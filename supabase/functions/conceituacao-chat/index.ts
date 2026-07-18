// Deploy:
//   supabase functions deploy conceituacao-chat
// Secrets: mesmas de conceituacao-draft (NVIDIA_API_KEY, OPENAI_API_KEY, etc).
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetadas automaticamente pelo
// runtime de Edge Functions — não precisa configurar como secret.
//
// Três ações (body.acao):
//   "turno"    — um passo da entrevista socrática: recebe a mensagem nova do
//                terapeuta + histórico local + campos já preenchidos, devolve
//                a próxima pergunta/comentário da IA + atualização parcial
//                dos campos do diagrama. Se pacienteId vier, persiste as duas
//                mensagens (terapeuta + ia) já redigidas em paciente_mensagens.
//   "encerrar" — fim de sessão: lê todo o histórico da sessao_id + perfil
//                atual do paciente, pede à IA um perfil evolutivo atualizado,
//                faz merge em paciente_perfil (crenças/estratégias sobrescrevem,
//                situações novas são anexadas à lista existente).
//   "anexo"    — ingestão de PDF extraído ou texto colado: aplica a mesma
//                redação de nome e grava em paciente_anexos. Não chama IA.
//
// Sem paciente vinculado (pacienteId null): "turno" funciona sem memória
// (não persiste, não redige — nada a redigir sem nome cadastrado); "encerrar"
// e "anexo" exigem pacienteId (não fazem sentido em modo genérico).
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { chamarProvedor, extrairJSON } from "../_shared/ai-providers.ts";
import { redigirNome } from "../_shared/redacao.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

// Documento grande demais infla o prompt (custo/latência) sem ganho real —
// corta e sinaliza em vez de mandar tudo pra IA silenciosamente.
const MAX_ANEXO_CHARS = 20000;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const LABELS = [
  "Dados relevantes da história",
  "Crença Central",
  "Crenças Intermediárias (pressupostos, regras, atitudes)",
  "Estratégias Compensatórias",
  "Situação 1",
  "Pensamento Automático (Sit. 1)",
  "Significado do PA (Sit. 1)",
  "Resposta Emocional (Sit. 1)",
  "Resposta Física (Sit. 1)",
  "Comportamento (Sit. 1)",
  "Situação 2",
  "Pensamento Automático (Sit. 2)",
  "Significado do PA (Sit. 2)",
  "Resposta Emocional (Sit. 2)",
  "Resposta Física (Sit. 2)",
  "Comportamento (Sit. 2)",
];

const SYSTEM_PROMPT_TURNO = `Você conduz uma entrevista socrática para ajudar um psicólogo clínico a
preencher o Diagrama de Conceituação Cognitiva (modelo de Judith Beck), em português do Brasil.
Faça UMA pergunta objetiva de cada vez, focada no que ainda falta preencher — nunca repita pergunta
sobre campo já respondido. Use tom profissional e colaborativo, como um par clínico pensando junto,
nunca prescritivo. Nunca afirme diagnóstico com certeza — use linguagem de hipótese quando inferir
algo. Com base no que o terapeuta acabou de responder, você pode atualizar um ou mais campos do
diagrama. Responda SOMENTE em JSON estrito, sem texto fora do JSON, no formato:
{"resposta": "sua próxima pergunta ou comentário", "campos": {"Rótulo do campo": "valor inferido"}}
"campos" só deve conter campos que você tem confiança para preencher/atualizar agora — pode ser
um objeto vazio {} se ainda não há nada novo a registrar.`;

const SYSTEM_PROMPT_ENCERRAR = `Você é um assistente de psicologia clínica que mantém um perfil
evolutivo e duradouro de um paciente, em português do Brasil, a partir de conversas de conceituação
cognitiva. Diferente do diagrama de trabalho de uma sessão (que tem "Situação 1"/"Situação 2"
pontuais), este perfil guarda o que é ESTÁVEL ao longo do tempo: crença central, crenças
intermediárias, estratégias compensatórias, e um registro de temas/situações que se REPETEM entre
sessões (não a última situação pontual). Nunca afirme diagnóstico com certeza. Responda SOMENTE em
JSON estrito no formato:
{"crencaCentral": "...", "crencasIntermediarias": "...", "estrategiasCompensatorias": "...",
 "situacoesNovas": ["tema ou padrão recorrente novo observado nesta sessão", "..."]}
"situacoesNovas" deve conter só temas GENUINAMENTE novos em relação ao perfil já existente — se
nada de novo surgiu, retorne uma lista vazia []. Nunca repita um tema já registrado no perfil atual.`;

interface Mensagem { papel: "terapeuta" | "ia"; conteudo: string; }

async function buscarPaciente(pacienteId: number | null) {
  if (pacienteId == null) return null;
  const { data } = await supabase
    .from("pacientes")
    .select("id, nome_paciente, nascimento")
    .eq("id", pacienteId)
    .maybeSingle();
  return data ?? null;
}

async function buscarPerfil(pacienteId: number | null) {
  if (pacienteId == null) return null;
  const { data } = await supabase
    .from("paciente_perfil")
    .select("crenca_central, crencas_intermediarias, estrategias_compensatorias, situacoes_recorrentes")
    .eq("paciente_id", pacienteId)
    .maybeSingle();
  return data ?? null;
}

async function buscarAnexosRecentes(pacienteId: number | null, limite = 3) {
  if (pacienteId == null) return [] as { tipo: string; conteudo_redigido: string }[];
  const { data } = await supabase
    .from("paciente_anexos")
    .select("tipo, conteudo_redigido")
    .eq("paciente_id", pacienteId)
    .order("criado_em", { ascending: false })
    .limit(limite);
  return data ?? [];
}

function formatarPerfil(perfil: Awaited<ReturnType<typeof buscarPerfil>>): string {
  if (!perfil) return "Nenhum perfil de longo prazo registrado ainda para este paciente.";
  const situacoes = Array.isArray(perfil.situacoes_recorrentes) ? perfil.situacoes_recorrentes : [];
  return [
    perfil.crenca_central ? `Crença central conhecida: ${perfil.crenca_central}` : "",
    perfil.crencas_intermediarias ? `Crenças intermediárias conhecidas: ${perfil.crencas_intermediarias}` : "",
    perfil.estrategias_compensatorias ? `Estratégias compensatórias conhecidas: ${perfil.estrategias_compensatorias}` : "",
    situacoes.length > 0 ? `Temas/situações recorrentes já observados: ${situacoes.map((s: { texto?: string }) => s?.texto ?? String(s)).join("; ")}` : "",
  ].filter(Boolean).join("\n") || "Nenhum perfil de longo prazo registrado ainda para este paciente.";
}

async function acaoTurno(body: Record<string, unknown>) {
  const pacienteId = typeof body.pacienteId === "number" ? body.pacienteId : null;
  const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";
  const mensagem = typeof body.mensagem === "string" ? body.mensagem : "";
  const historico: Mensagem[] = Array.isArray(body.historico) ? body.historico : [];
  const camposAtuais: Record<string, string> = typeof body.camposAtuais === "object" && body.camposAtuais ? body.camposAtuais as Record<string, string> : {};
  const providerKey = typeof body.provider === "string" ? body.provider : "nvidia";
  const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : undefined;

  if (!mensagem.trim()) return { status: 400, body: { error: "Mensagem vazia" } };

  const paciente = await buscarPaciente(pacienteId);
  const perfil = paciente ? await buscarPerfil(pacienteId) : null;
  const anexos = paciente ? await buscarAnexosRecentes(pacienteId) : [];

  const mensagemRedigida = paciente ? redigirNome(mensagem, paciente.nome_paciente, paciente.nascimento) : mensagem;
  const historicoRedigido = historico.map((m) => ({
    ...m,
    conteudo: paciente ? redigirNome(m.conteudo, paciente.nome_paciente, paciente.nascimento) : m.conteudo,
  }));

  const userMsg = [
    `Campos do diagrama já preenchidos:\n${JSON.stringify(camposAtuais)}`,
    `Rótulos disponíveis (use exatamente estas chaves em "campos"):\n${JSON.stringify(LABELS)}`,
    `Perfil de longo prazo deste paciente:\n${formatarPerfil(perfil)}`,
    anexos.length > 0
      ? `Trechos de referência anexados (prontuário/documentos):\n${anexos.map((a) => `[${a.tipo}] ${a.conteudo_redigido}`).join("\n---\n")}`
      : "",
    historicoRedigido.length > 0
      ? `Histórico da conversa até agora:\n${historicoRedigido.map((m) => `${m.papel === "terapeuta" ? "Terapeuta" : "Assistente"}: ${m.conteudo}`).join("\n")}`
      : "",
    `Nova mensagem do terapeuta:\n${mensagemRedigida}`,
  ].filter(Boolean).join("\n\n");

  const chamada = await chamarProvedor(providerKey, model, SYSTEM_PROMPT_TURNO, userMsg);
  if (!chamada.ok) return { status: chamada.status, body: { error: chamada.erro } };

  const parsed = extrairJSON(chamada.conteudo);
  const resposta = typeof parsed?.resposta === "string" ? parsed.resposta : chamada.conteudo;
  const campos = typeof parsed?.campos === "object" && parsed?.campos ? parsed.campos as Record<string, string> : {};
  const respostaRedigida = paciente ? redigirNome(resposta, paciente.nome_paciente, paciente.nascimento) : resposta;

  if (paciente && sessaoId) {
    await supabase.from("paciente_mensagens").insert([
      { paciente_id: paciente.id, sessao_id: sessaoId, papel: "terapeuta", conteudo: mensagemRedigida },
      { paciente_id: paciente.id, sessao_id: sessaoId, papel: "ia", conteudo: respostaRedigida },
    ]);
  }

  return { status: 200, body: { resposta: respostaRedigida, campos } };
}

async function acaoEncerrar(body: Record<string, unknown>) {
  const pacienteId = typeof body.pacienteId === "number" ? body.pacienteId : null;
  const sessaoId = typeof body.sessaoId === "string" ? body.sessaoId : "";
  const providerKey = typeof body.provider === "string" ? body.provider : "nvidia";
  const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : undefined;

  if (pacienteId == null || !sessaoId) return { status: 400, body: { error: "pacienteId e sessaoId são obrigatórios para encerrar sessão" } };

  const { data: mensagens } = await supabase
    .from("paciente_mensagens")
    .select("papel, conteudo")
    .eq("paciente_id", pacienteId)
    .eq("sessao_id", sessaoId)
    .order("criado_em", { ascending: true });

  if (!mensagens || mensagens.length === 0) return { status: 400, body: { error: "Nenhuma mensagem encontrada nessa sessão" } };

  const perfilAtual = await buscarPerfil(pacienteId);

  const userMsg = [
    `Perfil atual do paciente:\n${formatarPerfil(perfilAtual)}`,
    `Transcrição completa da sessão de hoje:\n${mensagens.map((m: Mensagem) => `${m.papel === "terapeuta" ? "Terapeuta" : "Assistente"}: ${m.conteudo}`).join("\n")}`,
  ].join("\n\n");

  const chamada = await chamarProvedor(providerKey, model, SYSTEM_PROMPT_ENCERRAR, userMsg);
  if (!chamada.ok) return { status: chamada.status, body: { error: chamada.erro } };

  const parsed = extrairJSON(chamada.conteudo);
  if (!parsed) return { status: 500, body: { error: "IA não retornou um perfil válido" } };

  const situacoesExistentes = Array.isArray(perfilAtual?.situacoes_recorrentes) ? perfilAtual!.situacoes_recorrentes : [];
  const situacoesNovas = Array.isArray(parsed.situacoesNovas) ? parsed.situacoesNovas : [];
  const situacoesAtualizadas = [
    ...situacoesExistentes,
    ...situacoesNovas
      .filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      .map((texto: string) => ({ texto, criado_em: new Date().toISOString() })),
  ];

  const perfilNovo = {
    paciente_id: pacienteId,
    crenca_central: typeof parsed.crencaCentral === "string" ? parsed.crencaCentral : perfilAtual?.crenca_central ?? null,
    crencas_intermediarias: typeof parsed.crencasIntermediarias === "string" ? parsed.crencasIntermediarias : perfilAtual?.crencas_intermediarias ?? null,
    estrategias_compensatorias: typeof parsed.estrategiasCompensatorias === "string" ? parsed.estrategiasCompensatorias : perfilAtual?.estrategias_compensatorias ?? null,
    situacoes_recorrentes: situacoesAtualizadas,
    atualizado_em: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase.from("paciente_perfil").upsert(perfilNovo, { onConflict: "paciente_id" });
  if (upsertError) {
    console.error("conceituacao-chat: erro ao salvar perfil", upsertError);
    return { status: 500, body: { error: "Falha ao salvar perfil atualizado" } };
  }

  return { status: 200, body: { perfil: perfilNovo } };
}

async function acaoAnexo(body: Record<string, unknown>) {
  const pacienteId = typeof body.pacienteId === "number" ? body.pacienteId : null;
  const tipo = body.tipo === "pdf" ? "pdf" : body.tipo === "texto" ? "texto" : null;
  const nomeArquivo = typeof body.nomeArquivo === "string" ? body.nomeArquivo : null;
  const conteudo = typeof body.conteudo === "string" ? body.conteudo : "";

  if (pacienteId == null) return { status: 400, body: { error: "pacienteId é obrigatório para anexar referência" } };
  if (!tipo) return { status: 400, body: { error: "tipo deve ser 'pdf' ou 'texto'" } };
  if (!conteudo.trim()) return { status: 400, body: { error: "Conteúdo vazio" } };

  const paciente = await buscarPaciente(pacienteId);
  const truncado = conteudo.length > MAX_ANEXO_CHARS;
  const conteudoLimitado = truncado ? conteudo.slice(0, MAX_ANEXO_CHARS) + "\n[...documento truncado — excedeu o limite de tamanho...]" : conteudo;
  const conteudoRedigido = paciente ? redigirNome(conteudoLimitado, paciente.nome_paciente, paciente.nascimento) : conteudoLimitado;

  const { data, error } = await supabase
    .from("paciente_anexos")
    .insert({ paciente_id: pacienteId, tipo, nome_arquivo: nomeArquivo, conteudo_redigido: conteudoRedigido })
    .select("id")
    .single();

  if (error) {
    console.error("conceituacao-chat: erro ao salvar anexo", error);
    return { status: 500, body: { error: "Falha ao salvar anexo" } };
  }

  return { status: 200, body: { ok: true, anexoId: data.id, truncado } };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const acao = typeof body?.acao === "string" ? body.acao : "";

    const resultado = acao === "turno" ? await acaoTurno(body)
      : acao === "encerrar" ? await acaoEncerrar(body)
      : acao === "anexo" ? await acaoAnexo(body)
      : { status: 400, body: { error: `Ação desconhecida: ${acao}` } };

    return new Response(JSON.stringify(resultado.body), { status: resultado.status, headers: jsonHeaders });
  } catch (error) {
    console.error("conceituacao-chat error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: jsonHeaders });
  }
});
