import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sun, CloudRain } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";
import { baloesClima } from "@/content/trilhaInfantil";

// Leahy 2.2 — Como pensamentos criam sentimentos.
// Mecânica: ver o pensamento no balão, ADIVINHAR se ele traz sol ou chuva antes de
// estourar (previsão), depois estourar e conferir. O objetivo é perceber que
// pensamentos diferentes trazem "climas" (sentimentos) diferentes.

type Fase = "prever" | "revelar" | "fim";

export default function BaloesDoClima() {
  const { complete } = useExerciseSession("baloes-clima");
  const [idx, setIdx] = useState(0);
  const [fase, setFase] = useState<Fase>("prever");
  const [palpite, setPalpite] = useState<"sol" | "chuva" | null>(null);
  const [acertos, setAcertos] = useState(0);

  const balao = baloesClima[idx];

  const prever = (escolha: "sol" | "chuva") => {
    setPalpite(escolha);
    if (escolha === balao.clima) setAcertos((a) => a + 1);
    setFase("revelar");
  };

  const proximo = () => {
    if (idx + 1 >= baloesClima.length) {
      setFase("fim");
      complete(Math.round((acertos / baloesClima.length) * 100));
      return;
    }
    setIdx((i) => i + 1);
    setPalpite(null);
    setFase("prever");
  };

  const reiniciar = () => {
    setIdx(0);
    setFase("prever");
    setPalpite(null);
    setAcertos(0);
  };

  if (fase === "fim") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center space-y-4">
        <Sun size={40} className="mx-auto text-[var(--c-warm)]" aria-hidden />
        <h2 className="text-xl font-semibold text-[var(--c-text)]">Fim do céu de pensamentos!</h2>
        <p className="text-sm text-[var(--c-muted)]">
          Você acertou o clima de <strong>{acertos}/{baloesClima.length}</strong> balões.
        </p>
        <p className="text-sm text-[var(--c-text)] italic">
          Cada pensamento traz um "clima" diferente pro nosso corpo. Pensamentos gostosos trazem sol; pensamentos assustadores trazem chuva.
        </p>
        <button onClick={reiniciar} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
          <RotateCcw size={16} aria-hidden /> Soltar outros balões
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-[10px] font-semibold text-[var(--c-muted)] uppercase tracking-wider">
        Balão {idx + 1} de {baloesClima.length}
      </p>

      <div className="glass-card rounded-2xl p-8 min-h-56 flex flex-col items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={fase === "revelar" ? { y: -260, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: fase === "revelar" ? 1.4 : 0.4, ease: "easeIn" }}
            className="text-center"
          >
            <div className="text-6xl mb-3" aria-hidden>🎈</div>
            <div className="bg-[var(--c-surface)] rounded-2xl px-4 py-3 border-2 border-dashed border-[var(--c-border)] max-w-xs">
              <p className="text-sm font-semibold text-[var(--c-text)]">"{balao.texto}"</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {fase === "revelar" && (
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-2">
            {balao.clima === "sol" ? (
              <Sun size={48} className="text-[var(--c-warm)]" aria-hidden />
            ) : (
              <CloudRain size={48} className="text-[var(--c-accent)]" aria-hidden />
            )}
            <p className={`text-sm font-semibold ${palpite === balao.clima ? "text-[var(--c-moss-dk)]" : "text-[var(--c-accent)]"}`}>
              {palpite === balao.clima ? "✓ Você acertou o clima!" : `✗ Esse pensamento era de ${balao.clima === "sol" ? "sol ☀️" : "chuva 🌧️"}.`}
            </p>
          </motion.div>
        )}
      </div>

      {fase === "prever" ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => prever("sol")}
            aria-label="Palpite: pensamento de sol"
            className="flex flex-col items-center gap-1 py-4 rounded-xl border border-[var(--c-border)] text-[var(--c-warm)] font-semibold hover:border-current transition-colors"
          >
            <Sun size={28} aria-hidden /> Sol
          </button>
          <button
            onClick={() => prever("chuva")}
            aria-label="Palpite: pensamento de chuva"
            className="flex flex-col items-center gap-1 py-4 rounded-xl border border-[var(--c-border)] text-[var(--c-accent)] font-semibold hover:border-current transition-colors"
          >
            <CloudRain size={28} aria-hidden /> Chuva
          </button>
        </div>
      ) : (
        <button onClick={proximo} className="w-full py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
          {idx + 1 >= baloesClima.length ? "Ver resultado" : "Próximo balão"}
        </button>
      )}
    </div>
  );
}
