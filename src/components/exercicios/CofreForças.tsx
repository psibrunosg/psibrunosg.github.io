import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "adicionar" | "colecao";

interface Forca {
  adversidade: string;
  comoLidou: string;
  recurso: string;
  [key: string]: any;
}

export default function CofreForças() {
  const { state, loading, save, complete } = useExerciseSession("cofre-forcas");
  const [fase, setFase] = useState<Fase>("adicionar");
  const [forcas, setForcas] = useState<Forca[]>([]);
  const [nova, setNova] = useState<Forca>({ adversidade: "", comoLidou: "", recurso: "" });

  // Um cofre que esvazia a cada visita não é um cofre: retoma a coleção salva
  useEffect(() => {
    if (loading) return;
    const salvas = state.payload?.forcas as Forca[] | undefined;
    if (salvas && salvas.length > 0) setForcas(salvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleAdicionar = () => {
    if (nova.adversidade.trim() && nova.comoLidou.trim() && nova.recurso.trim()) {
      setForcas([...forcas, nova]);
      setNova({ adversidade: "", comoLidou: "", recurso: "" });
      save({ forcas: [...forcas, nova] });
    }
  };

  const handleVerColecao = () => {
    if (forcas.length > 0) {
      complete(100);
      setFase("colecao");
    }
  };

  if (fase === "adicionar") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6 mb-4">
          <p className="text-sm text-[var(--c-muted)]">Colete suas superações. Cada adversidade que você venceu prova um recurso seu.</p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={nova.adversidade}
            onChange={(e) => setNova({ ...nova, adversidade: e.target.value })}
            placeholder="Adversidade (ex: Perdi o emprego)"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          />
          <input
            type="text"
            value={nova.comoLidou}
            onChange={(e) => setNova({ ...nova, comoLidou: e.target.value })}
            placeholder="Como você lidou (ex: fiz contatos, estudei)"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          />
          <input
            type="text"
            value={nova.recurso}
            onChange={(e) => setNova({ ...nova, recurso: e.target.value })}
            placeholder="Recurso demonstrado (ex: resiliência, criatividade)"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdicionar}
            disabled={!nova.adversidade.trim() || !nova.comoLidou.trim() || !nova.recurso.trim()}
            className="py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-xs disabled:opacity-50"
          >
            + Adicionar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerColecao}
            disabled={forcas.length === 0}
            className="py-2 rounded-lg bg-green-600/20 text-green-600 font-semibold text-xs disabled:opacity-50"
          >
            Ver coleção ({forcas.length})
          </motion.button>
        </div>

        {forcas.length > 0 && (
          <div className="space-y-2 mt-4">
            {forcas.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-lg p-2">
                <p className="text-xs font-semibold text-[var(--c-accent)]">{f.recurso}</p>
                <p className="text-[10px] text-[var(--c-muted)]">{f.adversidade}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">💎 Cofre de Forças</p>
        <p className="text-xs text-[var(--c-muted)]">{forcas.length} superações coletadas.</p>
      </div>

      <div className="space-y-2">
        {forcas.map((f, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-lg p-4">
            <p className="text-xs font-semibold text-green-600 mb-1">💪 {f.recurso}</p>
            <p className="text-[10px] text-[var(--c-muted)] mb-1">Adversidade: {f.adversidade}</p>
            <p className="text-[10px] text-[var(--c-text)]">Como lidou: {f.comoLidou}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Quando duvidar de si mesmo, releia seu cofre. Você já superou coisas piores.
      </p>
    </motion.div>
  );
}
