import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const DISTORCOES = [
  { id: 1, nome: "Catastrofização", desc: "Vai dar tudo errado" },
  { id: 2, nome: "Deverias", desc: "Eu deveria ser melhor" },
  { id: 3, nome: "Leitura de mente", desc: "Ela me acha chato" },
  { id: 4, nome: "Filtro mental", desc: "Só vejo o ruim" },
  { id: 5, nome: "Personalização", desc: "É culpa minha" },
  { id: 6, nome: "Tudo ou nada", desc: "Ou é perfeito ou falha" },
];

const EQUILIBRADOS = [
  "Tenho feito o melhor que posso",
  "Nem sempre controlamos tudo",
  "Posso aprender com erros",
];

type GameState = "ready" | "playing" | "finished";

export default function AcerteDistorcao() {
  const { complete } = useExerciseSession("acerte-distorcao");
  const [gameState, setGameState] = useState<GameState>("ready");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [pensamentos, setPensamentos] = useState<Array<{ id: string; texto: string; isDistorcao: boolean; pos: { x: number; y: number }; hit: boolean }>>([]);

  // Spawn pensamentos aleatórios
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      const isDistorcao = Math.random() > 0.3;
      const baseList = isDistorcao ? DISTORCOES : EQUILIBRADOS;
      const texto = baseList[Math.floor(Math.random() * baseList.length)] as any;
      const desc = typeof texto === "string" ? texto : texto.desc;

      setPensamentos((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          texto: desc,
          isDistorcao,
          pos: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 10 },
          hit: false,
        },
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, [gameState]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("finished");
          complete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, score, complete]);

  const handleClick = (id: string, isDistorcao: boolean) => {
    setPensamentos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hit: true } : p))
    );
    if (isDistorcao) {
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 5));
    }
    setTimeout(() => {
      setPensamentos((prev) => prev.filter((p) => p.id !== id));
    }, 300);
  };

  return (
    <div className="relative w-full h-96 bg-[var(--c-surface)] rounded-3xl border border-[var(--c-border)] overflow-hidden">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-sm font-semibold">
        <div className="flex items-center gap-2">
          <span className="text-[var(--c-accent)]">⏱ {timeLeft}s</span>
          <span className="text-[var(--c-text)]">Score: {score}</span>
        </div>
        {gameState === "ready" && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setGameState("playing");
              setTimeLeft(60);
              setScore(0);
              setPensamentos([]);
            }}
            className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-white font-semibold text-xs"
          >
            Começar
          </motion.button>
        )}
      </div>

      {gameState === "playing" && (
        <div className="absolute inset-0 pt-14 overflow-hidden">
          {pensamentos.map((p) => (
            <motion.button
              key={p.id}
              initial={{ scale: 1, opacity: 1 }}
              animate={
                p.hit
                  ? { scale: 0.5, opacity: 0 }
                  : { y: [0, 20], x: Math.sin(parseInt(p.id) / 100) * 10 }
              }
              transition={{ duration: p.hit ? 0.2 : 2 }}
              onClick={() => handleClick(p.id, p.isDistorcao)}
              className={`absolute px-3 py-2 rounded-full font-semibold text-[11px] cursor-pointer transition-all ${
                p.isDistorcao
                  ? "bg-red-500/80 text-white hover:bg-red-600"
                  : "bg-green-500/80 text-white hover:bg-green-600"
              }`}
              style={{ left: `${p.pos.x}%`, top: `${p.pos.y}%` }}
            >
              {p.texto.slice(0, 20)}
            </motion.button>
          ))}
        </div>
      )}

      {gameState === "finished" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white"
          >
            <p className="text-sm font-semibold mb-2">Jogo finalizado!</p>
            <p className="text-3xl font-bold mb-4">{score} pontos</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setGameState("ready");
                setPensamentos([]);
              }}
              className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-white font-semibold text-xs"
            >
              <RotateCcw size={14} className="inline mr-1" /> Novamente
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
