import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, ArrowDown, Heart, Footprints } from "lucide-react";
import type { NarrativaEsquema } from "@/content/psicoed/narrativas-esquemas";
import { necessidades } from "@/content/psicoed/narrativas-esquemas";

// Renderiza uma narrativa de esquema desdobrada: história da criança (espinha),
// as "linhas" conectando necessidade → esquema → modo → gatilho (profundidade),
// e o beat de cuidar da necessidade (agência). `escore` só é passado quando o
// terapeuta liberou revelar_escore — caso contrário nunca aparece.
export function NarrativaEsquemaView({ n, escore }: { n: NarrativaEsquema; escore?: number }) {
  const reduced = useReducedMotion();
  const necessidade = necessidades[n.dominioId];
  const revelar = { hidden: reduced ? {} : { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

  const Elo = ({ children, corDot }: { children: React.ReactNode; corDot: string }) => (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: corDot }} />
        <span className="my-1 w-px flex-1" style={{ borderLeft: "2px dashed var(--c-border)" }} />
      </div>
      <div className="pb-5">{children}</div>
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.08 }}
      className="rounded-2xl border p-6 md:p-7"
      style={{ borderColor: n.cor + "40", background: `color-mix(in oklab, ${n.cor} 4%, transparent)` }}
    >
      {/* Cabeçalho: necessidade + esquema */}
      <motion.div variants={revelar}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: n.cor }}>
          Necessidade · {necessidade.nome}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <h3 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>
            {n.esquema}
          </h3>
          {escore !== undefined && (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: n.cor + "1A", color: n.cor }}>
              {escore.toFixed(1)}
            </span>
          )}
        </div>
      </motion.div>

      {/* Espinha B — história da criança */}
      <motion.div variants={revelar} className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--c-text)]">
        <p>{n.crianca.abertura}</p>
        <p className="text-[var(--c-muted)]">{n.crianca.faltou}</p>
        <p>{n.crianca.aprendeu}</p>
      </motion.div>

      <motion.div variants={revelar} className="flex justify-center py-3 text-[var(--c-muted)]">
        <ArrowDown size={16} />
      </motion.div>

      {/* Profundidade A — as linhas conectando origem e presente */}
      <motion.div variants={revelar}>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: n.cor }}>
          Como isso te alcança hoje
        </p>
        <div>
          <Elo corDot={necessidade.cor}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">A necessidade</p>
            <p className="text-sm leading-relaxed text-[var(--c-text)]">{necessidade.descricao}</p>
          </Elo>
          <Elo corDot={n.cor}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Vira, hoje</p>
            <p className="text-sm leading-relaxed text-[var(--c-text)]">{n.conexao.hoje}</p>
          </Elo>
          <Elo corDot={n.cor}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Quem assume o microfone</p>
            <p className="text-sm leading-relaxed text-[var(--c-text)]">{n.conexao.modo}</p>
          </Elo>
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: n.cor }} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Um gatilho comum</p>
              <p className="text-sm leading-relaxed text-[var(--c-text)]">{n.conexao.gatilho}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Beat C — cuidar da necessidade */}
      <motion.div
        variants={revelar}
        className="mt-6 rounded-xl border p-4"
        style={{ borderColor: n.cor + "33", background: n.cor + "0D" }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Heart size={15} style={{ color: n.cor }} />
          <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: n.cor }}>Cuidar dessa necessidade</p>
        </div>
        <p className="text-sm leading-relaxed text-[var(--c-text)]">{n.cuidado.atendida}</p>
        <div className="mt-3 flex items-start gap-2 border-t pt-3" style={{ borderColor: n.cor + "22" }}>
          <Footprints size={15} className="mt-0.5 flex-shrink-0" style={{ color: n.cor }} />
          <p className="text-sm leading-relaxed text-[var(--c-text)]">{n.cuidado.passo}</p>
        </div>
      </motion.div>

      <motion.p variants={revelar} className="mt-4 flex items-center gap-1.5 text-[11px] italic text-[var(--c-muted)]">
        <Sparkles size={12} />
        Isto é um mapa de compreensão, não um diagnóstico — o aprofundamento acontece na terapia.
      </motion.p>
    </motion.div>
  );
}
