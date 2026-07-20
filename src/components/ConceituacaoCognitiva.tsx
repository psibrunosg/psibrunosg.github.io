import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Loader2, Download, Info, Send, Paperclip, LogOut } from "lucide-react";
import jsPDF from "jspdf";
import { supabase, mensagemErroEdgeFunction } from "@/lib/supabase";
import { interpretarResposta } from "@/lib/interpret";
import { extrairTextoPDF } from "@/lib/pdfExtract";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import type { RespostaRegistro } from "@/lib/scoring";

// Decoupled from Painel.tsx: Painel's `Resposta` type isn't exported, so this
// component declares the minimal shape it needs (structurally compatible —
// Painel can pass its `respostas` array directly).
type Resposta = RespostaRegistro & { patient_code?: string; email?: string };

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-cognitiva")!;
const L = FERRAMENTA.campos.map((c) => c.label);

// ponytail: chavePaciente/nomeSeguro duplicated (5 lines) instead of exporting
// them from Painel.tsx — smaller diff than changing Painel's export surface.
function chavePaciente(r: Resposta): string {
  if (r.patient_code) return "code:" + r.patient_code;
  if (r.nome && r.nome.trim()) return "nome:" + r.nome.trim().toLowerCase() + "|" + (r.nascimento ?? "");
  return "resp:" + r.id;
}
function nomeSeguro(r: Resposta): string {
  return r.nome?.trim() || (r.patient_code ? `Código ${r.patient_code}` : `Paciente #${r.id}`);
}

const PROVEDORES = [
  { id: "nvidia", label: "NVIDIA" },
  { id: "openai", label: "OpenAI" },
  { id: "groq", label: "Groq" },
  { id: "openrouter", label: "OpenRouter" },
  { id: "deepseek", label: "DeepSeek" },
  { id: "anthropic", label: "Anthropic (Claude)" },
];

// ponytail: modelos fixos (sem API de listagem) — cobre as opções mais comuns de cada
// provedor; o 1º de cada lista é o default usado pela edge function conceituacao-draft.
const MODELOS_POR_PROVEDOR: Record<string, { id: string; label: string }[]> = {
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
};

const INATIVIDADE_MS = 20 * 60 * 1000; // 20 min — rede de segurança do "Encerrar sessão"
const JANELA_HISTORICO = 8; // últimas mensagens mandadas por turno — evita prompt crescer sem limite

interface MensagemChat { papel: "terapeuta" | "ia"; conteudo: string; }
interface PerfilPaciente {
  crenca_central: string | null;
  crencas_intermediarias: string | null;
  estrategias_compensatorias: string | null;
  situacoes_recorrentes: { texto: string; criado_em: string }[];
}

const box = "rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/60 p-4";
const labelCls = "mb-1 block text-[11px] font-medium text-[var(--c-accent)]";
const inputCls = "w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none";

function Campo({ label, valor, onChange, area }: { label: string; valor: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {area ? (
        <textarea value={valor} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
      ) : (
        <input value={valor} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

const Seta = () => (
  <div className="flex justify-center py-1 text-[var(--c-muted)]"><ArrowDown size={16} /></div>
);

// Busca o paciente correspondente na tabela `pacientes` (âncora de identidade);
// cria se ainda não existir. Sem patient_code nem nome, não há identidade
// estável pra persistir (modo genérico "resp:" do chavePaciente) — retorna null.
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

export function ConceituacaoCognitiva({ respostas }: { respostas: Resposta[] }) {
  const [dados, setDados] = useState<Record<string, string>>({});
  const [pacienteChave, setPacienteChave] = useState("");
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [perfil, setPerfil] = useState<PerfilPaciente | null>(null);
  const [contexto, setContexto] = useState("");
  const [provider, setProvider] = useState(() => localStorage.getItem("conceituacao_provider") || "nvidia");
  const [model, setModel] = useState(() => {
    const salvo = localStorage.getItem("conceituacao_model");
    const opcoes = MODELOS_POR_PROVEDOR[localStorage.getItem("conceituacao_provider") || "nvidia"];
    return salvo && opcoes?.some((o) => o.id === salvo) ? salvo : opcoes[0].id;
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aiUsado, setAiUsado] = useState(false);

  // Conversa guiada (chat)
  const [sessaoId, setSessaoId] = useState(() => crypto.randomUUID());
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [inputChat, setInputChat] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatErro, setChatErro] = useState<string | null>(null);
  const [encerrarLoading, setEncerrarLoading] = useState(false);
  const inatividadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Referências (PDF / texto colado)
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
    // modelo vem junto do provedor — evita o usuário ter que descobrir o id do modelo
    const modeloPadrao = MODELOS_POR_PROVEDOR[p][0].id;
    setModel(modeloPadrao);
    localStorage.setItem("conceituacao_model", modeloPadrao);
  }
  function escolherModel(m: string) {
    setModel(m);
    localStorage.setItem("conceituacao_model", m);
  }

  // Troca de paciente: resolve/cria a identidade em `pacientes`, carrega o
  // perfil de longo prazo, e começa uma sessão de chat nova.
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
          .select("crenca_central, crencas_intermediarias, estrategias_compensatorias, situacoes_recorrentes")
          .eq("paciente_id", id).maybeSingle();
        if (!cancelado && data) setPerfil(data as PerfilPaciente);
      }
    })();
    return () => { cancelado = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacienteChave]);

  async function encerrarSessao() {
    if (!supabase || pacienteId == null || mensagens.length === 0) return;
    setEncerrarLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: { acao: "encerrar", pacienteId, sessaoId, provider, model: model || undefined },
      });
      if (error) throw error;
      if (data?.error) { setChatErro(data.error); return; }
      if (data?.perfil) setPerfil(data.perfil as PerfilPaciente);
      setMensagens([]);
      setSessaoId(crypto.randomUUID());
    } catch (e) {
      setChatErro(await mensagemErroEdgeFunction(e, "Erro ao encerrar sessão."));
    } finally {
      setEncerrarLoading(false);
    }
  }

  // Rede de segurança: 20min sem mensagem nova encerra sozinho (decisão B+C
  // da conversa de planejamento — botão explícito é o caminho principal).
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
    // Janela deslizante: manda só as últimas mensagens no prompt — sessão longa
    // não deve custar tokens crescendo sem limite a cada turno. Memória de
    // prazo mais longo já vem do paciente_perfil/anexos carregados no servidor.
    const historico = mensagens.slice(-JANELA_HISTORICO);
    setMensagens((m) => [...m, { papel: "terapeuta", conteudo: texto }]);
    setInputChat("");
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-chat", {
        body: {
          acao: "turno", pacienteId, sessaoId, mensagem: texto, historico,
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
      // De-identificado: só sigla + resumo interpretativo, nunca nome/cpf/nascimento/etc.
      const escalasPayload = rs.map((r) => {
        const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
        return { sigla: interp.sigla, resumo: interp.resumo };
      });
      const { data, error } = await supabase.functions.invoke("conceituacao-draft", {
        body: { tipo: "conceituacao-cognitiva", escalas: escalasPayload, contexto, provider, model: model || undefined },
      });
      if (error) throw error;
      if (data?.error) { setErro(data.error); return; }
      const draft: Record<string, string> = data?.draft ?? {};
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
    txt(FERRAMENTA.titulo, 14, true, [30, 30, 30]); y += 3;
    txt(FERRAMENTA.categoria, 9, false, [120, 120, 120]); y += 5;
    doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    for (const label of L) {
      txt(label, 10, true); y += 1;
      const val = dados[label]?.trim();
      txt(val || "(não preenchido)", 10, false, val ? [40, 40, 40] : [180, 180, 180]); y += 4;
    }
    y += 4; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    txt(FERRAMENTA.referencia, 8, false, [120, 120, 120]); y += 6;
    txt("Bruno de Souza Gonçalves · CRP 07/44472", 9, true, [120, 120, 120]);
    doc.save(`conceituacao-cognitiva_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      {/* IA: seleção de paciente, contexto, provedor */}
      <div className="glass-card mb-6 rounded-2xl p-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Sugerir rascunho com IA</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelCls}>Paciente (opcional — usa escalas de-identificadas)</label>
            <select value={pacienteChave} onChange={(e) => setPacienteChave(e.target.value)} className={inputCls}>
              <option value="">Nenhum / genérico</option>
              {grupos.map(([chave, rs]) => (
                <option key={chave} value={chave}>{nomeSeguro(rs[0])} ({rs.length} resposta{rs.length !== 1 ? "s" : ""})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelCls}>Provedor</label>
              <select value={provider} onChange={(e) => escolherProvider(e.target.value)} className={inputCls}>
                {PROVEDORES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelCls}>Modelo</label>
              <select value={model} onChange={(e) => escolherModel(e.target.value)} className={inputCls}>
                {MODELOS_POR_PROVEDOR[provider].map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className={labelCls}>Contexto clínico (opcional)</label>
          <textarea value={contexto} onChange={(e) => setContexto(e.target.value)} rows={2}
            placeholder="Observações livres — NÃO inclua nome, CPF, telefone ou outros dados identificáveis"
            className={`${inputCls} resize-y`} />
          <p className="mt-1 text-[10px] text-[var(--c-muted)]">Você é responsável por não digitar dados que identifiquem o paciente aqui.</p>
        </div>
        <button onClick={sugerirRascunho} disabled={loading}
          className="mt-3 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {loading ? "Gerando..." : "Sugerir rascunho (IA)"}
        </button>
        {erro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{erro}</p>}
      </div>

      {!pacienteChave && (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-[var(--c-text)]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <span>Sem paciente selecionado: modo genérico — sem memória entre sessões e sem redação automática de nome. Não digite dados identificáveis.</span>
        </div>
      )}

      {perfil && (perfil.crenca_central || perfil.crencas_intermediarias || perfil.estrategias_compensatorias || perfil.situacoes_recorrentes?.length > 0) && (
        <div className={`${box} mb-6`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Perfil de longo prazo deste paciente</p>
          <div className="space-y-1.5 text-xs text-[var(--c-text)]">
            {perfil.crenca_central && <p><span className="font-semibold">Crença central:</span> {perfil.crenca_central}</p>}
            {perfil.crencas_intermediarias && <p><span className="font-semibold">Crenças intermediárias:</span> {perfil.crencas_intermediarias}</p>}
            {perfil.estrategias_compensatorias && <p><span className="font-semibold">Estratégias compensatórias:</span> {perfil.estrategias_compensatorias}</p>}
            {perfil.situacoes_recorrentes?.length > 0 && (
              <p><span className="font-semibold">Temas recorrentes:</span> {perfil.situacoes_recorrentes.map((s) => s.texto).join("; ")}</p>
            )}
          </div>
        </div>
      )}

      {/* Conversa guiada: chat convive com o form — vai preenchendo os campos ao vivo */}
      <div className="glass-card mb-6 rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Conversa guiada</p>
          {pacienteId != null && mensagens.length > 0 && (
            <button onClick={encerrarSessao} disabled={encerrarLoading}
              className="flex items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)] disabled:opacity-60">
              {encerrarLoading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
              Encerrar sessão
            </button>
          )}
        </div>

        {mensagens.length > 0 && (
          <div className="mb-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-[var(--c-border)] p-3">
            {mensagens.map((m, i) => (
              <div key={i} className={`rounded-xl px-3 py-2 text-xs ${m.papel === "terapeuta" ? "ml-6 bg-[var(--c-accent)]/10 text-[var(--c-text)]" : "mr-6 bg-[var(--c-surface)] text-[var(--c-text)]"}`}>
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{m.papel === "terapeuta" ? "Você" : "IA"}</p>
                {m.conteudo}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input value={inputChat} onChange={(e) => setInputChat(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !chatLoading) enviarMensagemChat(); }}
            placeholder="Responda ou descreva o caso — a IA vai perguntando e preenchendo o diagrama"
            className={inputCls} />
          <button onClick={enviarMensagemChat} disabled={chatLoading || !inputChat.trim()}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
            {chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        {chatErro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{chatErro}</p>}
      </div>

      {/* Referências: PDF ou texto colado (só com paciente vinculado) */}
      {pacienteId != null && (
        <div className={`${box} mb-6`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Referências (prontuário / documentos)</p>
          <p className="mb-3 text-[10px] text-[var(--c-muted)]">
            O nome deste paciente é trocado por iniciais+nascimento antes do envio à IA. Outros dados sensíveis do documento
            (CPF, endereço, nomes de terceiros) NÃO são filtrados — você é responsável por essa checagem.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">
              <Paperclip size={12} /> Anexar PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={handleUploadPDF} disabled={anexoLoading} />
            </label>
          </div>
          <div className="mt-3">
            <label className={labelCls}>Ou cole um trecho do prontuário</label>
            <textarea value={anexoTexto} onChange={(e) => setAnexoTexto(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
            <button onClick={() => salvarAnexo("texto", anexoTexto)} disabled={anexoLoading || !anexoTexto.trim()}
              className="mt-2 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)] disabled:opacity-60">
              {anexoLoading ? "Salvando..." : "Salvar como referência"}
            </button>
          </div>
          {anexoErro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{anexoErro}</p>}
          {anexoOk && !anexoErro && (
            <p className="mt-2 text-xs text-[var(--c-accent)]">
              Referência salva — a IA vai usá-la nas próximas mensagens.
              {anexoTruncado && " Documento grande: só o início foi guardado (limite de tamanho)."}
            </p>
          )}
        </div>
      )}

      {aiUsado && (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-[var(--c-accent)]/30 bg-[var(--c-accent)]/10 p-3 text-xs text-[var(--c-text)]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-[var(--c-accent)]" />
          <span>Rascunho gerado por IA — revise e edite antes de usar. Não é laudo.</span>
        </div>
      )}

      {/* Diagrama de Beck */}
      <div className="space-y-0">
        <div className={box}><Campo label={L[0]} valor={dados[L[0]] ?? ""} onChange={(v) => set(L[0], v)} area /></div>
        <Seta />
        <div className={box}><Campo label={L[1]} valor={dados[L[1]] ?? ""} onChange={(v) => set(L[1], v)} /></div>
        <Seta />
        <div className={box}><Campo label={L[2]} valor={dados[L[2]] ?? ""} onChange={(v) => set(L[2], v)} area /></div>
        <Seta />
        <div className={box}><Campo label={L[3]} valor={dados[L[3]] ?? ""} onChange={(v) => set(L[3], v)} area /></div>
        <Seta />
        {/* ponytail: 2 situações fixas (igual ao formulário original); adicionar add/remove dinâmico se necessário */}
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((sit) => {
            const base = 4 + sit * 6;
            return (
              <div key={sit} className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={box}>
                    <Campo label={L[base + i]} valor={dados[L[base + i]] ?? ""} onChange={(v) => set(L[base + i], v)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
