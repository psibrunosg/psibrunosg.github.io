import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "reformulacao" | "resultado";

interface Historia {
  original: string;
  crenca: string;
  reformulada: string;
  [key: string]: any;
}

export default function ReformulacaoHistoria() {
  const { save, complete } = useExerciseSession("reformulacao-historia");
  const [fase, setFase] = useState<Fase>("entrada");
  const [historia, setHistoria] = useState<Historia>({ original: "", crenca: "", reformulada: "" });

  const handleIniciar = () => {
    if (!historia.original.trim()) return;
    setFase("reformulacao");
  };

  const handleFinalizar = () => {
    if (!historia.crenca.trim() || !historia.reformulada.trim()) return;
    save(historia);
    complete(100);
    setFase("resultado");
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Conte a história que define você
          </label>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Uma narrativa sobre algo que aconteceu e que você usa para explicar quem é. Ex: "Nunca consegui nada sozinho", "Sempre fui rejeitado", "Sou fraco".
          </p>
          <textarea
            value={historia.original}
            onChange={(e) => setHistoria({ ...historia, original: e.target.value })}
            placeholder="Ex: Quando tinha 10 anos, meu pai saiu e desde então acredito que pessoas me abandonam..."
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none mb-3"
            rows={4}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!historia.original.trim()}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Reformular →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "reformulacao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-4 bg-[var(--c-accent)]/10 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">História original:</p>
          <p className="text-sm text-[var(--c-text)] italic">"{historia.original}"</p>
        </div>

        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4">
            <label className="text-xs font-semibold text-red-600 block mb-2">Crença limite que ela criou:</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">Qual crença sobre si mesmo nasceu dessa história?</p>
            <textarea
              value={historia.crenca}
              onChange={(e) => setHistoria({ ...historia, crenca: e.target.value })}
              placeholder="Ex: Sou indigno de amor, vou ser abandonado sempre"
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-red-500 focus:outline-none resize-none"
              rows={2}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <label className="text-xs font-semibold text-green-600 block mb-2">Reformulação: um final diferente</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">Mantenha os fatos, mude a interpretação e o ending. Mas mantenha realista.</p>
            <textarea
              value={historia.reformulada}
              onChange={(e) => setHistoria({ ...historia, reformulada: e.target.value })}
              placeholder="Ex: Meu pai saiu, o que foi difícil. Mas aprendi a ser independente e hoje construo relacionamentos seguros porque escolho pessoas confiáveis..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-green-500 focus:outline-none resize-none"
              rows={3}
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          disabled={!historia.crenca.trim() || !historia.reformulada.trim()}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
        >
          Finalizar reformulação
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">✓ Narrativa reformulada</p>
        <p className="text-[10px] text-[var(--c-muted)]">Seus fatos não mudaram. Mas sua história sobre eles, mudou.</p>
      </div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-lg p-4 border-l-4" style={{ borderLeftColor: "#dc2626" }}>
        <p className="text-xs font-semibold text-red-600 mb-2">NARRATIVA ORIGINAL</p>
        <p className="text-sm text-[var(--c-text)] italic">"{historia.original}"</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-lg p-4 border-l-4"
        style={{ borderLeftColor: "#dc2626" }}
      >
        <p className="text-xs font-semibold text-red-600 mb-2">CRENÇA LIMITE</p>
        <p className="text-sm text-[var(--c-text)]">"{historia.crenca}"</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-lg p-4 border-l-4"
        style={{ borderLeftColor: "#22c55e" }}
      >
        <p className="text-xs font-semibold text-green-600 mb-2">NOVA NARRATIVA</p>
        <p className="text-sm text-[var(--c-text)]">"{historia.reformulada}"</p>
      </motion.div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Converse com seu terapeuta sobre integrar esta narrativa reformulada em sua vida.
      </p>
    </motion.div>
  );
}
