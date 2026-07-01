import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";

type Fase = "inspira" | "segura" | "solta";

const FASES: Record<Fase, { dur: number; label: string; proxima: Fase; escala: number }> = {
  inspira: { dur: 4, label: "Inspire pelo nariz", proxima: "segura", escala: 1.35 },
  segura: { dur: 7, label: "Segure o ar", proxima: "solta", escala: 1.35 },
  solta: { dur: 8, label: "Solte devagar pela boca", proxima: "inspira", escala: 1 },
};

const INICIAL = { fase: "inspira" as Fase, restante: FASES.inspira.dur, ciclos: 0 };

export default function Respiracao() {
  const [rodando, setRodando] = useState(false);
  const [s, setS] = useState(INICIAL);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(() => {
      setS((cur) => {
        if (cur.restante > 1) return { ...cur, restante: cur.restante - 1 };
        const prox = FASES[cur.fase].proxima;
        return {
          fase: prox,
          restante: FASES[prox].dur,
          ciclos: cur.ciclos + (prox === "inspira" ? 1 : 0),
        };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [rodando]);

  const reset = () => {
    setRodando(false);
    setS(INICIAL);
  };

  return (
    <ExercicioShell
      eyebrow="Respiração 4-7-8"
      titulo="Respire com o círculo"
      descricao="Inspire por 4 segundos, segure por 7, solte por 8. Acompanhe o movimento do círculo e deixe o corpo entender que está seguro. De 3 a 6 ciclos costumam bastar."
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--c-accent)]/10"
            animate={{ scale: rodando ? FASES[s.fase].escala : 1 }}
            transition={{ duration: rodando ? FASES[s.fase].dur : 0.6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full bg-[var(--c-accent)]/20"
            animate={{ scale: rodando ? FASES[s.fase].escala : 1 }}
            transition={{ duration: rodando ? FASES[s.fase].dur : 0.6, ease: "easeInOut" }}
          />
          <div className="relative z-10 text-center">
            <p className="text-6xl font-semibold text-[var(--c-accent)]" style={{ fontFamily: "var(--font-heading)" }}>
              {rodando ? s.restante : "4·7·8"}
            </p>
            <p className="text-sm text-[var(--c-muted)] mt-2 max-w-[180px]">
              {rodando ? FASES[s.fase].label : "Aperte iniciar e siga o ritmo"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setRodando((r) => !r)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--c-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {rodando ? <Pause size={16} /> : <Play size={16} />}
            {rodando ? "Pausar" : "Iniciar"}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] text-sm font-semibold hover:text-[var(--c-text)] transition-colors"
          >
            <RotateCcw size={16} /> Recomeçar
          </button>
        </div>

        <p className="text-sm text-[var(--c-muted)]">
          Ciclos completos: <strong className="text-[var(--c-text)]">{s.ciclos}</strong>
        </p>

        <p className="text-xs text-[var(--c-muted)] mt-8 max-w-md text-center leading-relaxed">
          Se sentir tontura, pause e respire no seu ritmo natural. Esta prática ajuda na regulação, mas não substitui
          acompanhamento profissional.
        </p>
      </div>
    </ExercicioShell>
  );
}
