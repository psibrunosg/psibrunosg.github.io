import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Heart,
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
  { label: "Atendimento", href: "#acolhimento" },
  { label: "Como funciona", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
  { label: "Perguntas", href: "#faq" },
];

const caminhos = [
  {
    icon: MessageCircle,
    title: "Primeiro contato simples",
    text: "Se quiser, você pode começar só me dizendo o que está pesado hoje. A partir disso, eu te ajudo a organizar o resto.",
  },
  {
    icon: Video,
    title: "Online ou presencial",
    text: "Atendimento em Pelotas e online para todo o Brasil, com o mesmo cuidado técnico e ético nos dois formatos.",
  },
  {
    icon: Clock3,
    title: "Ritmo possível",
    text: "A terapia não precisa começar quando tudo estiver em ordem. Ela pode começar justamente quando isso ainda não aconteceu.",
  },
];

const recursos = [
  {
    href: "/como-funciona",
    title: "Entenda como funciona a terapia",
    text: "Uma explicação direta sobre primeira sessão, frequência, sigilo e formato de atendimento.",
    label: "Como funciona",
  },
  {
    href: "/psicoeducacao",
    title: "Materiais para entender melhor o que você vive",
    text: "Psicoeducação, recursos visuais e conteúdos pensados para ansiedade, esquemas, sono e regulação emocional.",
    label: "Ver conteúdos",
  },
  {
    href: "/faq",
    title: "Tire dúvidas antes de marcar",
    text: "Se preferir chegar mais seguro, aqui estão respostas objetivas para as perguntas que costumam aparecer no começo.",
    label: "Abrir perguntas",
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
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[var(--c-accent)]">
      {children}
    </p>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-[var(--c-border)] bg-[color:color-mix(in_oklab,var(--c-surface)_84%,white)] shadow-[0_24px_60px_-32px_rgba(62,107,92,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

export default function VariantC() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Bruno Souza Psicólogo | Terapia em Pelotas e online";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--c-bg)] text-[var(--c-text)]">
      <SkipLink />
      <WhatsAppFloat />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-12%] top-[-6%] h-[26rem] w-[26rem] rounded-full bg-[color:color-mix(in_oklab,var(--c-moss)_48%,transparent)] blur-3xl opacity-35" />
        <div className="absolute right-[-10%] top-[8rem] h-[22rem] w-[22rem] rounded-full bg-[color:color-mix(in_oklab,var(--c-warm)_36%,transparent)] blur-3xl opacity-30" />
        <div className="absolute bottom-[-8rem] left-[18%] h-[24rem] w-[24rem] rounded-full bg-[color:color-mix(in_oklab,var(--c-accent-lt)_24%,transparent)] blur-3xl opacity-25" />
      </div>

      <header className="sticky top-0 z-50 border-b border-[color:color-mix(in_oklab,var(--c-border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--c-bg)_88%,white)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="group flex min-h-11 items-center gap-3" aria-label="Bruno Souza, página inicial">
            <div>
              <span
                className="block text-[1.2rem] leading-none text-[var(--c-deep)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Bruno Souza
              </span>
              <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--c-muted)]">
                Psicologia clínica
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex" aria-label="Navegação principal">
            <div className="flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-white/55 px-2 py-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--c-muted)] transition-colors duration-200 hover:text-[var(--c-accent)]"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/psicoeducacao"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--c-muted)] transition-colors duration-200 hover:text-[var(--c-accent)]"
              >
                Psicoeducação
              </Link>
            </div>

            <a
              href={contato.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--c-accent)] px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-[var(--c-deep)]"
            >
              Agendar conversa
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </nav>

          <button
            type="button"
            className="flex size-12 items-center justify-center rounded-full border border-[var(--c-border)] bg-white/70 lg:hidden"
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
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="border-t border-[var(--c-border)] bg-[color:color-mix(in_oklab,var(--c-bg)_96%,white)] px-5 pb-6 pt-3 lg:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[1.2rem] px-4 py-3 text-base font-semibold text-[var(--c-text)] hover:bg-white/70"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/psicoeducacao"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[1.2rem] px-4 py-3 text-base font-semibold text-[var(--c-text)] hover:bg-white/70"
                >
                  Psicoeducação
                </Link>
                <a
                  href={contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--c-accent)] px-5 font-bold text-white"
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
        <section className="mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 sm:pt-12 lg:px-10 lg:pb-18">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
            <Reveal className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--c-border)] bg-white/70 px-4 py-2 text-sm text-[var(--c-muted)] shadow-sm">
                <ShieldCheck size={16} className="text-[var(--c-accent)]" aria-hidden="true" />
                <span>{contato.crp} ativo · presencial em Pelotas e online</span>
              </div>

              <h1
                className="mt-6 max-w-[14ch] text-[clamp(3rem,7vw,6.4rem)] font-light leading-[0.92] tracking-[-0.05em] text-[var(--c-deep)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Você pode chegar como está.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--c-muted)] sm:text-[1.18rem]">
                Nem sempre dá para explicar direito o que está acontecendo. Às vezes a ansiedade
                aperta, o cansaço sobe, os pensamentos se embolam e pedir ajuda parece mais difícil
                do que deveria ser. A terapia pode começar exatamente aí.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={contato.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--c-accent)] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[var(--c-deep)]"
                >
                  Falar comigo no WhatsApp
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <Link
                  to="/como-funciona"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--c-border)] bg-white/70 px-5 text-sm font-bold text-[var(--c-text)] transition-colors duration-200 hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]"
                >
                  Entender como funciona
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Sem cobrança para chegar com tudo resolvido",
                  "Atendimento com base ética e técnica",
                  "Um caminho claro desde a primeira conversa",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.5rem] border border-[var(--c-border)] bg-white/65 px-4 py-4 text-sm leading-relaxed text-[var(--c-muted)]"
                  >
                    <span className="mb-2 inline-flex size-7 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--c-accent)_14%,white)] text-[var(--c-accent)]">
                      <Check size={15} aria-hidden="true" />
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="relative mx-auto max-w-[34rem]">
                <div className="absolute -left-6 top-8 hidden h-28 w-28 rounded-full bg-[color:color-mix(in_oklab,var(--c-warm)_30%,transparent)] blur-2xl sm:block" />
                <div className="absolute -right-6 bottom-10 hidden h-32 w-32 rounded-full bg-[color:color-mix(in_oklab,var(--c-moss)_45%,transparent)] blur-2xl sm:block" />

                <SoftCard className="relative overflow-hidden rounded-[2.4rem] p-3">
                  <div className="relative overflow-hidden rounded-[2rem] bg-[var(--c-bg-dark)]">
                    <motion.img
                      src="/img/foto.webp"
                      width="843"
                      height="1264"
                      alt="Bruno Souza em seu espaço de trabalho"
                      fetchPriority="high"
                      className="aspect-[0.86] w-full object-cover object-top"
                      initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
                      animate={
                        reduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, scale: [1.02, 1.045], y: [0, -10] }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              opacity: { duration: 0.55 },
                              scale: { duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                              y: { duration: 16, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                            }
                      }
                    />

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#11231b] via-[#11231b]/78 to-transparent px-6 pb-6 pt-14 text-white">
                      <p className="text-[1.5rem] font-light" style={{ fontFamily: "var(--font-display)" }}>
                        Bruno Souza
                      </p>
                      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/82">
                        Psicólogo clínico. Atendimento a adultos e adolescentes, com escuta acolhedora
                        e trabalho orientado por evidências.
                      </p>
                    </div>
                  </div>
                </SoftCard>

                <SoftCard className="absolute -left-2 top-5 hidden max-w-[13rem] rounded-[1.7rem] bg-[color:color-mix(in_oklab,var(--c-surface)_88%,white)] p-4 md:block">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)]">
                    Primeiro passo
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--c-muted)]">
                    Se for mais fácil, mande só um "oi". A conversa começa daí.
                  </p>
                </SoftCard>

                <SoftCard className="absolute -bottom-4 right-0 hidden max-w-[14rem] rounded-[1.7rem] bg-[color:color-mix(in_oklab,var(--c-surface)_88%,white)] p-4 md:block">
                  <div className="flex items-center gap-2 text-[var(--c-accent)]">
                    <MapPin size={16} aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Modalidade</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--c-muted)]">
                    {contato.modalidade}
                  </p>
                </SoftCard>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-6 sm:px-8 lg:px-10">
          <SoftCard className="overflow-hidden rounded-[2.4rem] bg-[color:color-mix(in_oklab,var(--c-warm-lt)_36%,white)] p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <Eyebrow>Se estiver em crise</Eyebrow>
                <h2
                  className="text-3xl font-light tracking-[-0.035em] text-[var(--c-deep)] sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Se você precisa de ajuda imediata, existe um caminho mais rápido.
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--c-muted)]">
                  Em situação de urgência emocional ou risco, o melhor é usar o canal de cuidado
                  imediato antes de pensar no processo terapêutico.
                </p>
              </div>
              <Link
                to="/crise"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--c-deep)] px-6 text-sm font-bold text-white transition-colors duration-200 hover:bg-[var(--c-accent)]"
              >
                Ver ajuda imediata
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </SoftCard>
        </section>

        <section id="acolhimento" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
            <Reveal>
              <Eyebrow>Precisa de atendimento?</Eyebrow>
              <h2
                className="max-w-[12ch] text-4xl font-light leading-[0.96] tracking-[-0.04em] text-[var(--c-deep)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Talvez você esteja se reconhecendo em algo assim.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--c-muted)]">
                Nem todo sofrimento aparece do mesmo jeito. Às vezes ele chega como exaustão, às
                vezes como medo, às vezes como repetição de padrões que você já tentou mudar.
              </p>
            </Reveal>

            <div className="grid gap-4">
              {dores.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05}>
                  <SoftCard className="rounded-[2rem] p-6 sm:p-7">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--c-accent)]">
                      Acolhimento
                    </p>
                    <h3
                      className="mt-3 text-2xl font-light leading-tight text-[var(--c-deep)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.titulo}
                    </h3>
                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--c-muted)]">
                      {item.descricao}
                    </p>
                  </SoftCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <Reveal>
            <SoftCard className="rounded-[2.6rem] bg-[color:color-mix(in_oklab,var(--c-moss)_18%,white)] p-6 sm:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                  <Eyebrow>Para quem eu atendo</Eyebrow>
                  <h2
                    className="max-w-[12ch] text-4xl font-light leading-[0.98] tracking-[-0.04em] text-[var(--c-deep)] sm:text-5xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Cada fase da vida pede um jeito diferente de cuidado.
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {publicos.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.8rem] border border-white/70 bg-white/78 p-5"
                    >
                      <div className="inline-flex size-11 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--c-accent)_14%,white)] text-[var(--c-accent)]">
                        <Heart size={18} aria-hidden="true" />
                      </div>
                      <h3
                        className="mt-4 text-2xl font-light text-[var(--c-deep)]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.titulo}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--c-muted)]">
                        {item.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SoftCard>
          </Reveal>
        </section>

        <section id="processo" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <Reveal className="max-w-3xl">
            <Eyebrow>Como funciona</Eyebrow>
            <h2
              className="text-4xl font-light leading-[0.98] tracking-[-0.04em] text-[var(--c-deep)] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Um processo claro, sem pressa desnecessária e sem promessas vazias.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {processo.map((item, index) => (
              <Reveal key={item.numero} delay={index * 0.06}>
                <SoftCard className="h-full rounded-[2rem] p-6 sm:p-7">
                  <span
                    className="text-[3rem] font-light leading-none text-[color:color-mix(in_oklab,var(--c-accent)_55%,white)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.numero}
                  </span>
                  <h3
                    className="mt-6 text-3xl font-light text-[var(--c-deep)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[var(--c-muted)]">
                    {item.descricao}
                  </p>
                </SoftCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {caminhos.map((item, index) => (
              <Reveal key={item.title} delay={0.08 + index * 0.05}>
                <div className="rounded-[1.8rem] border border-[var(--c-border)] bg-white/66 px-5 py-5">
                  <div className="inline-flex size-11 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--c-accent)_14%,white)] text-[var(--c-accent)]">
                    <item.icon size={18} aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[var(--c-text)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--c-muted)]">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="sobre" className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SoftCard className="rounded-[2.6rem] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
              <Reveal>
                <Eyebrow>Sobre mim</Eyebrow>
                <h2
                  className="text-4xl font-light leading-[0.98] tracking-[-0.04em] text-[var(--c-deep)] sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {sobre.titulo}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-[var(--c-muted)]">{sobre.bio}</p>
                <p className="mt-4 text-base leading-relaxed text-[var(--c-muted)]">
                  {sobre.complemento}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {sobre.formacao.map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-[var(--c-border)] bg-[color:color-mix(in_oklab,var(--c-surface)_88%,white)] px-4 py-2 text-sm font-semibold text-[var(--c-muted)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="grid gap-4">
                  {abordagens.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.9rem] border border-[var(--c-border)] bg-[color:color-mix(in_oklab,var(--c-surface)_88%,white)] p-6"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)]">
                        {item.sigla}
                      </p>
                      <h3
                        className="mt-3 text-2xl font-light text-[var(--c-deep)]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.nome}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--c-muted)]">
                        {item.descricao}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </SoftCard>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <Reveal className="max-w-3xl">
            <Eyebrow>Conteúdos de apoio</Eyebrow>
            <h2
              className="text-4xl font-light leading-[0.98] tracking-[-0.04em] text-[var(--c-deep)] sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Se você prefere se aproximar aos poucos, pode começar por aqui.
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {recursos.map((item, index) => (
              <Reveal key={item.href} delay={index * 0.05}>
                <Link
                  to={item.href}
                  className="group block h-full rounded-[2rem] border border-[var(--c-border)] bg-white/72 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--c-accent)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)]">
                    Recurso
                  </p>
                  <h3
                    className="mt-4 text-2xl font-light leading-tight text-[var(--c-deep)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--c-muted)]">{item.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--c-accent)]">
                    {item.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
          <SoftCard className="rounded-[2.6rem] bg-[color:color-mix(in_oklab,var(--c-moss)_12%,white)] p-6 sm:p-8 lg:p-10">
            <Reveal className="max-w-3xl">
              <Eyebrow>Perguntas frequentes</Eyebrow>
              <h2
                className="text-4xl font-light leading-[0.98] tracking-[-0.04em] text-[var(--c-deep)] sm:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dúvidas comuns antes de começar.
              </h2>
            </Reveal>

            <div className="mt-8 space-y-3">
              {faqs.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <Reveal key={item.pergunta} delay={index * 0.03}>
                    <div className="overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/86">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base font-bold text-[var(--c-text)] sm:text-lg">
                          {item.pergunta}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.2 }}
                          className="flex size-10 items-center justify-center rounded-full bg-[color:color-mix(in_oklab,var(--c-accent)_12%,white)] text-[var(--c-accent)]"
                        >
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
                            <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-[var(--c-muted)] sm:px-6 sm:text-base">
                              {item.resposta}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </SoftCard>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-18 pt-14 sm:px-8 lg:px-10">
          <Reveal>
            <div className="overflow-hidden rounded-[2.8rem] bg-[var(--c-deep)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div>
                  <Eyebrow>Se fizer sentido para você</Eyebrow>
                  <h2
                    className="max-w-[12ch] text-4xl font-light leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Podemos começar com uma conversa tranquila.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                    Você não precisa saber exatamente o que dizer. Se quiser, me chama no WhatsApp e
                    me conta do seu jeito o que te trouxe até aqui.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a
                    href={contato.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[var(--c-deep)] transition-colors duration-200 hover:bg-[var(--c-warm-lt)]"
                  >
                    Agendar conversa
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <p className="text-sm text-white/72">
                    {contato.nome} · {contato.crp}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <EthicalFooter />
    </div>
  );
}
