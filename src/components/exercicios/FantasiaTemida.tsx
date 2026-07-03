import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "redacao" | "resultado";

export default function FantasiaTemida() {
  const { save, complete } = useExerciseSession("fantasia-temida");
  const [fase, setFase] = useState<Fase>("entrada");
  const [situacao, setSituacao] = useState("");
  const [pior, setPior] = useState("");
  const [melhor, setMelhor] = useState("");
  const [realista, setRealista] = useState("");

  const handleIniciar = () => {
    if (!situacao.trim()) return;
    setFase("redacao");
  };

  const handleFinalizar = () => {
    if (!pior.trim() || !melhor.trim() || !realista.trim()) return;
    save({ situacao, pior, melhor, realista });
    complete(100);
    setFase("resultado");
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Qual cenário você teme?
          </label>
          <textarea
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
            placeholder="Ex: Fazer uma apresentação no trabalho e cometer um erro"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none mb-3"
            rows={3}
          />
          <p className="text-[10px] text-[var(--c-muted)] mb-3 italic">
            Fantasia temida: confrare seu medo diretamente. Redija o pior caso, o melhor, e o realista.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!situacao.trim()}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Escrever cenários →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "redacao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-4 bg-[var(--c-accent)]/10 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">Situação:</p>
          <p className="text-sm text-[var(--c-text)] italic">"{situacao}"</p>
        </div>

        <div className="space-y-4">
          {/* Pior caso */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4">
            <label className="block text-xs font-semibold text-red-600 mb-2">🔴 PIOR CASO</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">O que você teme que aconteça? Sem filtro.</p>
            <textarea
              value={pior}
              onChange={(e) => setPior(e.target.value)}
              placeholder="Descreva o pior cenário imaginável..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-red-500 focus:outline-none resize-none"
              rows={3}
            />
          </motion.div>

          {/* Melhor caso */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <label className="block text-xs font-semibold text-green-600 mb-2">🟢 MELHOR CASO</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">Melhor resultado possível nessa situação.</p>
            <textarea
              value={melhor}
              onChange={(e) => setMelhor(e.target.value)}
              placeholder="Descreva o melhor cenário..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-green-500 focus:outline-none resize-none"
              rows={3}
            />
          </motion.div>

          {/* Caso realista */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-4"
          >
            <label className="block text-xs font-semibold text-[var(--c-accent)] mb-2">🟡 CASO REALISTA</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">O que é mais provável que aconteça de verdade?</p>
            <textarea
              value={realista}
              onChange={(e) => setRealista(e.target.value)}
              placeholder="Descreva o cenário mais provável..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
              rows={3}
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          disabled={!pior.trim() || !melhor.trim() || !realista.trim()}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
        >
          Finalizar e revisar
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-4">✓ Fantasia explorada</p>
        <p className="text-sm text-[var(--c-text)] mb-4 italic">"{situacao}"</p>
        <p className="text-[10px] text-[var(--c-muted)]">
          Compare: seu medo (pior) vs. realidade (realista). Note a lacuna. Discussão com terapeuta ativa.
        </p>
      </div>

      <div className="space-y-3">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-lg p-4 border-l-4" style={{ borderLeftColor: "#dc2626" }}>
          <p className="text-[10px] font-semibold text-red-600 mb-2">PIOR CASO</p>
          <p className="text-sm text-[var(--c-text)] whitespace-pre-wrap">{pior}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-lg p-4 border-l-4"
          style={{ borderLeftColor: "#22c55e" }}
        >
          <p className="text-[10px] font-semibold text-green-600 mb-2">MELHOR CASO</p>
          <p className="text-sm text-[var(--c-text)] whitespace-pre-wrap">{melhor}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-lg p-4 border-l-4"
          style={{ borderLeftColor: "var(--c-accent)" }}
        >
          <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-2">CASO REALISTA</p>
          <p className="text-sm text-[var(--c-text)] whitespace-pre-wrap">{realista}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
