import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Layers, Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { modosQuiz, modosFlashcards, cenariosModo } from "@/content/psicoed/modos";
import QuizEngine from "@/components/psicoed/QuizEngine";
import Flashcards from "@/components/psicoed/Flashcards";
import Badge from "@/components/psicoed/Badge";
import { useProgresso } from "@/components/psicoed/useProgresso";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

type Etapa = "intro" | "quiz" | "flashcards" | "simulador" | "concluido";

function MiniSimuladorModos({ onFinalizar }: { onFinalizar: (acertos: number, total: number) => void }) {
  const reduced = useReducedMotion();
  const [indice, setIndice] = useState(0);
  const [escolhida, setEscolhida] = useState<string | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const cenario = cenariosModo[indice];
  const total = cenariosModo.length;

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
          Cenário {indice + 1} de {total}
        </span>
        <div className="flex gap-1">
          {cenariosModo.map((c, i) => (
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
            className="mt-6 w-full sm:w-auto px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            {indice + 1 < total ? "Próximo cenário" : "Ver resultado"}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

export default function ModosEsquema() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const { hasCode, save, complete } = useProgresso("modos-do-esquema");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Modos do Esquema | Psicoeducação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleQuizCompleto = (acertos: number, total: number) => {
    save({ quiz: { acertos, total } }, { partial: true });
    setEtapa("flashcards");
  };

  const handleFlashcardsCompleto = (acertosTotais: number, totalCartas: number) => {
    save({ flashcards: { acertosTotais, totalCartas } }, { partial: true });
    setEtapa("simulador");
  };

  const handleSimuladorCompleto = (acertos: number, total: number) => {
    complete(acertos);
    save({ simulador: { acertos, total } }, { partial: false });
    setEtapa("concluido");
  };

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/psicoeducacao"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao mapa
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                <Layers size={20} />
              </span>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold">
                Território · Modos do Esquema
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Modos do Esquema
            </motion.h1>
            {etapa === "intro" && (
              <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
                Em momentos difíceis, é como se partes diferentes de nós "assumissem o microfone": uma que sente
                medo, uma que desliga, uma que cobra com dureza — e uma que consegue acolher tudo isso com
                equilíbrio. Aqui você vai treinar reconhecer quem está falando, e depois praticar fortalecer a parte
                que cuida de você.
              </motion.p>
            )}
            {!hasCode && (
              <motion.p variants={fadeUp} className="text-xs text-[var(--c-muted)]/80 italic mt-3">
                Você não está com um código de paciente ativo — seu progresso não será salvo, mas o módulo funciona normalmente.
              </motion.p>
            )}
          </motion.div>

          {etapa === "intro" && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEtapa("quiz")}
              className="px-6 py-3 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              Começar
            </motion.button>
          )}

          {etapa === "quiz" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 1 · Qual modo está falando?</p>
              <QuizEngine config={modosQuiz} onComplete={handleQuizCompleto} />
            </div>
          )}

          {etapa === "flashcards" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 2 · Revise os 4 modos</p>
              <Flashcards cartas={modosFlashcards} onFinalizar={handleFlashcardsCompleto} />
            </div>
          )}

          {etapa === "simulador" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 3 · Escolha a resposta do Adulto Saudável</p>
              <MiniSimuladorModos onFinalizar={handleSimuladorCompleto} />
            </div>
          )}

          {etapa === "concluido" && (
            <div className="space-y-6">
              <Badge titulo="Modos do Esquema" />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEtapa("simulador")}
                  className="flex-1 px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm hover:border-[var(--c-accent)]/60 transition-colors"
                >
                  Praticar de novo
                </button>
                <Link
                  to="/psicoeducacao"
                  className="flex-1 text-center px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
                >
                  Voltar ao mapa
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
