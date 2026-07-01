import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Wind, Anchor, NotebookPen, Footprints, Layers } from "lucide-react";
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
    resumo: "Pratica guiada com circulo animado: inspire, segure e solte no ritmo certo para acalmar o sistema nervoso.",
    tempo: "3 min",
    href: "/exercicios/respiracao",
  },
  {
    Icon: Anchor,
    titulo: "Ancoragem 5-4-3-2-1",
    resumo: "Percurso interativo pelos cinco sentidos para sair do piloto automatico e voltar ao presente.",
    tempo: "5 min",
    href: "/exercicios/ancoragem",
  },
  {
    Icon: NotebookPen,
    titulo: "Registro de pensamentos",
    resumo: "Conversa guiada passo a passo para identificar, questionar e reformular um pensamento dificil.",
    tempo: "10 min",
    href: "/exercicios/registro",
  },
  {
    Icon: Footprints,
    titulo: "Ativacao comportamental",
    resumo: "Como planejar pequenas acoes que devolvem energia e sentido ao dia. Em breve em versao interativa.",
    tempo: "15 min",
    href: null,
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

            {/* Destaque: Baralho das Distorcoes */}
            <motion.div variants={fadeUp} className="mb-8">
              <Link
                to="/exercicios/baralho"
                className="group flex flex-col md:flex-row items-stretch rounded-2xl border border-[var(--c-accent)]/40 bg-[var(--c-bg-dark)] overflow-hidden hover:border-[var(--c-accent)] transition-colors"
              >
                <div className="flex md:w-56 shrink-0">
                  {["pretoebranco", "dramatizador", "leitor"].map((id) => (
                    <img
                      key={id}
                      src={`/img/monstros/${id}.webp`}
                      alt=""
                      loading="lazy"
                      className="w-1/3 md:w-full object-cover aspect-square md:aspect-auto md:h-full md:[&:not(:first-child)]:hidden"
                    />
                  ))}
                </div>
                <div className="p-7 flex flex-col justify-center">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[var(--c-warm)] mb-2">
                    <Layers size={14} /> Novo · Jogo
                  </span>
                  <h2
                    className="text-2xl font-semibold text-[var(--c-warm-lt)] mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Baralho das Distorcoes
                  </h2>
                  <p className="text-[var(--c-warm)]/90 text-sm leading-relaxed mb-3 max-w-md">
                    Conheca os 12 monstros que distorcem seus pensamentos — e jogue para aprender a reconhecer a voz de
                    cada um.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--c-warm-lt)] group-hover:gap-2.5 transition-all">
                    Abrir o baralho <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {exercicios.map((e, i) => {
                const Icon = e.Icon;
                const conteudo = (
                  <>
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
                    {e.href && (
                      <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--c-accent)] group-hover:gap-2.5 transition-all">
                        Comecar <ArrowRight size={15} />
                      </span>
                    )}
                  </>
                );
                const classes =
                  "group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 transition-colors";
                const estilo = { borderLeftWidth: 4, borderLeftColor: "var(--c-accent)" };
                return (
                  <motion.article key={e.titulo} variants={fadeUp} custom={i}>
                    {e.href ? (
                      <Link to={e.href} className={`block h-full ${classes} hover:border-[var(--c-accent)]`} style={estilo}>
                        {conteudo}
                      </Link>
                    ) : (
                      <div className={`h-full ${classes} opacity-80`} style={estilo}>
                        {conteudo}
                      </div>
                    )}
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
