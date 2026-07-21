-- Generaliza paciente_perfil pra suportar múltiplas ferramentas de conceituação
-- (antes só existia pro Diagrama de Conceituação Cognitiva/Beck, com colunas
-- fixas). Cada ferramenta passa a guardar seu próprio shape de perfil de longo
-- prazo em `dados` jsonb — sem migration nova a cada framework futuro.

alter table public.paciente_perfil
  add column if not exists ferramenta_id text not null default 'conceituacao-cognitiva',
  add column if not exists dados jsonb not null default '{}'::jsonb;

-- Backfill: move as colunas antigas do Beck pra dentro de `dados`, com as
-- mesmas chaves (mesmo nome), sem perder histórico.
update public.paciente_perfil
set dados = jsonb_strip_nulls(jsonb_build_object(
  'crenca_central', crenca_central,
  'crencas_intermediarias', crencas_intermediarias,
  'estrategias_compensatorias', estrategias_compensatorias,
  'situacoes_recorrentes', coalesce(situacoes_recorrentes, '[]'::jsonb)
))
where dados = '{}'::jsonb;

-- Chave composta: 1 perfil por (paciente, ferramenta) em vez de 1 por paciente.
alter table public.paciente_perfil drop constraint if exists paciente_perfil_pkey;
alter table public.paciente_perfil add primary key (paciente_id, ferramenta_id);

alter table public.paciente_perfil drop column if exists crenca_central;
alter table public.paciente_perfil drop column if exists crencas_intermediarias;
alter table public.paciente_perfil drop column if exists estrategias_compensatorias;
alter table public.paciente_perfil drop column if exists situacoes_recorrentes;
