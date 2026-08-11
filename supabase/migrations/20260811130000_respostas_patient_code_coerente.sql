-- Fecha o achado 26 da auditoria: INSERT anonimo podia atribuir uma resposta a
-- um patient_code arbitrario.
--
-- O with_check so exigia `code_allows_scale` para a lista restrita
-- (neoffir, neopir, bdi, bai, bhs, bss, cssrs). Para YSQ, PHQ-9, GAD-7 e todas
-- as demais, um anonimo podia inserir com o codigo de qualquer paciente. O
-- estrago concreto: psicoed-personalizada le a resposta YSQ MAIS RECENTE do
-- codigo para decidir quais esquemas mostrar. Um YSQ falso injetado por
-- terceiro passa a ser o mais recente e muda o que o paciente le sobre si.
--
-- A correcao NAO e exigir codigo para toda escala. Hoje 26 das 27 respostas do
-- banco nao tem codigo — o auto-preenchimento publico e o caso normal, nao a
-- excecao. Exigir codigo em todas derrubaria o site.
--
-- A regra correta e de COERENCIA: sem codigo, segue livre (auto-avaliacao
-- publica); COM codigo, o codigo precisa existir, estar ativo, nao ter expirado
-- e permitir aquela escala. Reduz o ataque de "qualquer anonimo atribui
-- qualquer escala a qualquer codigo" para "e preciso ter o codigo, e o codigo
-- precisa permitir a escala" — mesmo nivel de confianca do proprio paciente,
-- que e o limite razoavel aqui.
--
-- ponytail: o bloco de validacao de PII e reescrito por inteiro porque uma
-- policy nao e alteravel em partes. E a 5a copia literal dele (ver achado
-- H2-15). Extrair para `private.pii_valida()` resolveria a duplicacao, mas
-- coloca uma indirecao nova num caminho de seguranca — fica para uma rodada
-- dedicada, com teste proprio.

drop policy if exists "questionnaire_insert_with_access_code" on public.respostas_questionarios;

create policy "questionnaire_insert_with_access_code"
  on public.respostas_questionarios
  for insert
  to authenticated, anon
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
    -- Escala restrita exige codigo que a autorize (regra que ja existia).
    and (
      tipo <> all (array['neoffir','neopir','bdi','bai','bhs','bss','cssrs'])
      or private.code_allows_scale(patient_code::text, tipo)
    )
    -- NOVO: se um codigo foi informado, ele tem que ser coerente com a escala.
    -- Sem codigo continua permitido — e o fluxo publico.
    and (
      patient_code is null
      or private.code_allows_scale(patient_code::text, tipo)
    )
  );
