import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface CheckinEmojiProps {
  value: string | null;
  onChange: (value: string) => void;
}

const MOODS = [
  { id: "muito-mal", emoji: "😔", label: "Muito mal" },
  { id: "mal", emoji: "🙁", label: "Mal" },
  { id: "neutro", emoji: "😐", label: "Neutro" },
  { id: "bem", emoji: "🙂", label: "Bem" },
  { id: "muito-bem", emoji: "😄", label: "Muito bem" },
];

export default function CheckinEmoji({ value, onChange }: CheckinEmojiProps) {
  const prefersReducedMotion = useReducedMotion();
  const [wasSelected, setWasSelected] = useState(false);

  const handleSelect = (id: string) => {
    onChange(id);
    setWasSelected(true);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-6">
        <p className="text-sm font-semibold text-[var(--c-text)] text-center mb-4">
          Como você está se sentindo agora?
        </p>

        <div
          role="radiogroup"
          aria-label="Como você está se sentindo agora?"
          className="grid grid-cols-5 gap-2 mb-4"
        >
          {MOODS.map((mood) => (
            <motion.button
              key={mood.id}
              role="radio"
              aria-checked={value === mood.id}
              tabIndex={value === mood.id ? 0 : -1}
              onClick={() => handleSelect(mood.id)}
              animate={
                !prefersReducedMotion && value === mood.id && wasSelected
                  ? { scale: [1, 1.3, 1] }
                  : { scale: 1 }
              }
              whileTap={!prefersReducedMotion ? { scale: 0.9 } : {}}
              transition={{ duration: 0.3 }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all min-w-[44px] min-h-[44px] ${
                value === mood.id
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
    </div>
  );
}
