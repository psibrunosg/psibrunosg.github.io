import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const PARADAS = [
  { tempo: "1 semana", label: "1 Semana", dias: 7 },
  { tempo: "1 mês", label: "1 Mês", dias: 30 },
  { tempo: "1 ano", label: "1 Ano", dias: 365 },
  { tempo: "5 anos", label: "5 Anos", dias: 1825 },
];

type Fase = "inicio" | "viagem" | "fim";

export default function MaquinaDoTempo() {
  const { save, complete } = useExerciseSession("maquina-tempo");
  const [fase, setFase] = useState<Fase>("inicio");
  const [preocupacao, setPreocupacao] = useState("");
  const [paradaIdx, setParadaIdx] = useState(0);
  const [importancia, setImportancia] = useState(50);
  const [resultados, setResultados] = useState<Array<{ parada: string; valor: number }>>([]);
  const [score, setScore] = useState(0);

  const handleIniciar = () => {
    if (!preocupacao.trim()) return;
    setFase("viagem");
    setResultados([]);
  };

  const handleProximaParada = () => {
    // Registra o valor que o USUÁRIO escolheu — sem decair automaticamente
    // (pré-baixar o slider anularia a descoberta: a curva tem que ser dele)
    const novosResultados = [...resultados, { parada: PARADAS[paradaIdx].tempo, valor: importancia }];
    setResultados(novosResultados);
    setScore((s) => s + 10);

    if (paradaIdx < PARADAS.length - 1) {
      setParadaIdx(paradaIdx + 1);
    } else {
      save({ preocupacao, trajetoria: novosResultados });
      setFase("fim");
      complete(score + 10);
    }
  };

  if (fase === "inicio") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">Qual preocupação você quer examinar?</label>
          <textarea
            value={preocupacao}
            onChange={(e) => setPreocupacao(e.target.value)}
            placeholder="Ex: Vou ser demitido..."
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
            rows={3}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!preocupacao.trim()}
            className="mt-3 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Viajar no tempo →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "viagem") {
    const parada = PARADAS[paradaIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-[var(--c-accent)] uppercase tracking-wider">Viagem no tempo</span>
          <p className="text-lg font-bold text-[var(--c-text)] mt-1">{parada.label}</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Sua preocupação vai importar quanto?</p>

          {/* Slider */}
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="100"
              value={importancia}
              onChange={(e) => setImportancia(Number(e.target.value))}
              className="w-full"
            />

            <div className="flex items-center justify-between text-xs text-[var(--c-muted)]">
              <span>Não importa (0)</span>
              <span className="text-lg font-bold text-[var(--c-accent)]">{importancia}</span>
              <span>Muito (100)</span>
            </div>
          </div>

          {/* Gráfico de decaimento */}
          {resultados.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-[var(--c-border)]">
              <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-2">Sua trajetória:</p>
              <div className="flex items-end gap-2 h-20">
                {resultados.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${r.valor}%` }}
                    className="flex-1 bg-[var(--c-accent)]/30 rounded-t-lg flex items-end justify-center text-[9px] font-bold text-[var(--c-accent)]"
                  >
                    {r.valor}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProximaParada}
            className="mt-4 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm flex items-center justify-center gap-1"
          >
            {paradaIdx < PARADAS.length - 1 ? "Próxima parada" : "Ver resultado"} <ChevronRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6 text-center">
      <p className="text-lg font-bold text-[var(--c-accent)] mb-3">📉 Sua curva de importância</p>
      <div className="flex items-end gap-2 h-24 mb-4">
        {resultados.map((r, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, r.valor)}%` }}
              className="w-full bg-[var(--c-accent)]/40 rounded-t-lg flex items-start justify-center text-[10px] font-bold text-[var(--c-accent)] pt-1"
            >
              {r.valor}
            </motion.div>
            <p className="text-[9px] text-[var(--c-muted)] mt-1">{r.parada}</p>
          </div>
        ))}
      </div>
      <p className="text-sm font-semibold text-[var(--c-text)]">
        Em 1 semana: {resultados[0]?.valor ?? "—"} → Em 5 anos: {resultados[resultados.length - 1]?.valor ?? "—"}
      </p>
      {resultados.length > 1 && resultados[resultados.length - 1].valor < resultados[0].valor && (
        <p className="text-xs text-[var(--c-muted)] mt-2">A importância caiu com a distância — o que isso diz sobre a preocupação de hoje?</p>
      )}
    </motion.div>
  );
}
