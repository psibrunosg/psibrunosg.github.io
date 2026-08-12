// Modal com mensagem do Adulto Saudável para cada personagem no capítulo final

import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { Capitulo } from "@/content/psicoed/verade";

interface AdultoSaudavelModalProps {
  capitulo: Capitulo | null;
  onClose: () => void;
}

export default function AdultoSaudavelModal({ capitulo, onClose }: AdultoSaudavelModalProps) {
  const reduced = useReducedMotion();
  if (!capitulo) return null;

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl border p-6 shadow-2xl"
        style={{
          background: "color-mix(in oklab, var(--c-surface) 95%, transparent)",
          borderColor: `${capitulo.cor}55`,
          boxShadow: `0 0 40px -10px ${capitulo.glow}`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-[var(--c-muted)] hover:text-[var(--c-text)] transition-colors"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: capitulo.cor }}>
          Mensagem do Adulto Saudável
        </p>
        <h3
          className="text-2xl font-semibold text-[var(--c-text)] mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {capitulo.adultoSaudavel.titulo}
        </h3>
        <p className="text-[var(--c-text)] leading-relaxed">{capitulo.adultoSaudavel.mensagem}</p>
      </motion.div>
    </motion.div>
  );
}
