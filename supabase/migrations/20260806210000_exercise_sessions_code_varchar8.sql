-- Alarga exercise_sessions.code de varchar(5) para varchar(8).
--
-- POR QUE: generate-code/index.ts:51 emite codigos de 8 digitos desde a migracao
-- 20260711014942, que alargou APENAS patient_codes.code. exercise_sessions.code
-- ficou em varchar(5), entao todo insert de sessao de exercicio para qualquer
-- codigo emitido depois daquela data falha por estouro de largura.
--
-- O cliente so faz console.warn (useExerciseSession.ts), entao a falha e
-- silenciosa: o paciente ve o proprio progresso vindo do localStorage como se
-- tivesse salvo, e o terapeuta nunca recebe nada.
--
-- A metade da correcao que vive no codigo (regex /^\d{5}$/ -> /^\d{5}(\d{3})?$/
-- em save-session/index.ts) ja foi aplicada. Sem esta migracao ela nao resolve:
-- o insert passa a chegar no banco e quebra na coluna.

drop policy if exists "Anon insert sessions with active code" on public.exercise_sessions;
drop policy if exists "Anon read sessions with active code" on public.exercise_sessions;
drop policy if exists "Anon update own sessions with active code" on public.exercise_sessions;

alter table public.exercise_sessions
  alter column code type varchar(8);

create policy "Anon insert sessions with active code"
  on public.exercise_sessions
  for insert
  to public
  with check (private.code_is_active(exercise_sessions.code::text));

create policy "Anon read sessions with active code"
  on public.exercise_sessions
  for select
  to public
  using (private.code_is_active(exercise_sessions.code::text));

create policy "Anon update own sessions with active code"
  on public.exercise_sessions
  for update
  to public
  using (private.code_is_active(exercise_sessions.code::text))
  with check (private.code_is_active(exercise_sessions.code::text));

-- A FK para patient_codes(code) sobrevive ao alter de tipo porque a coluna
-- referenciada ja e varchar(8). Nenhum dado existente e truncado: alargar
-- varchar nunca perde caractere.

comment on column public.exercise_sessions.code is
  'Codigo de acesso do paciente. 5 digitos (legado) ou 8 digitos (atual).';
