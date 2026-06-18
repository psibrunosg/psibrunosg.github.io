import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { StickyScrollReveal } from "@/components/ui/StickyScrollReveal";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { hero, manifesto, dores, processo, abordagens, faqs, contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Como ajudo", href: "#ajudo" },
  { label: "Processo", href: "#processo" },
  { label: "Abordagens", href: "#abordagens" },
  { label: "FAQ", href: "#faq" },
];

const bentoItems = dores.map((d, i) => ({ ...d, large: i === 0 }));

export default function VariantB() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "b");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SkipLink />
      <FloatingNav items={navItems} crp={contato.crp} />
      <WhatsAppFloat />

      <main id="main">
        {/* HERO */}
        <section id="hero">
          <AuroraBackground
            variant="b"
            className="min-h-screen flex items-center justify-center bg-[var(--c-bg-dark)] text-white"
          >
            <div className="text-center px-6 max-w-4xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="inline-flex items-center gap-3 border border-[var(--c-accent)]/30 rounded-full px-5 py-2 mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--c-accent)] animate-pulse" aria-hidden="true" />
                <span className="text-xs tracking-widest uppercase text-[var(--c-accent)]">{contato.crp}</span>
              </motion.div>

              <h1
                className="text-5xl md:text-7xl font-light leading-tight mb-8 text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <TextGenerateEffect text={hero.headline} delay={0.3} mode="words" />
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="text-lg text-white/60 max-w-xl mx-auto mb-12 leading-relaxed"
              >
                {hero.subline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <AnimatedCTA href={contato.whatsappLink} label={hero.cta} sublabel={hero.ctaSub} />
              </motion.div>
            </div>
          </AuroraBackground>
        </section>

        {/* STICKY SCROLL — MANIFESTO/PILARES */}
        <section id="processo" className="bg-[var(--c-bg)] px-6">
          <div className="max-w-5xl mx-auto">
            <StickyScrollReveal
              items={processo}
              sticky={
                <div className="py-24">
                  <span className="text-xs tracking-widest uppercase text-[var(--c-accent)] block mb-4">O processo</span>
                  <blockquote
                    className="text-3xl md:text-4xl font-light text-[var(--c-text)] leading-relaxed"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    &ldquo;{manifesto.quote}&rdquo;
                  </blockquote>
                </div>
              }
            />
          </div>
        </section>

        {/* BENTO — COMO AJUDO */}
        <section id="ajudo" className="py-24 px-6 bg-[var(--c-surface)]">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-12 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Quando a terapia pode ajudar
            </motion.h2>
            <BentoGrid items={bentoItems} />
          </div>
        </section>

        {/* ABORDAGENS — TABS */}
        <section id="abordagens" className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-10 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Abordagens terapêuticas
            </motion.h2>
            <div className="flex gap-2 border-b border-[var(--c-border)] mb-8">
              {abordagens.map((ab, i) => (
                <button
                  key={ab.id}
                  onClick={() => setActiveTab(i)}
                  className="px-5 py-3 text-sm font-medium relative transition-colors"
                  style={{ color: activeTab === i ? "var(--c-accent)" : "var(--c-muted)" }}
                  aria-selected={activeTab === i}
                >
                  {ab.sigla}
                  {activeTab === i && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--c-warm)]"
                    />
                  )}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-semibold text-[var(--c-text)] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                  {abordagens[activeTab].nome}
                </h3>
                <p className="text-[var(--c-muted)] leading-relaxed mb-4">{abordagens[activeTab].descricao}</p>
                <p className="text-[var(--c-muted)] leading-relaxed text-sm">{abordagens[activeTab].detalhe}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6 bg-[var(--c-surface)]">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl font-semibold text-[var(--c-text)] mb-12 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Perguntas frequentes
            </motion.h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                  className="border border-[var(--c-border)] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-[var(--c-bg)] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-medium text-[var(--c-text)] text-sm">{faq.pergunta}</span>
                    <motion.svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="var(--c-warm)" strokeWidth="2"
                      animate={{ rotate: openFaq === i ? 180 : 0 }} aria-hidden="true"
                    >
                      <path d="M4 7l5 5 5-5"/>
                    </motion.svg>
                  </button>
                  <motion.div initial={false} animate={{ height: openFaq === i ? "auto" : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <p className="px-6 py-4 text-[var(--c-muted)] text-sm leading-relaxed">{faq.resposta}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 bg-[var(--c-bg-dark)] text-white text-center">
          <motion.div variants={stagger.container} initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-light mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Pronto para começar?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 mb-10 text-lg leading-relaxed">
              Uma conversa inicial, sem compromisso. Vamos ver juntos se faz sentido.
            </motion.p>
            <motion.div variants={fadeUp}>
              <AnimatedCTA href={contato.whatsappLink} label={hero.cta} sublabel={hero.ctaSub} />
            </motion.div>
          </motion.div>
        </section>
      </main>

      <EthicalFooter />
    </>
  );
}

