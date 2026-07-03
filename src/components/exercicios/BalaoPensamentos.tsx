import { useState } from "react";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";

const METAFORAS = [
  { nome: "Balão", emoji: "🎈", desc: "Flutua e some" },
  { nome: "Ligação", emoji: "☎️", desc: "Desliga e sai" },
  { nome: "Trem", emoji: "🚂", desc: "Passa e continua" },
  { nome: "Visitante", emoji: "🚪", desc: "Entra e sai" },
  { nome: "Palhaço", emoji: "🤡", desc: "Faz barulho e vai" },
];

export default function BalaoPensamentos() {
  const [pensamento, setPensamento] = useState("");
  const [metafora, setMetafora] = useState(0);
  const [solto, setSolto] = useState(false);

  const handleSoltar = () => {
    if (!pensamento.trim()) return;
    setSolto(true);
    setTimeout(() => {
      setPensamento("");
      setSolto(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="glass-card rounded-2xl p-6">
        <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">Qual pensamento desconfortável você está tendo?</label>
        <textarea
          value={pensamento}
          onChange={(e) => setPensamento(e.target.value)}
          placeholder="Ex: Ninguém vai gostar da minha apresentação..."
          className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
          rows={3}
        />

        {/* Seletor de metáfora */}
        <div className="mt-4">
          <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-2 uppercase tracking-wider">Escolha uma metáfora:</p>
          <div className="flex gap-2">
            {METAFORAS.map((m, i) => (
              <button
                key={i}
                onClick={() => setMetafora(i)}
                className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all text-[10px] font-semibold ${
                  metafora === i ? "bg-[var(--c-accent)]/20 text-[var(--c-accent)]" : "bg-[var(--c-border)] text-[var(--c-muted)]"
                }`}
              >
                <span className="text-lg mb-1">{m.emoji}</span>
                {m.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualização do balão */}
      <div className="glass-card rounded-2xl p-8 min-h-64 flex items-center justify-center relative">
        <motion.div
          animate={
            solto
              ? { y: -400, opacity: 0, scale: 0 }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{METAFORAS[metafora].emoji}</div>

          {pensamento && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[var(--c-accent)]/20 rounded-2xl p-4 max-w-xs border-2 border-dashed border-[var(--c-accent)]"
            >
              <p className="text-sm text-[var(--c-text)] font-semibold">"{pensamento}"</p>
              <p className="text-[10px] text-[var(--c-muted)] mt-2 italic">{METAFORAS[metafora].desc}</p>
            </motion.div>
          )}
        </motion.div>

        {!pensamento && (
          <p className="text-[var(--c-muted)] text-sm text-center">Digite um pensamento acima para começar</p>
        )}
      </div>

      {/* Botão soltar */}
      {pensamento && !solto && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSoltar}
          className="w-full py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold flex items-center justify-center gap-2"
        >
          <Wind size={16} /> Soltar (observe desaparecer)
        </motion.button>
      )}

      {solto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[var(--c-accent)] font-semibold text-sm py-3"
        >
          ✨ Pensamento saiu... Observe sem lutar.
        </motion.div>
      )}
    </div>
  );
}
