import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const PREOCUPACOES = [
  "Esquecer reunião importante",
  "Apresentação sair ruim",
  "Colega questionar competência",
  "Erro no relatório",
  "Chegar atrasado",
];

interface Preocupacao {
  id: string;
  texto: string;
  posX: number;
  posY: number;
  acao: "acao" | "estacionamento" | null;
}

export default function ChuvaPreocupacoes() {
  const { complete } = useExerciseSession("chuva-preocupacoes");
  const [preocupacoes, setPreocupacoes] = useState<Preocupacao[]>([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [score, setScore] = useState(0);
  const [perdidas, setPerdidas] = useState(0);
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready");

  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Sessão conta como completa ao terminar a rodada (rega o Jardim)
  useEffect(() => {
    if (gameState === "finished") complete(score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const spawnInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * PREOCUPACOES.length);
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setPreocupacoes((prev) => [
        ...prev,
        {
          id,
          texto: PREOCUPACOES[idx],
          posX: Math.random() * 80 + 10,
          posY: 0,
          acao: null,
        },
      ]);

      // Se ninguém arrastar, a preocupação "acumula no chão" e some — conta como perdida
      setTimeout(() => {
        setPreocupacoes((prev) => {
          const aindaExiste = prev.some((p) => p.id === id);
          if (aindaExiste) setPerdidas((n) => n + 1);
          return prev.filter((p) => p.id !== id);
        });
      }, 4500);
    }, 1600);
    return () => clearInterval(spawnInterval);
  }, [gameState]);

  const handleDragEnd = (id: string, info: any) => {
    const preoc = preocupacoes.find((p) => p.id === id);
    if (!preoc) return;

    const yPos = info.offset.y;
    // Mesmo peso para as duas zonas: estacionar uma preocupação improdutiva
    // vale tanto quanto transformar em ação — a habilidade é DECIDIR.
    if (yPos < -50 || yPos > 50) {
      setScore((s) => s + 15);
      setPreocupacoes((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="relative w-full h-96 bg-[var(--c-surface)] rounded-3xl border border-[var(--c-border)] overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-sm font-semibold">
        <span className="text-[var(--c-accent)]">⏱ {timeLeft}s</span>
        <span className="text-[var(--c-text)]">Score: {score}</span>
        {gameState === "ready" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setGameState("playing");
              setTimeLeft(90);
              setScore(0);
              setPerdidas(0);
              setPreocupacoes([]);
            }}
            className="px-3 py-1 rounded-full bg-[var(--c-accent)] text-white text-xs font-semibold"
          >
            Começar
          </motion.button>
        )}
      </div>

      {gameState === "playing" && (
        <>
          {/* Zonas drop */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 text-center text-[10px] font-semibold text-green-600 rounded-b-lg bg-green-500/10 flex items-center justify-center">
            ⬆ Ação hoje
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 text-center text-[10px] font-semibold text-orange-600 rounded-t-lg bg-orange-500/10 flex items-center justify-center">
            ⬇ Estacionar
          </div>

          {/* Preocupações caindo */}
          <div className="absolute inset-0 pt-20 pb-20 overflow-hidden">
            {preocupacoes.map((preoc) => (
              <motion.div
                key={preoc.id}
                drag="y"
                dragElastic={0.2}
                onDragEnd={(_, info) => handleDragEnd(preoc.id, info)}
                initial={{ y: -60, opacity: 1 }}
                animate={{ y: 280 }}
                transition={{ duration: 3, ease: "linear" }}
                exit={{ opacity: 0 }}
                className="absolute w-32 px-2 py-2 rounded-lg bg-[var(--c-accent)]/80 text-white text-[11px] font-semibold text-center cursor-grab active:cursor-grabbing"
                style={{ left: `${preoc.posX}%` }}
              >
                {preoc.texto}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {gameState === "finished" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center text-white">
            <p className="text-2xl font-bold mb-1">{score} pontos!</p>
            {perdidas > 0 && (
              <p className="text-xs mb-3 opacity-80">{perdidas} preocupações acumularam sem decisão</p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setGameState("ready");
                setPreocupacoes([]);
                setPerdidas(0);
              }}
              className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              Novamente
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
