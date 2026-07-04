import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "analise" | "resultado";

interface Lapso {
  situacao: string;
  disparador: string;
  reacao: string;
  consequencia: string;
  licao: string;
  [key: string]: any;
}

export default function DiarioLapsos() {
  const { save, complete } = useExerciseSession("diario-lapsos");
  const [fase, setFase] = useState<Fase>("entrada");
  const [lapso, setLapso] = useState<Lapso>({ situacao: "", disparador: "", reacao: "", consequencia: "", licao: "" });

  const handleIniciar = () => {
    if (!lapso.situacao.trim()) return;
    setFase("analise");
  };

  const handleFinalizar = () => {
    if (!lapso.disparador.trim() || !lapso.reacao.trim() || !lapso.licao.trim()) return;
    save(lapso);
    complete(100);
    setFase("resultado");
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">O que aconteceu?</label>
          <textarea
            value={lapso.situacao}
            onChange={(e) => setLapso({ ...lapso, situacao: e.target.value })}
            placeholder="Descreva o lapso ou recaída..."
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none mb-3"
            rows={3}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!lapso.situacao.trim()}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Analisar cadeia →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "analise") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-4 bg-[var(--c-accent)]/10 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">O lapso:</p>
          <p className="text-sm text-[var(--c-text)] italic">"{lapso.situacao}"</p>
        </div>

        <div className="space-y-3">
          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Qual foi o disparador?</label>
            <input
              type="text"
              value={lapso.disparador}
              onChange={(e) => setLapso({ ...lapso, disparador: e.target.value })}
              placeholder="Situação, emoção, pessoa, lugar..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-red-600 block mb-2">Como você reagiu?</label>
            <input
              type="text"
              value={lapso.reacao}
              onChange={(e) => setLapso({ ...lapso, reacao: e.target.value })}
              placeholder="A ação que fez..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-red-600 focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Qual a consequência?</label>
            <input
              type="text"
              value={lapso.consequencia}
              onChange={(e) => setLapso({ ...lapso, consequencia: e.target.value })}
              placeholder="O que aconteceu depois..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-green-600 block mb-2">Qual é a lição?</label>
            <input
              type="text"
              value={lapso.licao}
              onChange={(e) => setLapso({ ...lapso, licao: e.target.value })}
              placeholder="O que você aprende para próxima vez..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          disabled={!lapso.disparador.trim() || !lapso.reacao.trim() || !lapso.licao.trim()}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
        >
          Finalizar análise
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">✓ Cadeia analisada</p>
        <p className="text-xs text-[var(--c-muted)]">Lapsos não são fracassos — são dados. Agora você tem a lição.</p>
      </div>

      <div className="space-y-2">
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#3b82f6" }}>
          <p className="text-xs font-semibold text-blue-600 mb-1">DISPARADOR</p>
          <p className="text-sm text-[var(--c-text)]">{lapso.disparador}</p>
        </div>
        <div className="text-center text-xs text-[var(--c-muted)]">↓</div>
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#dc2626" }}>
          <p className="text-xs font-semibold text-red-600 mb-1">REAÇÃO</p>
          <p className="text-sm text-[var(--c-text)]">{lapso.reacao}</p>
        </div>
        <div className="text-center text-xs text-[var(--c-muted)]">↓</div>
        {lapso.consequencia.trim() && (
          <>
            <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#f59e0b" }}>
              <p className="text-xs font-semibold text-amber-600 mb-1">CONSEQUÊNCIA</p>
              <p className="text-sm text-[var(--c-text)]">{lapso.consequencia}</p>
            </div>
            <div className="text-center text-xs text-[var(--c-muted)]">↓</div>
          </>
        )}
        <div className="glass-card rounded-lg p-3 border-l-4" style={{ borderLeftColor: "#22c55e" }}>
          <p className="text-xs font-semibold text-green-600 mb-1">LIÇÃO</p>
          <p className="text-sm text-[var(--c-text)]">{lapso.licao}</p>
        </div>
      </div>
    </motion.div>
  );
}
