import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CirclePause,
  CirclePlay,
  MapPin,
  Menu,
  MessageCircle,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import {
  abordagens,
  contato,
  dores,
  faqs,
  processo,
  publicos,
  sobre,
} from "@/content/copy";

const navItems = [
  { label: "Para você", href: "#para-voce" },
  { label: "Meu trabalho", href: "#trabalho" },
  { label: "Sobre", href: "#sobre" },
  { label: "Dúvidas", href: "#faq" },
];

const linksDeRecursos = [
  { label: "Exercícios", href: "/exercicios" },
  { label: "Psicoeducação", href: "/psicoeducacao" },
  { label: "Área do paciente e escalas", href: "/paciente" },
  { label: "Blog", href: "/blog" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Perguntas frequentes", href: "/faq" },
];

const recursos = [
  {
    href: "/como-funciona",
    index: "01",
    title: "Como funciona a terapia",
    text: "Primeira sessão, frequência, sigilo e os combinados do processo explicados sem rodeios.",
  },
  {
    href: "/exercicios",
    index: "02",
    title: "Exercícios para praticar",
    text: "Práticas guiadas para observar pensamentos, emoções e padrões também fora da sessão.",
  },
  {
    href: "/psicoeducacao",
    index: "03",
    title: "Entenda o que você vive",
    text: "Materiais sobre ansiedade, sono, esquemas e regulação emocional para consultar no seu tempo.",
  },
  {
    href: "/paciente",
    index: "04",
    title: "Área do paciente e escalas",
    text: "Questionários e instrumentos de acompanhamento organizados em um só lugar.",
  },
  {
    href: "/blog",
    index: "05",
    title: "Leituras para ir além",
    text: "Textos que aproximam psicologia, cotidiano e ciência sem transformar sofrimento em fórmula pronta.",
  },
  {
    href: "/faq",
    index: "06",
    title: "Perguntas frequentes",
    text: "Respostas diretas sobre atendimento, horários, modalidade online e primeiros passos.",
  },
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
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0 : 0.58,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p
      className={`mb-5 flex items-center gap-3 text-[0.7rem] font-extrabold uppercase tracking-[0.22em] ${
        light ? "text-white/62" : "text-[var(--c-accent)]"
      }`}
    >
      <span className={`h-px w-8 ${light ? "bg-white/35" : "bg-[var(--c-warm)]"}`} />
      {children}
    </p>
  );
}

export default function VariantC() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 52]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.045]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Bruno de Souza Gonçalves | Psicólogo em Pelotas e online";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setVideoPlaying(true);
      } catch {
        setVideoPlaying(false);
      }
      return;
    }

    video.pause();
    setVideoPlaying(false);
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--c-bg)] text-[var(--c-text)]">
      <SkipLink />
      <WhatsAppFloat />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[color:color-mix(in_oklab,var(--c-deep)_14%,transparent)] bg-[color:color-mix(in_oklab,var(--c-bg)_90%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            to="/"
            className="group flex min-h-11 items-center gap-3"
            aria-label="Bruno de Souza Gonçalves, página inicial"
          >
            <span
              className="text-[1.08rem] font-semibold leading-none tracking-[-0.02em] text-[var(--c-deep)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bruno de Souza Gonçalves
            </span>
            <span className="hidden border-l border-[var(--c-border)] pl-3 text-[0.63rem] font-extrabold uppercase tracking-[0.16em] text-[var(--c-muted)] sm:block">
              Psicólogo · CRP 07/44472
            </span>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative min-h-11 content-center text-sm font-bold text-[var(--c-muted)] after:absolute after:bottom-2 after:left-0 after:h-px after:w-0 after:bg-[var(--c-warm)] after:transition-[width] after:duration-200 hover:text-[var(--c-deep)] hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
            <details className="group relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-bold text-[var(--c-muted)] marker:content-none hover:text-[var(--c-deep)]">
                Recursos
                <ChevronDown size={15} className="transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="absolute right-0 top-[calc(100%+0.5rem)] w-72 border border-[var(--c-border)] bg-[var(--c-bg)] p-2 shadow-[0_22px_55px_-28px_rgba(31,46,37,0.55)]">
                {linksDeRecursos.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex min-h-11 items-center justify-between px-3 text-sm font-bold text-[var(--c-muted)] transition-colors hover:bg-[var(--c-warm-lt)] hover:text-[var(--c-deep)]"
                  >
                    {item.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </details>
            <a
              href={contato.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 border border-[var(--c-deep)] bg-[var(--c-deep)] px-5 text-sm font-extrabold text-white transition-colors duration-200 hover:bg-[var(--c-warm)] hover:border-[var(--c-warm)]"
            >
              Conversar agora
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            className="flex size-11 items-center justify-center border border-[var(--c-deep)] text-[var(--c-deep)] xl:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="menu-mobile"
              aria-label="Navegação móvel"
              initial={reduceMotion ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="border-t border-[var(--c-border)] bg-[var(--c-bg)] px-5 pb-6 pt-3 xl:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-[var(--c-border)] px-1 py-4 text-lg font-bold text-[var(--c-deep)]"
                  >
                    {item.label}
                  </a>
                ))}
                <p className="px-1 pb-1 pt-5 text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-[var(--c-accent)]">
                  Recursos
                </p>
                {linksDeRecursos.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center justify-between border-b border-[var(--c-border)] px-1 text-base font-bold text-[var(--c-deep)]"
                  >
                    {item.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
                <a
                  href={contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--c-deep)] px-5 font-extrabold text-white"
                >
                  Conversar no WhatsApp
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main">
        <section
          ref={heroRef}
          className="relative mx-auto min-h-dvh max-w-[90rem] px-5 pb-10 pt-28 sm:px-8 lg:px-12 lg:pb-14 lg:pt-32"
        >
          <div className="pointer-events-none absolute right-[-5vw] top-[16vh] hidden select-none text-[clamp(8rem,18vw,18rem)] font-semibold leading-none tracking-[-0.08em] text-[color:color-mix(in_oklab,var(--c-moss)_18%,transparent)] xl:block" aria-hidden="true" style={{ fontFamily: "var(--font-display)" }}>
            aqui
          </div>

          <div className="grid min-h-[calc(100dvh-10rem)] items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-w-[48rem]"
            >
              <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-extrabold uppercase tracking-[0.17em] text-[var(--c-accent)]">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={15} aria-hidden="true" />
                  Registro ativo · {contato.crp}
                </span>
                <span className="h-px w-8 bg-[var(--c-warm)]" aria-hidden="true" />
                <span>Pelotas e online</span>
              </div>

              <h1
                className="max-w-[11ch] text-[clamp(3.65rem,7.6vw,8.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-[var(--c-deep)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Você não precisa entender tudo antes de começar.
              </h1>

              <div className="mt-8 grid gap-6 border-l-2 border-[var(--c-warm)] pl-5 sm:grid-cols-[1fr_auto] sm:items-end sm:pl-7">
                <p className="max-w-[39rem] text-lg leading-[1.7] text-[var(--c-muted)] sm:text-xl">
                  Quando a ansiedade aperta, o cansaço se acumula ou os mesmos padrões voltam,
                  organizar tudo sozinho pode ficar difícil. Na terapia, começamos pelo que existe
                  hoje e construímos o resto juntos.
                </p>
                <a
                  href="#para-voce"
                  aria-label="Conhecer o atendimento"
                  className="hidden size-14 items-center justify-center border border-[var(--c-deep)] text-[var(--c-deep)] transition-colors duration-200 hover:bg-[var(--c-deep)] hover:text-white sm:flex"
                >
                  <ArrowDown size={20} aria-hidden="true" />
                </a>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-13 items-center justify-center gap-3 bg-[var(--c-deep)] px-7 text-sm font-extrabold text-white transition-colors duration-200 hover:bg-[var(--c-warm)]"
                >
                  Me conte o que está acontecendo
                  <MessageCircle size={18} aria-hidden="true" />
                </a>
                <Link
                  to="/como-funciona"
                  className="inline-flex min-h-13 items-center justify-center gap-2 border border-[var(--c-deep)] px-6 text-sm font-extrabold text-[var(--c-deep)] transition-colors duration-200 hover:bg-[var(--c-deep)] hover:text-white"
                >
                  Entender como trabalho
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>

            <motion.figure
              style={reduceMotion ? undefined : { y: portraitY, scale: portraitScale }}
              className="relative z-10 mx-auto w-full max-w-[36rem] lg:ml-auto"
            >
              <div className="absolute -left-4 top-10 z-20 border border-[var(--c-deep)] bg-[var(--c-bg)] px-4 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-[var(--c-deep)] sm:-left-8">
                Presença antes de pressa
              </div>
              <div className="relative overflow-hidden bg-[var(--c-deep)] [clip-path:polygon(8%_0,100%_0,100%_92%,84%_100%,0_100%,0_12%)]">
                <img
                  src="/img/foto.webp"
                  width="843"
                  height="1264"
                  alt="Bruno de Souza Gonçalves, psicólogo"
                  fetchPriority="high"
                  className="aspect-[0.78] w-full object-cover object-top contrast-[1.03] saturate-[0.88]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#172c24] via-[#172c24]/72 to-transparent px-6 pb-8 pt-24 text-white sm:px-8">
                  <p className="text-3xl font-medium tracking-[-0.035em]" style={{ fontFamily: "var(--font-display)" }}>
                    Bruno de Souza Gonçalves
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.12em] text-white/72">
                    Psicólogo clínico · CRP 07/44472
                  </p>
                </div>
              </div>
              <figcaption className="ml-auto mt-4 flex max-w-[24rem] items-start gap-3 border-t border-[var(--c-border)] pt-4 text-sm leading-relaxed text-[var(--c-muted)]">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--c-warm)]" aria-hidden="true" />
                Presencial em Pelotas, RS, e online para todo o Brasil.
              </figcaption>
            </motion.figure>
          </div>
        </section>

        <section className="border-y border-[var(--c-deep)] bg-[var(--c-deep)] text-white" aria-label="Informações do atendimento">
          <div className="mx-auto grid max-w-[90rem] sm:grid-cols-3">
            {[
              ["Atendimento", "Adultos e adolescentes"],
              ["Modalidade", "Presencial e online"],
              ["Compromisso", "Ética, sigilo e clareza"],
            ].map(([label, value], index) => (
              <div key={label} className={`px-6 py-6 sm:px-8 lg:px-12 ${index > 0 ? "border-t border-white/18 sm:border-l sm:border-t-0" : ""}`}>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/52">{label}</p>
                <p className="mt-2 text-base font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 border-b border-[var(--c-border)] pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-1 h-10 w-1 bg-[var(--c-warm)]" aria-hidden="true" />
              <div>
                <p className="font-bold text-[var(--c-deep)]">Precisa de ajuda imediata?</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--c-muted)]">
                  Situações de crise e risco pedem suporte de urgência, não espera por uma sessão.
                </p>
              </div>
            </div>
            <Link to="/crise" className="inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[var(--c-deep)] underline decoration-[var(--c-warm)] decoration-2 underline-offset-4">
              Ver canais de ajuda
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section id="para-voce" className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-28 lg:self-start">
              <SectionLabel>Talvez seja hora de olhar</SectionLabel>
              <h2 className="max-w-[11ch] text-[clamp(2.9rem,5vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[var(--c-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                O sofrimento nem sempre faz barulho.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-[1.7] text-[var(--c-muted)]">
                Às vezes ele aparece como produtividade demais, irritação, isolamento ou a sensação
                de que você está sempre atrasado para a própria vida.
              </p>
            </Reveal>

            <div className="border-t border-[var(--c-deep)]">
              {dores.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <article className="grid gap-4 border-b border-[var(--c-border)] py-8 sm:grid-cols-[4rem_1fr] sm:py-10">
                    <span className="text-sm font-extrabold text-[var(--c-warm)]">0{index + 1}</span>
                    <div>
                      <h3 className="max-w-[23ch] text-3xl font-medium leading-tight tracking-[-0.03em] text-[var(--c-deep)] sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                        {item.titulo}
                      </h3>
                      <p className="mt-4 max-w-2xl text-base leading-[1.75] text-[var(--c-muted)] sm:text-lg">
                        {item.descricao}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="trabalho" className="bg-[var(--c-deep)] text-white">
          <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
              <Reveal>
                <SectionLabel light>Meu jeito de trabalhar</SectionLabel>
                <h2 className="max-w-[12ch] text-[clamp(3rem,5.6vw,6.4rem)] font-medium leading-[0.9] tracking-[-0.055em] text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Acolhimento não é deixar a conversa sem direção.
                </h2>
                <p className="mt-7 max-w-xl text-lg leading-[1.75] text-white/68">
                  Você encontra espaço para falar sem julgamento, mas também participa de um
                  processo com objetivos, compreensão dos padrões e recursos que possam ser usados
                  fora da sessão.
                </p>
              </Reveal>

              <div className="space-y-0 border-t border-white/28">
                {abordagens.map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.06}>
                    <article className="grid gap-5 border-b border-white/18 py-8 sm:grid-cols-[5rem_1fr] sm:py-10">
                      <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#e3a178]">{item.sigla}</span>
                      <div>
                        <h3 className="text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                          {item.nome}
                        </h3>
                        <p className="mt-4 max-w-2xl text-base leading-[1.75] text-white/64">{item.descricao}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="mt-20 border-t border-white/26 pt-10 lg:mt-28">
              <div className="grid gap-10 md:grid-cols-3">
                {processo.map((item) => (
                  <div key={item.numero}>
                    <span className="text-sm font-extrabold text-[#e3a178]">{item.numero}</span>
                    <h3 className="mt-5 text-3xl font-medium text-white" style={{ fontFamily: "var(--font-display)" }}>{item.titulo}</h3>
                    <p className="mt-4 text-base leading-[1.7] text-white/62">{item.descricao}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <SectionLabel>Um intervalo para respirar</SectionLabel>
              <h2 className="max-w-[12ch] text-[clamp(2.8rem,4.8vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-[var(--c-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                Você não precisa resolver tudo de uma vez.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-[1.75] text-[var(--c-muted)] lg:justify-self-end">
              Primeiro, organizamos o que está acontecendo. Com o tempo, aparecem relações que
              antes passavam despercebidas e caminhos que cabem melhor na sua vida.
            </p>
          </Reveal>

          <motion.div
            initial={reduceMotion ? false : { scale: 0.94, opacity: 0.7 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reduceMotion ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden bg-[var(--c-deep)]"
          >
            <video
              ref={videoRef}
              poster="/media/acolhimento-folhas.webp"
              preload="metadata"
              playsInline
              muted
              loop
              onEnded={() => setVideoPlaying(false)}
              className="aspect-[16/9] max-h-[46rem] w-full object-cover opacity-82"
              aria-label="Luz do sol atravessando folhas verdes"
            >
              <source src="/media/acolhimento-folhas.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#162b23]/82 via-transparent to-[#162b23]/12" />
            <button
              type="button"
              onClick={toggleVideo}
              className="absolute bottom-5 right-5 flex min-h-12 items-center gap-3 border border-white/70 bg-[#172c24]/82 px-5 text-sm font-extrabold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white hover:text-[var(--c-deep)] sm:bottom-8 sm:right-8"
              aria-label={videoPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            >
              {videoPlaying ? <CirclePause size={22} aria-hidden="true" /> : <CirclePlay size={22} aria-hidden="true" />}
              {videoPlaying ? "Pausar" : "Dar play"}
            </button>
            <p className="absolute bottom-5 left-5 max-w-[18rem] text-sm font-bold leading-relaxed text-white/84 sm:bottom-8 sm:left-8">
              Movimento sem pressa, com controle nas suas mãos.
            </p>
          </motion.div>
          <p className="mt-3 text-right text-[0.64rem] text-[var(--c-muted)]">Vídeo: Coverr · uso comercial autorizado</p>
        </section>

        <section id="sobre" className="border-y border-[var(--c-border)] bg-[var(--c-surface)]">
          <div className="mx-auto grid max-w-[90rem] gap-0 lg:grid-cols-[0.82fr_1.18fr]">
            <Reveal className="relative min-h-[34rem] overflow-hidden bg-[var(--c-deep)]">
              <img
                src="/img/foto.webp"
                width="843"
                height="1264"
                loading="lazy"
                alt="Retrato de Bruno de Souza Gonçalves"
                className="absolute inset-0 h-full w-full object-cover object-top grayscale-[0.12]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172c24]/84 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/62">Psicólogo clínico</p>
                <p className="mt-2 text-3xl font-medium" style={{ fontFamily: "var(--font-display)" }}>Bruno de Souza Gonçalves</p>
                <p className="mt-2 text-sm font-bold text-white/76">CRP 07/44472 · registro ativo</p>
              </div>
            </Reveal>

            <div className="px-5 py-16 sm:px-8 lg:px-16 lg:py-20 xl:px-24">
              <Reveal>
                <SectionLabel>Sobre mim</SectionLabel>
                <h2 className="max-w-[13ch] text-[clamp(3rem,5vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-[var(--c-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                  {sobre.titulo}. E como penso a terapia.
                </h2>
                <p className="mt-7 max-w-2xl text-lg leading-[1.8] text-[var(--c-muted)]">{sobre.bio}</p>
                <p className="mt-5 max-w-2xl text-base leading-[1.8] text-[var(--c-muted)]">{sobre.complemento}</p>

                <div className="mt-9 border-t border-[var(--c-deep)]">
                  {sobre.formacao.map((item) => (
                    <p key={item} className="flex gap-4 border-b border-[var(--c-border)] py-4 text-sm font-bold text-[var(--c-text)]">
                      <span className="text-[var(--c-warm)]" aria-hidden="true">↳</span>
                      {item}
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="recursos" className="mx-auto max-w-[90rem] scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <Reveal className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <SectionLabel>Conteúdos de apoio</SectionLabel>
              <h2 className="max-w-[11ch] text-[clamp(2.9rem,5vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.05em] text-[var(--c-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                Você pode se aproximar no seu tempo.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-[1.75] text-[var(--c-muted)] lg:justify-self-end">
              Aqui você encontra exercícios, psicoeducação, escalas e leituras para usar com
              autonomia ou como parte do acompanhamento.
            </p>
          </Reveal>

          <div className="mt-12 grid border-t border-[var(--c-deep)] lg:grid-cols-3">
            {recursos.map((item, index) => (
              <Reveal key={item.href} delay={index * 0.05}>
                <Link
                  to={item.href}
                  className={`group block min-h-[20rem] border-b border-[var(--c-border)] p-6 transition-colors duration-200 hover:bg-[var(--c-deep)] hover:text-white sm:p-8 lg:border-b-0 ${index % 3 > 0 ? "lg:border-l" : ""} ${index >= 3 ? "lg:border-t lg:border-[var(--c-border)]" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[var(--c-warm)]">{item.index}</span>
                    <ArrowUpRight size={20} className="text-[var(--c-deep)] transition-colors group-hover:text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mt-16 max-w-[12ch] text-3xl font-medium leading-tight tracking-[-0.035em] text-[var(--c-deep)] transition-colors group-hover:text-white" style={{ fontFamily: "var(--font-display)" }}>
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-[1.7] text-[var(--c-muted)] transition-colors group-hover:text-white/68">{item.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq" className="bg-[color:color-mix(in_oklab,var(--c-warm-lt)_34%,white)]">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12 lg:py-28">
            <Reveal>
              <SectionLabel>Antes de marcar</SectionLabel>
              <h2 className="max-w-[10ch] text-[clamp(3rem,5vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[var(--c-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                Dúvidas honestas pedem respostas claras.
              </h2>
              <Link to="/faq" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--c-deep)] underline decoration-[var(--c-warm)] decoration-2 underline-offset-4">
                Ver todas as perguntas
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </Reveal>

            <div className="border-t border-[var(--c-deep)]">
              {faqs.slice(0, 5).map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <Reveal key={item.pergunta} delay={index * 0.025}>
                    <div className="border-b border-[color:color-mix(in_oklab,var(--c-deep)_24%,transparent)]">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-lg font-extrabold text-[var(--c-deep)] sm:text-xl">{item.pergunta}</span>
                        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="flex size-11 shrink-0 items-center justify-center border border-[var(--c-deep)] text-[var(--c-deep)]">
                          <ChevronDown size={18} aria-hidden="true" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.24 }}
                          >
                            <p className="max-w-2xl pb-6 pr-12 text-base leading-[1.75] text-[var(--c-muted)]">{item.resposta}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[var(--c-warm)] text-[#1d2f29]">
          <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-12 lg:py-20">
            <Reveal>
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-[#1d2f29]/64">Se fizer sentido para você</p>
              <h2 className="mt-5 max-w-[12ch] text-[clamp(3.2rem,6vw,7rem)] font-medium leading-[0.88] tracking-[-0.06em]" style={{ fontFamily: "var(--font-display)" }}>
                Pode começar com uma mensagem curta.
              </h2>
            </Reveal>
            <Reveal delay={0.06} className="lg:justify-self-end">
              <p className="max-w-md text-lg leading-[1.7] text-[#1d2f29]/78">
                Você não precisa preparar um resumo da sua vida. Diga o que trouxe você até aqui e
                eu explico os próximos passos.
              </p>
              <a
                href={contato.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex min-h-13 items-center gap-3 bg-[var(--c-deep)] px-7 text-sm font-extrabold text-white transition-colors duration-200 hover:bg-white hover:text-[var(--c-deep)]"
              >
                Falar com Bruno no WhatsApp
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#1d2f29]/68">
                <span className="inline-flex items-center gap-2"><Video size={15} aria-hidden="true" /> Online em todo o Brasil</span>
                <span className="inline-flex items-center gap-2"><MapPin size={15} aria-hidden="true" /> Presencial em Pelotas</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-5 py-10 sm:px-8 lg:px-12" aria-label="Públicos atendidos">
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-center text-xs font-bold uppercase tracking-[0.12em] text-[var(--c-muted)]">
            {publicos.map((item) => (
              <span key={item.id}>{item.titulo}</span>
            ))}
          </div>
        </section>
      </main>

      <EthicalFooter />
    </div>
  );
}
