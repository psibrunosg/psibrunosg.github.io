// Caminho client-side pro provedor "9router" (self-hosted local, ex:
// http://localhost:20128/v1) — a edge function do Supabase roda na nuvem e
// NUNCA alcança um endpoint em localhost da máquina do terapeuta, então pra
// esse provedor específico o navegador chama a IA diretamente e faz a
// orquestração (perfil/memória/redação) que normalmente vive em
// conceituacao-draft/conceituacao-chat. Login já usa Supabase Auth
// (signInWithPassword) — o client no navegador carrega sessão `authenticated`,
// e as tabelas pacientes/paciente_perfil/paciente_mensagens/paciente_anexos
// já liberam CRUD pra "authenticated" via RLS, então isso funciona sem
// precisar de service-role key.
import { supabase } from "@/lib/supabase";
import { redigirNome } from "@/lib/redacao";
import { FERRAMENTAS_IA } from "@/content/ferramentas-ia-prompts";
import type { MensagemChat } from "@/hooks/useConceituacaoIA";

export const NINE_ROUTER_URL_PADRAO = "http://localhost:20128/v1";

interface Paciente { id: number; nome_paciente: string | null; nascimento: string | null; }

// Parser balanceado (conta chaves de verdade, ignora as dentro de strings) —
// espelha o fix em supabase/functions/_shared/ai-providers.ts: "primeiro { até
// último }" quebrava sempre que o modelo escrevia prosa com chaves soltas
// fora do JSON, produzindo o bug de "{}" aparecendo cru no chat.
function extrairJSON(texto: string): Record<string, unknown> | null {
  const semCercas = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const inicio = semCercas.indexOf("{");
  if (inicio === -1) return null;

  let profundidade = 0;
  let dentroString = false;
  let escapando = false;
  for (let i = inicio; i < semCercas.length; i++) {
    const c = semCercas[i];
    if (escapando) { escapando = false; continue; }
    if (c === "\\") { escapando = true; continue; }
    if (c === '"') { dentroString = !dentroString; continue; }
    if (dentroString) continue;
    if (c === "{") profundidade++;
    else if (c === "}") {
      profundidade--;
      if (profundidade === 0) {
        try {
          const obj = JSON.parse(semCercas.slice(inicio, i + 1));
          return typeof obj === "object" && obj !== null ? obj : null;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

async function chamar9Router(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMsg: string
): Promise<{ ok: true; conteudo: string } | { ok: false; erro: string }> {
  const url = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey.trim() ? { Authorization: `Bearer ${apiKey.trim()}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
        temperature: 0.4,
        max_tokens: 1200,
        stream: false,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch {
    return { ok: false, erro: `9Router não respondeu em ${url} — confira se está rodando e se a URL está certa.` };
  } finally {
    clearTimeout(timer);
  }

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    console.error("9router: erro do provedor", resp.status, errText);
    return { ok: false, erro: `Falha na API (9router): ${resp.status}` };
  }
  const data = await resp.json();
  return { ok: true, conteudo: data?.choices?.[0]?.message?.content ?? "" };
}

async function buscarPaciente(pacienteId: number | null): Promise<Paciente | null> {
  if (!supabase || pacienteId == null) return null;
  const { data } = await supabase.from("pacientes").select("id, nome_paciente, nascimento").eq("id", pacienteId).maybeSingle();
  return (data as Paciente) ?? null;
}

async function buscarPerfilDados(pacienteId: number | null, ferramentaId: string): Promise<Record<string, unknown> | null> {
  if (!supabase || pacienteId == null) return null;
  const { data } = await supabase.from("paciente_perfil").select("dados").eq("paciente_id", pacienteId).eq("ferramenta_id", ferramentaId).maybeSingle();
  return (data?.dados as Record<string, unknown>) ?? null;
}

async function buscarAnexosRecentes(pacienteId: number | null, limite = 3): Promise<{ tipo: string; conteudo_redigido: string }[]> {
  if (!supabase || pacienteId == null) return [];
  const { data } = await supabase.from("paciente_anexos").select("tipo, conteudo_redigido").eq("paciente_id", pacienteId).order("criado_em", { ascending: false }).limit(limite);
  return data ?? [];
}

function formatarPerfil(dados: Record<string, unknown> | null): string {
  if (!dados || Object.keys(dados).length === 0) return "Nenhum perfil de longo prazo registrado ainda para este paciente.";
  const situacoes = Array.isArray(dados.situacoes_recorrentes) ? dados.situacoes_recorrentes : [];
  const linhas = Object.entries(dados)
    .filter(([chave, valor]) => chave !== "situacoes_recorrentes" && valor != null && String(valor).trim() !== "")
    .map(([chave, valor]) => `${chave}: ${valor}`);
  if (situacoes.length > 0) {
    linhas.push(`Temas/situações recorrentes já observados: ${situacoes.map((s: { texto?: string }) => s?.texto ?? String(s)).join("; ")}`);
  }
  return linhas.length > 0 ? linhas.join("\n") : "Nenhum perfil de longo prazo registrado ainda para este paciente.";
}

function mensagemEscalas(escalas: { sigla: string; resumo: string }[]): string {
  return escalas.length > 0
    ? `Escalas aplicadas (de-identificadas):\n${escalas.map((e) => `- ${e.sigla}: ${e.resumo}`).join("\n")}`
    : "Nenhuma escala informada.";
}

export async function gerarRascunho9Router(opts: {
  baseUrl: string; apiKey: string; model: string; tipo: string;
  escalas: { sigla: string; resumo: string }[]; contexto: string;
}): Promise<{ draft?: Record<string, string>; error?: string }> {
  const config = FERRAMENTAS_IA[opts.tipo];
  if (!config) return { error: `Ferramenta desconhecida: ${opts.tipo}` };

  const userMsg = [
    `Ferramenta: ${opts.tipo}`,
    mensagemEscalas(opts.escalas),
    opts.contexto ? `Contexto clínico informado pelo terapeuta:\n${opts.contexto}` : "",
    `Preencha um objeto JSON com exatamente estas chaves (rótulos do diagrama):\n${JSON.stringify(config.labels)}`,
  ].filter(Boolean).join("\n\n");

  const chamada = await chamar9Router(opts.baseUrl, opts.apiKey, opts.model, config.promptDraft, userMsg);
  if (!chamada.ok) return { error: chamada.erro };

  const draft = extrairJSON(chamada.conteudo) as Record<string, string> | null;
  return { draft: draft ?? {} };
}

export async function turno9Router(opts: {
  baseUrl: string; apiKey: string; model: string; tipo: string;
  pacienteId: number | null; sessaoId: string; mensagem: string;
  historico: MensagemChat[]; camposAtuais: Record<string, string>;
}): Promise<{ resposta?: string; campos?: Record<string, string>; error?: string }> {
  const config = FERRAMENTAS_IA[opts.tipo];
  if (!config) return { error: `Ferramenta desconhecida: ${opts.tipo}` };
  if (!opts.mensagem.trim()) return { error: "Mensagem vazia" };

  const paciente = await buscarPaciente(opts.pacienteId);
  const perfil = paciente ? await buscarPerfilDados(opts.pacienteId, opts.tipo) : null;
  const anexos = paciente ? await buscarAnexosRecentes(opts.pacienteId) : [];

  const mensagemRedigida = paciente ? redigirNome(opts.mensagem, paciente.nome_paciente, paciente.nascimento) : opts.mensagem;
  const historicoRedigido = opts.historico.map((m) => ({
    ...m,
    conteudo: paciente ? redigirNome(m.conteudo, paciente.nome_paciente, paciente.nascimento) : m.conteudo,
  }));

  const userMsg = [
    `Campos do diagrama já preenchidos:\n${JSON.stringify(opts.camposAtuais)}`,
    `Rótulos disponíveis (use exatamente estas chaves em "campos"):\n${JSON.stringify(config.labels)}`,
    `Perfil de longo prazo deste paciente:\n${formatarPerfil(perfil)}`,
    anexos.length > 0
      ? `Trechos de referência anexados (prontuário/documentos):\n${anexos.map((a) => `[${a.tipo}] ${a.conteudo_redigido}`).join("\n---\n")}`
      : "",
    historicoRedigido.length > 0
      ? `Histórico da conversa até agora:\n${historicoRedigido.map((m) => `${m.papel === "terapeuta" ? "Terapeuta" : "Assistente"}: ${m.conteudo}`).join("\n")}`
      : "",
    `Nova mensagem do terapeuta:\n${mensagemRedigida}`,
  ].filter(Boolean).join("\n\n");

  const chamada = await chamar9Router(opts.baseUrl, opts.apiKey, opts.model, config.promptTurno, userMsg);
  if (!chamada.ok) return { error: chamada.erro };

  const parsed = extrairJSON(chamada.conteudo);
  const resposta = typeof parsed?.resposta === "string" ? parsed.resposta : chamada.conteudo;
  const campos = typeof parsed?.campos === "object" && parsed?.campos ? parsed.campos as Record<string, string> : {};
  const respostaRedigida = paciente ? redigirNome(resposta, paciente.nome_paciente, paciente.nascimento) : resposta;

  if (supabase && paciente && opts.sessaoId) {
    await supabase.from("paciente_mensagens").insert([
      { paciente_id: paciente.id, sessao_id: opts.sessaoId, papel: "terapeuta", conteudo: mensagemRedigida },
      { paciente_id: paciente.id, sessao_id: opts.sessaoId, papel: "ia", conteudo: respostaRedigida },
    ]);
  }

  return { resposta: respostaRedigida, campos };
}

export async function encerrar9Router(opts: {
  baseUrl: string; apiKey: string; model: string; tipo: string;
  pacienteId: number; sessaoId: string;
}): Promise<{ perfil?: Record<string, unknown>; error?: string }> {
  if (!supabase) return { error: "Supabase não configurado." };
  const config = FERRAMENTAS_IA[opts.tipo];
  if (!config) return { error: `Ferramenta desconhecida: ${opts.tipo}` };

  const { data: mensagens } = await supabase
    .from("paciente_mensagens")
    .select("papel, conteudo")
    .eq("paciente_id", opts.pacienteId)
    .eq("sessao_id", opts.sessaoId)
    .order("criado_em", { ascending: true });

  if (!mensagens || mensagens.length === 0) return { error: "Nenhuma mensagem encontrada nessa sessão" };

  const dadosAtuais = (await buscarPerfilDados(opts.pacienteId, opts.tipo)) ?? {};

  const userMsg = [
    `Perfil atual do paciente:\n${formatarPerfil(dadosAtuais)}`,
    `Transcrição completa da sessão de hoje:\n${mensagens.map((m: MensagemChat) => `${m.papel === "terapeuta" ? "Terapeuta" : "Assistente"}: ${m.conteudo}`).join("\n")}`,
  ].join("\n\n");

  const chamada = await chamar9Router(opts.baseUrl, opts.apiKey, opts.model, config.promptEncerrar, userMsg);
  if (!chamada.ok) return { error: chamada.erro };

  const parsed = extrairJSON(chamada.conteudo);
  if (!parsed) return { error: "IA não retornou um perfil válido" };

  // Mesmo delta controlado no código (não pela IA) que conceituacao-chat usa:
  // só situacoesNovas é aceito como adição, timestamp gerado aqui — nunca
  // sobrescreve o histórico existente de situações recorrentes.
  const { situacoesNovas: situacoesNovasRaw, ...escalares } = parsed;
  const situacoesExistentes = Array.isArray(dadosAtuais.situacoes_recorrentes) ? dadosAtuais.situacoes_recorrentes : [];
  const situacoesNovas = Array.isArray(situacoesNovasRaw) ? situacoesNovasRaw : [];
  const situacoesAtualizadas = [
    ...situacoesExistentes,
    ...situacoesNovas
      .filter((s: unknown): s is string => typeof s === "string" && s.trim().length > 0)
      .map((texto: string) => ({ texto, criado_em: new Date().toISOString() })),
  ];

  const dadosNovos = { ...dadosAtuais, ...escalares, situacoes_recorrentes: situacoesAtualizadas };

  const { error: upsertError } = await supabase.from("paciente_perfil").upsert(
    { paciente_id: opts.pacienteId, ferramenta_id: opts.tipo, dados: dadosNovos, atualizado_em: new Date().toISOString() },
    { onConflict: "paciente_id,ferramenta_id" }
  );
  if (upsertError) {
    console.error("9router: erro ao salvar perfil", upsertError);
    return { error: "Falha ao salvar perfil atualizado" };
  }

  return { perfil: dadosNovos };
}
