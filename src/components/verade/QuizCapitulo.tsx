// Quiz leve de um capítulo da Jornada Verade

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, X, Sparkles } from "lucide-react";
import type { Capitulo } from "@/content/psicoed/verade";

interface QuizCapituloProps {
  capitulo: Capitulo;
  onAcerto?: () => void;
  onReflexao?: (texto: string) => void;
  jaRespondido?: boolean;
}

export default function QuizCapitulo({ capitulo, onAcerto, onReflexao, jaRespondido = false }: QuizCapituloProps) {
  const reduced = useReducedMotion();
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [reflexao, setReflexao] = useState("");
  const [enviado, setEnviado] = useState(false);

  const { pergunta, reflexivo, cor } = capitulo;

  const handleEscolher = (opcaoId: string) => {
    if (selecionada || jaRespondido) return;
    setSelecionada(opcaoId);
    const opcao = pergunta.opcoes.find((o) => o.id === opcaoId);
    if (opcao?.correto) {
      onAcerto?.();
    }
  };

  const handleReflexao = () => {
    if (reflexao.trim()) {
      setEnviado(true);
      onReflexao?.(reflexao.trim());
    }
  };

  if (reflexivo) {
    return (
      <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/95 backdrop-blur-sm p-5 md:p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} style={{ color: cor }} />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: cor }}>
            Reflexão com Pessy
          </p>
        </div>
        <p className="text-sm text-[var(--c-muted)] mb-4 leading-relaxed">{pergunta.situacao}</p>
        <p className="text-base md:text-lg text-[var(--c-text)] font-medium mb-4">{pergunta.pergunta}</p>
        {!enviado ? (
          <>
            <textarea
              value={reflexao}
              onChange={(e) => setReflexao(e.target.value)}
              placeholder="Escreva aqui o que você notou..."
              className="w-full min-h-[100px] rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] p-3 text-sm text-[var(--c-text)] placeholder:text-[var(--c-muted)]/60 focus:outline-none focus-visible:ring-2 resize-none"
              style={{ outlineColor: cor }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReflexao}
              disabled={!reflexao.trim()}
              className="mt-4 px-5 py-2.5 rounded-full text-white text-sm font-semibold disabled:opacity-40"
              style={{ background: cor }}
            >
              Registrar reflexão
            </motion.button>
          </>
        ) : (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 text-sm"
            style={{ background: `${cor}15`, borderLeft: `4px solid ${cor}` }}
          >
            Obrigado por olhar para dentro. A metacognição começa exatamente assim: notar quem está no comando.
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/95 backdrop-blur-sm p-5 md:p-6 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: cor }}>
        Quiz do capítulo
      </p>
      <p className="text-sm text-[var(--c-muted)] mb-3 leading-relaxed">{pergunta.situacao}</p>
      <p className="text-base md:text-lg text-[var(--c-text)] font-medium mb-5">{pergunta.pergunta}</p>

      <div className="space-y-3">
        {pergunta.opcoes.map((opcao) => {
          const isSelecionada = selecionada === opcao.id;
          const mostrar = !!selecionada || jaRespondido;
          const corOpcao = mostrar
            ? opcao.correto
              ? "border-green-600/60 bg-green-600/10"
              : isSelecionada
                ? "border-red-600/60 bg-red-600/10"
                : "opacity-60"
            : "border-[var(--c-border)] hover:border-[var(--c-accent)]/60";

          return (
            <div key={opcao.id}>
              <button
                onClick={() => handleEscolher(opcao.id)}
                disabled={mostrar}
                className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 ${corOpcao}`}
              >
                {mostrar && (
                  <span className="mt-0.5 flex-shrink-0">
                    {opcao.correto ? (
                      <Check size={16} className="text-green-600" />
                    ) : isSelecionada ? (
                      <X size={16} className="text-red-600" />
                    ) : null}
                  </span>
                )}
                <span className="text-sm text-[var(--c-text)]">{opcao.texto}</span>
              </button>

              <AnimatePresence>
                {mostrar && isSelecionada && (
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

      {selecionada && pergunta.opcoes.find((o) => o.id === selecionada)?.correto && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl p-3 text-sm flex items-center gap-2"
          style={{ background: `${cor}15`, borderLeft: `4px solid ${cor}` }}
        >
          <Sparkles size={16} style={{ color: cor }} />
          {capitulo.recompensa.titulo}: {capitulo.recompensa.descricao}
        </motion.div>
      )}
    </div>
  );
}
