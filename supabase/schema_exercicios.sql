-- Fase 0: Schema para plataforma de exercícios gamificados

-- Códigos de paciente — SEM nome, SEM PII
create table if not exists patient_codes (
  code varchar(5) primary key check (code ~ '^[0-9]{5}$'),
  active boolean not null default true,
  restricted_unlocked text[] not null default '{}',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz
);

-- Sessões de exercício — parciais e completas
create table if not exists exercise_sessions (
  id uuid primary key default gen_random_uuid(),
  code varchar(5) not null references patient_codes(code) on delete cascade,
  exercise_slug text not null,
  payload jsonb not null default '{}',
  score int,
  partial boolean not null default true,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(code, exercise_slug) -- última sessão por exercício
);

create index if not exists idx_exercise_sessions_code_slug on exercise_sessions (code, exercise_slug);
create index if not exists idx_exercise_sessions_completed on exercise_sessions (completed_at);

-- RLS: acesso só via edge function com service role; nenhum acesso direto anon
alter table patient_codes enable row level security;
alter table exercise_sessions enable row level security;

-- sem policies para anon/authenticated — só service_role (edge functions)
-- revoke select, insert, update, delete on patient_codes from anon, authenticated;
-- revoke select, insert, update, delete on exercise_sessions from anon, authenticated;
