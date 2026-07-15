-- Decisão clínica (12/07/2026): REVERSÃO da anonimização introduzida em
-- 20260712010000_pii_optional_respostas.sql. A partir de agora o paciente
-- DEVE se identificar (nome, CPF, nascimento, e-mail, telefone, contato de
-- emergência) para responder qualquer escala. Trata-se de dado clínico
-- coletado com consentimento explícito (checkbox LGPD), coerente com o
-- Termo de Consentimento Livre e Esclarecido (TCLE) já assinado/aceito
-- pelo paciente na clínica. Quando o paciente é menor de idade, também é
-- exigida a identificação do responsável legal.
--
-- Esta migration NÃO apaga dados existentes: apenas adiciona colunas novas
-- (nullable, para não quebrar linhas históricas) e recria a policy de
-- insert para exigir os campos de identificação em todo novo envio.

alter table public.respostas_questionarios
  add column if not exists cpf text,
  add column if not exists contato_emergencia_nome text,
  add column if not exists contato_emergencia_telefone text,
  add column if not exists responsavel_nome text,
  add column if not exists responsavel_telefone text,
  add column if not exists is_menor boolean default false;

drop policy if exists "questionnaire_insert_with_access_code" on public.respostas_questionarios;
create policy "questionnaire_insert_with_access_code"
  on public.respostas_questionarios
  for insert
  to anon, authenticated
  with check (
    consentimento_lgpd = true
    and nome is not null and length(btrim(nome)) > 0
    and email is not null and length(btrim(email)) > 0
    and telefone is not null and length(btrim(telefone)) > 0
    and cpf is not null and length(btrim(cpf)) > 0
    and nascimento is not null and length(btrim(nascimento)) > 0
    and contato_emergencia_nome is not null and length(btrim(contato_emergencia_nome)) > 0
    and contato_emergencia_telefone is not null and length(btrim(contato_emergencia_telefone)) > 0
    and (
      is_menor is not true
      or (
        responsavel_nome is not null and length(btrim(responsavel_nome)) > 0
        and responsavel_telefone is not null and length(btrim(responsavel_telefone)) > 0
      )
    )
    and (
      tipo not in ('neoffir', 'neopir', 'bdi', 'bai', 'bhs', 'bss', 'cssrs')
      or private.code_allows_scale(respostas_questionarios.patient_code, respostas_questionarios.tipo)
    )
  );
