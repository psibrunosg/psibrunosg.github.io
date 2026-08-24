import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { daysSinceWatering, parseGardenSnapshot } from "./exerciseState";

const ESTAGIOS = [
  { emoji: "🌱", desc: "Semente" },
  { emoji: "🌿", desc: "Broto" },
  { emoji: "🍃", desc: "Folhas" },
  { emoji: "🌸", desc: "Flor" },
  { emoji: "🌺", desc: "Florada" },
  { emoji: "🌳", desc: "Árvore" },
];

const NOMES: Record<string, string> = {
  "acerte-distorcao": "Acerte a Distorção",
  "muralha-evidencias": "Muralha de Evidências",
  "registro-v2": "Registro de Pensamentos",
  "baralho-adulto": "Baralho Adulto",
  "pares-mente": "Pares da Mente",
  "chuva-preocupacoes": "Chuva de Preocupações",
  "balao-pensamentos": "Balão de Pensamentos",
  "caca-fatos": "Caça aos Fatos",
  "gps-decisoes": "GPS de Decisões",
  "maquina-tempo": "Máquina do Tempo",
  "torta-responsabilidade": "Torta da Responsabilidade",
  "lab-previsoes": "Laboratório de Previsões",
  "conecte-abc": "Conecte A-B-C",
};

const JARDIM_REFERENCE_TIME = Date.now();

export default function JardimMente() {
  const [snapshot] = useState(() => (
    parseGardenSnapshot(localStorage.getItem("jardim_regas"))
  ));
  const plantas = snapshot.plants;
  const totalSessoes = snapshot.totalSessions;

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
            <p className="text-sm text-[var(--c-muted)]">Complete um exercício para plantar sua primeira semente 🌱</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" role="list">
            {plantas.map((planta) => {
              const estagio = ESTAGIOS[planta.stage];
              const diasDesdeRega = daysSinceWatering(planta.lastWateredAt, JARDIM_REFERENCE_TIME);
              const saudavel = diasDesdeRega < 14;

              return (
                <motion.div
                  key={planta.slug}
                  role="listitem"
                  whileHover={{ scale: 1.05 }}
                  className="rounded-xl border p-3 text-center transition-colors"
                  style={{ borderColor: saudavel ? "var(--c-accent)" : "var(--c-border)" }}
                >
                  <div className="text-3xl mb-2" aria-hidden="true">{estagio.emoji}</div>
                  <p className="text-[10px] font-semibold text-[var(--c-text)]">
                    {NOMES[planta.slug] ?? planta.slug}
                  </p>
                  <p className="text-[9px] text-[var(--c-muted)] mt-1">
                    {estagio.desc} · {planta.completedSessions} {planta.completedSessions === 1 ? "sessão" : "sessões"}
                  </p>

                  <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-[var(--c-muted)]">
                    <Calendar size={10} aria-hidden="true" />
                    <span>{diasDesdeRega === 0 ? "hoje" : `${diasDesdeRega}d atrás`}</span>
                  </div>

                  {!saudavel && (
                    <p className="mt-2 text-[10px] font-semibold text-[var(--c-muted)]">
                      💧 Precisa de água — pratique de novo
                    </p>
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
        <p>Cada sessão concluída em qualquer exercício rega a planta daquele exercício. Quanto mais você pratica, mais elas crescem — e murcham se ficarem 14 dias sem rega.</p>
      </motion.div>
    </div>
  );
}
