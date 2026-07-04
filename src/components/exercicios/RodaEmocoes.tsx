import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "nomeacao" | "resultado";

const EMOCOES = [
  { nome: "Alegria", cor: "#22c55e", nuances: ["Contentamento", "Orgulho", "Entusiasmo", "Gratidão"] },
  { nome: "Tristeza", cor: "#3b82f6", nuances: ["Desânimo", "Solidão", "Decepção", "Luto"] },
  { nome: "Raiva", cor: "#dc2626", nuances: ["Irritação", "Frustração", "Ressentimento", "Indignação"] },
  { nome: "Medo", cor: "#f59e0b", nuances: ["Apreensão", "Ansiedade", "Insegurança", "Pavor"] },
  { nome: "Surpresa", cor: "#8b5cf6", nuances: ["Espanto", "Confusão", "Choque", "Curiosidade"] },
  { nome: "Aversão", cor: "#ec4899", nuances: ["Desconforto", "Rejeição", "Desprezo", "Repulsa"] },
];

export default function RodaEmocoes() {
  const { save, complete } = useExerciseSession("roda-emocoes");
  const [fase, setFase] = useState<Fase>("nomeacao");
  const [emocaoAtual, setEmocaoAtual] = useState<string | null>(null);
  const [nuanceAtual, setNuanceAtual] = useState<string | null>(null);
  const [intensidade, setIntensidade] = useState(50);
  const [historico, setHistorico] = useState<{ emocao: string; nuance?: string; intensidade: number }[]>([]);

  const handleNomear = (emocao: string) => {
    setEmocaoAtual(emocao);
    setNuanceAtual(null);
    setIntensidade(50);
  };

  const handleRegistrar = () => {
    if (emocaoAtual) {
      const novo = { emocao: emocaoAtual, nuance: nuanceAtual ?? undefined, intensidade };
      setHistorico([...historico, novo]);
      save({ emocoes: [...historico, novo] });
      setEmocaoAtual(null);
      setNuanceAtual(null);
      setIntensidade(50);
    }
  };

  const handleFinalizar = () => {
    if (historico.length > 0) {
      complete(100);
      setFase("resultado");
    }
  };

  if (fase === "nomeacao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6 mb-4">
          <p className="text-sm text-[var(--c-muted)]">Nomeie o que você sente agora. Depois, avalie intensidade (0-100).</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {EMOCOES.map((e) => (
            <motion.button
              key={e.nome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNomear(e.nome)}
              className={`py-3 rounded-lg font-semibold text-xs transition-all ${
                emocaoAtual === e.nome
                  ? "scale-110 shadow-lg"
                  : "opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: e.cor, color: "white" }}
            >
              {e.nome}
            </motion.button>
          ))}
        </div>

        {emocaoAtual && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
            <p className="text-sm font-semibold text-[var(--c-text)] mb-3">Consegue ser mais específico?</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {EMOCOES.find((e) => e.nome === emocaoAtual)?.nuances.map((n) => (
                <button
                  key={n}
                  onClick={() => setNuanceAtual(nuanceAtual === n ? null : n)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    nuanceAtual === n
                      ? "bg-[var(--c-accent)] text-white"
                      : "bg-[var(--c-surface)] text-[var(--c-text)] border border-[var(--c-border)] hover:border-[var(--c-accent)]"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Qual a intensidade?</p>
            <input
              type="range"
              min="0"
              max="100"
              value={intensidade}
              onChange={(e) => setIntensidade(Number(e.target.value))}
              className="w-full mb-3"
            />
            <div className="flex justify-between text-xs text-[var(--c-muted)] mb-4">
              <span>Leve (0)</span>
              <span className="text-lg font-bold text-[var(--c-accent)]">{intensidade}</span>
              <span>Extrema (100)</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegistrar}
              className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              Registrar
            </motion.button>
          </motion.div>
        )}

        {historico.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinalizar}
            className="w-full py-2 rounded-lg bg-green-600/20 text-green-600 font-semibold text-xs mt-4"
          >
            Ver padrão ({historico.length})
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">Roda das Emoções</p>
        <p className="text-xs text-[var(--c-muted)]">{historico.length} emoções nomeadas.</p>
      </div>

      <div className="space-y-2">
        {historico.map((h, i) => {
          const emocao = EMOCOES.find(e => e.nome === h.emocao);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: emocao?.cor }} />
                <p className="text-xs font-semibold text-[var(--c-text)]">
                  {h.emocao}
                  {h.nuance && <span className="text-[var(--c-muted)] font-normal"> · {h.nuance}</span>}
                </p>
              </div>
              <div className="h-1.5 bg-[var(--c-border)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: emocao?.cor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${h.intensidade}%` }}
                />
              </div>
              <p className="text-[10px] text-[var(--c-muted)] mt-1">Intensidade: {h.intensidade}/100</p>
            </motion.div>
          );
        })}
      </div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Nomear com precisão o que se sente já muda a relação com a emoção — é o primeiro passo para regulá-la.
      </p>
    </motion.div>
  );
}
