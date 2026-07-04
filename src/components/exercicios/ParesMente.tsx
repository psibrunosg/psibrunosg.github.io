import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const PARES = [
  { esquerda: "Catastrofização", direita: 'Pensamento: "Tudo vai dar errado"' },
  { esquerda: "Deverias", direita: "Padrão rígido de comportamento" },
  { esquerda: "Leitura de mente", direita: "Suposição sobre opinião alheia" },
  { esquerda: "Personalização", direita: "Responsabilização por tudo" },
  { esquerda: "Tudo ou nada", direita: "Sem meio termo possível" },
  { esquerda: "Filtro mental", direita: "Foco só no negativo" },
];

interface Carta {
  id: string;
  tipo: "esquerda" | "direita";
  texto: string;
  virada: boolean;
  acertada: boolean;
  pairIdx: number;
}

export default function ParesMente() {
  const { complete } = useExerciseSession("pares-mente");
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [acertadas, setAcertadas] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    iniciarJogo();
  }, []);

  const iniciarJogo = () => {
    const novasCartas: Carta[] = [];
    PARES.forEach((par, idx) => {
      novasCartas.push({ id: `l${idx}`, tipo: "esquerda", texto: par.esquerda, virada: false, acertada: false, pairIdx: idx });
      novasCartas.push({ id: `r${idx}`, tipo: "direita", texto: par.direita, virada: false, acertada: false, pairIdx: idx });
    });
    setCartas(novasCartas.sort(() => Math.random() - 0.5));
    setSelecionadas([]);
    setAcertadas(0);
    setScore(0);
  };

  const handleClick = (id: string) => {
    // Bloqueia 3º clique enquanto o par atual está sendo avaliado
    if (selecionadas.length >= 2) return;
    if (selecionadas.includes(id) || cartas.find((c) => c.id === id)?.acertada) return;

    const novaSelecionada = [...selecionadas, id];
    setSelecionadas(novaSelecionada);

    if (novaSelecionada.length === 2) {
      const [id1, id2] = novaSelecionada;
      const carta1 = cartas.find((c) => c.id === id1)!;
      const carta2 = cartas.find((c) => c.id === id2)!;

      if (carta1.pairIdx === carta2.pairIdx) {
        // Acertou
        setTimeout(() => {
          setCartas((prev) =>
            prev.map((c) =>
              c.id === id1 || c.id === id2 ? { ...c, acertada: true } : c
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
              carta.acertada
                ? "bg-green-500/20 text-green-700 cursor-default"
                : selecionadas.includes(carta.id)
                  ? "bg-[var(--c-accent)] text-white"
                  : "bg-[var(--c-border)] text-[var(--c-muted)] hover:bg-[var(--c-accent)]/30"
            }`}
            disabled={carta.acertada || completado}
            whileHover={!carta.acertada && !selecionadas.includes(carta.id) ? { scale: 1.05 } : {}}
            whileTap={!carta.acertada && !selecionadas.includes(carta.id) ? { scale: 0.95 } : {}}
          >
            {selecionadas.includes(carta.id) || carta.acertada ? (
              <div className="break-words leading-tight">{carta.texto}</div>
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
            className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            <RotateCcw size={14} className="inline mr-1" /> Novamente
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
