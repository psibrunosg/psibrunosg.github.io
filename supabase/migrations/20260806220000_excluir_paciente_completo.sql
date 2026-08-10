-- Exclusao LGPD de verdade: apaga o paciente das 7 origens, numa transacao.
--
-- POR QUE: Painel.tsx `excluirPaciente` apaga APENAS respostas_questionarios,
-- e `pacientes` nao tem FK para essa tabela, entao nenhum cascade dispara.
-- Sobrevivem hoje a "exclusao permanente" que a UI promete (e que exige o
-- terapeuta digitar o nome do paciente para confirmar):
--   pacientes · paciente_perfil · paciente_mensagens (transcricoes de IA sobre
--   o paciente) · paciente_anexos (texto integral de PDFs de prontuario) ·
--   paciente_psicoed · conceituacoes_registros · patient_codes.nome_paciente
--
-- ATENCAO ANTES DE APLICAR
-- Esta funcao foi escrita a partir das migracoes versionadas neste repo, NAO
-- do schema remoto — o MCP do Supabase desta sessao nao tem acesso ao projeto
-- e a auditoria de 2026-08-06 encontrou schema drift (respostas_questionarios
-- e blog_posts nao tem CREATE TABLE nem policy versionados). Confira contra o
-- banco real antes de rodar. E uma operacao destrutiva e irreversivel.
--
-- SECURITY INVOKER de proposito: a funcao NAO deve conceder privilegio novo.
-- Ela roda sob as policies do chamador; se o terapeuta ja pode apagar pelas
-- policies atuais, continua podendo, e ninguem mais ganha poder. Nao troque
-- para SECURITY DEFINER sem antes amarrar o auth.uid() ao terapeuta.

create or replace function public.excluir_paciente_completo(
  p_resposta_ids bigint[],
  p_paciente_id  bigint default null
)
returns jsonb
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_respostas int := 0;
  v_conceituacoes int := 0;
  v_pacientes int := 0;
  v_codigos int := 0;
begin
  if p_paciente_id is not null then
    -- conceituacoes_registros usa ON DELETE SET NULL, entao o delete em
    -- `pacientes` NAO a remove: deixaria linha orfa com dado clinico. Vai antes.
    delete from public.conceituacoes_registros
      where paciente_id = p_paciente_id;
    get diagnostics v_conceituacoes = row_count;

    -- Tira o nome do paciente do codigo de acesso. O codigo em si e credencial,
    -- nao dado pessoal, e e mantido para nao orfanizar exercise_sessions.
    update public.patient_codes pc
       set nome_paciente = null
      from public.pacientes p
     where p.id = p_paciente_id
       and pc.code = p.patient_code
       and pc.nome_paciente is not null;
    get diagnostics v_codigos = row_count;

    -- Cascata: paciente_perfil, paciente_mensagens, paciente_anexos,
    -- paciente_psicoed caem junto (ON DELETE CASCADE ja declarado nas
    -- migracoes 20260718000000 e 20260718170000).
    delete from public.pacientes where id = p_paciente_id;
    get diagnostics v_pacientes = row_count;
  end if;

  if p_resposta_ids is not null and array_length(p_resposta_ids, 1) > 0 then
    delete from public.respostas_questionarios
      where id = any(p_resposta_ids);
    get diagnostics v_respostas = row_count;
  end if;

  return jsonb_build_object(
    'respostas', v_respostas,
    'conceituacoes', v_conceituacoes,
    'pacientes', v_pacientes,
    'codigos_anonimizados', v_codigos
  );
end;
$$;

comment on function public.excluir_paciente_completo(bigint[], bigint) is
  'Exclusao LGPD atomica. Recebe os ids de resposta e, quando conhecido, o id em `pacientes`. Sem p_paciente_id apaga so as respostas — mesmo comportamento (insuficiente) do codigo antigo.';

revoke all on function public.excluir_paciente_completo(bigint[], bigint) from public, anon;
grant execute on function public.excluir_paciente_completo(bigint[], bigint) to authenticated;
