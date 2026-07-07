import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Scale } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

// Engine B — Balança de Evidências (Leahy 3.3 custo-benefício, 3.5 exame de evidências)
// Mecânica: classificar cartas em "pesa a favor", "pesa contra" ou "não é fato".
// Sentimentos não entram na balança — esse é o aprendizado central da técnica.

type Bin = "favor" | "contra" | "sentimento";

interface Carta {
  texto: string;
  tipo: Bin;
  explicacao: string;
}

interface Cenario {
  pensamento: string;
  emoji: string;
  cartas: Carta[];
  reflexao: string;
}

const CENARIOS: Cenario[] = [
  {
    pensamento: "Errei no trabalho, vão me demitir",
    emoji: "💼",
    cartas: [
      { texto: "Meu chefe apontou o erro na reunião", tipo: "favor", explicacao: "É um fato — mas apontar um erro não é o mesmo que demitir." },
      { texto: "Recebi uma avaliação positiva no último ciclo", tipo: "contra", explicacao: "Fato concreto que pesa contra a previsão de demissão." },
      { texto: "Colegas já erraram coisas parecidas e continuam na empresa", tipo: "contra", explicacao: "Evidência histórica: erros assim não costumam custar o emprego." },
      { texto: "Sinto que todos me olham diferente agora", tipo: "sentimento", explicacao: "Sensação, não fato. Sentimento não entra na balança." },
      { texto: "Fui chamado para participar de um projeto novo", tipo: "contra", explicacao: "Quem vai ser demitido raramente é escalado para projetos novos." },
      { texto: "Tenho certeza de que meu chefe me odeia", tipo: "sentimento", explicacao: "Leitura mental: certeza sobre a cabeça do outro é opinião, não evidência." },
      { texto: "O erro causou retrabalho para a equipe", tipo: "favor", explicacao: "Fato real — pesa, mas veja o tamanho dele diante do resto." },
    ],
    reflexao: "Quando só os fatos entram na balança, a previsão catastrófica costuma perder peso. O que os fatos dizem sobre a chance real de demissão?",
  },
  {
    pensamento: "Ninguém gostou de mim na festa",
    emoji: "🎉",
    cartas: [
      { texto: "Duas pessoas puxaram assunto comigo", tipo: "contra", explicacao: "Fato observável: houve aproximação espontânea." },
      { texto: "Fiquei um tempo sozinho perto da mesa", tipo: "favor", explicacao: "Fato — mas ficar sozinho em um momento não mede o que os outros sentiram." },
      { texto: "Senti um clima estranho o tempo todo", tipo: "sentimento", explicacao: "'Clima' é interpretação. Sensação não é fato." },
      { texto: "Me chamaram para o próximo encontro do grupo", tipo: "contra", explicacao: "Quem não gosta de alguém não costuma convidar de novo." },
      { texto: "Uma pessoa riu de algo que eu contei", tipo: "contra", explicacao: "Reação positiva concreta ao seu jeito." },
      { texto: "Aposto que comentaram de mim depois", tipo: "sentimento", explicacao: "Suposição sem qualquer evidência — leitura mental do futuro." },
      { texto: "Respondi uma pergunta de forma atrapalhada", tipo: "favor", explicacao: "Fato pontual — um tropeço em uma conversa inteira." },
    ],
    reflexao: "Repare quantas 'evidências' eram sentimentos disfarçados. Sobrando só os fatos, o que a balança mostra sobre a festa?",
  },
  {
    pensamento: "Vou reprovar na prova, não adianta estudar",
    emoji: "📚",
    cartas: [
      { texto: "Tirei nota baixa no último simulado", tipo: "favor", explicacao: "Fato — um simulado indica onde melhorar, não o resultado final." },
      { texto: "Passei em provas parecidas nos semestres anteriores", tipo: "contra", explicacao: "Seu histórico real de aprovações é evidência forte." },
      { texto: "Sinto um branco só de pensar na prova", tipo: "sentimento", explicacao: "Ansiedade antecipatória é sensação, não previsão confiável." },
      { texto: "Ainda faltam duas semanas de estudo", tipo: "contra", explicacao: "Tempo disponível é um fato que muda o cenário." },
      { texto: "Meu professor disse que meu trabalho melhorou", tipo: "contra", explicacao: "Feedback externo concreto sobre sua evolução." },
      { texto: "Todo mundo é mais inteligente do que eu", tipo: "sentimento", explicacao: "Comparação global e vaga — opinião dura, não fato mensurável." },
      { texto: "Deixei dois capítulos sem revisar", tipo: "favor", explicacao: "Fato específico — e acionável: dá para revisar em duas semanas." },
    ],
    reflexao: "'Não adianta estudar' sobreviveu ao teste dos fatos? Repare que até as evidências a favor apontam ações possíveis, não um destino.",
  },
];

const BINS: Array<{ id: Bin; rotulo: string; cor: string }> = [
  { id: "favor", rotulo: "Pesa a favor", cor: "var(--c-accent)" },
  { id: "contra", rotulo: "Pesa contra", cor: "var(--c-moss)" },
  { id: "sentimento", rotulo: "Não é fato", cor: "var(--c-muted)" },
];

export default function BalancaTerapeutica() {
  const { complete } = useExerciseSession("balanca");
  const [cenarioIdx, setCenarioIdx] = useState<number | null>(null);
  const [cartaIdx, setCartaIdx] = useState(0);
  const [pesoFavor, setPesoFavor] = useState(0);
  const [pesoContra, setPesoContra] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [feedback, setFeedback] = useState<{ correto: boolean; explicacao: string } | null>(null);
  const [fim, setFim] = useState(false);

  const cenario = cenarioIdx !== null ? CENARIOS[cenarioIdx] : null;
  const carta = cenario && cartaIdx < cenario.cartas.length ? cenario.cartas[cartaIdx] : null;

  // Inclinação da balança: só fatos pesam
  const inclinacao = Math.max(-16, Math.min(16, (pesoFavor - pesoContra) * 6));

  const handleEscolha = (bin: Bin) => {
    if (!carta || !cenario || feedback) return;
    const correto = bin === carta.tipo;
    if (correto) setAcertos((a) => a + 1);
    // O peso sempre vai para o prato correto (clinicamente o fato é o que é)
    if (carta.tipo === "favor") setPesoFavor((p) => p + 1);
    if (carta.tipo === "contra") setPesoContra((p) => p + 1);
    setFeedback({ correto, explicacao: carta.explicacao });
  };

  const proximaCarta = () => {
    if (!cenario) return;
    setFeedback(null);
    if (cartaIdx + 1 >= cenario.cartas.length) {
      setFim(true);
      const score = Math.round((acertos / cenario.cartas.length) * 100);
      complete(score);
    } else {
      setCartaIdx((i) => i + 1);
    }
  };

  const reiniciar = () => {
    setCenarioIdx(null);
    setCartaIdx(0);
    setPesoFavor(0);
    setPesoContra(0);
    setAcertos(0);
    setFeedback(null);
    setFim(false);
  };

  // Tela 1: escolher o pensamento a julgar
  if (cenarioIdx === null) {
    return (
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-1 uppercase tracking-wider">Escolha um pensamento para colocar na balança</p>
          <p className="text-sm text-[var(--c-muted)] mb-4">Só fatos podem pesar. Sentimentos e suposições ficam de fora — descobrir a diferença é o jogo.</p>
          <div className="space-y-3">
            {CENARIOS.map((c, i) => (
              <button
                key={i}
                onClick={() => setCenarioIdx(i)}
                aria-label={`Julgar o pensamento: ${c.pensamento}`}
                className="w-full flex items-center gap-3 text-left rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-4 hover:border-[var(--c-accent)] transition-colors"
              >
                <span className="text-2xl" aria-hidden>{c.emoji}</span>
                <span className="text-sm font-semibold text-[var(--c-text)]">"{c.pensamento}"</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tela final: veredito
  if (fim && cenario) {
    const veredito =
      pesoContra > pesoFavor
        ? "A balança pendeu CONTRA o pensamento."
        : pesoContra === pesoFavor
          ? "A balança ficou equilibrada — o pensamento não é a verdade toda."
          : "Alguns fatos pesaram a favor — e todos apontam ações possíveis.";
    return (
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center">
          <Scale size={40} className="mx-auto mb-4 text-[var(--c-accent)]" aria-hidden />
          <h2 className="text-xl font-semibold text-[var(--c-text)] mb-2">{veredito}</h2>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Fatos a favor: <strong>{pesoFavor}</strong> · Fatos contra: <strong>{pesoContra}</strong> · Você separou fato de sentimento em{" "}
            <strong>{acertos}/{cenario.cartas.length}</strong> cartas.
          </p>
          <p className="text-sm text-[var(--c-text)] italic mb-6">{cenario.reflexao}</p>
          <button
            onClick={reiniciar}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold"
          >
            <RotateCcw size={16} aria-hidden /> Julgar outro pensamento
          </button>
        </motion.div>
      </div>
    );
  }

  // Tela 2: julgamento carta a carta
  return (
    <div className="space-y-4">
      {/* Pensamento em julgamento */}
      <div className="glass-card rounded-2xl p-4 text-center">
        <p className="text-[10px] font-semibold text-[var(--c-accent)] uppercase tracking-wider mb-1">Em julgamento</p>
        <p className="text-sm font-semibold text-[var(--c-text)]">"{cenario?.pensamento}"</p>
      </div>

      {/* Balança */}
      <div className="glass-card rounded-2xl p-6 flex flex-col items-center" aria-label={`Balança: ${pesoFavor} fatos a favor, ${pesoContra} fatos contra`}>
        <motion.div animate={{ rotate: inclinacao }} transition={{ type: "spring", stiffness: 60, damping: 12 }} className="w-full max-w-xs origin-center">
          <div className="flex items-end justify-between">
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-14 rounded-b-2xl border-2 border-t-0 border-[var(--c-accent)] flex items-center justify-center text-lg font-bold text-[var(--c-accent)]">
                {pesoFavor}
              </div>
              <span className="text-[10px] font-semibold text-[var(--c-muted)] uppercase">A favor</span>
            </div>
            <div className="flex-1 h-1 bg-[var(--c-border)] mx-2 mb-10 rounded" aria-hidden />
            <div className="flex flex-col items-center gap-1">
              <div className="w-20 h-14 rounded-b-2xl border-2 border-t-0 border-[var(--c-moss)] flex items-center justify-center text-lg font-bold text-[var(--c-moss)]">
                {pesoContra}
              </div>
              <span className="text-[10px] font-semibold text-[var(--c-muted)] uppercase">Contra</span>
            </div>
          </div>
        </motion.div>
        <div className="w-2 h-8 bg-[var(--c-border)] rounded mt-1" aria-hidden />
      </div>

      {/* Carta atual */}
      <AnimatePresence mode="wait">
        {carta && (
          <motion.div
            key={cartaIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="glass-card rounded-2xl p-6"
          >
            <p className="text-[10px] font-semibold text-[var(--c-accent)] uppercase tracking-wider mb-2">
              Carta {cartaIdx + 1} de {cenario?.cartas.length} — isso pesa na balança?
            </p>
            <p className="text-base font-semibold text-[var(--c-text)] mb-4">"{carta.texto}"</p>

            {!feedback ? (
              <div className="grid grid-cols-3 gap-2">
                {BINS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleEscolha(b.id)}
                    aria-label={`Classificar como: ${b.rotulo}`}
                    className="px-2 py-3 rounded-lg text-xs font-semibold border border-[var(--c-border)] text-[var(--c-text)] hover:border-current transition-colors"
                    style={{ color: b.cor }}
                  >
                    {b.rotulo}
                  </button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className={`text-sm font-semibold ${feedback.correto ? "text-[var(--c-moss)]" : "text-[var(--c-accent)]"}`}>
                  {feedback.correto ? "✓ Isso mesmo." : "✗ Quase —"} {feedback.explicacao}
                </p>
                <button
                  onClick={proximaCarta}
                  className="w-full py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold"
                >
                  {cartaIdx + 1 >= (cenario?.cartas.length ?? 0) ? "Ver o veredito" : "Próxima carta"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
