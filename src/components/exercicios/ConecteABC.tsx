import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "mapeamento" | "resultado";

interface Cadeia {
  evento: string;
  pensamento: string;
  emocao: string;
  comportamento: string;
  [key: string]: string;
}

const PLACEHOLDER_EMOCOES = ["Ansiedade", "Tristeza", "Raiva", "Culpa", "Medo"];
const PLACEHOLDER_COMPORTAMENTOS = ["Evitar", "Procrastinar", "Falar demais", "Isolamento", "Comportamento compulsivo"];

export default function ConecteABC() {
  const { save, complete } = useExerciseSession("conecte-abc");
  const [fase, setFase] = useState<Fase>("entrada");
  const [cadeia, setCadeia] = useState<Cadeia>({
    evento: "",
    pensamento: "",
    emocao: "",
    comportamento: "",
  });

  const handleMudar = (campo: keyof Cadeia, valor: string) => {
    setCadeia({ ...cadeia, [campo]: valor });
  };

  const handleIniciar = () => {
    if (!cadeia.evento.trim()) return;
    setFase("mapeamento");
  };

  const handleFinalizar = () => {
    if (cadeia.pensamento && cadeia.emocao && cadeia.comportamento) {
      save(cadeia);
      complete(100);
      setFase("resultado");
    }
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">O que aconteceu? (Situação)</label>
          <textarea
            value={cadeia.evento}
            onChange={(e) => handleMudar("evento", e.target.value)}
            placeholder="Ex: Chefe comentou sobre meu trabalho na reunião"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
            rows={3}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!cadeia.evento.trim()}
            className="mt-3 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Mapear cadeia →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "mapeamento") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {/* Evento */}
        <div className="glass-card rounded-2xl p-4 border-l-4" style={{ borderLeftColor: "#3b82f6" }}>
          <p className="text-[10px] font-semibold text-blue-600 mb-1">A — EVENTO</p>
          <p className="text-sm font-semibold text-[var(--c-text)]">{cadeia.evento}</p>
        </div>

        {/* Pensamento */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4">
          <label className="text-xs font-semibold text-[var(--c-accent)] mb-2">B — O que você pensou?</label>
          <input
            type="text"
            value={cadeia.pensamento}
            onChange={(e) => handleMudar("pensamento", e.target.value)}
            placeholder="Ex: Sou incompetente"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          />
        </motion.div>

        {/* Emoção */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-4">
          <label className="text-xs font-semibold text-[var(--c-accent)] mb-2">C — Que emoção surgiu?</label>
          <select
            value={cadeia.emocao}
            onChange={(e) => handleMudar("emocao", e.target.value)}
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          >
            <option value="">Selecione uma emoção...</option>
            {PLACEHOLDER_EMOCOES.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Comportamento */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-4">
          <label className="text-xs font-semibold text-[var(--c-accent)] mb-2">D — Como você reagiu?</label>
          <select
            value={cadeia.comportamento}
            onChange={(e) => handleMudar("comportamento", e.target.value)}
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          >
            <option value="">Selecione um comportamento...</option>
            {PLACEHOLDER_COMPORTAMENTOS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          disabled={!cadeia.pensamento || !cadeia.emocao || !cadeia.comportamento}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
        >
          Finalizar mapa
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <p className="text-center text-sm font-semibold text-[var(--c-accent)] mb-4">✅ Cadeia mapeada!</p>

      <div className="space-y-2">
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#3b82f6" }}>
          <p className="text-[10px] font-semibold text-blue-600">A — EVENTO</p>
          <p className="text-xs text-[var(--c-text)]">{cadeia.evento}</p>
        </div>
        <div className="text-center text-[var(--c-muted)]">↓</div>
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#f59e0b" }}>
          <p className="text-[10px] font-semibold text-amber-600">B — PENSAMENTO</p>
          <p className="text-xs text-[var(--c-text)]">{cadeia.pensamento}</p>
        </div>
        <div className="text-center text-[var(--c-muted)]">↓</div>
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#ec4899" }}>
          <p className="text-[10px] font-semibold text-pink-600">C — EMOÇÃO</p>
          <p className="text-xs text-[var(--c-text)]">{cadeia.emocao}</p>
        </div>
        <div className="text-center text-[var(--c-muted)]">↓</div>
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#22c55e" }}>
          <p className="text-[10px] font-semibold text-green-600">D — COMPORTAMENTO</p>
          <p className="text-xs text-[var(--c-text)]">{cadeia.comportamento}</p>
        </div>
      </div>

      <p className="text-[10px] text-[var(--c-muted)] text-center italic">Mudando B (pensamento), você pode mudar C e D</p>
    </motion.div>
  );
}
