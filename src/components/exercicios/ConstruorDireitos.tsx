import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "criacao" | "resultado";

interface Direito {
  direito: string;
  acao: string;
  sentimento: string;
}

export default function ConstruorDireitos() {
  const { save, complete } = useExerciseSession("direitos");
  const [fase, setFase] = useState<Fase>("criacao");
  const [direitos, setDireitos] = useState<Direito[]>([{ direito: "", acao: "", sentimento: "" }]);

  const handleAdicionar = () => {
    setDireitos([...direitos, { direito: "", acao: "", sentimento: "" }]);
  };

  const handleAtualizar = (idx: number, campo: keyof Direito, valor: string) => {
    const novo = [...direitos];
    novo[idx][campo] = valor;
    setDireitos(novo);
  };

  const handleFinalizar = () => {
    const completos = direitos.filter(d => d.direito.trim() && d.acao.trim() && d.sentimento.trim());
    if (completos.length > 0) {
      save({ direitos: completos });
      complete(100);
      setFase("resultado");
    }
  };

  if (fase === "criacao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6 mb-4">
          <p className="text-sm text-[var(--c-muted)]">Construa sua declaração de direitos. Cada direito → ação permitida → como você se sentiria.</p>
        </div>

        <div className="space-y-3">
          {direitos.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-lg p-4 space-y-2">
              <input
                type="text"
                value={d.direito}
                onChange={(e) => handleAtualizar(i, "direito", e.target.value)}
                placeholder="Seu direito (ex: Tenho direito a..."
                className="w-full text-xs rounded border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2 py-1 text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none font-semibold"
              />
              <input
                type="text"
                value={d.acao}
                onChange={(e) => handleAtualizar(i, "acao", e.target.value)}
                placeholder="Ação permitida..."
                className="w-full text-xs rounded border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2 py-1 text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
              />
              <input
                type="text"
                value={d.sentimento}
                onChange={(e) => handleAtualizar(i, "sentimento", e.target.value)}
                placeholder="Como você se sentiria"
                className="w-full text-xs rounded border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2 py-1 text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
              />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdicionar}
            className="py-2 rounded-lg bg-[var(--c-accent)]/20 text-[var(--c-accent)] font-semibold text-xs"
          >
            + Direito
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinalizar}
            className="py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-xs"
          >
            Finalizar
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">📜 Declaração de Direitos</p>
        <p className="text-xs text-[var(--c-muted)]">{direitos.length} direitos declarados.</p>
      </div>

      <div className="space-y-2">
        {direitos.filter(d => d.direito.trim()).map((d, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-lg p-3">
            <p className="text-xs font-semibold text-[var(--c-accent)] mb-1">{d.direito}</p>
            <p className="text-[10px] text-[var(--c-muted)] mb-1">Ação: {d.acao}</p>
            <p className="text-[10px] text-green-600">Sentimento: {d.sentimento}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
