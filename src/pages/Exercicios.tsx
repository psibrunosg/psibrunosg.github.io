import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Wind, Anchor, NotebookPen, Footprints } from "lucide-react";
import { useEffect } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const exercicios = [
  {
    Icon: Wind,
    titulo: "Respiracao 4-7-8",
    resumo: "Tecnica de respiracao para acalmar o sistema nervoso em momentos de ansiedade aguda.",
    tempo: "3 min",
  },
  {
    Icon: Anchor,
    titulo: "Ancoragem 5-4-3-2-1",
    resumo: "Exercicio de grounding usando os cinco sentidos para voltar ao presente.",
    tempo: "5 min",
  },
  {
    Icon: NotebookPen,
    titulo: "Registro de pensamentos",
    resumo: "Estrutura para identificar, questionar e reformular pensamentos automaticos.",
    tempo: "10 min",
  },
  {
    Icon: Footprints,
    titulo: "Ativacao comportamental",
    resumo: "Como planejar pequenas acoes que devolvem energia e sentido ao dia.",
    tempo: "15 min",
  },
];

export default function Exercicios() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Exercicios | Bruno SG Psicologo | Pelotas";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Praticar para mudar
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Exercicios
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-12 leading-relaxed">
              Praticas guiadas para usar no dia a dia. Pequenas ferramentas, baseadas em evidencia, para regular emocoes e construir habitos mais saudaveis.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
              {exercicios.map((e, i) => {
                const Icon = e.Icon;
                return (
                  <motion.article
                    key={e.titulo}
                    variants={fadeUp}
                    custom={i}
                    className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 transition-colors"
                    style={{ borderLeftWidth: 4, borderLeftColor: "var(--c-accent)" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                        <Icon size={20} />
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                        {e.tempo}
                      </span>
                    </div>
                    <h2
                      className="text-xl font-semibold text-[var(--c-text)] mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {e.titulo}
                    </h2>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed">{e.resumo}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
