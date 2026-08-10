-- Tabelas para gerenciamento de formulários anônimos e treinamentos
-- IMPORTANTE: Execute este arquivo no SQL Editor do seu projeto Supabase.

-- Tabela de Formulários
create table if not exists formularios_anonimos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  campos jsonb not null default '[]', -- Lista de objetos descrevendo as perguntas (ex: [{ "id": "1", "tipo": "texto", "pergunta": "Qual seu nome?" }])
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Tabela de Respostas
create table if not exists respostas_formularios_anonimos (
  id uuid primary key default gen_random_uuid(),
  formulario_id uuid not null references formularios_anonimos(id) on delete cascade,
  respostas jsonb not null default '{}', -- Mapa de ID da pergunta -> valor respondido (ex: { "1": "João" })
  criado_em timestamptz not null default now()
);

-- RLS (Row Level Security)
alter table formularios_anonimos enable row level security;
alter table respostas_formularios_anonimos enable row level security;

-- Políticas para formularios_anonimos
-- Qualquer pessoa (anon ou autenticada) pode LER formulários (para renderizar a página pública)
create policy "Qualquer pessoa pode ler formularios ativos" on formularios_anonimos
  for select using (ativo = true);

-- Apenas autenticados (o painel do Bruno) podem inserir/atualizar/deletar
create policy "Apenas admin pode modificar formulários" on formularios_anonimos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Políticas para respostas_formularios_anonimos
-- Qualquer pessoa (anon) pode INSERIR (enviar sua resposta anônima)
create policy "Qualquer pessoa pode enviar respostas" on respostas_formularios_anonimos
  for insert with check (true);

-- Apenas autenticados (o painel do Bruno) podem LER e DELETAR as respostas
create policy "Apenas admin pode ver respostas" on respostas_formularios_anonimos
  for select using (auth.role() = 'authenticated');

create policy "Apenas admin pode deletar respostas" on respostas_formularios_anonimos
  for delete using (auth.role() = 'authenticated');
