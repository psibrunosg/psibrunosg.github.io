import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

// "Meu comportamento" vem POR ÚLTIMO de propósito: a técnica pede distribuir
// primeiro os outros fatores — a fatia da própria culpa é o que sobra, e encolhe.
const FATORES = [
  "Circunstâncias externas",
  "Ação de outros",
  "Sorte/acaso",
  "Minha negligência",
  "Meu comportamento",
];

const CORES = ["#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#dc2626"];

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

  const somaFatores = fatores.reduce((a, b) => a + b, 0) || 1;
  const proporcoes = fatores.map((f) => (f / somaFatores) * 100);
  const meuFator = proporcoes[FATORES.length - 1]; // Último é "Meu comportamento"

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
        <p className="text-sm text-[var(--c-text)] font-semibold">
          Quando a culpa vira "100% minha", a torta lembra: a realidade tem mais fatias.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <p className="text-sm font-semibold text-[var(--c-text)] mb-3">
        Distribua a responsabilidade — comece pelos fatores externos; a sua fatia fica por último:
      </p>

      {/* Pizza de verdade (conic-gradient) */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div
          className="w-36 h-36 rounded-full border border-[var(--c-border)]"
          role="img"
          aria-label={`Torta de responsabilidade: ${FATORES.map((f, i) => `${f} ${Math.round(proporcoes[i])}%`).join(", ")}`}
          style={{
            background: `conic-gradient(${proporcoes
              .map((prop, i) => {
                const inicio = proporcoes.slice(0, i).reduce((a, b) => a + b, 0);
                return `${CORES[i]} ${inicio}% ${inicio + prop}%`;
              })
              .join(", ")})`,
          }}
        />
        <div className="space-y-1">
          {FATORES.map((fator, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] text-[var(--c-text)]">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: CORES[i] }} aria-hidden="true" />
              {fator}
            </div>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        {FATORES.map((fator, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor={`fator-${i}`} className="text-xs font-semibold text-[var(--c-text)]">{fator}</label>
              <span className="text-xs font-bold" style={{ color: CORES[i] }}>{Math.round(proporcoes[i])}%</span>
            </div>
            <input
              id={`fator-${i}`}
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
