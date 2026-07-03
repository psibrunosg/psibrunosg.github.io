import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Check } from "lucide-react";

const CENARIOS = [
  {
    pensamento: "Ninguém prestou atenção na minha apresentação",
    fatos: [
      { texto: "Vários colegas fizeram perguntas ao final", correto: true },
      { texto: "Meu chefe pediu para compartilhar com o time", correto: true },
      { texto: "Uma pessoa olhava para o celular", correto: false },
      { texto: "Recebi 2 emails depois elogiando", correto: true },
      { texto: "Ninguém riu dos meus piadas", correto: false },
    ],
  },
  {
    pensamento: "Sou incompetente no trabalho",
    fatos: [
      { texto: "Promovi 2 projetos com sucesso este ano", correto: true },
      { texto: "Cometi um erro no relatório", correto: false },
      { texto: "Meu time pede minha opinião frequentemente", correto: true },
      { texto: "Não sei tudo sobre meu campo", correto: false },
      { texto: "Fui promovido 2 anos atrás", correto: true },
    ],
  },
];

export default function CacaFatos() {
  const [cenarioIdx, setCenarioIdx] = useState(0);
  const [fatosEncontrados, setFatosEncontrados] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cenario = CENARIOS[cenarioIdx];
  const progresso = (fatosEncontrados.length / cenario.fatos.filter((f) => f.correto).length) * 100;

  const handleClique = (idx: number) => {
    if (fatosEncontrados.includes(idx)) return;

    if (cenario.fatos[idx].correto) {
      setFatosEncontrados([...fatosEncontrados, idx]);
      setScore((s) => s + 20);
    } else {
      setScore((s) => Math.max(0, s - 10));
    }
  };

  const completado = fatosEncontrados.length === cenario.fatos.filter((f) => f.correto).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[var(--c-accent)]">⏱ {timeLeft}s</span>
        <span className="text-sm font-semibold text-[var(--c-text)]">{fatosEncontrados.length} fatos</span>
        <span className="text-sm font-semibold text-[var(--c-accent)]">+{score}</span>
      </div>

      {/* Pensamento "réu" */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-4 border-l-4" style={{ borderLeftColor: "#dc2626" }}>
        <p className="text-xs font-semibold text-red-600 mb-1">PENSAMENTO:</p>
        <p className="text-sm text-[var(--c-text)] font-semibold">"{cenario.pensamento}"</p>
      </motion.div>

      {/* Instrução */}
      <p className="text-xs text-[var(--c-muted)]">Encontre os fatos que o pensamento ignora (clique em verde):</p>

      {/* Barra progresso */}
      <div className="h-2 rounded-full bg-[var(--c-border)] overflow-hidden">
        <motion.div
          animate={{ width: `${progresso}%` }}
          className="h-full bg-green-500"
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Fatos */}
      <div className="space-y-2">
        {cenario.fatos.map((fato, i) => (
          <motion.button
            key={i}
            onClick={() => handleClique(i)}
            disabled={fatosEncontrados.includes(i)}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
              fatosEncontrados.includes(i)
                ? "bg-green-500/20 text-green-700 border-2 border-green-500"
                : fato.correto
                  ? "bg-[var(--c-surface)] text-[var(--c-text)] hover:bg-green-500/10 border border-[var(--c-border)]"
                  : "bg-[var(--c-surface)] text-[var(--c-text)] border border-[var(--c-border)]"
            }`}
            whileHover={!fatosEncontrados.includes(i) && fato.correto ? { scale: 1.02 } : {}}
          >
            <span className="flex items-center gap-2">
              {fatosEncontrados.includes(i) && <Check size={14} />}
              {fato.texto}
            </span>
          </motion.button>
        ))}
      </div>

      {completado && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 glass-card rounded-2xl">
          <p className="text-lg font-bold text-green-600 mb-3">✅ Todos encontrados!</p>
          <p className="text-xs text-[var(--c-muted)] mb-4">O pensamento original ignora vários fatos favoráveis.</p>
          {cenarioIdx < CENARIOS.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setCenarioIdx(cenarioIdx + 1);
                setFatosEncontrados([]);
              }}
              className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              Próximo cenário →
            </motion.button>
          )}
          {cenarioIdx === CENARIOS.length - 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setCenarioIdx(0);
                setFatosEncontrados([]);
                setScore(0);
                setTimeLeft(120);
              }}
              className="px-4 py-2 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              <RotateCcw size={14} className="inline mr-1" /> Recomeçar
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
}
