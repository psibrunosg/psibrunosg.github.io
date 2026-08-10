-- Policy de UPDATE em respostas_questionarios. Nao existia — zero policies com
-- polcmd='w' — e o painel faz .update({ risco_status }) em Painel.tsx.
--
-- POR QUE: marcar um alerta de risco suicida como "em acompanhamento" ou
-- "resolvido" era recusado pelo RLS em silencio. O PostgREST devolve 0 linhas
-- afetadas, nao erro, e o painel atualiza a UI de forma otimista — entao a tela
-- mostra o status novo e o banco continua com o antigo. No proximo carregamento
-- o alerta reaparece.
--
-- Efeito colateral do mesmo bug: a Visao geral conta todo hit de detectarRiscos
-- ignorando risco_status, e a aba Respostas filtra por "resolvido". Como o campo
-- nunca mudava, os dois numeros divergiam sem explicacao aparente.
--
-- O GRANT de UPDATE para `authenticated` ja existia; faltava so a policy.
--
-- Espelha exatamente as policies irmas ja aplicadas neste banco
-- ("Authenticated read responses" e "Authenticated delete responses"): mesmo
-- UUID de terapeuta, mesma forma `(select auth.uid())`, que o Postgres avalia
-- uma vez por query em vez de uma vez por linha.
--
-- Escopo: permite ao terapeuta atualizar qualquer coluna, nao so risco_status.
-- Nao e escalada — ele ja tem DELETE nesta tabela, que e estritamente mais
-- poderoso. Restringir por coluna aqui adicionaria complexidade sem fechar nada.

drop policy if exists "Authenticated update responses" on public.respostas_questionarios;

create policy "Authenticated update responses"
  on public.respostas_questionarios
  for update
  to authenticated
  using ((select auth.uid()) = 'd0dddd26-7dd0-4b5c-911a-7d541c7826e6'::uuid)
  with check ((select auth.uid()) = 'd0dddd26-7dd0-4b5c-911a-7d541c7826e6'::uuid);
