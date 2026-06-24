import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint } from "lucide-react";

const FRASES = [
  "Me pegou!", "Auuu!", "Que rapido!", "Hihi, quase!", "Boa!", "Voce e craque!",
];

// "Ache a toupeira": o lobo surge em pontos aleatorios perto do topo,
// fica alguns segundos e some. Clicar antes de sumir = ponto + frase.
export function LoboToupeira({ active }: { active: boolean }) {
  const [visivel, setVisivel] = useState(false);
  const [pos, setPos] = useState({ left: "50%" });
  const [pontos, setPontos] = useState(0);
  const [fala, setFala] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const limpar = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const surgir = useCallback(() => {
    const left = 8 + Math.random() * 74; // % dentro da viewport
    setPos({ left: `${left}%` });
    setVisivel(true);
    // some sozinho se ninguem pegar
    const t = window.setTimeout(() => setVisivel(false), 2800);
    timers.current.push(t);
  }, []);

  useEffect(() => {
    if (!active) { setVisivel(false); limpar(); return; }
    let cancelado = false;
    function agendar() {
      const espera = 3500 + Math.random() * 4500;
      const t = window.setTimeout(() => {
        if (cancelado) return;
        surgir();
        agendar();
      }, espera);
      timers.current.push(t);
    }
    agendar();
    return () => { cancelado = true; limpar(); };
  }, [active, surgir, limpar]);

  function pegar() {
    setVisivel(false);
    setPontos((p) => p + 1);
    setFala(FRASES[Math.floor(Math.random() * FRASES.length)]);
    const t = window.setTimeout(() => setFala(null), 1800);
    timers.current.push(t);
  }

  if (!active) return null;

  return (
    <>
      {/* placar */}
      {pontos > 0 && (
        <div className="fixed left-1/2 top-[68px] z-[60] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--c-accent)] px-3 py-1 text-[11px] font-bold text-white shadow-lg">
          <PawPrint size={12} aria-hidden="true" /> {pontos} {pontos === 1 ? "captura" : "capturas"}
        </div>
      )}

      <AnimatePresence>
        {visivel && (
          <motion.button
            key="toupeira"
            type="button"
            onClick={pegar}
            aria-label="Pegar o lobo"
            className="fixed top-[52px] z-[55] h-24 w-24 cursor-pointer"
            style={{ left: pos.left }}
            initial={{ y: 90, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 90, opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            whileTap={{ scale: 0.85 }}
          >
            <video
              src="/img/lobo-espia.webm"
              autoPlay loop muted playsInline
              className="h-full w-full object-contain"
              style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))" }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fala && (
          <motion.div
            key={fala}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed left-1/2 top-[104px] z-[60] -translate-x-1/2 rounded-2xl bg-white px-3 py-1.5 text-xs font-semibold text-[var(--c-accent)] shadow-lg"
          >
            {fala}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
