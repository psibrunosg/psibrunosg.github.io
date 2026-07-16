import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Loader2, Download, Info } from "lucide-react";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";
import { interpretarResposta } from "@/lib/interpret";
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

export function ConceituacaoCognitiva({ respostas }: { respostas: Resposta[] }) {
  const [dados, setDados] = useState<Record<string, string>>({});
  const [pacienteChave, setPacienteChave] = useState("");
  const [contexto, setContexto] = useState("");
  const [provider, setProvider] = useState(() => localStorage.getItem("conceituacao_provider") || "nvidia");
  const [model, setModel] = useState(() => localStorage.getItem("conceituacao_model") || "");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aiUsado, setAiUsado] = useState(false);

  const set = (label: string, v: string) => setDados((d) => ({ ...d, [label]: v }));

  const grupos = (() => {
    const m = new Map<string, Resposta[]>();
    for (const r of respostas) { const k = chavePaciente(r); const a = m.get(k) ?? []; a.push(r); m.set(k, a); }
    return Array.from(m.entries());
  })();

  function escolherProvider(p: string) {
    setProvider(p);
    localStorage.setItem("conceituacao_provider", p);
  }
  function escolherModel(m: string) {
    setModel(m);
    localStorage.setItem("conceituacao_model", m);
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
      setErro(e instanceof Error ? e.message : "Erro ao gerar rascunho.");
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
              <label className={labelCls}>Modelo (opcional)</label>
              <input value={model} onChange={(e) => escolherModel(e.target.value)} placeholder="padrão do provedor" className={inputCls} />
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
