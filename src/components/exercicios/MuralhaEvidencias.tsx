import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2 } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type RodadaFase = "pensamento" | "evidencias" | "veredito";

interface Evidencia {
  id: string;
  texto: string;
  ehFato: boolean | null; // null = ainda não testada no júri
}

interface RodadaSalva {
  pensamento: string;
  tijolos: string[];
  reformulado: string;
}

export default function MuralhaEvidencias() {
  const { save, complete } = useExerciseSession("muralha-evidencias");
  const [rodada, setRodada] = useState(1);
  const [fase, setFase] = useState<RodadaFase>("pensamento");
  const [pensamento, setPensamento] = useState("");
  const [novaEvidencia, setNovaEvidencia] = useState("");
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [reformulado, setReformulado] = useState("");
  const [rodadasSalvas, setRodadasSalvas] = useState<RodadaSalva[]>([]);
  const [score, setScore] = useState(0);

  const tijolos = evidencias.filter((e) => e.ehFato === true);
  const todasTestadas = evidencias.length > 0 && evidencias.every((e) => e.ehFato !== null);

  const handleAddEvidencia = () => {
    if (!novaEvidencia.trim()) return;
    setEvidencias([
      ...evidencias,
      { id: `${Date.now()}-${evidencias.length}`, texto: novaEvidencia, ehFato: null },
    ]);
    setNovaEvidencia("");
  };

  // Teste do júri: só FATO vira tijolo; sentimento disfarçado de fato desmorona
  const handleTestarEvidencia = (id: string, ehFato: boolean) => {
    setEvidencias((prev) => prev.map((e) => (e.id === id ? { ...e, ehFato } : e)));
    if (ehFato) setScore((s) => s + 15);
  };

  const handleVeredito = () => {
    if (!reformulado.trim()) return;
    const novaRodada: RodadaSalva = {
      pensamento,
      tijolos: tijolos.map((t) => t.texto),
      reformulado,
    };
    const todas = [...rodadasSalvas, novaRodada];
    setRodadasSalvas(todas);
    save({ rodadas: todas, score: score });

    if (rodada < 3) {
      setRodada(rodada + 1);
      setFase("pensamento");
      setPensamento("");
      setEvidencias([]);
      setNovaEvidencia("");
      setReformulado("");
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
          <label htmlFor="pensamento-reu" className="block text-xs font-semibold text-[var(--c-accent)] mb-2">
            Pensamento "réu"
          </label>
          <input
            id="pensamento-reu"
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
              if (pensamento.trim()) setFase("evidencias");
            }}
            disabled={!pensamento.trim()}
            className="mt-3 w-full py-2.5 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Acusar →
          </motion.button>
        </motion.div>
      )}

      {fase === "evidencias" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="glass-card rounded-2xl p-5 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
            <p className="text-sm font-semibold text-[var(--c-text)] mb-1">Pensamento: "{pensamento}"</p>
            <p className="text-[10px] text-[var(--c-muted)] mb-3">
              Liste as evidências que sustentam esse pensamento. Depois, o júri testa cada uma: é um <strong>fato verificável</strong> ou um <strong>sentimento disfarçado de fato</strong>?
            </p>

            <div className="space-y-2 mb-3">
              {evidencias.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`flex flex-wrap items-center gap-2 p-2 rounded-lg ${
                    e.ehFato === false ? "bg-[var(--c-surface)] opacity-50 line-through" : "bg-[var(--c-surface)]"
                  }`}
                >
                  <span className="flex-1 text-xs text-[var(--c-text)] min-w-32">{e.texto}</span>
                  {e.ehFato === null ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleTestarEvidencia(e.id, true)}
                        className="px-2 py-1.5 rounded text-[10px] font-semibold bg-green-500/20 text-green-600 hover:bg-green-500/30"
                        aria-label={`Marcar "${e.texto}" como fato`}
                      >
                        Fato → tijolo
                      </button>
                      <button
                        onClick={() => handleTestarEvidencia(e.id, false)}
                        className="px-2 py-1.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-600 hover:bg-red-500/30"
                        aria-label={`Marcar "${e.texto}" como sentimento`}
                      >
                        Sentimento → cai
                      </button>
                    </div>
                  ) : (
                    <span className={`text-[10px] font-semibold ${e.ehFato ? "text-green-600" : "text-red-600"}`}>
                      {e.ehFato ? "🧱 Tijolo" : "💨 Desmoronou"}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={novaEvidencia}
                onChange={(e) => setNovaEvidencia(e.target.value)}
                placeholder="Adicionar evidência..."
                aria-label="Nova evidência"
                className="flex-1 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddEvidencia()}
              />
              <button
                onClick={handleAddEvidencia}
                aria-label="Adicionar evidência"
                className="px-3 py-2 rounded-lg bg-[var(--c-accent)]/20 text-[var(--c-accent)] hover:bg-[var(--c-accent)]/30"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Muralha visual: cada fato vira tijolo */}
          {tijolos.length > 0 && (
            <div className="glass-card rounded-2xl p-4">
              <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-2 uppercase tracking-wider">A muralha</p>
              <div className="flex flex-wrap gap-1">
                {tijolos.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-3 py-2 rounded bg-[var(--c-accent)]/20 border border-[var(--c-accent)]/40 text-[10px] font-semibold text-[var(--c-text)]"
                    title={t.texto}
                  >
                    🧱 {t.texto.length > 24 ? `${t.texto.slice(0, 24)}…` : t.texto}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFase("veredito")}
            disabled={!todasTestadas}
            className="w-full py-2.5 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            {todasTestadas ? "Veredito →" : "Teste todas as evidências no júri"}
          </motion.button>
        </motion.div>
      )}

      {fase === "veredito" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-[var(--c-accent)]" aria-hidden="true" />
          <h3 className="font-semibold text-[var(--c-text)] mb-1 text-center">Veredito do júri</h3>
          <p className="text-xs text-[var(--c-muted)] mb-4 text-center">
            Sobraram <strong>{tijolos.length}</strong> de <strong>{evidencias.length}</strong> evidências de pé.
            {tijolos.length === 0
              ? " A acusação não se sustenta em fatos."
              : " Considere o que os fatos realmente dizem — sem o exagero do pensamento original."}
          </p>

          <label htmlFor="pensamento-reformulado" className="block text-xs font-semibold text-[var(--c-accent)] mb-2">
            Reescreva o pensamento com base no que sobrou:
          </label>
          <textarea
            id="pensamento-reformulado"
            value={reformulado}
            onChange={(e) => setReformulado(e.target.value)}
            placeholder='Ex: "Posso ter dificuldades, mas os fatos mostram que costumo dar conta"'
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none mb-3"
            rows={2}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVeredito}
            disabled={!reformulado.trim()}
            className="w-full py-2.5 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            {rodada < 3 ? "Próxima rodada" : "Finalizar"}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
