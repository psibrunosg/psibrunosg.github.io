import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ReflexaoPosExercicioProps {
  onSalvar: (data: { reflexao: string; humorFinal: number }) => void;
}

const MOODS = [
  { id: 1, emoji: "😔", label: "Muito mal" },
  { id: 2, emoji: "🙁", label: "Mal" },
  { id: 3, emoji: "😐", label: "Neutro" },
  { id: 4, emoji: "🙂", label: "Bem" },
  { id: 5, emoji: "😄", label: "Muito bem" },
];

export default function ReflexaoPosExercicio({ onSalvar }: ReflexaoPosExercicioProps) {
  const prefersReducedMotion = useReducedMotion();
  const [humorFinal, setHumorFinal] = useState<number | null>(null);
  const [reflexao, setReflexao] = useState("");
  const [wasSelected, setWasSelected] = useState(false);

  const handleSelectMood = (id: number) => {
    setHumorFinal(id);
    setWasSelected(true);
  };

  const handleSalvar = () => {
    if (humorFinal !== null) {
      onSalvar({ reflexao, humorFinal });
    }
  };

  const handlePular = () => {
    onSalvar({ reflexao: "", humorFinal: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm font-semibold text-[var(--c-text)] text-center mb-4">
          O que mudou para você neste exercício?
        </p>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-[var(--c-muted)] mb-3">
              Como você se sente agora?
            </p>
            <div
              role="radiogroup"
              aria-label="Como você se sente agora?"
              className="grid grid-cols-5 gap-2"
            >
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.id}
                  role="radio"
                  aria-checked={humorFinal === mood.id}
                  tabIndex={humorFinal === mood.id ? 0 : -1}
                  onClick={() => handleSelectMood(mood.id)}
                  animate={
                    !prefersReducedMotion && humorFinal === mood.id && wasSelected
                      ? { scale: [1, 1.3, 1] }
                      : { scale: 1 }
                  }
                  whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all min-w-[44px] min-h-[44px] ${
                    humorFinal === mood.id
                      ? "ring-2 ring-[var(--c-accent)] shadow-lg"
                      : "border border-[var(--c-border)] opacity-60 hover:opacity-100"
                  }`}
                  title={mood.label}
                >
                  <span className="text-3xl mb-1">{mood.emoji}</span>
                  <span className="text-[10px] text-[var(--c-text)] font-semibold text-center leading-tight">
                    {mood.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="reflexao-textarea"
              className="text-xs font-semibold text-[var(--c-muted)] block mb-2"
            >
              Reflexão (opcional)
            </label>
            <textarea
              id="reflexao-textarea"
              value={reflexao}
              onChange={(e) => setReflexao(e.target.value)}
              placeholder="O que mudou pra você? (opcional)"
              className="w-full p-3 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] placeholder:text-[var(--c-muted)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--c-accent)] resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSalvar}
          disabled={humorFinal === null}
          className="flex-1 py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
        >
          Salvar e voltar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePular}
          className="px-4 py-3 rounded-lg text-[var(--c-accent)] border border-[var(--c-accent)] font-semibold text-sm hover:bg-[var(--c-accent)]/5 transition-all min-w-[44px] min-h-[44px]"
        >
          Pular
        </motion.button>
      </div>
    </motion.div>
  );
}
