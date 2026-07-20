-- Feature: chatbot conversacional de Conceituação Cognitiva com memória por paciente.
-- Cria a entidade `pacientes` (âncora que faltava — hoje "paciente" é só um
-- agrupamento derivado por patient_code ou nome+nascimento, ver chavePaciente()
-- em src/components/ConceituacaoCognitiva.tsx) e as tabelas de memória que
-- dependem dela: perfil evolutivo estruturado, histórico bruto de chat, e
-- anexos de referência (PDF/texto colado).
--
-- Acesso: authenticated (terapeuta único do painel) tem CRUD completo em todas
-- as 4 tabelas — mesmo padrão de "Therapist manage codes" já usado em
-- patient_codes. anon (paciente) não tem NENHUM acesso: essas tabelas só
-- existem pro terapeuta, diferente de respostas_questionarios/patient_codes
-- que o paciente também toca.

-- ---------------------------------------------------------------------------
-- pacientes: âncora de identidade
-- ---------------------------------------------------------------------------
create table if not exists public.pacientes (
  id bigint generated always as identity primary key,
  patient_code varchar(8) references public.patient_codes(code) on delete set null,
  nome_paciente text,
  nascimento text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Um paciente por patient_code (quando presente).
create unique index if not exists idx_pacientes_patient_code
  on public.pacientes(patient_code)
  where patient_code is not null;

-- Sem código: identidade cai em nome+nascimento (mesma chave frágil de hoje,
-- mas agora com registro único em vez de recalculada toda hora na tela).
create unique index if not exists idx_pacientes_nome_nascimento
  on public.pacientes(lower(btrim(nome_paciente)), nascimento)
  where patient_code is null and nome_paciente is not null and btrim(nome_paciente) <> '';

alter table public.pacientes enable row level security;

drop policy if exists "Therapist manage pacientes" on public.pacientes;
create policy "Therapist manage pacientes"
  on public.pacientes
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- paciente_perfil: memória destilada, evolutiva (1:1 com paciente)
-- Situações NÃO entram aqui como campo fixo (isso é do form de trabalho da
-- sessão atual) — o que persiste entre sessões é o padrão de fundo.
-- ---------------------------------------------------------------------------
create table if not exists public.paciente_perfil (
  paciente_id bigint primary key references public.pacientes(id) on delete cascade,
  crenca_central text,
  crencas_intermediarias text,
  estrategias_compensatorias text,
  situacoes_recorrentes jsonb not null default '[]'::jsonb,
  atualizado_em timestamptz not null default now()
);

alter table public.paciente_perfil enable row level security;

drop policy if exists "Therapist manage paciente_perfil" on public.paciente_perfil;
create policy "Therapist manage paciente_perfil"
  on public.paciente_perfil
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- paciente_mensagens: histórico bruto do chat (auditoria/releitura).
-- sessao_id agrupa as mensagens de uma conversa; "Encerrar sessão" na UI
-- dispara o merge no paciente_perfil e fecha aquele sessao_id.
-- Conteúdo já chega redigido (nome -> iniciais+nascimento) antes de gravar.
-- ---------------------------------------------------------------------------
create table if not exists public.paciente_mensagens (
  id bigint generated always as identity primary key,
  paciente_id bigint not null references public.pacientes(id) on delete cascade,
  sessao_id uuid not null,
  papel text not null check (papel in ('terapeuta', 'ia')),
  conteudo text not null,
  criado_em timestamptz not null default now()
);

create index if not exists idx_paciente_mensagens_paciente_sessao
  on public.paciente_mensagens(paciente_id, sessao_id, criado_em);

alter table public.paciente_mensagens enable row level security;

drop policy if exists "Therapist manage paciente_mensagens" on public.paciente_mensagens;
create policy "Therapist manage paciente_mensagens"
  on public.paciente_mensagens
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- paciente_anexos: referências de apoio (PDF extraído ou texto colado).
-- conteudo_redigido já passou pela mesma redação de nome do chat antes de
-- gravar — outros dados sensíveis do documento (CPF, endereço, terceiros)
-- não são filtrados (decisão explícita, risco aceito).
-- ---------------------------------------------------------------------------
create table if not exists public.paciente_anexos (
  id bigint generated always as identity primary key,
  paciente_id bigint not null references public.pacientes(id) on delete cascade,
  tipo text not null check (tipo in ('pdf', 'texto')),
  nome_arquivo text,
  conteudo_redigido text not null,
  criado_em timestamptz not null default now()
);

create index if not exists idx_paciente_anexos_paciente
  on public.paciente_anexos(paciente_id, criado_em);

alter table public.paciente_anexos enable row level security;

drop policy if exists "Therapist manage paciente_anexos" on public.paciente_anexos;
create policy "Therapist manage paciente_anexos"
  on public.paciente_anexos
  for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Backfill: popular pacientes a partir do que já existe hoje, sem duplicar.
-- 1) Todo patient_code ativo/histórico vira um paciente (mesmo sem resposta).
-- 2) Toda combinação distinta de nome+nascimento em respostas_questionarios
--    sem patient_code vira um paciente (mesma chave que chavePaciente() usa).
-- ---------------------------------------------------------------------------
insert into public.pacientes (patient_code, nome_paciente, nascimento)
select pc.code, pc.nome_paciente, null
from public.patient_codes pc
on conflict (patient_code) where patient_code is not null do nothing;

insert into public.pacientes (patient_code, nome_paciente, nascimento)
select null, r.nome, r.nascimento
from (
  select distinct on (lower(btrim(nome)), nascimento) nome, nascimento
  from public.respostas_questionarios
  where patient_code is null
    and nome is not null and btrim(nome) <> ''
  order by lower(btrim(nome)), nascimento, criado_em desc
) r
on conflict (lower(btrim(nome_paciente)), nascimento) where patient_code is null and nome_paciente is not null and btrim(nome_paciente) <> '' do nothing;
