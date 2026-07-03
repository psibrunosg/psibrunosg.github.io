import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2 } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type RodadaFase = "pensamento" | "evidencias" | "veredito";

interface Evidencia {
  id: string;
  texto: string;
  valida: boolean;
  testada: boolean;
}

export default function MuralhaEvidencias() {
  const { save, complete } = useExerciseSession("muralha-evidencias");
  const [rodada, setRodada] = useState(1);
  const [fase, setFase] = useState<RodadaFase>("pensamento");
  const [pensamento, setPensamento] = useState("");
  const [novaEvidencia, setNovaEvidencia] = useState("");
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [score, setScore] = useState(0);

  const handleAddEvidencia = () => {
    if (!novaEvidencia.trim()) return;
    setEvidencias([
      ...evidencias,
      { id: Date.now().toString(), texto: novaEvidencia, valida: true, testada: false },
    ]);
    setNovaEvidencia("");
  };

  const handleTestarEvidencia = (id: string, valida: boolean) => {
    setEvidencias((prev) =>
      prev.map((e) => (e.id === id ? { ...e, testada: true, valida } : e))
    );
    if (valida) setScore((s) => s + 15);
  };

  const handleProxima = () => {
    if (rodada < 3) {
      setRodada(rodada + 1);
      setFase("pensamento");
      setPensamento("");
      setEvidencias([]);
      setNovaEvidencia("");
    } else {
      complete(score);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-[var(--c-accent)] mb-2">
        Rodada {rodada}/3 • Score: {score}
      </div>

      {fase === "pensamento" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-5">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-2">Pensamento "réu"</label>
          <input
            type="text"
            value={pensamento}
            onChange={(e) => setPensamento(e.target.value)}
            placeholder="Ex: Vou fracassar nessa apresentação"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (pensamento.trim()) {
                setFase("evidencias");
                save({ rodada, pensamento, evidencias: [] });
              }
            }}
            disabled={!pensamento.trim()}
            className="mt-3 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Acusar →
          </motion.button>
        </motion.div>
      )}

      {fase === "evidencias" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="glass-card rounded-2xl p-5 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
            <p className="text-sm font-semibold text-[var(--c-text)] mb-3">Pensamento: "{pensamento}"</p>
            <div className="space-y-2 mb-3">
              {evidencias.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-[var(--c-surface)]"
                >
                  <span className="flex-1 text-xs text-[var(--c-text)]">{e.texto}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTestarEvidencia(e.id, true)}
                      className="px-2 py-1 rounded text-[9px] font-semibold bg-green-500/20 text-green-600 hover:bg-green-500/30"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => handleTestarEvidencia(e.id, false)}
                      className="px-2 py-1 rounded text-[9px] font-semibold bg-red-500/20 text-red-600 hover:bg-red-500/30"
                    >
                      ✗
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={novaEvidencia}
                onChange={(e) => setNovaEvidencia(e.target.value)}
                placeholder="Adicionar evidência..."
                className="flex-1 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddEvidencia()}
              />
              <button
                onClick={handleAddEvidencia}
                className="px-3 py-2 rounded-lg bg-[var(--c-accent)]/20 text-[var(--c-accent)] hover:bg-[var(--c-accent)]/30"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFase("veredito")}
            disabled={evidencias.length === 0}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Veredito →
          </motion.button>
        </motion.div>
      )}

      {fase === "veredito" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6 text-center">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-[var(--c-accent)]" />
          <h3 className="font-semibold text-[var(--c-text)] mb-2">Pensamento reformulado</h3>
          <p className="text-xs text-[var(--c-muted)] mb-4">
            Com base nas evidências, o pensamento pode ser visto como: "Preparei bem, tenho capacidade."
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProxima}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            {rodada < 3 ? "Próxima rodada" : "Finalizar"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
