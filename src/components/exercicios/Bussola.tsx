import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "ranking" | "resultado";

const VALORES_INICIAIS = ["Saúde", "Relacionamentos", "Trabalho", "Criatividade", "Aprendizado", "Diversão", "Família", "Independência"];

export default function Bussola() {
  const { save, complete } = useExerciseSession("bussola-valores");
  const [fase, setFase] = useState<Fase>("ranking");
  const [ranking, setRanking] = useState<string[]>([...VALORES_INICIAIS].sort(() => Math.random() - 0.5));

  const handleMove = (item: string, direction: "up" | "down") => {
    const idx = ranking.indexOf(item);
    if (direction === "up" && idx > 0) {
      const novoRanking = [...ranking];
      [novoRanking[idx], novoRanking[idx - 1]] = [novoRanking[idx - 1], novoRanking[idx]];
      setRanking(novoRanking);
    } else if (direction === "down" && idx < ranking.length - 1) {
      const novoRanking = [...ranking];
      [novoRanking[idx], novoRanking[idx + 1]] = [novoRanking[idx + 1], novoRanking[idx]];
      setRanking(novoRanking);
    }
  };

  const handleFinalizar = () => {
    save({ ranking });
    complete(100);
    setFase("resultado");
  };

  if (fase === "ranking") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6 mb-6">
          <p className="text-sm text-[var(--c-muted)] mb-3">Ordene seus valores: do mais importante (topo) ao menos importante (base).</p>
        </div>

        <div className="space-y-2">
          {ranking.map((valor, i) => (
            <motion.div
              key={valor}
              layout
              className="glass-card rounded-lg p-4 flex items-center justify-between gap-2 border border-[var(--c-border)] hover:border-[var(--c-accent)] transition-all"
            >
              <span className="text-xs font-semibold text-[var(--c-accent)] min-w-6">{i + 1}º</span>
              <span className="flex-1 text-sm font-semibold text-[var(--c-text)]">{valor}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleMove(valor, "up")}
                  disabled={i === 0}
                  className="px-2 py-1 rounded text-xs bg-[var(--c-accent)]/20 text-[var(--c-accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(valor, "down")}
                  disabled={i === ranking.length - 1}
                  className="px-2 py-1 rounded text-xs bg-[var(--c-accent)]/20 text-[var(--c-accent)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ↓
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm mt-6"
        >
          Ver alinhamento
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">🧭 Sua Bússola de Valores</p>
        <p className="text-xs text-[var(--c-muted)] mb-4">Seus 3 principais valores são guia.</p>
      </div>

      <div className="space-y-2">
        {ranking.slice(0, 3).map((valor, i) => (
          <motion.div
            key={valor}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-lg p-4 border-l-4"
            style={{ borderLeftColor: ["#22c55e", "#3b82f6", "#8b5cf6"][i] }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: ["#22c55e", "#3b82f6", "#8b5cf6"][i] }}>
              Prioridade {i + 1}
            </p>
            <p className="text-lg font-bold text-[var(--c-text)]">{valor}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Próximo passo: alinhe suas ações diárias com seus 3 principais valores.
      </p>
    </motion.div>
  );
}
