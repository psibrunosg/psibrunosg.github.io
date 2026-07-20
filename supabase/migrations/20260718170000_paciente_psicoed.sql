-- Feature: psicoeducação personalizada por paciente.
-- Estado escopo-paciente para o território carro-chefe "De onde vêm seus padrões".
-- Decisão clínica (grilling 18/07): o terapeuta controla por paciente o que é
-- liberado; NADA aparece por padrão (liberado = false), e o escore nomeado do
-- esquema NUNCA é revelado ao paciente por padrão (revelar_escore = false).
--
-- O paciente (anon) não toca nesta tabela: a edge function psicoed-personalizada
-- lê tudo via service role. RLS authenticated-only (terapeuta), mesmo padrão de
-- paciente_perfil / paciente_mensagens / paciente_anexos.

create table if not exists public.paciente_psicoed (
  paciente_id bigint primary key references public.pacientes(id) on delete cascade,
  -- Interruptor mestre: personalização ligada para este paciente?
  liberado boolean not null default false,
  -- Mostra o escore/nome do esquema ao paciente? (default: não revela)
  revelar_escore boolean not null default false,
  -- Esquemas a OCULTAR mesmo estando ativos (terapeuta segura um específico).
  -- Vazio = mostra todos os esquemas ativos do paciente (decisão 7b: todos ativos).
  esquemas_ocultos text[] not null default '{}',
  atualizado_em timestamptz not null default now()
);

alter table public.paciente_psicoed enable row level security;

drop policy if exists "Therapist manage paciente_psicoed" on public.paciente_psicoed;
create policy "Therapist manage paciente_psicoed"
  on public.paciente_psicoed
  for all
  to authenticated
  using (true)
  with check (true);
