import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Brain, HeartPulse, Lightbulb } from "lucide-react";
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

const topicos = [
  {
    Icon: Brain,
    titulo: "Como funciona a ansiedade",
    resumo: "O que acontece no corpo e na mente quando a ansiedade aparece, e por que ela nao e sua inimiga.",
  },
  {
    Icon: HeartPulse,
    titulo: "Entendendo a depressao",
    resumo: "Sinais, mitos e o que a ciencia diz sobre os caminhos de tratamento que funcionam.",
  },
  {
    Icon: Lightbulb,
    titulo: "Pensamentos automaticos",
    resumo: "Como a mente cria atalhos que distorcem a realidade e como observar esses padroes.",
  },
  {
    Icon: BookOpen,
    titulo: "O que e a TCC",
    resumo: "Uma introducao clara a Terapia Cognitivo-Comportamental e por que ela tem evidencia.",
  },
];

export default function Psicoeducacao() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Psicoeducacao | Bruno SG Psicologo | Pelotas";
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
              Entender para cuidar
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Psicoeducacao
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-12 leading-relaxed">
              Conteudo claro para entender o que voce sente. Saber como a mente funciona e o primeiro passo para cuidar dela com mais autonomia.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
              {topicos.map((t, i) => {
                const Icon = t.Icon;
                return (
                  <motion.article
                    key={t.titulo}
                    variants={fadeUp}
                    custom={i}
                    className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 transition-colors"
                    style={{ borderLeftWidth: 4, borderLeftColor: "var(--c-accent)" }}
                  >
                    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                      <Icon size={20} />
                    </span>
                    <h2
                      className="text-xl font-semibold text-[var(--c-text)] mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.titulo}
                    </h2>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed">{t.resumo}</p>
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
