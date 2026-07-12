-- Espelho da migration aplicada ao remoto em 12/07/2026.
-- C-SSRS rastreio (risco suicida) entra no rol de escalas restritas:
-- insert só com código válido que autorize a escala.
drop policy if exists "questionnaire_insert_with_access_code" on public.respostas_questionarios;
create policy "questionnaire_insert_with_access_code"
  on public.respostas_questionarios
  for insert
  to anon, authenticated
  with check (
    consentimento_lgpd = true
    and (
      tipo not in ('neoffir', 'neopir', 'bdi', 'bai', 'bhs', 'bss', 'cssrs')
      or private.code_allows_scale(respostas_questionarios.patient_code, respostas_questionarios.tipo)
    )
  );
