import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";

export interface QuizOption {
  id: string;
  texto: string;
  correta: boolean;
  explicacao: string;
}

export interface QuizPergunta {
  id: string;
  pergunta: string;
  tipo?: "multipla" | "vf";
  opcoes: QuizOption[];
}

export interface QuizConfig {
  perguntas: QuizPergunta[];
}

interface QuizEngineProps {
  config: QuizConfig;
  onComplete?: (acertos: number, total: number) => void;
}

function mensagemFinal(pct: number) {
  if (pct === 100) return "Você reconheceu todos os padrões. Ótimo olhar treinado!";
  if (pct >= 70) return "Muito bom! Você já reconhece a maioria desses padrões.";
  if (pct >= 40) return "Bom começo — identificar esses padrões é um treino, e treino leva tempo.";
  return "Está tudo bem começar do zero. O importante é ir se familiarizando com os padrões, sem pressa.";
}

export default function QuizEngine({ config, onComplete }: QuizEngineProps) {
  const reduced = useReducedMotion();
  const [indice, setIndice] = useState(0);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [respondidas, setRespondidas] = useState<Set<string>>(new Set());
  const [finalizado, setFinalizado] = useState(false);

  const pergunta = config.perguntas[indice];
  const total = config.perguntas.length;

  const handleEscolher = (opcaoId: string) => {
    if (selecionada) return; // já respondeu essa pergunta
    setSelecionada(opcaoId);
    const opcao = pergunta.opcoes.find((o) => o.id === opcaoId);
    if (opcao?.correta && !respondidas.has(pergunta.id)) {
      setAcertos((a) => a + 1);
    }
    setRespondidas((prev) => new Set(prev).add(pergunta.id));
  };

  const handleProxima = () => {
    if (indice + 1 < total) {
      setIndice((i) => i + 1);
      setSelecionada(null);
    } else {
      setFinalizado(true);
      onComplete?.(acertos, total);
    }
  };

  const handleReiniciar = () => {
    setIndice(0);
    setSelecionada(null);
    setAcertos(0);
    setRespondidas(new Set());
    setFinalizado(false);
  };

  if (finalizado) {
    const pct = Math.round((acertos / total) * 100);
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 text-center"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">
          Quiz concluído
        </p>
        <p className="text-4xl font-bold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          {acertos}/{total}
        </p>
        <p className="text-sm text-[var(--c-muted)] max-w-sm mx-auto mb-6">{mensagemFinal(pct)}</p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleReiniciar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
        >
          <RotateCcw size={16} />
          Tentar de novo
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold text-[var(--c-muted)]">
          Pergunta {indice + 1} de {total}
        </span>
        <div className="flex gap-1">
          {config.perguntas.map((p, i) => (
            <span
              key={p.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: i <= indice ? "var(--c-accent)" : "var(--c-border)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Sem AnimatePresence aqui de propósito: a troca de pergunta precisa ser
          instantânea (apenas a entrada anima) — não pode depender de uma
          animação de saída terminar (ex.: aba em segundo plano com rAF
          pausado), senão a pergunta nova fica presa atrás da antiga. */}
      <motion.div
        key={pergunta.id}
        initial={reduced ? undefined : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
          <p className="text-base md:text-lg text-[var(--c-text)] font-medium mb-6 leading-relaxed">
            {pergunta.pergunta}
          </p>

          <div className="space-y-3">
            {pergunta.opcoes.map((opcao) => {
              const isSelecionada = selecionada === opcao.id;
              const mostrarResultado = !!selecionada;
              const cor = !mostrarResultado
                ? ""
                : opcao.correta
                ? "border-green-600/60 bg-green-600/10"
                : isSelecionada
                ? "border-red-600/60 bg-red-600/10"
                : "opacity-60";

              return (
                <div key={opcao.id}>
                  <button
                    onClick={() => handleEscolher(opcao.id)}
                    disabled={mostrarResultado}
                    className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 ${
                      mostrarResultado ? cor : "border-[var(--c-border)] hover:border-[var(--c-accent)]/60"
                    }`}
                  >
                    {mostrarResultado && (
                      <span className="mt-0.5 flex-shrink-0">
                        {opcao.correta ? (
                          <Check size={16} className="text-green-600" />
                        ) : isSelecionada ? (
                          <X size={16} className="text-red-600" />
                        ) : null}
                      </span>
                    )}
                    <span className="text-sm text-[var(--c-text)]">{opcao.texto}</span>
                  </button>

                  <AnimatePresence>
                    {mostrarResultado && isSelecionada && (
                      <motion.p
                        initial={reduced ? undefined : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-[var(--c-muted)] px-4 pt-2 leading-relaxed"
                      >
                        {opcao.explicacao}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {selecionada && (
            <motion.button
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleProxima}
              className="mt-6 w-full sm:w-auto px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              {indice + 1 < total ? "Próxima" : "Ver resultado"}
            </motion.button>
          )}
      </motion.div>
    </div>
  );
}
