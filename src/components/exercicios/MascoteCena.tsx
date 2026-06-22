import { motion } from "framer-motion";

// Mascote unico e gentil que reage ao progresso (estilo blob acolhedor).
// progresso: 0 (inicio) .. 1 (concluido)
export function Mascote({ progresso, cor, fala }: { progresso: number; cor: string; fala?: string }) {
  const feliz = progresso >= 1;
  const animado = progresso > 0;
  // curva do sorriso: comeca neutro, vira sorriso conforme progride
  const sorriso = 50 + progresso * 8; // controle Y da boca
  const olhoY = feliz ? 40 : 42;

  return (
    <motion.div
      className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2"
      initial={{ opacity: 0, y: 30, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {fala && (
        <motion.div
          key={fala}
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-[160px] rounded-2xl rounded-br-sm bg-white px-3 py-2 text-[11px] font-medium text-[var(--c-text)] shadow-lg"
          style={{ border: `1.5px solid ${cor}40` }}
        >
          {fala}
        </motion.div>
      )}
      <motion.svg
        width="84" height="84" viewBox="0 0 100 100"
        animate={animado ? { y: [0, -6, 0], rotate: [0, -3, 3, 0] } : { y: [0, -3, 0] }}
        transition={{ duration: feliz ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.18))" }}
      >
        {/* corpo */}
        <ellipse cx="50" cy="55" rx="34" ry="33" fill={cor} />
        <ellipse cx="50" cy="55" rx="34" ry="33" fill="url(#mascoteGrad)" opacity="0.25" />
        {/* barriga clara */}
        <ellipse cx="50" cy="62" rx="20" ry="18" fill="#ffffff" opacity="0.85" />
        {/* olhos */}
        <circle cx="40" cy={olhoY} r="4.2" fill="#3a2a1f" />
        <circle cx="60" cy={olhoY} r="4.2" fill="#3a2a1f" />
        <circle cx="41.3" cy={olhoY - 1.3} r="1.4" fill="#fff" />
        <circle cx="61.3" cy={olhoY - 1.3} r="1.4" fill="#fff" />
        {/* bochechas */}
        <circle cx="33" cy="50" r="4" fill="#ff9bb0" opacity="0.55" />
        <circle cx="67" cy="50" r="4" fill="#ff9bb0" opacity="0.55" />
        {/* boca */}
        <path d={`M40 52 Q50 ${sorriso} 60 52`} stroke="#3a2a1f" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* folhinha quando feliz */}
        {feliz && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <path d="M50 22 Q50 12 58 10 Q52 18 50 24 Z" fill="#6B8C3A" />
          </motion.g>
        )}
        <defs>
          <radialGradient id="mascoteGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
        </defs>
      </motion.svg>
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
