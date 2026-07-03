import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const FATORES = [
  "Meu comportamento",
  "Circunstâncias externas",
  "Ação de outros",
  "Sorte/acaso",
  "Minha negligência",
];

export default function TortaResponsabilidade() {
  const { save, complete } = useExerciseSession("torta-responsabilidade");
  const [evento, setEvento] = useState("");
  const [fatores, setFatores] = useState<number[]>(Array(FATORES.length).fill(20));
  const [fase, setFase] = useState<"entrada" | "distribuicao" | "resultado">("entrada");

  const handleIniciar = () => {
    if (!evento.trim()) return;
    setFase("distribuicao");
    save({ evento });
  };

  const atualizarFator = (idx: number, valor: number) => {
    const novosFatores = [...fatores];
    novosFatores[idx] = valor;
    setFatores(novosFatores);
  };

  const somaFatores = fatores.reduce((a, b) => a + b, 0);
  const proporcoes = fatores.map((f) => (f / somaFatores) * 100);
  const meuFator = proporcoes[0]; // Primeiro é "Meu comportamento"

  const handleFinalizar = () => {
    save({ fatores, proporcoes });
    complete(100 - Math.round(meuFator)); // XP baseado na redução da culpa
    setFase("resultado");
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">O que deu errado?</label>
          <textarea
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            placeholder="Descreva o evento negativo..."
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
            rows={3}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!evento.trim()}
            className="mt-3 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Distribuir responsabilidade →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "resultado") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">Culpa pessoal:</p>
          <p className="text-4xl font-bold text-[var(--c-text)] mb-2">{Math.round(meuFator)}%</p>
          <p className="text-xs text-[var(--c-muted)]">Você não é responsável por {Math.round(100 - meuFator)}%</p>
        </div>
        <p className="text-sm text-[var(--c-text)] font-semibold">Reduza a culpa realista.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <p className="text-sm font-semibold text-[var(--c-text)] mb-3">Distribua a responsabilidade (total = 100%):</p>

      {/* Pizza visual simples */}
      <div className="flex gap-2 justify-center mb-4">
        {proporcoes.map((prop, i) => (
          <div
            key={i}
            className="rounded-lg"
            style={{
              width: `${Math.max(20, (prop / 100) * 200)}px`,
              height: "40px",
              backgroundColor: ["#dc2626", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"][i],
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {FATORES.map((fator, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[var(--c-text)]">{fator}</label>
              <span className="text-xs font-bold text-[var(--c-accent)]">{Math.round(proporcoes[i])}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={fatores[i]}
              onChange={(e) => atualizarFator(i, Number(e.target.value))}
              className="w-full"
            />
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleFinalizar}
        className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
      >
        Finalizar
      </motion.button>
    </motion.div>
  );
}
