import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "avaliacao" | "resultado";

const FACETAS = ["Trabalho", "Relacionamentos", "Aparência", "Casa", "Saúde", "Pontualidade"];

export default function Perfeccionometro() {
  const { save, complete } = useExerciseSession("perfeccionometro");
  const [fase, setFase] = useState<Fase>("avaliacao");
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const handleAvaliar = (faceta: string, valor: number) => {
    setScores({ ...scores, [faceta]: valor });
  };

  const handleFinalizar = () => {
    if (Object.keys(scores).length === FACETAS.length) {
      save(scores);
      complete(100);
      setFase("resultado");
    }
  };

  const todasAvaliadasCheck = Object.keys(scores).length === FACETAS.length;

  if (fase === "avaliacao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6 mb-4">
          <p className="text-sm text-[var(--c-muted)]">Avalie quanto de perfeccionismo você tem em cada faceta (0 = relaxado, 100 = rígido).</p>
        </div>

        <div className="space-y-4">
          {FACETAS.map((faceta) => (
            <motion.div key={faceta} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-[var(--c-accent)]">{faceta}</label>
                <span className="text-xs font-bold text-[var(--c-accent)]">{scores[faceta] || 0}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={scores[faceta] || 0}
                onChange={(e) => handleAvaliar(faceta, Number(e.target.value))}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          disabled={!todasAvaliadasCheck}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50 mt-6"
        >
          Ver radar
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">📊 Seu Perfeccionômetro</p>
        <p className="text-xs text-[var(--c-muted)]">Áreas com alta rigidez custam energia e causa estresse.</p>
      </div>

      <div className="space-y-3">
        {FACETAS.map((faceta, i) => {
          const score = scores[faceta] || 0;
          return (
            <motion.div
              key={faceta}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-1"
            >
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[var(--c-text)]">{faceta}</span>
                <span className="text-[var(--c-accent)]">{score}</span>
              </div>
              <div className="h-2 bg-[var(--c-border)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[var(--c-accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Áreas acima de 70: considere relaxar expectativas. Perfeição custa mais do que progresso.
      </p>
    </motion.div>
  );
}
