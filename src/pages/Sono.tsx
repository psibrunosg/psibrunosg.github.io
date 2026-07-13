import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { sonoQuiz, sonoFlashcards, passosRotinaNoturna } from "@/content/psicoed/sono";
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

type Etapa = "intro" | "quiz" | "rotina" | "flashcards" | "concluido";

export default function Sono() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const { hasCode, save, complete } = useProgresso("sono");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Sono | Psicoeducação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleQuizCompleto = (acertos: number, total: number) => {
    save({ quiz: { acertos, total } }, { partial: true });
    setEtapa("rotina");
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
                <Moon size={20} />
              </span>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold">
                Território · Sono
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sono
            </motion.h1>
            {etapa === "intro" && (
              <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
                A mente ansiosa e o sono costumam brigar: quanto mais a gente tenta forçar o sono, mais ele foge.
                Aqui você vai testar 8 crenças comuns sobre sono — mito ou fato — e depois revisar os conceitos por
                trás de uma boa higiene do sono.
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
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 1 · Mito ou fato?</p>
              <QuizEngine config={sonoQuiz} onComplete={handleQuizCompleto} />
            </div>
          )}

          {etapa === "rotina" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 2 · O que ajuda a preparar o sono</p>
              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8 space-y-5">
                {passosRotinaNoturna.map((p, i) => (
                  <motion.div
                    key={p.titulo}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <p className="text-sm font-semibold text-[var(--c-text)]">{p.titulo}</p>
                    <p className="text-xs text-[var(--c-muted)] leading-relaxed mt-1">{p.descricao}</p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEtapa("flashcards")}
                className="mt-6 px-6 py-3 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
              >
                Continuar
              </motion.button>
            </div>
          )}

          {etapa === "flashcards" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 3 · Revise os conceitos</p>
              <Flashcards cartas={sonoFlashcards} onFinalizar={handleFlashcardsCompleto} />
            </div>
          )}

          {etapa === "concluido" && (
            <div className="space-y-6">
              <Badge titulo="Sono" />
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
