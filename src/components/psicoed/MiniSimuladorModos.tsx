// Mini-simulador "qual é a resposta do Adulto Saudável?" — extraído de
// src/pages/ModosEsquema.tsx (versão pré-revamp Torajo, commit d643b7a) pra
// não virar código morto quando aquela página passou a usar o território
// Torajo. Reaproveitado em PersonagensTorajo.tsx. Ver docs/mundo-torajo-playbook.md.

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { CenarioModo } from "@/content/psicoed/modos";

export default function MiniSimuladorModos({
  cenarios,
  onFinalizar,
}: {
  cenarios: CenarioModo[];
  onFinalizar: (acertos: number, total: number) => void;
}) {
  const reduced = useReducedMotion();
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const cenario = cenarios[indice];
  const total = cenarios.length;

  const escolher = (opcaoId: string) => {
    if (escolhida) return;
    setEscolhida(opcaoId);
    const opcao = cenario.opcoes.find((o) => o.id === opcaoId);
    if (opcao?.correta) setAcertos((a) => a + 1);
  };

  const proximo = () => {
    if (indice + 1 < total) {
      setIndice((i) => i + 1);
      setEscolhida(null);
    } else {
      setFinalizado(true);
      onFinalizar(acertos, total);
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setEscolhida(null);
    setAcertos(0);
    setFinalizado(false);
  };

  if (finalizado) {
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 text-center"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">
          Simulador concluído
        </p>
        <p className="text-4xl font-bold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          {acertos}/{total}
        </p>
        <p className="text-sm text-[var(--c-muted)] max-w-sm mx-auto mb-6">
          Reconhecer a resposta do Adulto Saudável é um treino — quanto mais você praticar, mais rápido consegue
          acessar essa parte no dia a dia.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={reiniciar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)] font-semibold text-sm"
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
          Cenário {indice + 1} de {total}
        </span>
        <div className="flex gap-1">
          {cenarios.map((c, i) => (
            <span
              key={c.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i <= indice ? "var(--c-accent)" : "var(--c-border)" }}
            />
          ))}
        </div>
      </div>

      <motion.div
        key={cenario.id}
        initial={reduced ? undefined : { opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-xs font-semibold text-[var(--c-accent)] uppercase tracking-wide mb-2">Cenário</p>
        <p className="text-base md:text-lg text-[var(--c-text)] font-medium mb-6 leading-relaxed">{cenario.situacao}</p>
        <p className="text-xs text-[var(--c-muted)] mb-3">
          Qual dessas respostas vem do <strong className="text-[var(--c-text)]">Adulto Saudável</strong>?
        </p>

        <div className="space-y-3">
          {cenario.opcoes.map((opcao) => {
            const isEscolhida = escolhida === opcao.id;
            const mostrar = !!escolhida;
            const cor = !mostrar
              ? ""
              : opcao.correta
              ? "border-green-600/60 bg-green-600/10"
              : isEscolhida
              ? "border-red-600/60 bg-red-600/10"
              : "opacity-60";

            return (
              <div key={opcao.id}>
                <button
                  onClick={() => escolher(opcao.id)}
                  disabled={mostrar}
                  className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3 ${
                    mostrar ? cor : "border-[var(--c-border)] hover:border-[var(--c-accent)]/60"
                  }`}
                >
                  {mostrar && opcao.correta && <Check size={16} className="mt-0.5 flex-shrink-0 text-green-600" />}
                  <span className="text-sm text-[var(--c-text)]">{opcao.texto}</span>
                </button>
                <AnimatePresence>
                  {mostrar && isEscolhida && (
                    <motion.p
                      initial={reduced ? undefined : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-[var(--c-muted)] px-4 pt-2 leading-relaxed"
                    >
                      {opcao.feedback}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {escolhida && (
          <motion.button
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={proximo}
            className="mt-6 w-full sm:w-auto px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-[var(--c-on-accent)] font-semibold text-sm"
          >
            {indice + 1 < total ? "Próximo cenário" : "Ver resultado"}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
