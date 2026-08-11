-- Fecha o achado 29 da auditoria: exercise_sessions era legivel por qualquer
-- anonimo que conhecesse UM codigo ativo.
--
-- As tres policies anonimas tinham predicado `private.code_is_active(code)`,
-- que olha a LINHA e nao o CHAMADOR. Um paciente com codigo valido podia ler
-- (e atualizar) as sessoes de todos os demais codigos ativos, bastando remover
-- o filtro `.eq("code", ...)` da requisicao ao PostgREST.
--
-- Nao havia correcao possivel so na policy: sem header nem claim, o Postgres
-- nao distingue um chamador anonimo de outro. A informacao precisa vir da
-- requisicao, entao a leitura passou a ser feita pela edge function
-- save-session (GET), que le o codigo do header X-Patient-Code e o usa como
-- filtro obrigatorio, com service role.
--
-- ORDEM IMPORTA e ja foi respeitada: a edge function foi publicada (v13) e o
-- cliente que a consome foi para producao (commit bdd3ed8, deploy verificado)
-- ANTES desta migracao. Aplicar isto primeiro derrubaria o cliente antigo, que
-- lia a tabela direto.
--
-- Depois disto, `exercise_sessions` so e acessivel por service role (edge
-- functions save-session e patient-progress) e pelo terapeuta autenticado.
-- Nenhum caminho anonimo permanece.

drop policy if exists "Anon insert sessions with active code" on public.exercise_sessions;
drop policy if exists "Anon read sessions with active code" on public.exercise_sessions;
drop policy if exists "Anon update own sessions with active code" on public.exercise_sessions;

-- Defesa em profundidade: sem policy o RLS ja barra, mas manter o grant de
-- tabela para `anon` deixa a porta pronta para reabrir por engano na proxima
-- policy que alguem criar sem pensar.
revoke select, insert, update, delete on public.exercise_sessions from anon;

-- `authenticated` mantem os grants: a policy "Therapist manage sessions"
-- (auth.uid() = terapeuta) depende deles.
