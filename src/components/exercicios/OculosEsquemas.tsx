import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "inicio" | "jogo" | "resultado";

const ESQUEMAS = ["Abandono", "Desconfiança", "Inadequação", "Dependência", "Rigidez"];

interface Cenario {
  contexto: string;
  pensamento: string;
  resposta: string;
}

const CENARIOS: Cenario[] = [
  {
    contexto: "Você não é convidado para uma reunião social.",
    pensamento: "Ninguém me quer por perto. Vou acabar sozinho.",
    resposta: "Abandono",
  },
  {
    contexto: "Sua apresentação no trabalho teve um erro pequeno.",
    pensamento: "Cometi um erro. Isso é inaceitável — tinha que ser perfeito.",
    resposta: "Rigidez",
  },
  {
    contexto: "Um amigo demora para responder suas mensagens.",
    pensamento: "Ele deve estar fazendo isso de propósito para me atingir.",
    resposta: "Desconfiança",
  },
  {
    contexto: "Você recebe uma tarefa nova e desafiadora.",
    pensamento: "Sozinho eu não dou conta. Preciso que alguém me diga como fazer.",
    resposta: "Dependência",
  },
  {
    contexto: "Alguém elogia seu trabalho na frente do time.",
    pensamento: "Se me conhecessem de verdade, veriam que não sou bom o suficiente.",
    resposta: "Inadequação",
  },
];

export default function OculosEsquemas() {
  const { save, complete } = useExerciseSession("oculos-esquemas");
  const [fase, setFase] = useState<Fase>("inicio");
  const [cenarioIdx, setCenarioIdx] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ acertou: boolean; certa: string } | null>(null);

  const handleResposta = (esquema: string) => {
    if (feedback) return;
    const cenario = CENARIOS[cenarioIdx];
    const acertou = esquema === cenario.resposta;
    const novosAcertos = acertou ? acertos + 1 : acertos;
    const novasRespostas = [...respostas, esquema];

    setAcertos(novosAcertos);
    setRespostas(novasRespostas);
    setFeedback({ acertou, certa: cenario.resposta });

    setTimeout(() => {
      setFeedback(null);
      if (cenarioIdx < CENARIOS.length - 1) {
        setCenarioIdx(cenarioIdx + 1);
      } else {
        save({
          cenarios: CENARIOS.length,
          acertos: novosAcertos,
          respostas: novasRespostas,
        });
        complete(Math.round((novosAcertos / CENARIOS.length) * 100));
        setFase("resultado");
      }
    }, 1200);
  };

  if (fase === "inicio") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            🕶️ Óculos dos Esquemas
          </p>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Você vai ler um pensamento automático em cada cenário. Identifique qual esquema está falando.
          </p>
          <div className="bg-[var(--c-surface)] rounded-lg p-4 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
            <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-2">Esquemas:</p>
            <ul className="text-[10px] text-[var(--c-muted)] space-y-1">
              <li><span className="font-semibold">Abandono</span>: medo de ser deixado</li>
              <li><span className="font-semibold">Desconfiança</span>: pessoas têm segundas intenções</li>
              <li><span className="font-semibold">Inadequação</span>: não sou bom o suficiente</li>
              <li><span className="font-semibold">Dependência</span>: não consigo sozinho</li>
              <li><span className="font-semibold">Rigidez</span>: devo ser perfeito</li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFase("jogo")}
            className="mt-6 w-full py-2.5 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            Começar →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "jogo") {
    const cenario = CENARIOS[cenarioIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1 bg-[var(--c-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--c-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((cenarioIdx + 1) / CENARIOS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--c-muted)]">
            {cenarioIdx + 1}/{CENARIOS.length}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs text-[var(--c-muted)] mb-2">{cenario.contexto}</p>
          <p className="text-base font-semibold text-[var(--c-text)] mb-6 italic">"{cenario.pensamento}"</p>

          <p className="text-xs font-semibold text-[var(--c-accent)] mb-3">Qual esquema está falando?</p>
          <div className="grid grid-cols-2 gap-2">
            {ESQUEMAS.map((esquema) => {
              const destaque =
                feedback && esquema === feedback.certa
                  ? "border-green-500 bg-green-500/15"
                  : feedback && respostas[cenarioIdx] === esquema && !feedback.acertou
                    ? "border-red-500 bg-red-500/15"
                    : "border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent)]";
              return (
                <motion.button
                  key={esquema}
                  whileHover={feedback ? {} : { scale: 1.02 }}
                  whileTap={feedback ? {} : { scale: 0.98 }}
                  onClick={() => handleResposta(esquema)}
                  disabled={!!feedback}
                  className={`p-3 rounded-lg border text-sm font-semibold text-[var(--c-text)] transition-all ${destaque}`}
                >
                  {esquema}
                </motion.button>
              );
            })}
          </div>

          {feedback && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 text-center text-sm font-semibold ${feedback.acertou ? "text-green-600" : "text-red-600"}`}
            >
              {feedback.acertou ? "✓ Isso mesmo!" : `✗ Era ${feedback.certa}`}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">🕶️ Quiz completo</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-[var(--c-muted)] mb-1">Acertos</p>
            <p className="text-2xl font-bold text-[var(--c-accent)]">{acertos}/{CENARIOS.length}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--c-muted)] mb-1">Taxa</p>
            <p className="text-2xl font-bold text-green-600">{Math.round((acertos / CENARIOS.length) * 100)}%</p>
          </div>
        </div>
      </div>

      {respostas.map((resposta, i) => {
        const cenario = CENARIOS[i];
        const acertou = resposta === cenario.resposta;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-lg p-4 border-l-4 ${acertou ? "border-l-green-600" : "border-l-red-600"}`}
          >
            <p className="text-xs font-semibold mb-1 text-[var(--c-text)]">
              {acertou ? "✓" : `✗ Você disse ${resposta} —`} {cenario.resposta}
            </p>
            <p className="text-[10px] text-[var(--c-muted)] italic">"{cenario.pensamento}"</p>
          </motion.div>
        );
      })}

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Quanto melhor você reconhece esquemas, mais rápido consegue questionar pensamentos automáticos.
      </p>
    </motion.div>
  );
}
