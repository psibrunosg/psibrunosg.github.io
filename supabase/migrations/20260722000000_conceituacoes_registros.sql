-- Feature: botão "Gravar" nos diagramas de conceituação — persiste o
-- diagrama preenchido (todos os campos, não só o perfil condensado que já
-- existe em paciente_perfil) como um registro de histórico. Cada clique em
-- Gravar cria uma linha nova (histórico, não sobrescreve) — decisão do
-- terapeuta, permite comparar conceituações ao longo do tempo.
--
-- paciente_id é opcional: modo genérico (sem paciente vinculado) também
-- pode gravar, usando só o rótulo livre pra identificar depois — mesma
-- responsabilidade do terapeuta em não digitar dado identificável que já
-- vale pro campo de contexto clínico em outras partes da ferramenta.
--
-- Acesso: mesmo padrão das demais tabelas de memória de conceituação
-- (pacientes/paciente_perfil/paciente_mensagens/paciente_anexos) — só o
-- terapeuta autenticado (authenticated) tem CRUD, anon não toca.
create table if not exists public.conceituacoes_registros (
  id bigint generated always as identity primary key,
  paciente_id bigint references public.pacientes(id) on delete set null,
  ferramenta_id text not null,
  dados jsonb not null default '{}'::jsonb,
  rotulo text,
  criado_em timestamptz not null default now()
);

create index if not exists idx_conceituacoes_registros_paciente_ferramenta
  on public.conceituacoes_registros(paciente_id, ferramenta_id, criado_em desc);

alter table public.conceituacoes_registros enable row level security;

drop policy if exists "Therapist manage conceituacoes_registros" on public.conceituacoes_registros;
create policy "Therapist manage conceituacoes_registros"
  on public.conceituacoes_registros
  for all
  to authenticated
  using (true)
  with check (true);
