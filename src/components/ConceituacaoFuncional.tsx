import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-funcional")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoFuncional({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-funcional", respostas, FERRAMENTA);

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{FERRAMENTA.categoria}</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{FERRAMENTA.titulo}</h2>
        </div>
        <button onClick={ia.exportarPDF}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Salvar PDF
        </button>
      </div>

      <PainelIAConceituacao ia={ia} />

      <div className="space-y-0">
        <div className={box}><Campo label={L[0]} valor={ia.dados[L[0]] ?? ""} onChange={(v) => ia.set(L[0], v)} /></div>
        <Seta />
        <div className={box}><Campo label={L[1]} valor={ia.dados[L[1]] ?? ""} onChange={(v) => ia.set(L[1], v)} area /></div>
        <Seta />
        {/* 2 situações fixas: Antecedente, Comportamento, Consequência (3 campos cada) */}
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((sit) => {
            const base = 2 + sit * 3;
            return (
              <div key={sit} className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={box}>
                    <Campo label={L[base + i]} valor={ia.dados[L[base + i]] ?? ""} onChange={(v) => ia.set(L[base + i], v)} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <Seta />
        <div className={box}><Campo label={L[8]} valor={ia.dados[L[8]] ?? ""} onChange={(v) => ia.set(L[8], v)} area /></div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
