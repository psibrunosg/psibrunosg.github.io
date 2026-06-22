import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";

const FRASES_TOQUE = [
  "Oi! Que bom te ver! 🐾", "Voce consegue!", "To aqui com voce!",
  "Respira fundo... 🌿", "Mandou bem!", "Vamos com calma!", "Auuu! 🐺",
];

// Mascote lobo animado (video), tocavel e reativo ao progresso.
// progresso: 0 (inicio) .. 1 (concluido)
export function Mascote({ progresso, cor, fala }: { progresso: number; cor: string; fala?: string }) {
  const feliz = progresso >= 1;
  const [falaToque, setFalaToque] = useState<string | null>(null);
  const controls = useAnimationControls();

  const falaAtual = falaToque ?? fala;

  function brincar() {
    setFalaToque(FRASES_TOQUE[Math.floor(Math.random() * FRASES_TOQUE.length)]);
    controls.start({
      y: [0, -28, 0, -12, 0],
      rotate: [0, -8, 8, -4, 0],
      scale: [1, 1.12, 1, 1.05, 1],
      transition: { duration: 0.9, ease: "easeInOut" },
    });
    setTimeout(() => setFalaToque(null), 2600);
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2"
      initial={{ opacity: 0, y: 30, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {falaAtual && (
        <motion.div
          key={falaAtual}
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none max-w-[180px] rounded-2xl rounded-br-sm bg-white px-3 py-2 text-[11px] font-medium text-[var(--c-text)] shadow-lg"
          style={{ border: `1.5px solid ${cor}40` }}
        >
          {falaAtual}
        </motion.div>
      )}

      <motion.button
        type="button"
        onClick={brincar}
        aria-label="Brincar com o mascote"
        className="relative cursor-pointer rounded-full"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92 }}
        animate={controls}
      >
        {/* balao claro: o blend multiply some o fundo branco do video */}
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "#FBF7F0", boxShadow: `0 10px 24px -8px ${cor}99, inset 0 0 0 2px ${cor}33` }}
          aria-hidden="true"
        />
        <motion.div
          className="relative h-[104px] w-[104px] overflow-hidden rounded-full sm:h-[120px] sm:w-[120px]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: feliz ? 1.8 : 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <video
            src="/img/mascote-lobo.mp4"
            autoPlay loop muted playsInline
            className="h-full w-full scale-110 object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
        </motion.div>
        {feliz && (
          <motion.span
            className="absolute -right-1 -top-1 text-xl"
            initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1], rotate: [0, 20, 0] }} transition={{ type: "spring" }}
          >
            🌟
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
}

// Cena ilustrada suave por tema (header decorativo, tingida pela cor do objetivo).
export function CenaTema({ cor, variante = 0 }: { cor: string; variante?: number }) {
  return (
    <div className="relative h-24 w-full overflow-hidden rounded-t-2xl" style={{ background: `linear-gradient(160deg, ${cor}22, ${cor}08)` }}>
      <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {/* sol/lua suave */}
        <circle cx={variante % 2 === 0 ? 320 : 70} cy="34" r="20" fill={cor} opacity="0.35" />
        {/* colinas/ondas */}
        <path d="M0 70 Q60 45 120 65 T260 60 T400 68 V100 H0 Z" fill={cor} opacity="0.22" />
        <path d="M0 82 Q80 60 160 78 T340 74 T400 80 V100 H0 Z" fill={cor} opacity="0.32" />
        {/* plantinhas */}
        {[40, 130, 230, 330].map((x, i) => (
          <motion.path
            key={x}
            d={`M${x} 88 Q${x - 5} 76 ${x} 70 Q${x + 5} 76 ${x} 88`}
            fill={cor} opacity="0.45"
            animate={{ rotate: [0, 4, -4, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${x}px 88px` }}
          />
        ))}
      </svg>
    </div>
  );
}
