-- Códigos de acesso por escala. Esta migration não remove dados existentes.
alter table public.patient_codes
  alter column code type varchar(8),
  add column if not exists allowed_scales text[] not null default '{}',
  add column if not exists expires_at timestamptz,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists last_used_at timestamptz;

alter table public.patient_codes
  drop constraint if exists patient_codes_code_check;

alter table public.patient_codes
  add constraint patient_codes_code_check
  check (code ~ '^[0-9]{5}([0-9]{3})?$');

alter table public.respostas_questionarios
  add column if not exists patient_code varchar(8) references public.patient_codes(code) on delete set null,
  add column if not exists email text,
  add column if not exists situacao_clinica text,
  add column if not exists classificacao_profissional text;

create index if not exists idx_respostas_questionarios_patient_code
  on public.respostas_questionarios(patient_code);

create index if not exists idx_patient_codes_active_expires
  on public.patient_codes(active, expires_at);

alter table public.respostas_questionarios enable row level security;

-- ---------------------------------------------------------------------------
-- Security-definer helpers so anonymous clients never need direct SELECT on
-- patient_codes (which would let them enumerate active codes).
-- ---------------------------------------------------------------------------

create or replace function public.code_is_active(p_code text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.patient_codes pc
    where pc.code = p_code
      and pc.active
      and (pc.expires_at is null or pc.expires_at > now())
  );
$$;

revoke all on function public.code_is_active(text) from public;
grant execute on function public.code_is_active(text) to anon, authenticated;

create or replace function public.code_allows_scale(p_code text, p_scale text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.patient_codes pc
    where pc.code = p_code
      and pc.active
      and (pc.expires_at is null or pc.expires_at > now())
      and p_scale = any(pc.allowed_scales)
  );
$$;

revoke all on function public.code_allows_scale(text, text) from public;
grant execute on function public.code_allows_scale(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- respostas_questionarios: fold the LGPD-consent policy and the restricted
-- code requirement into a single insert policy so a bare consent checkbox
-- can no longer bypass the code check for restricted scales.
-- ---------------------------------------------------------------------------

drop policy if exists "Anon insert responses" on public.respostas_questionarios;
drop policy if exists "questionnaire_insert_with_access_code" on public.respostas_questionarios;
create policy "questionnaire_insert_with_access_code"
  on public.respostas_questionarios
  for insert
  to anon, authenticated
  with check (
    consentimento_lgpd = true
    and (
      tipo not in ('neoffir', 'neopir', 'bdi', 'bai', 'bhs', 'bss')
      or public.code_allows_scale(respostas_questionarios.patient_code, respostas_questionarios.tipo)
    )
  );

grant insert on table public.respostas_questionarios to anon, authenticated;
revoke select, update, delete on table public.respostas_questionarios from anon;

-- ---------------------------------------------------------------------------
-- patient_codes: remove the policy that let anonymous clients enumerate all
-- active codes. exercise_sessions policies switch to the code_is_active()
-- helper instead of querying patient_codes directly.
-- ---------------------------------------------------------------------------

drop policy if exists "Anon read active codes" on public.patient_codes;

drop policy if exists "Anon insert sessions with active code" on public.exercise_sessions;
create policy "Anon insert sessions with active code"
  on public.exercise_sessions
  for insert
  to public
  with check (public.code_is_active(exercise_sessions.code::text));

drop policy if exists "Anon read sessions with active code" on public.exercise_sessions;
create policy "Anon read sessions with active code"
  on public.exercise_sessions
  for select
  to public
  using (public.code_is_active(exercise_sessions.code::text));

drop policy if exists "Anon update own sessions with active code" on public.exercise_sessions;
create policy "Anon update own sessions with active code"
  on public.exercise_sessions
  for update
  to public
  using (public.code_is_active(exercise_sessions.code::text))
  with check (public.code_is_active(exercise_sessions.code::text));

-- ---------------------------------------------------------------------------
-- Per-IP rate limiting storage for the validate-code edge function (edge
-- functions are stateless, so throttling state has to live in Postgres).
-- Service role only; no policies, RLS blocks anon/authenticated entirely.
-- ---------------------------------------------------------------------------

create table if not exists public.validation_attempts (
  id bigint generated always as identity primary key,
  ip text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_validation_attempts_ip_time
  on public.validation_attempts(ip, attempted_at);

alter table public.validation_attempts enable row level security;
