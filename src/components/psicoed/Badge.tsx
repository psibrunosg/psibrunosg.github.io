import { motion, useReducedMotion } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface BadgeProps {
  titulo: string;
  mensagem?: string;
}

/**
 * Celebração leve de conclusão de módulo. Tom de constância, nunca de
 * "melhora clínica" (restrição do CFP) — apenas reconhece que a pessoa
 * dedicou um tempo a se entender melhor.
 */
export default function Badge({
  titulo,
  mensagem = "Constância é o que importa. Você pode voltar a este território sempre que quiser.",
}: BadgeProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-2xl border border-[var(--c-accent)]/30 bg-gradient-to-br from-[var(--c-accent)]/10 to-[var(--c-bg)] p-8 text-center overflow-hidden"
    >
      {!reduced && <ConfeteLeve />}

      <motion.div
        initial={reduced ? undefined : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--c-accent)]/15 text-[var(--c-accent)] mb-4"
      >
        <PartyPopper size={28} />
      </motion.div>

      <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">
        Território concluído
      </p>
      <h3
        className="text-xl md:text-2xl font-semibold text-[var(--c-text)] mb-3"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {titulo}
      </h3>
      <p className="text-sm text-[var(--c-muted)] max-w-sm mx-auto">{mensagem}</p>
    </motion.div>
  );
}

// Confete leve com CSS/motion, sem dependências externas.
function ConfeteLeve() {
  const cores = ["var(--c-accent)", "var(--c-accent-lt)", "#E5C687"];
  const particulas = Array.from({ length: 14 });

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {particulas.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const cor = cores[i % cores.length];
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -20, x: `${x}%` }}
            animate={{ opacity: [0, 1, 0], y: 140 }}
            transition={{ duration: 1.4, delay, ease: "easeOut" }}
            className="absolute top-0 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: cor }}
          />
        );
      })}
    </div>
  );
}
