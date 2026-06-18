import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { Spotlight } from "@/components/ui/Spotlight";
import { CardHoverEffect } from "@/components/ui/CardHoverEffect";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { MagneticCursor } from "@/components/ui/MagneticCursor";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { hero, manifesto, dores, processo, abordagens, faqs, contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { useState } from "react";

const navItems = [
  { label: "Início", href: "#hero" },
  { label: "Como ajudo", href: "#ajudo" },
  { label: "Processo", href: "#processo" },
  { label: "Abordagens", href: "#abordagens" },
  { label: "FAQ", href: "#faq" },
  { label: "Contato", href: contato.whatsappLink },
];

export default function VariantA() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "a");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SkipLink />
      <MagneticCursor />
      <FloatingNav items={navItems} crp={contato.crp} />
      <WhatsAppFloat />

      <main id="main">
        {/* HERO */}
        <section id="hero">
          <AuroraBackground
            variant="a"
            className="min-h-screen flex items-center justify-center relative bg-[var(--c-bg-dark)] text-white"
          >
            <Spotlight />
            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] mb-6"
              >
                {contato.crp} · Psicólogo
              </motion.p>

              <h1
                className="text-5xl md:text-7xl font-light leading-tight mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <TextGenerateEffect
                  text={hero.headline}
                  delay={0.4}
                  mode="words"
                  className="text-white"
                />
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="text-lg text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {hero.subline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
              >
                <AnimatedCTA
                  href={contato.whatsappLink}
                  label={hero.cta}
                  sublabel={hero.ctaSub}
                />
              </motion.div>
            </div>

            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </motion.div>
          </AuroraBackground>
        </section>

        {/* MANIFESTO */}
        <section className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.blockquote
              initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl md:text-4xl font-light text-[var(--c-text)] leading-relaxed"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;{manifesto.quote}&rdquo;
            </motion.blockquote>
          </div>
        </section>

        {/* COMO AJUDO */}
        <section id="ajudo" className="py-24 px-6 bg-[var(--c-surface)]">
          <div className="max-w-4xl mx-auto">
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
            <CardHoverEffect
              items={dores}
              className="grid-cols-1 md:grid-cols-3"
            />
          </div>
        </section>

        {/* PROCESSO */}
        <section id="processo" className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-16 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Como funciona o processo
            </motion.h2>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--c-border)] hidden md:block" aria-hidden="true" />
              <motion.div
                className="absolute left-8 top-0 w-px bg-[var(--c-accent)] hidden md:block"
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                aria-hidden="true"
              />
              <div className="space-y-16">
                {processo.map((step, i) => (
                  <motion.div
                    key={step.numero}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    className="flex gap-8 items-start md:pl-20 relative"
                  >
                    <div
                      className="hidden md:flex absolute left-4 w-8 h-8 rounded-full border-2 border-[var(--c-accent)] bg-[var(--c-bg)] items-center justify-center text-xs font-bold text-[var(--c-accent)]"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <div>
                      <span className="text-4xl font-light text-[var(--c-accent)] opacity-30 block mb-2" style={{ fontFamily: "var(--font-display)" }}>
                        {step.numero}
                      </span>
                      <h3 className="text-xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        {step.titulo}
                      </h3>
                      <p className="text-[var(--c-muted)] leading-relaxed">{step.descricao}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ABORDAGENS */}
        <section id="abordagens" className="py-24 px-6 bg-[var(--c-surface)]">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-12 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Abordagens terapêuticas
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {abordagens.map((ab, i) => (
                <motion.div
                  key={ab.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border border-[var(--c-border)] p-8 bg-[var(--c-bg)] group hover:border-[var(--c-warm)] transition-colors"
                >
                  <span className="text-xs tracking-widest uppercase text-[var(--c-warm)] font-semibold">{ab.sigla}</span>
                  <h3 className="text-xl font-semibold text-[var(--c-text)] mt-1 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    {ab.nome}
                  </h3>
                  <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-4">{ab.descricao}</p>
                  <p className="text-[var(--c-muted)] text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {ab.detalhe}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-12 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Perguntas frequentes
            </motion.h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="border border-[var(--c-border)] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-[var(--c-surface)] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-medium text-[var(--c-text)]">{faq.pergunta}</span>
                    <motion.svg
                      width="20" height="20" viewBox="0 0 20 20" fill="none"
                      stroke="var(--c-accent)" strokeWidth="2"
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      aria-hidden="true"
                    >
                      <path d="M5 7.5l5 5 5-5"/>
                    </motion.svg>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-4 text-[var(--c-muted)] text-sm leading-relaxed">{faq.resposta}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 bg-[var(--c-bg-dark)] text-white text-center">
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-light mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pronto para começar?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 mb-10 text-lg leading-relaxed">
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

