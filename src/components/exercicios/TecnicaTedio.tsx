import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "exposicao" | "resultado";

export default function TecnicaTedio() {
  const { save, complete } = useExerciseSession("tedio");
  const [fase, setFase] = useState<Fase>("entrada");
  const [sensacao, setSensacao] = useState("");
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [tempoMeta, setTempoMeta] = useState(300); // 5 min default
  const [rodando, setRodando] = useState(false);
  const [paradaCedo, setParadaCedo] = useState(false);

  const handleIniciar = () => {
    if (!sensacao.trim() || !tempoMeta) return;
    setFase("exposicao");
    setRodando(true);
    setParadaCedo(false);
  };

  const handleStop = () => {
    setRodando(false);
    save({ sensacao, tempoDecorrido, tempoMeta });
    if (tempoDecorrido >= tempoMeta * 0.8) {
      complete(100);
      setFase("resultado");
    } else {
      // Parou antes de 80%: dá feedback e caminho — antes o botão não fazia nada visível
      setParadaCedo(true);
    }
  };

  const handleContinuar = () => {
    setParadaCedo(false);
    setRodando(true);
  };

  // Simulate timer
  useEffect(() => {
    if (!rodando) return;
    const interval = setInterval(() => {
      setTempoDecorrido((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [rodando]);

  const percentualCompleto = Math.min(100, (tempoDecorrido / tempoMeta) * 100);

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Qual sensação de tédio você quer observar?
          </label>
          <input
            type="text"
            value={sensacao}
            onChange={(e) => setSensacao(e.target.value)}
            placeholder="Ex: Vazio, desinteresse, inquietação"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none mb-4"
          />

          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-2">Quanto tempo?</label>
          <div className="flex gap-2 mb-4">
            {[60, 180, 300, 600].map((t) => (
              <button
                key={t}
                onClick={() => setTempoMeta(t)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  tempoMeta === t
                    ? "bg-[var(--c-accent)] text-white"
                    : "bg-[var(--c-surface)] text-[var(--c-text)] border border-[var(--c-border)]"
                }`}
              >
                {t === 60 ? "1m" : t === 180 ? "3m" : t === 300 ? "5m" : "10m"}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-[var(--c-muted)] mb-3 italic">
            Tédio é temporário. Quanto mais você observe sem evitar, mais rápido passa.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!sensacao.trim()}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Iniciar observação →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "exposicao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-3 uppercase tracking-wider">Observando</p>
          <p className="text-2xl font-bold text-[var(--c-text)] mb-6">{sensacao}</p>

          <div className="mb-6">
            <div className="h-2 bg-[var(--c-border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--c-accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${percentualCompleto}%` }}
              />
            </div>
          </div>

          <div className="flex justify-around mb-6">
            <div className="text-center">
              <p className="text-xs text-[var(--c-muted)] mb-1">Tempo</p>
              <p className="text-xl font-bold text-[var(--c-text)]">
                {String(Math.floor(tempoDecorrido / 60)).padStart(2, "0")}:{String(tempoDecorrido % 60).padStart(2, "0")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--c-muted)] mb-1">Meta</p>
              <p className="text-xl font-bold text-[var(--c-accent)]">
                {String(Math.floor(tempoMeta / 60)).padStart(2, "0")}:{String(tempoMeta % 60).padStart(2, "0")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--c-muted)] mb-1">Progresso</p>
              <p className="text-xl font-bold text-[var(--c-accent)]">{Math.round(percentualCompleto)}%</p>
            </div>
          </div>

          <p className="text-sm text-[var(--c-muted)] mb-4 italic">
            Observe a sensação. Não tente mudar. Apenas note: surge, flutua, diminui.
          </p>

          {!paradaCedo ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStop}
              className="w-full py-2 rounded-lg bg-red-500/20 text-red-600 font-semibold text-sm border border-red-500/30"
            >
              Parar observação
            </motion.button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <p className="text-xs text-[var(--c-muted)]">
                Você parou antes da meta — o progresso ficou salvo. A vontade de sair É a evitação que estamos observando. Consegue ficar mais um pouco?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleContinuar}
                  className="py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
                >
                  Continuar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    complete(Math.round((tempoDecorrido / tempoMeta) * 100));
                    setFase("resultado");
                  }}
                  className="py-2 rounded-lg bg-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm"
                >
                  Encerrar por hoje
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6 text-center">
      <p className="text-lg font-bold text-[var(--c-accent)] mb-3">✓ Observação completa</p>
      <p className="text-sm text-[var(--c-text)] mb-2">Sensação: <span className="font-semibold">{sensacao}</span></p>
      <p className="text-sm text-[var(--c-text)] mb-4">
        Tempo: {String(Math.floor(tempoDecorrido / 60)).padStart(2, "0")}:{String(tempoDecorrido % 60).padStart(2, "0")} /
        {String(Math.floor(tempoMeta / 60)).padStart(2, "0")}:{String(tempoMeta % 60).padStart(2, "0")}
      </p>
      <p className="text-[10px] text-[var(--c-muted)] italic">
        O tédio é uma onda — sobe, fica, cai. Quanto menos você evita, mais rápido passa.
      </p>
    </motion.div>
  );
}
