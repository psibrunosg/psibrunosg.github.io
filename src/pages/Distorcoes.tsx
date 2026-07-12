import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { distorcoesQuiz, distorcoesFlashcards } from "@/content/psicoed";
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

type Etapa = "intro" | "quiz" | "flashcards" | "concluido";

export default function Distorcoes() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const { hasCode, save, complete } = useProgresso("distorcoes-cognitivas");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Distorções Cognitivas | Psicoeducação | Bruno Souza";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleQuizCompleto = (acertos: number, total: number) => {
    save({ quiz: { acertos, total } }, { partial: true });
    setEtapa("flashcards");
  };

  const handleFlashcardsCompleto = (acertosTotais: number, totalCartas: number) => {
    complete(acertosTotais);
    save({ flashcards: { acertosTotais, totalCartas } }, { partial: false });
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
                <Scale size={20} />
              </span>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold">
                Território · Distorções Cognitivas
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Distorções Cognitivas
            </motion.h1>
            {etapa === "intro" && (
              <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
                A mente comete atalhos previsíveis quando está sob pressão: exagera, generaliza, adivinha o pior.
                Esses atalhos têm nome — e reconhecê-los é o primeiro passo para questioná-los. Aqui você vai
                identificar 8 situações do dia a dia e depois revisar as 6 distorções mais comuns num baralho de
                cartas.
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
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 1 · Identifique a distorção</p>
              <QuizEngine config={distorcoesQuiz} onComplete={handleQuizCompleto} />
            </div>
          )}

          {etapa === "flashcards" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 2 · Revise as 6 distorções clássicas</p>
              <Flashcards cartas={distorcoesFlashcards} onFinalizar={handleFlashcardsCompleto} />
            </div>
          )}

          {etapa === "concluido" && (
            <div className="space-y-6">
              <Badge titulo="Distorções Cognitivas" />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEtapa("flashcards")}
                  className="flex-1 px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm hover:border-[var(--c-accent)]/60 transition-colors"
                >
                  Revisar cartas de novo
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
