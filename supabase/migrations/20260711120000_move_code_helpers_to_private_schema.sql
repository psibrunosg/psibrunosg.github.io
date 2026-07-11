-- Move code-check helpers out of the PostgREST-exposed public schema so anon
-- cannot probe code validity via /rest/v1/rpc (unthrottled enumeration oracle).
create schema if not exists private;

create or replace function private.code_is_active(p_code text)
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

revoke all on function private.code_is_active(text) from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.code_is_active(text) to anon, authenticated;

create or replace function private.code_allows_scale(p_code text, p_scale text)
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

revoke all on function private.code_allows_scale(text, text) from public;
grant execute on function private.code_allows_scale(text, text) to anon, authenticated;

drop policy if exists "questionnaire_insert_with_access_code" on public.respostas_questionarios;
create policy "questionnaire_insert_with_access_code"
  on public.respostas_questionarios
  for insert
  to anon, authenticated
  with check (
    consentimento_lgpd = true
    and (
      tipo not in ('neoffir', 'neopir', 'bdi', 'bai', 'bhs', 'bss')
      or private.code_allows_scale(respostas_questionarios.patient_code, respostas_questionarios.tipo)
    )
  );

drop policy if exists "Anon insert sessions with active code" on public.exercise_sessions;
create policy "Anon insert sessions with active code"
  on public.exercise_sessions
  for insert
  to public
  with check (private.code_is_active(exercise_sessions.code::text));

drop policy if exists "Anon read sessions with active code" on public.exercise_sessions;
create policy "Anon read sessions with active code"
  on public.exercise_sessions
  for select
  to public
  using (private.code_is_active(exercise_sessions.code::text));

drop policy if exists "Anon update own sessions with active code" on public.exercise_sessions;
create policy "Anon update own sessions with active code"
  on public.exercise_sessions
  for update
  to public
  using (private.code_is_active(exercise_sessions.code::text))
  with check (private.code_is_active(exercise_sessions.code::text));

drop function if exists public.code_is_active(text);
drop function if exists public.code_allows_scale(text, text);
