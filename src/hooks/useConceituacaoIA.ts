import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { supabase, mensagemErroEdgeFunction } from "@/lib/supabase";
import { interpretarResposta } from "@/lib/interpret";
import { extrairTextoPDF } from "@/lib/pdfExtract";
import { NINE_ROUTER_URL_PADRAO, gerarRascunho9Router, turno9Router, encerrar9Router } from "@/lib/nineRouter";
import type { FerramentaTerapeuta } from "@/content/ferramentas-terapeuta";
import type { RespostaRegistro } from "@/lib/scoring";

export type Resposta = RespostaRegistro & { patient_code?: string; email?: string };

export function chavePaciente(r: Resposta): string {
  if (r.patient_code) return "code:" + r.patient_code;
  if (r.nome && r.nome.trim()) return "nome:" + r.nome.trim().toLowerCase() + "|" + (r.nascimento ?? "");
  return "resp:" + r.id;
}
export function nomeSeguro(r: Resposta): string {
  return r.nome?.trim() || (r.patient_code ? `Código ${r.patient_code}` : `Paciente #${r.id}`);
}

export const PROVEDORES = [
  { id: "nvidia", label: "NVIDIA" },
  { id: "openai", label: "OpenAI" },
  { id: "groq", label: "Groq" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "anthropic", label: "Anthropic (Claude)" },
  { id: "gemini", label: "Google Gemini" },
  { id: "9router", label: "9Router (local)" },
];

export const MODELOS_POR_PROVEDOR: Record<string, { id: string; label: string }[]> = {
  nvidia: [
    { id: "meta/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
    { id: "meta/llama-3.1-405b-instruct", label: "Llama 3.1 405B" },
  ],
  openai: [
    { id: "gpt-4o-mini", label: "GPT-4o mini" },
    { id: "gpt-4o", label: "GPT-4o" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile" },
    { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant" },
  ],
  openrouter: [
    { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B" },
    { id: "openai/gpt-4o-mini", label: "GPT-4o mini" },
  ],
  deepseek: [
    { id: "deepseek-chat", label: "DeepSeek Chat" },
    { id: "deepseek-reasoner", label: "DeepSeek Reasoner" },
  ],
  anthropic: [
    { id: "claude-opus-4-8", label: "Claude Opus 4.8" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5" },
    { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  ],
  gemini: [
    { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
    { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
  ],
};

const INATIVIDADE_MS = 20 * 60 * 1000;
const JANELA_HISTORICO = 8;

export interface MensagemChat { papel: "terapeuta" | "ia"; conteudo: string; }

async function resolverPacienteId(r: Resposta): Promise<number | null> {
  if (!supabase) return null;
  if (r.patient_code) {
    const { data: existente } = await supabase.from("pacientes").select("id").eq("patient_code", r.patient_code).maybeSingle();
    if (existente) return existente.id;
    const { data: criado } = await supabase.from("pacientes").insert({ patient_code: r.patient_code, nome_paciente: r.nome ?? null }).select("id").single();
    return criado?.id ?? null;
  }
  if (r.nome && r.nome.trim()) {
    const nome = r.nome.trim();
    const { data: existente } = await supabase.from("pacientes").select("id").is("patient_code", null).ilike("nome_paciente", nome).eq("nascimento", r.nascimento ?? "").maybeSingle();
    if (existente) return existente.id;
    const { data: criado } = await supabase.from("pacientes").insert({ nome_paciente: nome, nascimento: r.nascimento ?? null }).select("id").single();
    return criado?.id ?? null;
  }
  return null;
}

export interface UseConceituacaoIAResult {
  dados: Record<string, string>;
  set: (label: string, v: string) => void;
  pacienteChave: string;
  setPacienteChave: (v: string) => void;
  grupos: [string, Resposta[]][];
  pacienteId: number | null;
  perfil: Record<string, unknown> | null;
  contexto: string;
  setContexto: (v: string) => void;
  provider: string;
  model: string;
  escolherProvider: (p: string) => void;
  escolherModel: (m: string) => void;
  nineRouterUrl: string;
  setNineRouterUrl: (v: string) => void;
  nineRouterKey: string;
  setNineRouterKey: (v: string) => void;
  loading: boolean;
  erro: string | null;
  aiUsado: boolean;
  sugerirRascunho: () => Promise<void>;
  mensagens: MensagemChat[];
  inputChat: string;
  setInputChat: (v: string) => void;
  chatLoading: boolean;
  chatErro: string | null;
  enviarMensagemChat: () => Promise<void>;
  encerrarSessao: () => Promise<void>;
  encerrarLoading: boolean;
  anexoTexto: string;
  setAnexoTexto: (v: string) => void;
  anexoLoading: boolean;
  anexoErro: string | null;
  anexoOk: boolean;
  anexoTruncado: boolean;
  salvarAnexo: (tipo: "pdf" | "texto", conteudo: string, nomeArquivo?: string) => Promise<void>;
  handleUploadPDF: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  exportarPDF: () => void;
}

export function useConceituacaoIA(toolId: string, respostas: Resposta[], ferramenta: FerramentaTerapeuta): UseConceituacaoIAResult {
  const L = ferramenta.campos.map((c) => c.label);

  const [dados, setDados] = useState<Record<string, string>>({});
  const [pacienteChave, setPacienteChave] = useState("");
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [perfil, setPerfil] = useState<Record<string, unknown> | null>(null);
  const [contexto, setContexto] = useState("");
  const [provider, setProvider] = useState(() => localStorage.getItem("conceituacao_provider") || "nvidia");
  const [model, setModel] = useState(() => {
    const salvo = localStorage.getItem("conceituacao_model");
    const opcoes = MODELOS_POR_PROVEDOR[localStorage.getItem("conceituacao_provider") || "nvidia"];
    if (!opcoes) return salvo ?? ""; // 9router: modelo é texto livre, sem lista fixa
    return salvo && opcoes.some((o) => o.id === salvo) ? salvo : opcoes[0].id;
  });
  const [nineRouterUrl, setNineRouterUrlState] = useState(() => localStorage.getItem("conceituacao_9router_url") || NINE_ROUTER_URL_PADRAO);
  const [nineRouterKey, setNineRouterKeyState] = useState(() => localStorage.getItem("conceituacao_9router_key") || "");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aiUsado, setAiUsado] = useState(false);

  const [sessaoId, setSessaoId] = useState(() => crypto.randomUUID());
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [inputChat, setInputChat] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatErro, setChatErro] = useState<string | null>(null);
  const [encerrarLoading, setEncerrarLoading] = useState(false);
  const inatividadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [anexoTexto, setAnexoTexto] = useState("");
  const [anexoLoading, setAnexoLoading] = useState(false);
  const [anexoErro, setAnexoErro] = useState<string | null>(null);
  const [anexoOk, setAnexoOk] = useState(false);
  const [anexoTruncado, setAnexoTruncado] = useState(false);

  const set = (label: string, v: string) => setDados((d) => ({ ...d, [label]: v }));

  const grupos = (() => {
    const m = new Map<string, Resposta[]>();
    for (const r of respostas) { const k = chavePaciente(r); const a = m.get(k) ?? []; a.push(r); m.set(k, a); }
    return Array.from(m.entries());
  })();

  function escolherProvider(p: string) {
    setProvider(p);
    localStorage.setItem("conceituacao_provider", p);
    const modeloPadrao = MODELOS_POR_PROVEDOR[p]?.[0]?.id ?? "";
    setModel(modeloPadrao);
    localStorage.setItem("conceituacao_model", modeloPadrao);
  }
  function escolherModel(m: string) {
    setModel(m);
    localStorage.setItem("conceituacao_model", m);
  }
  function setNineRouterUrl(v: string) {
    setNineRouterUrlState(v);
    localStorage.setItem("conceituacao_9router_url", v);
  }
  function setNineRouterKey(v: string) {
    setNineRouterKeyState(v);
    localStorage.setItem("conceituacao_9router_key", v);
  }

  useEffect(() => {
    setPerfil(null);
    setMensagens([]);
    setSessaoId(crypto.randomUUID());
    if (!pacienteChave || !supabase) { setPacienteId(null); return; }
    const grupo = grupos.find(([k]) => k === pacienteChave);
    if (!grupo) { setPacienteId(null); return; }
    let cancelado = false;
    (async () => {
      const id = await resolverPacienteId(grupo[1][0]);
      if (cancelado) return;
      setPacienteId(id);
      if (id != null) {
        const { data } = await supabase!.from("paciente_perfil")
          .select("dados")
          .eq("paciente_id", id).eq("ferramenta_id", toolId).maybeSingle();
        if (!cancelado && data) setPerfil(data.dados as Record<string, unknown>);
      }
    })();
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteChave, toolId]);

  async function encerrarSessao() {
    if (!supabase || pacienteId == null || mensagens.length === 0) return;
    setEncerrarLoading(true);
    try {
      if (provider === "9router") {
        const r = await encerrar9Router({ baseUrl: nineRouterUrl, apiKey: nineRouterKey, model, tipo: toolId, pacienteId, sessaoId });
        if (r.error) { setChatErro(r.error); return; }
        if (r.perfil) setPerfil(r.perfil);
        setMensagens([]);
        setSessaoId(crypto.randomUUID());
        return;
      }
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: { acao: "encerrar", tipo: toolId, pacienteId, sessaoId, provider, model: model || undefined },
      });
      if (error) throw error;
      if (data?.error) { setChatErro(data.error); return; }
      if (data?.perfil) setPerfil(data.perfil as Record<string, unknown>);
      setMensagens([]);
      setSessaoId(crypto.randomUUID());
    } catch (e) {
      setChatErro(await mensagemErroEdgeFunction(e, "Erro ao encerrar sessão."));
    } finally {
      setEncerrarLoading(false);
    }
  }

  useEffect(() => {
    if (inatividadeTimer.current) clearTimeout(inatividadeTimer.current);
    if (pacienteId == null || mensagens.length === 0) return;
    inatividadeTimer.current = setTimeout(() => { encerrarSessao(); }, INATIVIDADE_MS);
    return () => { if (inatividadeTimer.current) clearTimeout(inatividadeTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensagens, pacienteId]);

  async function enviarMensagemChat() {
    const texto = inputChat.trim();
    if (!texto || !supabase) return;
    setChatLoading(true);
    setChatErro(null);
    const historico = mensagens.slice(-JANELA_HISTORICO);
    setMensagens((m) => [...m, { papel: "terapeuta", conteudo: texto }]);
    setInputChat("");
    try {
      if (provider === "9router") {
        const r = await turno9Router({
          baseUrl: nineRouterUrl, apiKey: nineRouterKey, model, tipo: toolId,
          pacienteId, sessaoId, mensagem: texto, historico, camposAtuais: dados,
        });
        if (r.error) { setChatErro(r.error); return; }
        setMensagens((m) => [...m, { papel: "ia", conteudo: r.resposta ?? "" }]);
        if (r.campos && Object.keys(r.campos).length > 0) {
          setDados((d) => ({ ...d, ...r.campos }));
          setAiUsado(true);
        }
        return;
      }
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: {
          acao: "turno", tipo: toolId, pacienteId, sessaoId, mensagem: texto, historico,
          camposAtuais: dados, provider, model: model || undefined,
        },
      });
      if (error) throw error;
      if (data?.error) { setChatErro(data.error); return; }
      const resposta: string = data?.resposta ?? "";
      const campos: Record<string, string> = data?.campos ?? {};
      setMensagens((m) => [...m, { papel: "ia", conteudo: resposta }]);
      if (Object.keys(campos).length > 0) {
        setDados((d) => ({ ...d, ...campos }));
        setAiUsado(true);
      }
    } catch (e) {
      setChatErro(await mensagemErroEdgeFunction(e, "Erro ao conversar com a IA."));
    } finally {
      setChatLoading(false);
    }
  }

  async function salvarAnexo(tipo: "pdf" | "texto", conteudo: string, nomeArquivo?: string) {
    if (!supabase || pacienteId == null || !conteudo.trim()) return;
    setAnexoLoading(true);
    setAnexoErro(null);
    setAnexoOk(false);
    setAnexoTruncado(false);
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: { acao: "anexo", pacienteId, tipo, nomeArquivo, conteudo },
      });
      if (error) throw error;
      if (data?.error) { setAnexoErro(data.error); return; }
      setAnexoOk(true);
      if (data?.truncado) setAnexoTruncado(true);
      if (tipo === "texto") setAnexoTexto("");
    } catch (e) {
      setAnexoErro(await mensagemErroEdgeFunction(e, "Erro ao salvar referência."));
    } finally {
      setAnexoLoading(false);
    }
  }

  async function handleUploadPDF(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0];
    e.target.value = "";
    if (!arquivo) return;
    setAnexoLoading(true);
    setAnexoErro(null);
    setAnexoOk(false);
    try {
      const texto = await extrairTextoPDF(arquivo);
      if (!texto.trim()) { setAnexoErro("Não foi possível extrair texto desse PDF."); return; }
      await salvarAnexo("pdf", texto, arquivo.name);
    } catch {
      setAnexoErro("Falha ao ler o PDF.");
    } finally {
      setAnexoLoading(false);
    }
  }

  async function sugerirRascunho() {
    if (!supabase) { setErro("Supabase não configurado — não é possível gerar rascunho."); return; }
    setLoading(true);
    setErro(null);
    try {
      const rs = respostas.filter((r) => chavePaciente(r) === pacienteChave);
      const escalasPayload = rs.map((r) => {
        const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
        return { sigla: interp.sigla, resumo: interp.resumo };
      });
      let draft: Record<string, string>;
      if (provider === "9router") {
        const r = await gerarRascunho9Router({ baseUrl: nineRouterUrl, apiKey: nineRouterKey, model, tipo: toolId, escalas: escalasPayload, contexto });
        if (r.error) { setErro(r.error); return; }
        draft = r.draft ?? {};
      } else {
        const { data, error } = await supabase.functions.invoke("conceituacao-draft", {
          body: { tipo: toolId, escalas: escalasPayload, contexto, provider, model: model || undefined },
        });
        if (error) throw error;
        if (data?.error) { setErro(data.error); return; }
        draft = data?.draft ?? {};
      }
      setDados((d) => {
        const novo = { ...d };
        for (const label of L) if (!novo[label]?.trim() && draft[label]) novo[label] = draft[label];
        return novo;
      });
      setAiUsado(true);
    } catch (e) {
      setErro(await mensagemErroEdgeFunction(e, "Erro ao gerar rascunho."));
    } finally {
      setLoading(false);
    }
  }

  function exportarPDF() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 180; const ML = 15; let y = 20;
    function txt(text: string, size = 10, bold = false, color: [number, number, number] = [40, 40, 40]) {
      doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setTextColor(...color);
      for (const line of doc.splitTextToSize(text, W)) { if (y > 275) { doc.addPage(); y = 20; } doc.text(line, ML, y); y += size * 0.45; }
    }
    txt(ferramenta.titulo, 14, true, [30, 30, 30]); y += 3;
    txt(ferramenta.categoria, 9, false, [120, 120, 120]); y += 5;
    doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    for (const label of L) {
      txt(label, 10, true); y += 1;
      const val = dados[label]?.trim();
      txt(val || "(não preenchido)", 10, false, val ? [40, 40, 40] : [180, 180, 180]); y += 4;
    }
    y += 4; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    txt(ferramenta.referencia, 8, false, [120, 120, 120]); y += 6;
    txt("Bruno de Souza Gonçalves · CRP 07/44472", 9, true, [120, 120, 120]);
    doc.save(`${toolId}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return {
    dados, set, pacienteChave, setPacienteChave, grupos, pacienteId, perfil,
    contexto, setContexto, provider, model, escolherProvider, escolherModel,
    nineRouterUrl, setNineRouterUrl, nineRouterKey, setNineRouterKey,
    loading, erro, aiUsado, sugerirRascunho,
    mensagens, inputChat, setInputChat, chatLoading, chatErro, enviarMensagemChat, encerrarSessao, encerrarLoading,
    anexoTexto, setAnexoTexto, anexoLoading, anexoErro, anexoOk, anexoTruncado, salvarAnexo, handleUploadPDF,
    exportarPDF,
  };
}
