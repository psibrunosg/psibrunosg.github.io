import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";
import { createMatchingGameState, type MatchingCard } from "./exerciseState";

const PARES = [
  { esquerda: "Catastrofização", direita: 'Pensamento: "Tudo vai dar errado"' },
  { esquerda: "Deverias", direita: "Padrão rígido de comportamento" },
  { esquerda: "Leitura de mente", direita: "Suposição sobre opinião alheia" },
  { esquerda: "Personalização", direita: "Responsabilização por tudo" },
  { esquerda: "Tudo ou nada", direita: "Sem meio termo possível" },
  { esquerda: "Filtro mental", direita: "Foco só no negativo" },
];

const MATCHING_PAIRS = PARES.map((pair) => ({
  left: pair.esquerda,
  right: pair.direita,
}));
const INITIAL_GAME = createMatchingGameState(MATCHING_PAIRS, Math.random);

export default function ParesMente() {
  const { complete } = useExerciseSession("pares-mente");
  const [cartas, setCartas] = useState<MatchingCard[]>(INITIAL_GAME.cards);
  const [selecionadas, setSelecionadas] = useState<string[]>(INITIAL_GAME.selectedIds);
  const [acertadas, setAcertadas] = useState(INITIAL_GAME.matchedPairs);
  const [score, setScore] = useState(INITIAL_GAME.score);

  const iniciarJogo = () => {
    const game = createMatchingGameState(MATCHING_PAIRS, Math.random);
    setCartas(game.cards);
    setSelecionadas(game.selectedIds);
    setAcertadas(game.matchedPairs);
    setScore(game.score);
  };

  const handleClick = (id: string) => {
    // Bloqueia 3º clique enquanto o par atual está sendo avaliado
    if (selecionadas.length >= 2) return;
    if (selecionadas.includes(id) || cartas.find((c) => c.id === id)?.matched) return;

    const novaSelecionada = [...selecionadas, id];
    setSelecionadas(novaSelecionada);

    if (novaSelecionada.length === 2) {
      const [id1, id2] = novaSelecionada;
      const carta1 = cartas.find((c) => c.id === id1)!;
      const carta2 = cartas.find((c) => c.id === id2)!;

      if (carta1.pairIndex === carta2.pairIndex) {
        // Acertou
        setTimeout(() => {
          setCartas((prev) =>
            prev.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, matched: true } : c
            )
          );
          setAcertadas((a) => {
            const novo = a + 1;
            if (novo === PARES.length) complete(score + 15);
            return novo;
          });
          setScore((s) => s + 15);
          setSelecionadas([]);
        }, 600);
      } else {
        // Errou
        setTimeout(() => {
          setSelecionadas([]);
          setScore((s) => Math.max(0, s - 5));
        }, 1000);
      }
    }
  };

  const completado = acertadas === PARES.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-[var(--c-text)]">
          {acertadas}/{PARES.length} pares
        </div>
        <div className="text-sm font-semibold text-[var(--c-accent)]">+{score} XP</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cartas.map((carta) => (
          <motion.button
            key={carta.id}
            onClick={() => handleClick(carta.id)}
            className={`aspect-square rounded-xl font-semibold text-xs p-2 text-center transition-all ${
              carta.matched
                ? "bg-green-500/20 text-green-700 cursor-default"
                : selecionadas.includes(carta.id)
                  ? "bg-[var(--c-accent)] text-[var(--c-on-accent)]"
                  : "bg-[var(--c-border)] text-[var(--c-muted)] hover:bg-[var(--c-accent)]/30"
            }`}
            disabled={carta.matched || completado}
            whileHover={!carta.matched && !selecionadas.includes(carta.id) ? { scale: 1.05 } : {}}
            whileTap={!carta.matched && !selecionadas.includes(carta.id) ? { scale: 0.95 } : {}}
          >
            {selecionadas.includes(carta.id) || carta.matched ? (
              <div className="break-words leading-tight">{carta.text}</div>
            ) : (
              "?"
            )}
          </motion.button>
        ))}
      </div>

      {completado && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
          <p className="text-lg font-bold text-[var(--c-accent)] mb-3">🎉 Parabéns!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={iniciarJogo}
            className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)] font-semibold text-sm"
          >
            <RotateCcw size={14} className="inline mr-1" /> Novamente
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
