import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Gem, Scale, Eye, Layers, Map } from "lucide-react";
import { useEffect } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { mundoPorId } from "@/content/psicoed-mundos";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const icones = { gem: Gem, scale: Scale, eye: Eye, layers: Layers } as const;

export default function MundoTemas() {
  const { mundoId } = useParams<{ mundoId: string }>();
  const mundo = mundoId ? mundoPorId(mundoId) : undefined;

  useEffect(() => {
    if (!mundo) return;
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = `${mundo.titulo} | Psicoeducação | Bruno de Souza Gonçalves`;
    return () => document.documentElement.removeAttribute("data-theme");
  }, [mundo]);

  if (!mundo) return <Navigate to="/psicoeducacao/mundos" replace />;

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/psicoeducacao/mundos"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Outros mundos
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-10 flex items-center gap-4">
            <img
              src={mundo.imagemCapa}
              alt=""
              className="w-16 h-16 rounded-full object-cover object-top border-2 flex-shrink-0"
              style={{ borderColor: mundo.cor }}
            />
            <div>
              <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase font-semibold mb-1" style={{ color: mundo.cor }}>
                Mundo Temático
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-2xl md:text-3xl font-semibold text-[var(--c-text)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {mundo.titulo}
              </motion.h1>
            </div>
          </motion.div>

          <p className="text-[var(--c-muted)] leading-relaxed mb-8">Escolha o que você quer aprender.</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {mundo.temas.map((tema, i) => {
              const Icone = icones[tema.icone];
              return (
                <motion.div
                  key={tema.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={tema.rota}
                    className="group flex items-center gap-3 p-4 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent)]/60 transition-colors"
                  >
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${mundo.cor}1a`, color: mundo.cor }}
                    >
                      <Icone size={18} />
                    </span>
                    <p className="flex-1 text-sm font-semibold text-[var(--c-text)] group-hover:text-[var(--c-accent)] transition-colors">
                      {tema.titulo}
                    </p>
                    <ChevronRight size={16} className="text-[var(--c-muted)] group-hover:text-[var(--c-accent)] flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {mundo.id === "torajo" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mb-4"
            >
              <Link
                to="/psicoeducacao/mundos/torajo/verade"
                className="group flex items-center gap-3 p-4 rounded-2xl border border-[var(--c-border)] bg-gradient-to-r from-[var(--c-surface)] to-[var(--c-surface)] hover:border-[var(--c-accent)]/60 transition-colors"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${mundo.cor}1a`, color: mundo.cor }}
                >
                  <Map size={18} />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--c-text)] group-hover:text-[var(--c-accent)] transition-colors">
                    Jornada por Verade
                  </p>
                  <p className="text-xs text-[var(--c-muted)] mt-0.5">Uma experiência narrativa pelos modos do esquema.</p>
                </div>
                <ChevronRight size={16} className="text-[var(--c-muted)] group-hover:text-[var(--c-accent)] flex-shrink-0" />
              </Link>
            </motion.div>
          )}

          {mundo.linkExtra && (
            <Link
              to={mundo.linkExtra.rota}
              className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors underline underline-offset-4"
            >
              {mundo.linkExtra.titulo}
            </Link>
          )}
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
