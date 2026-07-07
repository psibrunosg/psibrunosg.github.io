import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

// Engine A — Roleta do "E Se?" (Leahy 2.6 grau de crença, 5.3 probabilidades, 8.14 finais possíveis)
// Mecânica: girar → cenário "E se...?" → estimar chance no susto → ver finais possíveis →
// escolher o mais provável → reestimar. O delta entre as estimativas é o insight.

interface Cenario {
  texto: string;
  emoji: string;
  finais: { texto: string; tipo: "catastrofico" | "provavel" | "positivo" }[];
}

const CENARIOS: Cenario[] = [
  {
    texto: "E se eu travar na apresentação?",
    emoji: "🎤",
    finais: [
      { texto: "Todo mundo ri, minha reputação acaba para sempre", tipo: "catastrofico" },
      { texto: "Pauso, bebo água, retomo — quase ninguém repara", tipo: "provavel" },
      { texto: "Improviso uma piada e a plateia adora", tipo: "positivo" },
    ],
  },
  {
    texto: "E se ele(a) não responder minha mensagem?",
    emoji: "📱",
    finais: [
      { texto: "Está me odiando e vai cortar relações", tipo: "catastrofico" },
      { texto: "Está ocupado(a) e responde quando puder", tipo: "provavel" },
      { texto: "Estava esperando para responder com um convite", tipo: "positivo" },
    ],
  },
  {
    texto: "E se meu coração acelerar do nada?",
    emoji: "💓",
    finais: [
      { texto: "É um infarto, vou desmaiar na frente de todos", tipo: "catastrofico" },
      { texto: "É ansiedade: desconfortável, passageira e inofensiva", tipo: "provavel" },
      { texto: "Percebo, respiro fundo e uso como lembrete de pausa", tipo: "positivo" },
    ],
  },
  {
    texto: "E se eu errar na frente do meu chefe?",
    emoji: "💼",
    finais: [
      { texto: "Demissão imediata e ninguém mais me contrata", tipo: "catastrofico" },
      { texto: "Corrijo o erro, viro aprendizado, a semana segue", tipo: "provavel" },
      { texto: "Meu jeito de corrigir vira exemplo para a equipe", tipo: "positivo" },
    ],
  },
  {
    texto: "E se eu for mal na prova?",
    emoji: "📚",
    finais: [
      { texto: "Reprovo em tudo e nunca me formo", tipo: "catastrofico" },
      { texto: "Recupero nos próximos trabalhos, como sempre houve jeito", tipo: "provavel" },
      { texto: "A nota me mostra exatamente o que estudar e a próxima vem melhor", tipo: "positivo" },
    ],
  },
  {
    texto: "E se me julgarem pela minha roupa na festa?",
    emoji: "👕",
    finais: [
      { texto: "Viro piada do grupo e nunca mais me convidam", tipo: "catastrofico" },
      { texto: "Cada um está preocupado consigo — ninguém comenta", tipo: "provavel" },
      { texto: "Alguém elogia e puxa assunto pelo meu estilo", tipo: "positivo" },
    ],
  },
  {
    texto: "E se eu esquecer o nome de alguém importante?",
    emoji: "🤝",
    finais: [
      { texto: "A pessoa se ofende profundamente e me corta", tipo: "catastrofico" },
      { texto: "Peço desculpa, pergunto de novo, a conversa segue", tipo: "provavel" },
      { texto: "Rimos juntos — ela também tinha esquecido o meu", tipo: "positivo" },
    ],
  },
  {
    texto: "E se eu não der conta da semana?",
    emoji: "📅",
    finais: [
      { texto: "Tudo desmorona e provo que sou incapaz", tipo: "catastrofico" },
      { texto: "Reordeno prioridades: algo espera, o essencial sai", tipo: "provavel" },
      { texto: "Peço ajuda e descubro que a carga podia ser dividida", tipo: "positivo" },
    ],
  },
];

const RODADAS = 4;
const CORES_SEG = ["var(--c-accent)", "var(--c-moss)", "var(--c-warm, #C99A5B)", "var(--c-deep, #4A5D6A)"];

type Fase = "girar" | "estimar" | "finais" | "reestimar" | "fim";

function embaralhar<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function RoletaTerapeutica() {
  const { complete } = useExerciseSession("roleta");
  const [fase, setFase] = useState<Fase>("girar");
  const [rotacao, setRotacao] = useState(0);
  const [girando, setGirando] = useState(false);
  const [usados, setUsados] = useState<number[]>([]);
  const [cenarioIdx, setCenarioIdx] = useState<number | null>(null);
  const [estimativa1, setEstimativa1] = useState(70);
  const [estimativa2, setEstimativa2] = useState(70);
  const [finaisEmbaralhados, setFinaisEmbaralhados] = useState<Cenario["finais"]>([]);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [rodada, setRodada] = useState(1);
  const [deltas, setDeltas] = useState<number[]>([]);

  const cenario = cenarioIdx !== null ? CENARIOS[cenarioIdx] : null;

  const girar = () => {
    if (girando) return;
    const disponiveis = CENARIOS.map((_, i) => i).filter((i) => !usados.includes(i));
    const sorteado = disponiveis[Math.floor(Math.random() * disponiveis.length)];
    const segAngulo = 360 / CENARIOS.length;
    // gira 4 voltas + para no segmento sorteado (ponteiro no topo)
    const destino = 360 * 4 + (360 - (sorteado * segAngulo + segAngulo / 2));
    setGirando(true);
    setRotacao((r) => r + destino - (r % 360));
    setTimeout(() => {
      setGirando(false);
      setCenarioIdx(sorteado);
      setUsados((u) => [...u, sorteado]);
      setEstimativa1(70);
      setEstimativa2(70);
      setEscolha(null);
      setFinaisEmbaralhados(embaralhar(CENARIOS[sorteado].finais));
      setFase("estimar");
    }, 2600);
  };

  const confirmarFinais = (idx: number) => {
    setEscolha(idx);
    setEstimativa2(estimativa1);
    setFase("reestimar");
  };

  const proximaRodada = () => {
    const delta = estimativa1 - estimativa2;
    setDeltas((d) => [...d, delta]);
    if (rodada >= RODADAS) {
      setFase("fim");
      complete(rodada * 25);
    } else {
      setRodada((r) => r + 1);
      setCenarioIdx(null);
      setFase("girar");
    }
  };

  const reiniciar = () => {
    setFase("girar");
    setUsados([]);
    setCenarioIdx(null);
    setRodada(1);
    setDeltas([]);
  };

  const segAngulo = 360 / CENARIOS.length;

  if (fase === "fim") {
    const mediaDelta = deltas.length ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : 0;
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center space-y-4">
        <Sparkles size={40} className="mx-auto text-[var(--c-accent)]" aria-hidden />
        <h2 className="text-xl font-semibold text-[var(--c-text)]">Roleta completa!</h2>
        <p className="text-sm text-[var(--c-muted)]">
          {mediaDelta > 0 ? (
            <>Em média, sua estimativa de catástrofe caiu <strong>{mediaDelta} pontos</strong> depois de olhar os finais possíveis. É isso que examinar alternativas faz com o "E se?".</>
          ) : (
            <>Suas estimativas se mantiveram. Vale repetir o giro em outro dia — o "E se?" muda de tamanho conforme o contexto.</>
          )}
        </p>
        <button onClick={reiniciar} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
          <RotateCcw size={16} aria-hidden /> Girar de novo
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-center text-[10px] font-semibold text-[var(--c-muted)] uppercase tracking-wider">Rodada {rodada} de {RODADAS}</p>

      {/* Roleta */}
      {fase === "girar" && (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center gap-5">
          <div className="relative" aria-label="Roleta de cenários E se">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-8 border-r-8 border-t-[14px] border-l-transparent border-r-transparent border-t-[var(--c-text)]" aria-hidden />
            <motion.div
              animate={{ rotate: rotacao }}
              transition={{ duration: 2.5, ease: [0.15, 0.9, 0.3, 1] }}
              className="w-56 h-56 rounded-full border-4 border-[var(--c-border)] relative overflow-hidden"
              style={{
                background: `conic-gradient(${CENARIOS.map((_, i) => `${CORES_SEG[i % CORES_SEG.length]} ${i * segAngulo}deg ${(i + 1) * segAngulo}deg`).join(", ")})`,
              }}
            >
              {CENARIOS.map((c, i) => {
                const ang = i * segAngulo + segAngulo / 2;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 text-xl"
                    style={{ transform: `rotate(${ang}deg) translateY(-88px) rotate(-${ang}deg) translate(-50%, -50%)` }}
                    aria-hidden
                  >
                    {c.emoji}
                  </span>
                );
              })}
            </motion.div>
          </div>
          <button
            onClick={girar}
            disabled={girando}
            aria-label="Girar a roleta"
            className="px-8 py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold disabled:opacity-50"
          >
            {girando ? "Girando..." : "Girar a roleta"}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Estimativa no susto */}
        {fase === "estimar" && cenario && (
          <motion.div key="estimar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <span className="text-4xl" aria-hidden>{cenario.emoji}</span>
              <h2 className="text-lg font-semibold text-[var(--c-text)] mt-2">{cenario.texto}</h2>
            </div>
            <div>
              <label htmlFor="estimativa1" className="block text-xs font-semibold text-[var(--c-accent)] mb-2">
                No susto: qual a chance do PIOR final acontecer?
              </label>
              <input
                id="estimativa1"
                type="range"
                min={0}
                max={100}
                value={estimativa1}
                onChange={(e) => setEstimativa1(Number(e.target.value))}
                className="w-full accent-[var(--c-accent)]"
              />
              <p className="text-center text-2xl font-bold text-[var(--c-accent)]">{estimativa1}%</p>
            </div>
            <button onClick={() => setFase("finais")} className="w-full py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
              Travar estimativa e ver os finais possíveis
            </button>
          </motion.div>
        )}

        {/* Finais possíveis */}
        {fase === "finais" && cenario && (
          <motion.div key="finais" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-6 space-y-3">
            <p className="text-xs font-semibold text-[var(--c-accent)] uppercase tracking-wider text-center">
              Este filme tem 3 finais. Qual é o MAIS PROVÁVEL?
            </p>
            {finaisEmbaralhados.map((f, i) => (
              <button
                key={i}
                onClick={() => confirmarFinais(i)}
                aria-label={`Escolher final: ${f.texto}`}
                className="w-full text-left rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] hover:border-[var(--c-accent)] transition-colors"
              >
                {f.texto}
              </button>
            ))}
          </motion.div>
        )}

        {/* Reestimativa */}
        {fase === "reestimar" && cenario && escolha !== null && (
          <motion.div key="reestimar" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
            {finaisEmbaralhados[escolha].tipo === "provavel" ? (
              <p className="text-sm font-semibold text-[var(--c-moss)]">✓ É esse mesmo que a experiência costuma confirmar.</p>
            ) : finaisEmbaralhados[escolha].tipo === "catastrofico" ? (
              <p className="text-sm font-semibold text-[var(--c-accent)]">
                Você escolheu o final catastrófico. Ele é possível — mas compare com: "{cenario.finais.find((f) => f.tipo === "provavel")?.texto}". Qual já aconteceu mais vezes na sua vida?
              </p>
            ) : (
              <p className="text-sm font-semibold text-[var(--c-accent)]">
                Otimista! O mais comum na prática: "{cenario.finais.find((f) => f.tipo === "provavel")?.texto}".
              </p>
            )}
            <div>
              <label htmlFor="estimativa2" className="block text-xs font-semibold text-[var(--c-accent)] mb-2">
                Olhando os 3 finais: qual a chance do PIOR agora?
              </label>
              <input
                id="estimativa2"
                type="range"
                min={0}
                max={100}
                value={estimativa2}
                onChange={(e) => setEstimativa2(Number(e.target.value))}
                className="w-full accent-[var(--c-accent)]"
              />
              <p className="text-center text-2xl font-bold text-[var(--c-accent)]">{estimativa2}%</p>
              {estimativa1 !== estimativa2 && (
                <p className="text-center text-xs text-[var(--c-muted)] mt-1">
                  Você começou em {estimativa1}% — {estimativa1 > estimativa2 ? `baixou ${estimativa1 - estimativa2} pontos` : `subiu ${estimativa2 - estimativa1} pontos`}.
                </p>
              )}
            </div>
            <button onClick={proximaRodada} className="w-full py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
              {rodada >= RODADAS ? "Ver resultado" : "Próximo giro"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
