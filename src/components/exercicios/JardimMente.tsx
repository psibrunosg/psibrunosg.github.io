import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface Planta {
  id: number;
  estagio: number; // 0-5 (semente, broto, folhas, flores, fruto, árvore)
  ultimaRega: string;
  sessoesConcluidas: number;
}

const ESTAGIOS = [
  { emoji: "🌱", desc: "Semente" },
  { emoji: "🌿", desc: "Broto" },
  { emoji: "🌱🌿", desc: "Folhas" },
  { emoji: "🌸", desc: "Flor" },
  { emoji: "🍀", desc: "Florada" },
  { emoji: "🌳", desc: "Árvore" },
];

export default function JardimMente() {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [totalSessoes, setTotalSessoes] = useState(0);

  // Simula progresso — em produção, viria do Supabase
  useEffect(() => {
    const code = localStorage.getItem("exercise_patient_code");
    if (!code) {
      // Anônimo: mostra demo
      setPlantas([
        { id: 1, estagio: 0, ultimaRega: new Date().toLocaleDateString("pt-BR"), sessoesConcluidas: 0 },
      ]);
      return;
    }

    // TODO: carregar do Supabase patient-progress
    // Por enquanto, mostra estado demo
    const demo: Planta[] = [];
    for (let i = 0; i < 3; i++) {
      demo.push({
        id: i,
        estagio: Math.min(5, Math.floor(Math.random() * 6)),
        ultimaRega: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleDateString("pt-BR"),
        sessoesConcluidas: Math.floor(Math.random() * 10),
      });
    }
    setPlantas(demo);
    setTotalSessoes(demo.reduce((a, p) => a + p.sessoesConcluidas, 0));
  }, []);

  const calcularDiasDesdeRega = (data: string) => {
    const hoje = new Date();
    const rega = new Date(data);
    const diff = Math.floor((hoje.getTime() - rega.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--c-accent)]">{plantas.length}</p>
          <p className="text-xs text-[var(--c-muted)]">Plantas no jardim</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--c-accent)]">{totalSessoes}</p>
          <p className="text-xs text-[var(--c-muted)]">Sessões completas</p>
        </div>
      </motion.div>

      {/* Jardim */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--c-accent)]">Seu jardim</p>

        {plantas.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--c-muted)]">Comece um exercício para plantar sua primeira semente 🌱</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {plantas.map((planta) => {
              const estagio = ESTAGIOS[planta.estagio];
              const diasDesdeRega = calcularDiasDesdeRega(planta.ultimaRega);
              const saudavel = diasDesdeRega < 14;

              return (
                <motion.div
                  key={planta.id}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl border border-[var(--c-border)] p-3 text-center transition-colors"
                  style={{ borderColor: saudavel ? "var(--c-accent)" : "#dc2626" }}
                >
                  <div className="text-3xl mb-2">{estagio.emoji}</div>
                  <p className="text-[10px] font-semibold text-[var(--c-text)]">{estagio.desc}</p>
                  <p className="text-[9px] text-[var(--c-muted)] mt-1">
                    {planta.sessoesConcluidas} sessões
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-[var(--c-muted)]">
                    <Calendar size={10} />
                    <span>{diasDesdeRega}d atrás</span>
                  </div>

                  {!saudavel && (
                    <motion.div
                      animate={{ opacity: [0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mt-2 text-xs font-semibold text-red-500"
                    >
                      ⚠ Carece água
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-[var(--c-muted)] bg-[var(--c-surface)] rounded-xl p-3">
        <p className="mb-1 font-semibold text-[var(--c-accent)]">💡 Como funciona</p>
        <p>Cada sessão concluída em qualquer exercício rega uma planta. Quanto mais você pratica, mais elas crescem!</p>
      </motion.div>
    </div>
  );
}
