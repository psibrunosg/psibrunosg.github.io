import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint } from "lucide-react";

const CORES_BOLHA = ["#C2658A", "#7A4A8C", "#3A6B8C", "#2F8C7A", "#C0773A", "#8C5A3A", "#5B6B8C"];

interface Bolha { id: number; x: number; y: number; size: number; cor: string; }

// Grade de bolhas decorativas. O lobo surge em uma aleatoria a cada poucos segundos.
// Clicar no lobo = ponto + frase.
export function LoboBolhas({ active }: { active: boolean }) {
  const bolhas = useMemo<Bolha[]>(() => {
    const list: Bolha[] = [];
    let id = 0;
    const posicoes = [
      { x: 2, y: 12 }, { x: 88, y: 8 },
      { x: -2, y: 42 }, { x: 92, y: 38 },
      { x: 3, y: 72 }, { x: 90, y: 68 },
      { x: 85, y: 88 }, { x: 5, y: 92 },
    ];
    for (const pos of posicoes) {
      list.push({
        id: id++,
        x: pos.x,
        y: pos.y,
        size: 40 + Math.random() * 20,
        cor: CORES_BOLHA[id % CORES_BOLHA.length],
      });
    }
    return list;
  }, []);

  const [loboEm, setLoboEm] = useState<number | null>(null);
  const [pontos, setPontos] = useState(0);
  const [fala, setFala] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  const limpar = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  const surgir = useCallback(() => {
    const idx = Math.floor(Math.random() * bolhas.length);
    setLoboEm(idx);
    const t = window.setTimeout(() => setLoboEm(null), 2500);
    timers.current.push(t);
  }, [bolhas.length]);

  useEffect(() => {
    if (!active) { setLoboEm(null); limpar(); return; }
    let cancelado = false;
    function agendar() {
      const espera = 4000 + Math.random() * 5000;
      const t = window.setTimeout(() => {
        if (cancelado) return;
        surgir();
        agendar();
      }, espera);
      timers.current.push(t);
    }
    const t = window.setTimeout(agendar, 2000);
    timers.current.push(t);
    return () => { cancelado = true; limpar(); };
  }, [active, surgir, limpar]);

  function pegar() {
    setLoboEm(null);
    setPontos((p) => p + 1);
    const frases = ["Achei!", "Auuuu!", "Boa vista!", "Rapido!", "Hihi!"];
    setFala(frases[Math.floor(Math.random() * frases.length)]);
    const t = window.setTimeout(() => setFala(null), 1600);
    timers.current.push(t);
  }

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden="true">
      {/* bolhas decorativas */}
      {bolhas.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full opacity-[0.06]"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, background: b.cor }}
        />
      ))}

      {/* lobo surgindo */}
      <AnimatePresence>
        {loboEm !== null && (() => {
          const b = bolhas[loboEm];
          return (
            <motion.button
              key={"lobo-" + loboEm}
              type="button"
              onClick={pegar}
              className="pointer-events-auto absolute cursor-pointer"
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: 80, height: 80, marginLeft: -16, marginTop: -16 }}
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 340, damping: 18 }}
              whileTap={{ scale: 0.8 }}
            >
              <video
                src="/img/lobo-bolha.webm"
                autoPlay loop muted playsInline
                className="h-full w-full object-contain"
                style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))" }}
              />
            </motion.button>
          );
        })()}
      </AnimatePresence>

      {/* placar + fala */}
      {pontos > 0 && (
        <div className="pointer-events-none fixed bottom-20 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--c-accent)] px-3 py-1 text-[11px] font-bold text-white shadow-lg">
          <PawPrint size={12} aria-hidden="true" /> {pontos} encontrado{pontos > 1 ? "s" : ""}
        </div>
      )}
      <AnimatePresence>
        {fala && (
          <motion.div
            key={fala}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-none fixed bottom-32 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-white px-3 py-1.5 text-xs font-semibold text-[var(--c-accent)] shadow-lg"
          >
            {fala}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
