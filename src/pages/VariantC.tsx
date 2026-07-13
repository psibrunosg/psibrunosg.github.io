import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import {
  abordagens,
  contato,
  dores,
  faqs,
  processo,
  publicos,
  sobre,
} from "@/content/copy";
import { posts } from "@/content/posts-loader";

const navItems = [
  { label: "Atendimento", href: "#atendimento" },
  { label: "Como funciona", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
  { label: "Conteúdos", href: "#conteudos" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-5 text-[0.68rem] font-bold uppercase tracking-[0.24em] ${
        light ? "text-[#c8d7d0]" : "text-[#8d432f]"
      }`}
    >
      {children}
    </p>
  );
}

export default function VariantC() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f4f1e9] text-[#17231e]">
      <SkipLink />

      <header className="sticky top-0 z-50 border-b border-[#17231e]/15 bg-[#f4f1e9]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link to="/" className="group flex min-h-11 items-center gap-3" aria-label="Bruno Souza, página inicial">
            <span
              className="text-xl leading-none text-[#17231e]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bruno Souza
            </span>
            <span className="hidden border-l border-[#17231e]/25 pl-3 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#5f6963] sm:block">
              Psicologia clínica
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#435049] transition-colors duration-200 hover:text-[#8d432f]"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/psicoeducacao"
              className="flex min-h-11 items-center px-3 text-sm font-semibold text-[#435049] transition-colors duration-200 hover:text-[#8d432f]"
            >
              Psicoeducação
            </Link>
            <a
              href={contato.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 inline-flex min-h-11 items-center gap-2 bg-[#17231e] px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#8d432f]"
            >
              Agendar conversa
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            className="flex size-12 items-center justify-center border border-[#17231e]/25 lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="menu-mobile"
              aria-label="Navegação móvel"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="border-t border-[#17231e]/15 bg-[#f4f1e9] px-5 pb-6 pt-3 lg:hidden"
            >
              <div className="mx-auto flex max-w-[1440px] flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center border-b border-[#17231e]/10 text-base font-semibold"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/psicoeducacao"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center border-b border-[#17231e]/10 text-base font-semibold"
                >
                  Psicoeducação
                </Link>
                <a
                  href={contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 bg-[#17231e] px-5 font-bold text-white"
                >
                  Agendar conversa
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1440px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex items-center px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="max-w-[760px]">
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4 }}
                className="mb-7 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#8d432f]"
              >
                Psicólogo clínico · {contato.crp}
              </motion.p>
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.55, delay: 0.06 }}
                className="max-w-[780px] text-[clamp(3.4rem,7.5vw,7.4rem)] font-light leading-[0.9] tracking-[-0.055em] text-[#17231e]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Você não precisa chegar com tudo organizado.
              </motion.h1>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.14 }}
                className="mt-8 max-w-xl text-lg leading-relaxed text-[#536059] sm:text-xl"
              >
                A terapia pode começar justamente no ponto em que está difícil nomear o que você sente. O primeiro encontro serve para entender a sua demanda e ver se esse trabalho faz sentido para você.
              </motion.p>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: 0.2 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <a
                  href={contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#8d432f] px-6 font-bold text-white transition-colors duration-200 hover:bg-[#713323]"
                >
                  Falar comigo pelo WhatsApp
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <Link
                  to="/como-funciona"
                  className="inline-flex min-h-12 items-center justify-center gap-2 px-5 font-bold text-[#17231e] underline decoration-[#8d432f]/40 underline-offset-4 transition-colors hover:text-[#8d432f]"
                >
                  Entenda como funciona
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="relative min-h-[72svh] overflow-hidden bg-[#0f2b35] lg:min-h-full">
            <motion.img
              src="/img/foto.webp"
              width="843"
              height="1264"
              alt="Bruno Souza em seu espaço de trabalho, escrevendo em um tablet"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-top"
              initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: [1.025, 1.05], y: [0, -8] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.55 },
                      scale: { duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                      y: { duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    }
              }
            />
            <div className="absolute inset-x-0 bottom-0 bg-[#0b222a]/92 px-6 py-5 text-white sm:px-8">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
                    Bruno Souza
                  </p>
                  <p className="mt-1 text-xs tracking-wide text-white/70">Psicólogo · {contato.crp}</p>
                </div>
                <p className="max-w-[14rem] text-right text-xs leading-relaxed text-white/70">
                  Presencial em Pelotas e online para todo o Brasil
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#17231e] text-white" aria-label="Informações do atendimento">
          <div className="mx-auto grid max-w-[1440px] divide-y divide-white/15 px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-12">
            {["Registro profissional ativo", "TCC e Terapia do Esquema", "Atendimento presencial e online"].map((item) => (
              <p key={item} className="flex min-h-24 items-center gap-3 py-5 text-sm font-semibold md:px-7 first:md:pl-0">
                <Check size={17} className="shrink-0 text-[#d58b6f]" aria-hidden="true" />
                {item}
              </p>
            ))}
          </div>
        </section>

        <section id="atendimento" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
            <Reveal>
              <Eyebrow>Quando procurar terapia</Eyebrow>
              <h2
                className="max-w-lg text-4xl font-light leading-[1.02] tracking-[-0.035em] sm:text-6xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tem coisas que cansam antes mesmo de virar palavras.
              </h2>
              <p className="mt-7 max-w-md text-base leading-relaxed text-[#5f6963]">
                Você não precisa saber explicar tudo antes de buscar ajuda. Reconhecer que algo não vai bem já é informação suficiente para começar uma conversa.
              </p>
            </Reveal>

            <div>
              <span id="ansiedade-pelotas" className="block scroll-mt-24" aria-hidden="true" />
              <span id="esgotamento-burnout" className="block scroll-mt-24" aria-hidden="true" />
              {dores.map((dor, index) => (
                <Reveal key={dor.id} delay={index * 0.05}>
                  <article className="grid gap-4 border-t border-[#17231e]/25 py-7 sm:grid-cols-[3rem_1fr] sm:gap-7 sm:py-9">
                    <span className="text-xs font-bold tracking-[0.18em] text-[#8d432f]">0{index + 1}</span>
                    <div>
                      <h3 className="text-2xl font-normal leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                        {dor.titulo}
                      </h3>
                      <p className="mt-3 max-w-2xl leading-relaxed text-[#5f6963]">{dor.descricao}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#17231e]/15 bg-[#fcfbf7] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="max-w-2xl">
              <Eyebrow>Para quem é o atendimento</Eyebrow>
              <h2 className="text-4xl font-light tracking-[-0.035em] sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                O contexto muda. A escuta também precisa mudar.
              </h2>
            </Reveal>
            <div className="mt-16 grid border-t border-[#17231e]/25 md:grid-cols-3 md:divide-x md:divide-[#17231e]/20">
              {publicos.map((publico, index) => (
                <Reveal key={publico.id} delay={index * 0.05} className="h-full">
                  <article className="h-full border-b border-[#17231e]/20 py-8 md:border-b-0 md:px-8 first:md:pl-0 last:md:pr-0">
                    <p className="mb-8 text-xs font-bold tracking-[0.18em] text-[#8d432f]">0{index + 1}</p>
                    <h3 className="text-3xl font-normal" style={{ fontFamily: "var(--font-display)" }}>
                      {publico.titulo}
                    </h3>
                    <p className="mt-5 leading-relaxed text-[#5f6963]">{publico.descricao}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="processo" className="scroll-mt-24 bg-[#0e2b31] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <Eyebrow light>Como funciona</Eyebrow>
                <h2 className="text-4xl font-light tracking-[-0.035em] sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                  Um processo com direção, sem respostas prontas.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-white/70 lg:justify-self-end lg:text-lg">
                A terapia tem estrutura, mas não segue uma fórmula. As decisões são construídas a partir da sua história, dos seus objetivos e do que aparece ao longo do processo.
              </p>
            </Reveal>

            <div className="mt-16 grid border-t border-white/25 md:grid-cols-3 md:divide-x md:divide-white/20">
              {processo.map((step, index) => (
                <Reveal key={step.numero} delay={index * 0.06} className="h-full">
                  <article className="h-full border-b border-white/20 py-9 md:border-b-0 md:px-8 first:md:pl-0 last:md:pr-0">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#d58b6f]">{step.numero}</span>
                    <h3 className="mt-10 text-3xl font-light" style={{ fontFamily: "var(--font-display)" }}>
                      {step.titulo}
                    </h3>
                    <p className="mt-5 leading-relaxed text-white/68">{step.descricao}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
            <Reveal>
              <Eyebrow>{sobre.titulo}</Eyebrow>
              <div className="relative aspect-square max-w-md overflow-hidden border border-[#17231e]/20 bg-[#a8c3b4] p-10">
                <img
                  src="/img/lobo.svg"
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="h-full w-full object-contain opacity-75 mix-blend-multiply"
                />
                <p className="absolute bottom-7 left-7 right-7 border-t border-[#17231e]/30 pt-4 text-xs font-bold uppercase tracking-[0.16em]">
                  Clínica BS · Saúde &amp; Bem-estar
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="text-4xl font-light tracking-[-0.035em] sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                {sobre.subtitulo}
              </h2>
              <div className="mt-9 max-w-3xl space-y-5 text-lg leading-relaxed text-[#536059]">
                <p>{sobre.bio}</p>
                <p>{sobre.complemento}</p>
              </div>
              <ul className="mt-10 grid gap-3 border-t border-[#17231e]/20 pt-7 sm:grid-cols-2">
                {sobre.formacao.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-semibold text-[#344139]">
                    <Check size={17} className="mt-0.5 shrink-0 text-[#8d432f]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
                <li className="flex gap-3 text-sm font-semibold text-[#344139]">
                  <Check size={17} className="mt-0.5 shrink-0 text-[#8d432f]" aria-hidden="true" />
                  Registro profissional {contato.crp}
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#c8d5cd] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="max-w-3xl">
              <Eyebrow>Abordagens clínicas</Eyebrow>
              <h2 className="text-4xl font-light tracking-[-0.035em] sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                Ciência ajuda a orientar. A história de cada pessoa define o caminho.
              </h2>
            </Reveal>
            <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
              {abordagens.map((abordagem, index) => (
                <Reveal key={abordagem.id} delay={index * 0.06}>
                  <article className="border-t border-[#17231e]/35 pt-7">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8d432f]">{abordagem.sigla}</p>
                    <h3 className="mt-5 text-3xl font-normal leading-tight sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                      {abordagem.nome}
                    </h3>
                    <p className="mt-6 leading-relaxed text-[#36453d]">{abordagem.descricao}</p>
                    <p className="mt-4 text-sm leading-relaxed text-[#536059]">{abordagem.detalhe}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="conteudos" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <Reveal className="flex flex-col gap-7 border-b border-[#17231e]/25 pb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Conteúdo útil</Eyebrow>
                <h2 className="text-4xl font-light tracking-[-0.035em] sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                  Para entender melhor o que você vive.
                </h2>
              </div>
              <Link to="/blog" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-bold text-[#8d432f]">
                Ver todos os textos
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </Reveal>

            <div className="grid md:grid-cols-3">
              {posts.slice(0, 3).map((post, index) => (
                <Reveal key={post.slug} delay={index * 0.05} className="h-full">
                  <article className="group h-full border-b border-[#17231e]/20 py-8 md:border-r md:px-7 first:md:pl-0 last:md:border-r-0 last:md:pr-0">
                    <Link to={`/blog/${post.slug}`} className="flex h-full min-h-60 flex-col">
                      <div className="flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8d432f]">
                        <span>{post.categoria}</span>
                        <span className="flex items-center gap-1.5 text-[#5f6963]">
                          <Clock size={13} aria-hidden="true" />
                          {post.tempoLeitura}
                        </span>
                      </div>
                      <h3 className="mt-9 text-2xl font-normal leading-tight transition-colors group-hover:text-[#8d432f]" style={{ fontFamily: "var(--font-display)" }}>
                        {post.titulo}
                      </h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-[#5f6963]">{post.resumo}</p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-bold">
                        Ler texto
                        <ArrowUpRight size={15} aria-hidden="true" />
                      </span>
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#17231e]/15 bg-[#fcfbf7] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
          <div className="mx-auto grid max-w-[1120px] gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <Reveal>
              <Eyebrow>Antes de começar</Eyebrow>
              <h2 className="text-4xl font-light tracking-[-0.035em] sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                Perguntas que costumam aparecer no primeiro contato.
              </h2>
            </Reveal>
            <div>
              {faqs.slice(0, 5).map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.pergunta} className="border-t border-[#17231e]/25 last:border-b">
                    <button
                      type="button"
                      className="flex min-h-16 w-full items-center justify-between gap-5 py-4 text-left font-bold"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${index}`}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span>{faq.pergunta}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
                        <ChevronDown size={19} aria-hidden="true" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-${index}`}
                          initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.24 }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-6 pr-8 leading-relaxed text-[#5f6963]">{faq.resposta}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#8d432f] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12">
          <Reveal className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <Eyebrow light>Primeiro contato</Eyebrow>
              <h2 className="max-w-4xl text-5xl font-light leading-[0.98] tracking-[-0.04em] sm:text-7xl" style={{ fontFamily: "var(--font-display)" }}>
                Podemos começar por uma conversa simples.
              </h2>
            </div>
            <div className="lg:justify-self-end">
              <p className="mb-7 max-w-md leading-relaxed text-white/78">
                Você me conta, do seu jeito, o que motivou a procura. Eu explico como trabalho e verificamos juntos se o atendimento faz sentido neste momento.
              </p>
              <a
                href={contato.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-6 font-bold text-[#713323] transition-colors hover:bg-[#f4f1e9]"
              >
                Enviar uma mensagem
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <EthicalFooter />
    </div>
  );
}
