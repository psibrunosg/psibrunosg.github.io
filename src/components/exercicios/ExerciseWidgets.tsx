import { motion } from "framer-motion";

// Detecta o tipo de campo a partir do texto da instrucao.
export type TipoCampo = "termometro" | "humor" | "sentimentos" | "evidencias" | "texto" | "info";

export function tipoCampo(text: string): TipoCampo {
  const t = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (t.includes("evidencia") || (t.includes("a favor") && t.includes("contra")) || t.includes("provas")) return "evidencias";
  if (t.includes("0 a 10") || t.includes("0-10") || t.includes("escala de 0") || t.includes("intensidade") || t.includes("o quanto") || t.includes("avalie de") || t.includes("nota de") || t.includes("de 0 a")) return "termometro";
  if (t.includes("como voce se sente") || t.includes("como se sente") || t.includes("seu humor") || t.includes("como esta se sentindo")) return "humor";
  if (t.includes("sentimento") || t.includes("emocoes") || t.includes("que emocao") || t.includes("nomeie") || t.includes("nomear")) return "sentimentos";
  // prompts que pedem escrita
  if (text.endsWith(":") || text.endsWith("?") || text.includes("___") ||
    t.includes("escreva") || t.includes("liste") || t.includes("anote") || t.includes("descreva") ||
    t.includes("registre") || t.includes("preencha") || t.includes("identifique") || t.includes("reflita") ||
    t.includes("observe") || t.includes("responda") || t.includes("complete")) return "texto";
  return "info";
}

// ---------- Termometro de emocao (0-10) ----------
function Termometro({ value, onChange, cor }: { value: string; onChange: (v: string) => void; cor: string }) {
  const num = parseInt(value, 10);
  const v = isNaN(num) ? -1 : num;
  return (
    <div className="mt-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/40 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--c-muted)]">Toque no numero</span>
        {v >= 0 && <span className="text-lg font-bold" style={{ color: cor }}>{v}<span className="text-xs text-[var(--c-muted)]">/10</span></span>}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 11 }, (_, i) => {
          const sel = v === i;
          const intensidade = i / 10;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(String(i))}
              className="flex-1 rounded-lg py-2.5 text-xs font-bold transition-all"
              style={{
                background: sel ? cor : `color-mix(in oklab, ${cor} ${8 + intensidade * 22}%, transparent)`,
                color: sel ? "#fff" : "var(--c-text)",
                transform: sel ? "scale(1.12)" : undefined,
              }}
            >
              {i}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[9px] text-[var(--c-muted)]">
        <span>Nada</span><span>Muito</span>
      </div>
    </div>
  );
}

// ---------- Seletor de humor (emojis) ----------
const HUMORES = [
  { e: "😄", l: "Otimo" }, { e: "🙂", l: "Bem" }, { e: "😐", l: "Mais ou menos" },
  { e: "😟", l: "Triste" }, { e: "😢", l: "Muito triste" }, { e: "😠", l: "Bravo" }, { e: "😰", l: "Ansioso" },
];
function Humor({ value, onChange, cor }: { value: string; onChange: (v: string) => void; cor: string }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {HUMORES.map((h) => {
        const sel = value === `${h.e} ${h.l}`;
        return (
          <button
            key={h.l}
            type="button"
            onClick={() => onChange(sel ? "" : `${h.e} ${h.l}`)}
            className="flex flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition-all"
            style={{
              borderColor: sel ? cor : "var(--c-border)",
              background: sel ? `color-mix(in oklab, ${cor} 12%, transparent)` : "transparent",
              transform: sel ? "scale(1.06)" : undefined,
            }}
          >
            <span className="text-2xl">{h.e}</span>
            <span className="text-[9px] font-medium text-[var(--c-muted)]">{h.l}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Roda de sentimentos (multi-selecao) ----------
const SENTIMENTOS = [
  "Alegria", "Calma", "Gratidao", "Esperanca", "Orgulho", "Amor",
  "Medo", "Ansiedade", "Tristeza", "Raiva", "Culpa", "Vergonha",
  "Solidao", "Frustracao", "Inveja", "Confusao", "Tedio", "Surpresa",
];
function Sentimentos({ value, onChange, cor }: { value: string; onChange: (v: string) => void; cor: string }) {
  const selecionados = value ? value.split(", ").filter(Boolean) : [];
  function toggle(s: string) {
    const next = selecionados.includes(s) ? selecionados.filter((x) => x !== s) : [...selecionados, s];
    onChange(next.join(", "));
  }
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {SENTIMENTOS.map((s) => {
        const sel = selecionados.includes(s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => toggle(s)}
            className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              borderColor: sel ? cor : "var(--c-border)",
              background: sel ? cor : "transparent",
              color: sel ? "#fff" : "var(--c-text)",
            }}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Evidencias (a favor / contra) ----------
function parseEvid(value: string): { favor: string; contra: string } {
  try {
    const o = JSON.parse(value);
    if (o && typeof o === "object") return { favor: o.favor ?? "", contra: o.contra ?? "" };
  } catch { /* texto livre antigo */ }
  return { favor: value ?? "", contra: "" };
}
function Evidencias({ value, onChange, cor }: { value: string; onChange: (v: string) => void; cor: string }) {
  const { favor, contra } = parseEvid(value);
  const set = (f: string, c: string) => onChange(JSON.stringify({ favor: f, contra: c }));
  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border-2 p-3" style={{ borderColor: "#4A6B4755" }}>
        <p className="mb-1.5 text-[11px] font-bold text-[#4A6B47]">✓ A favor</p>
        <textarea value={favor} onChange={(e) => set(e.target.value, contra)} rows={3}
          placeholder="Fatos que apoiam..."
          className="w-full resize-y rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:outline-none focus:border-[#4A6B47]" />
      </div>
      <div className="rounded-xl border-2 p-3" style={{ borderColor: "#B0503055" }}>
        <p className="mb-1.5 text-[11px] font-bold text-[#B05030]">✗ Contra</p>
        <textarea value={contra} onChange={(e) => set(favor, e.target.value)} rows={3}
          placeholder="Fatos que contradizem..."
          className="w-full resize-y rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:outline-none focus:border-[#B05030]" />
      </div>
      {/* mantem cor de tema referenciada para consistencia visual futura */}
      <span className="hidden" style={{ color: cor }} />
    </div>
  );
}

// Converte valor de widget para texto legivel (PDF / leitura).
export function valorLegivel(tipo: TipoCampo, value: string): string {
  if (!value) return "";
  if (tipo === "termometro") return `${value}/10`;
  if (tipo === "evidencias") {
    const { favor, contra } = parseEvid(value);
    const parts: string[] = [];
    if (favor.trim()) parts.push(`A favor: ${favor.trim()}`);
    if (contra.trim()) parts.push(`Contra: ${contra.trim()}`);
    return parts.join("  |  ");
  }
  return value;
}

// Campo unificado.
export function CampoExercicio({ tipo, value, onChange, cor, isInfantil }: {
  tipo: TipoCampo; value: string; onChange: (v: string) => void; cor: string; isInfantil: boolean;
}) {
  if (tipo === "termometro") return <Termometro value={value} onChange={onChange} cor={cor} />;
  if (tipo === "humor") return <Humor value={value} onChange={onChange} cor={cor} />;
  if (tipo === "sentimentos") return <Sentimentos value={value} onChange={onChange} cor={cor} />;
  if (tipo === "evidencias") return <Evidencias value={value} onChange={onChange} cor={cor} />;
  if (tipo === "texto") {
    return (
      <motion.textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isInfantil ? "Escreva aqui do seu jeito..." : "Escreva sua resposta..."}
        rows={3}
        whileFocus={{ scale: 1.005 }}
        className="mt-2 w-full resize-y rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] transition-colors placeholder:text-[var(--c-muted)]/40 focus:outline-none"
        style={{ borderColor: value.trim() ? cor : undefined }}
      />
    );
  }
  // info: campo opcional discreto
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Anotacoes (opcional)..."
      rows={2}
      className="mt-2 w-full resize-y rounded-lg border border-dashed border-[var(--c-border)]/60 bg-transparent px-4 py-2 text-xs text-[var(--c-muted)] transition-colors placeholder:text-[var(--c-muted)]/30 focus:bg-[var(--c-bg)]/40 focus:outline-none"
    />
  );
}
