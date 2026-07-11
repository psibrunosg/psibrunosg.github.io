import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Sprout, Heart } from "lucide-react";
import { HeroParallax } from "@/components/ui/HeroParallax";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { InfiniteMovingCards } from "@/components/ui/InfiniteMovingCards";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { FloatingBlobs } from "@/components/ui/FloatingBlobs";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Navbar } from "@/components/ui/Navbar";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import {
  hero, manifesto, sobre, publicos, dores, processo,
  abordagens, faqs, contato, principiosEticos
} from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { posts } from "@/content/posts-loader";
import { Clock, ArrowRight } from "lucide-react";

const navItems = [
  { label: "Início",      href: "#hero" },
  { label: "Sobre",       href: "#sobre" },
  { label: "Como ajudo",  href: "#ajudo" },
  { label: "Processo",    href: "#processo" },
  { label: "Abordagens",  href: "#abordagens" },
  { label: "FAQ",         href: "#faq" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Psicoeducação", href: "/psicoeducacao" },
  { label: "Exercícios",  href: "/exercicios" },
  { label: "Blog",        href: "/blog" },
  { label: "Paciente",    href: "/paciente" },
];

const desktopNavItems = [
  { label: "Como funciona",   href: "/como-funciona" },
  { label: "Psicoeducação",   href: "/psicoeducacao" },
  { label: "Exercícios",      href: "/exercicios" },
  { label: "Blog",            href: "/blog" },
  { label: "FAQ",             href: "/faq" },
  { label: "Área do Paciente", href: "/paciente" },
];

export default function VariantC() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <Navbar items={desktopNavItems} whatsappLink={contato.whatsappLink} />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main">
        {/* HERO PARALLAX */}
        <section id="hero">
          <HeroParallax foto={contato.foto}>
            <div className="text-center px-6 max-w-4xl mx-auto">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs tracking-[0.3em] uppercase text-[var(--c-warm)] mb-2"
              >
                {contato.crp} · Psicólogo
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs tracking-[0.15em] text-white/80 mb-8"
              >
                {contato.modalidade}
              </motion.p>

              <h1
                className="text-5xl md:text-7xl font-light leading-tight mb-8 text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <TextGenerateEffect text={hero.headline} delay={0.7} mode="chars" />
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-lg text-white/85 max-w-xl mx-auto mb-12 leading-relaxed"
              >
                {hero.subline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <AnimatedCTA href={contato.whatsappLink} label={hero.cta} />
              </motion.div>
            </div>
          </HeroParallax>
        </section>

        {/* MANIFESTO */}
        <section className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-2xl md:text-4xl font-light text-[var(--c-text)] leading-relaxed"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;{manifesto.quote}&rdquo;
            </motion.blockquote>
          </div>
        </section>

        <WaveDivider from="var(--c-bg)" to="var(--c-surface)" />

        {/* PRINCÍPIOS ÉTICOS — INFINITE SCROLL */}
        <section className="py-12 bg-[var(--c-surface)]" aria-labelledby="principios-heading">
          <h2 id="principios-heading" className="sr-only">Princípios éticos</h2>
          <InfiniteMovingCards items={principiosEticos} speed="slow" />
        </section>

        <WaveDivider from="var(--c-surface)" to="var(--c-bg)" flip />

        {/* SOBRE */}
        <section id="sobre" className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Foto */}
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-xl">
                  <img
                    src={contato.foto}
                    alt="Bruno Souza, Psicólogo"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                {/* CRP badge sobre a foto */}
                <div className="absolute -bottom-4 -right-4 bg-[var(--c-accent)] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg tracking-widest uppercase">
                  {contato.crp}
                </div>
              </motion.div>

              {/* Texto */}
              <motion.div
                variants={stagger.container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] mb-2 font-semibold">
                  {sobre.titulo}
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {sobre.subtitulo}
                </motion.h2>
                <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed mb-4">
                  {sobre.bio}
                </motion.p>
                <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed mb-8">
                  {sobre.complemento}
                </motion.p>
                <motion.ul variants={fadeUp} className="space-y-2">
                  {sobre.formacao.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--c-muted)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </div>
        </section>

        <WaveDivider from="var(--c-bg)" to="var(--c-surface)" />

        {/* PARA QUEM — SEGMENTAÇÃO A1 */}
        <section className="py-20 px-6 bg-[var(--c-surface)] relative overflow-hidden">
          <FloatingBlobs />
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Para quem é a terapia?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[var(--c-muted)] text-center mb-14 max-w-xl mx-auto"
            >
              Cada fase da vida tem seus desafios. Atendo quem está passando por momentos difíceis, seja qual for o seu momento.
            </motion.p>
            <div className="grid md:grid-cols-3 gap-6">
              {publicos.map((p, i) => (
                <motion.div
                  key={p.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border border-[var(--c-border)] p-6 bg-[var(--c-bg)] hover:border-[var(--c-accent)]/50 transition-colors"
                >
                  {p.icon === "Leaf" && <Leaf size={28} className="mb-4 text-[var(--c-accent)]" aria-hidden="true" />}
                  {p.icon === "Sprout" && <Sprout size={28} className="mb-4 text-[var(--c-accent)]" aria-hidden="true" />}
                  {p.icon === "Heart" && <Heart size={28} className="mb-4 text-[var(--c-accent)]" aria-hidden="true" />}
                  <h3 className="text-lg font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    {p.titulo}
                  </h3>
                  <p className="text-[var(--c-muted)] text-sm leading-relaxed">{p.descricao}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider from="var(--c-surface)" to="var(--c-bg)" flip />

        {/* SEO anchors */}
        <span id="ansiedade-pelotas" className="block" style={{ scrollMarginTop: "80px" }} aria-hidden="true" />
        <span id="esgotamento-burnout" className="block" aria-hidden="true" />

        {/* COMO AJUDO — BENTO */}
        <section id="ajudo" className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Você se reconhece em algum desses momentos?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[var(--c-muted)] text-center mb-12 max-w-xl mx-auto"
            >
              Se sim, a terapia pode te ajudar a entender o que está acontecendo — e a encontrar um caminho diferente.
            </motion.p>
            <BentoGrid items={dores.map((d, i) => ({ ...d, large: i === 2 }))} />
          </div>
        </section>

        <WaveDivider from="var(--c-bg)" to="var(--c-surface)" />

        {/* PROCESSO */}
        <section id="processo" className="py-24 px-6 bg-[var(--c-surface)]">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Como é o processo terapêutico?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[var(--c-muted)] text-center mb-16 max-w-xl mx-auto"
            >
              Cada processo é único. Existe uma estrutura que nos orienta ao longo do caminho.
            </motion.p>
            <div className="space-y-6">
              {processo.map((step, i) => (
                <motion.div
                  key={step.numero}
                  initial={{ opacity: 0, x: -32 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="rounded-2xl border border-[var(--c-border)] p-8 bg-[var(--c-bg)] flex gap-6 items-start"
                >
                  <span
                    className="text-5xl font-light text-[var(--c-accent)] opacity-30 flex-shrink-0 leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                    aria-hidden="true"
                  >
                    {step.numero}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                      {step.titulo}
                    </h3>
                    <p className="text-[var(--c-muted)] leading-relaxed">{step.descricao}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider from="var(--c-surface)" to="var(--c-bg)" flip />

        {/* ABORDAGENS */}
        <section id="abordagens" className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Como eu trabalho
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[var(--c-muted)] text-center mb-12 max-w-xl mx-auto"
            >
              Utilizo abordagens com evidências científicas sólidas, adaptadas à sua história e ao seu momento.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
              {abordagens.map((ab, i) => (
                <motion.div
                  key={ab.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="rounded-2xl border-2 border-[var(--c-accent)]/20 hover:border-[var(--c-accent)]/60 transition-colors p-8 bg-[var(--c-surface)]"
                >
                  <span className="text-xs tracking-widest uppercase text-[var(--c-accent)] font-semibold">{ab.sigla}</span>
                  <h3 className="text-xl font-semibold text-[var(--c-text)] mt-1 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    {ab.nome}
                  </h3>
                  <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-3">{ab.descricao}</p>
                  <p className="text-[var(--c-muted)] text-sm leading-relaxed">{ab.detalhe}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <WaveDivider from="var(--c-bg)" to="var(--c-surface)" />

        {/* FAQ */}
        <section id="faq" className="py-24 px-6 bg-[var(--c-surface)]">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl font-semibold text-[var(--c-text)] mb-4 text-center"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Perguntas frequentes
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[var(--c-muted)] text-center mb-12"
            >
              Dúvidas comuns antes de começar, respondidas com clareza.
            </motion.p>
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
                    className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-[var(--c-bg)] transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-medium text-[var(--c-text)] text-sm">{faq.pergunta}</span>
                    <motion.svg
                      width="18" height="18" viewBox="0 0 18 18"
                      fill="none" stroke="var(--c-accent)" strokeWidth="2"
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      aria-hidden="true"
                    >
                      <path d="M4 7l5 5 5-5"/>
                    </motion.svg>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-4 text-[var(--c-muted)] text-sm leading-relaxed">{faq.resposta}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        <WaveDivider from="var(--c-surface)" to="var(--c-bg)" flip />

        {/* BLOG PREVIEW */}
        <section className="py-24 px-6 bg-[var(--c-bg)]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={stagger.container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
                Conteudo educativo
              </motion.p>
              <div className="flex items-end justify-between mb-12">
                <motion.h2
                  variants={fadeUp}
                  className="text-3xl md:text-4xl font-semibold text-[var(--c-text)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Do blog
                </motion.h2>
                <motion.div variants={fadeUp}>
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--c-accent)] font-medium hover:underline"
                  >
                    Ver todos <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                {posts.slice(0, 3).map((post, i) => (
                  <motion.article
                    key={post.slug}
                    variants={fadeUp}
                    custom={i}
                    className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent)]/50 transition-colors"
                  >
                    <Link to={"/blog/" + post.slug} className="block p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold tracking-widest uppercase text-[var(--c-accent)]">
                          {post.categoria}
                        </span>
                        <span className="text-[var(--c-border)]">·</span>
                        <span className="flex items-center gap-1 text-xs text-[var(--c-muted)]">
                          <Clock size={12} aria-hidden="true" />
                          {post.tempoLeitura}
                        </span>
                      </div>
                      <h3
                        className="text-base font-semibold text-[var(--c-text)] mb-2 group-hover:text-[var(--c-accent)] transition-colors leading-snug"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {post.titulo}
                      </h3>
                      <p className="text-[var(--c-muted)] text-xs leading-relaxed line-clamp-3">
                        {post.resumo}
                      </p>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
        <WaveDivider from="var(--c-bg)" to="var(--c-bg-dark)" />

        {/* CTA FINAL */}
        <section className="py-24 px-6 bg-[var(--c-bg-dark)] text-white text-center">
          <motion.div
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-warm)] mb-4">
              {contato.modalidade}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-5xl font-light mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pronto para dar o primeiro passo?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/80 mb-10 leading-relaxed">
              Uma conversa inicial, sem compromisso. Vamos ver juntos se faz sentido.
            </motion.p>
            <motion.div variants={fadeUp}>
              <AnimatedCTA href={contato.whatsappLink} label={hero.cta} sublabel={hero.ctaSub} sublabelClassName="text-white/50" />
            </motion.div>
          </motion.div>
        </section>
      </main>

      <EthicalFooter />
    </>
  );
}
