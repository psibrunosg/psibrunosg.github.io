import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { ferramentas } from "@/content/ferramentas-terapeuta";
import { fadeUp } from "@/lib/motion";
import { useConceituacaoIA, type Resposta } from "@/hooks/useConceituacaoIA";
import { PainelIAConceituacao } from "@/components/conceituacao/PainelIAConceituacao";
import { box, Campo, Seta } from "@/components/conceituacao/CampoDiagrama";

const FERRAMENTA = ferramentas.find((f) => f.id === "conceituacao-processos")!;
const L = FERRAMENTA.campos.map((c) => c.label);

export function ConceituacaoProcessos({ respostas }: { respostas: Resposta[] }) {
  const ia = useConceituacaoIA("conceituacao-processos", respostas, FERRAMENTA);

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
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={box}><Campo label={L[i]} valor={ia.dados[L[i]] ?? ""} onChange={(v) => ia.set(L[i], v)} area /></div>
          ))}
        </div>
        <Seta />
        <div className={box}><Campo label={L[6]} valor={ia.dados[L[6]] ?? ""} onChange={(v) => ia.set(L[6], v)} area /></div>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
        <p className="text-[9px] text-[var(--c-muted)]">{FERRAMENTA.referencia}</p>
      </div>
    </motion.div>
  );
}
