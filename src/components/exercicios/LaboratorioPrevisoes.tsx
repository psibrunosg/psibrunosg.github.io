import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, CheckCircle2, XCircle } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

interface Previsao {
  id: string;
  texto: string;
  data: string;
  resultado?: "acertou" | "errou";
  notasResultado?: string;
}

export default function LaboratorioPrevisoes() {
  const { state, loading, save, complete } = useExerciseSession("lab-previsoes");
  const [previsoes, setPrevisoes] = useState<Previsao[]>([]);
  const [novaPrevisao, setNovaPrevisao] = useState("");
  const [dataPrazo, setDataPrazo] = useState("");
  const [modo, setModo] = useState<"registrar" | "revisar">("registrar");

  // Retoma previsões salvas (localStorage/DB) — o Laboratório só funciona com retorno ao longo do tempo
  useEffect(() => {
    if (loading) return;
    const salvas = state.payload?.previsoes as Previsao[] | undefined;
    if (salvas && salvas.length > 0) {
      setPrevisoes(salvas);
      // Se há previsões vencidas sem resultado, abre direto na revisão
      const hoje = new Date().toISOString().slice(0, 10);
      if (salvas.some((p) => !p.resultado && p.data <= hoje)) {
        setModo("revisar");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const persistir = (novas: Previsao[]) => {
    setPrevisoes(novas);
    save({ previsoes: novas });
  };

  const handleRegistrar = () => {
    if (!novaPrevisao.trim() || !dataPrazo) return;
    persistir([
      ...previsoes,
      {
        id: Date.now().toString(),
        texto: novaPrevisao,
        data: dataPrazo,
      },
    ]);
    setNovaPrevisao("");
    setDataPrazo("");
  };

  const handleRegistrarResultado = (id: string, resultado: "acertou" | "errou", notas: string) => {
    const novas = previsoes.map((p) =>
      p.id === id ? { ...p, resultado, notasResultado: notas } : p
    );
    persistir(novas);
    // Testar uma previsão conta como sessão concluída (rega o Jardim)
    const testadas = novas.filter((p) => p.resultado).length;
    const acertosAtuais = novas.filter((p) => p.resultado === "acertou").length;
    complete(testadas > 0 ? Math.round((acertosAtuais / testadas) * 100) : 0);
  };

  const acertos = previsoes.filter((p) => p.resultado === "acertou").length;
  const totalTestadas = previsoes.filter((p) => p.resultado).length;
  const percentualAcerto = totalTestadas > 0 ? Math.round((acertos / totalTestadas) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        {(["registrar", "revisar"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setModo(m)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              modo === m
                ? "bg-[var(--c-accent)] text-white"
                : "bg-[var(--c-border)] text-[var(--c-text)]"
            }`}
          >
            {m === "registrar" ? "📝 Registrar" : "🎯 Revisar"}
          </button>
        ))}
      </div>

      {modo === "registrar" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-2">Sua previsão testável:</label>
          <textarea
            value={novaPrevisao}
            onChange={(e) => setNovaPrevisao(e.target.value)}
            placeholder="Ex: Vou ficar ansioso na apresentação de amanhã"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
            rows={2}
          />

          <label className="block text-xs font-semibold text-[var(--c-accent)] mt-3 mb-2">Prazo para testar:</label>
          <input
            type="date"
            value={dataPrazo}
            onChange={(e) => setDataPrazo(e.target.value)}
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRegistrar}
            disabled={!novaPrevisao.trim() || !dataPrazo}
            className="mt-4 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> Registrar Previsão
          </motion.button>
        </motion.div>
      )}

      {modo === "revisar" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-card rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[var(--c-accent)]">{previsoes.length}</p>
              <p className="text-[9px] text-[var(--c-muted)]">Total</p>
            </div>
            <div className="glass-card rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{acertos}</p>
              <p className="text-[9px] text-[var(--c-muted)]">Acertos</p>
            </div>
            <div className="glass-card rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[var(--c-accent)]">{percentualAcerto}%</p>
              <p className="text-[9px] text-[var(--c-muted)]">Taxa</p>
            </div>
          </div>

          {/* Previsões */}
          {previsoes.map((pred) => {
            const vencida = !pred.resultado && pred.data <= new Date().toISOString().slice(0, 10);
            return (
            <motion.div key={pred.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`glass-card rounded-lg p-3 ${vencida ? "border-l-4" : ""}`} style={vencida ? { borderLeftColor: "var(--c-accent)" } : undefined}>
              <p className="text-xs font-semibold text-[var(--c-text)] mb-1">{pred.texto}</p>
              <p className="text-[10px] text-[var(--c-muted)] mb-2">
                Prazo: {new Date(`${pred.data}T12:00:00`).toLocaleDateString("pt-BR")}
                {vencida && <span className="ml-2 font-semibold text-[var(--c-accent)]">• Hora de testar: o que aconteceu de verdade?</span>}
              </p>

              {!pred.resultado ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRegistrarResultado(pred.id, "acertou", "")}
                    className="flex-1 px-2 py-1 rounded bg-green-500/20 text-green-700 text-[10px] font-semibold hover:bg-green-500/30"
                  >
                    ✓ Acertou
                  </button>
                  <button
                    onClick={() => handleRegistrarResultado(pred.id, "errou", "")}
                    className="flex-1 px-2 py-1 rounded bg-red-500/20 text-red-700 text-[10px] font-semibold hover:bg-red-500/30"
                  >
                    ✗ Errou
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  {pred.resultado === "acertou" ? (
                    <>
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span className="text-[10px] text-green-600 font-semibold">Acertou!</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={12} className="text-red-600" />
                      <span className="text-[10px] text-red-600 font-semibold">Errou</span>
                    </>
                  )}
                </div>
              )}
            </motion.div>
            );
          })}

          {previsoes.length === 0 && (
            <p className="text-center text-[var(--c-muted)] text-sm py-4">Nenhuma previsão registrada ainda</p>
          )}
        </motion.div>
      )}
    </div>
  );
}
