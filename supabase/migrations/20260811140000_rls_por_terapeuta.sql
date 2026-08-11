-- Fecha o achado 28: seis tabelas clinicas com RLS `using(true) with check(true)`
-- para o papel `authenticated`.
--
-- RLS ligado sem restringir nada. Qualquer conta autenticada do projeto lia e
-- escrevia todo o prontuario: dados do paciente, perfil de conceituacao,
-- transcricoes de IA sobre ele, texto integral de PDFs de prontuario anexados,
-- configuracao de psicoeducacao e os registros de conceituacao.
--
-- Hoje existe 1 unico usuario cadastrado (o proprio terapeuta), entao a
-- exposicao era latente, nao ativa. Mas o custo de criar uma conta e zero e o
-- estrago seria total, entao "ninguem criou conta ainda" nao e controle de
-- acesso.
--
-- Passa a exigir o UUID do terapeuta, o mesmo padrao que patient_codes,
-- blog_posts e respostas_questionarios ja usavam. A forma `(select auth.uid())`
-- e avaliada uma vez por query em vez de uma vez por linha.
--
-- VERIFICADO ANTES DE APLICAR: as 8 edge functions usam service role, que
-- ignora RLS — nenhuma e afetada. Em src/, so useConceituacaoIA.ts,
-- nineRouter.ts e Painel.tsx tocam estas tabelas, todos na sessao autenticada
-- do proprio terapeuta.

do $$
declare
  t text;
  terapeuta constant uuid := 'd0dddd26-7dd0-4b5c-911a-7d541c7826e6';
begin
  foreach t in array array[
    'pacientes',
    'paciente_perfil',
    'paciente_mensagens',
    'paciente_anexos',
    'paciente_psicoed',
    'conceituacoes_registros'
  ] loop
    execute format('drop policy if exists %I on public.%I', 'Therapist manage ' || t, t);
    execute format(
      'create policy %I on public.%I for all to authenticated using ((select auth.uid()) = %L::uuid) with check ((select auth.uid()) = %L::uuid)',
      'Therapist manage ' || t, t, terapeuta, terapeuta
    );
  end loop;
end $$;
