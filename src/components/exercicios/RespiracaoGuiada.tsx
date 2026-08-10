import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

interface RespiracaoGuiadaProps {
  audioUrl?: string;
}

const FASES = [
  { nome: "Inspire", duracao: 4 },
  { nome: "Segure", duracao: 7 },
  { nome: "Expire", duracao: 8 },
];

type Velocidade = "lento" | "normal" | "rapido";

const VELOCIDADES: Record<Velocidade, number> = {
  lento: 1.3,
  normal: 1,
  rapido: 0.75,
};

export default function RespiracaoGuiada({ audioUrl }: RespiracaoGuiadaProps) {
  const { save, complete } = useExerciseSession("respiracao-guiada");
  const prefersReducedMotion = useReducedMotion();

  const [isPlaying, setIsPlaying] = useState(false);
  const [velocidade, setVelocidade] = useState<Velocidade>("normal");
  const [faseIndex, setFaseIndex] = useState(0);
  const [ciclosCompletos, setCiclosCompletos] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(
    FASES[0].duracao * VELOCIDADES[velocidade]
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const faseAtual = FASES[faseIndex];
  const duracao = faseAtual.duracao * VELOCIDADES[velocidade];

  // Efeito: trata play/pause
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Inicia áudio se disponível
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Silencioso se áudio falhar
      });
    }

    // Inicia contador
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, duracao - elapsed);
      setTempoRestante(remaining);

      if (remaining <= 0) {
        // Avança para próxima fase
        const nextIndex = (faseIndex + 1) % FASES.length;

        // Se completa um ciclo (volta ao Inspire), incrementa ciclos
        if (nextIndex === 0) {
          setCiclosCompletos((prev) => {
            const novo = prev + 1;
            save({ ciclosCompletos: novo });
            return novo;
          });
        }

        setFaseIndex(nextIndex);
        const novaFase = FASES[nextIndex];
        const novaDuracao = novaFase.duracao * VELOCIDADES[velocidade];
        setTempoRestante(novaDuracao);
      }
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, faseIndex, duracao, audioUrl, velocidade, save]);

  const handleVelocidadeChange = (vel: Velocidade) => {
    setVelocidade(vel);
    // Resetar tempos com nova velocidade
    const novaFase = FASES[faseIndex];
    const novaDuracao = novaFase.duracao * VELOCIDADES[vel];
    setTempoRestante(novaDuracao);
    // Se estava tocando, para momentaneamente pra resetar timer
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handleConcluir = () => {
    setIsPlaying(false);
    complete(ciclosCompletos);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
      {/* Círculo Animado */}
      <div className="flex flex-col items-center justify-center gap-8">
        <motion.div
          animate={{
            scale:
              prefersReducedMotion || faseAtual.nome === "Inspire"
                ? 1
                : faseAtual.nome === "Segure"
                  ? 1
                  : 0.6,
          }}
          transition={{ duration: prefersReducedMotion ? 0 : duracao, ease: "easeInOut" }}
          className="w-48 h-48 rounded-full border-4 flex items-center justify-center flex-col"
          style={{
            borderColor: "var(--c-accent)",
            backgroundColor: "color-mix(in oklab, var(--c-accent) 10%, transparent)",
          }}
        >
          <p className="text-sm font-semibold text-[var(--c-muted)] mb-2">{faseAtual.nome}</p>
          <p className="text-4xl font-bold text-[var(--c-accent)]">{Math.ceil(tempoRestante)}</p>
        </motion.div>

        {/* Indicador de Ciclo */}
        <div className="glass-card rounded-lg px-4 py-2 border border-[var(--c-border)]">
          <p className="text-xs font-semibold text-[var(--c-muted)]">
            Ciclo {ciclosCompletos + 1}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        {/* Play/Pause */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--c-accent)] text-[var(--c-on-accent)] font-semibold text-sm transition-all hover:opacity-90 min-h-[44px]"
          >
            {isPlaying ? (
              <>
                <Pause size={20} />
                Pausar
              </>
            ) : (
              <>
                <Play size={20} />
                {ciclosCompletos === 0 ? "Começar" : "Retomar"}
              </>
            )}
          </button>
        </div>

        {/* Seletor de Velocidade */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--c-muted)] block">
            Velocidade
          </label>
          <div className="flex gap-2">
            {["lento", "normal", "rapido"].map((vel) => (
              <button
                key={vel}
                onClick={() => handleVelocidadeChange(vel as Velocidade)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all min-h-[44px] ${
                  velocidade === vel
                    ? "bg-[var(--c-accent)] text-[var(--c-on-accent)]"
                    : "bg-[var(--c-border)] text-[var(--c-text)] hover:bg-[var(--c-muted)]"
                }`}
              >
                {vel === "lento" ? "Lento" : vel === "normal" ? "Normal" : "Rápido"}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Concluir */}
        {ciclosCompletos >= 3 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleConcluir}
            className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold text-sm transition-all hover:opacity-90 min-h-[44px]"
          >
            Concluir Exercício ({ciclosCompletos} ciclos)
          </motion.button>
        )}
      </div>

      {/* Áudio (se disponível) */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="w-full mt-4"
          controls
        />
      )}

      {/* Dicas */}
      <div className="glass-card rounded-lg p-4 bg-[var(--c-accent)]/5 border border-[var(--c-accent)]/20">
        <p className="text-xs text-[var(--c-text)] leading-relaxed">
          <strong>Técnica 4-7-8:</strong> Inspire por 4 segundos, segure por 7 e expire em 8. Este padrão acalma o sistema nervoso. Complete pelo menos 3 ciclos.
        </p>
      </div>
    </motion.div>
  );
}
