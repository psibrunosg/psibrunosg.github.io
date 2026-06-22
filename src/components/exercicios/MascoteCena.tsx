import { motion } from "framer-motion";

// Mascote unico e gentil que reage ao progresso (estilo blob acolhedor).
// progresso: 0 (inicio) .. 1 (concluido)
export function Mascote({ progresso, cor, fala }: { progresso: number; cor: string; fala?: string }) {
  const feliz = progresso >= 1;
  const animado = progresso > 0;
  const src = feliz ? "/img/mascote-lobo-feliz.png" : "/img/mascote-lobo.png";

  return (
    <motion.div
      className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2"
      initial={{ opacity: 0, y: 30, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {fala && (
        <motion.div
          key={fala}
          initial={{ opacity: 0, scale: 0.8, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-[170px] rounded-2xl rounded-br-sm bg-white px-3 py-2 text-[11px] font-medium text-[var(--c-text)] shadow-lg"
          style={{ border: `1.5px solid ${cor}40` }}
        >
          {fala}
        </motion.div>
      )}
      <motion.img
        src={src}
        alt="Mascote"
        draggable={false}
        className="h-24 w-24 select-none object-contain sm:h-28 sm:w-28"
        style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.2))" }}
        animate={animado ? { y: [0, -8, 0], rotate: [0, -2, 2, 0] } : { y: [0, -4, 0] }}
        transition={{ duration: feliz ? 1.6 : 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
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
