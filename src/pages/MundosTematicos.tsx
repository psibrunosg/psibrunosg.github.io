import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { mundos } from "@/content/psicoed-mundos";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export default function MundosTematicos() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Mundos Temáticos | Psicoeducação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/psicoeducacao"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao mapa
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-10">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Mundos Temáticos
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Escolha um mundo
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
              Cada mundo tem os mesmos 4 temas (Crenças, Distorções, Esquemas, Modos), explicados por um elenco de
              personagens diferente. Escolha o que fizer mais sentido pra você.
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {mundos.map((mundo, i) => (
              <motion.div
                key={mundo.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              >
                <Link
                  to={`/psicoeducacao/mundos/${mundo.id}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent)]/60 transition-colors"
                >
                  <img
                    src={mundo.imagemCapa}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover object-top border-2 flex-shrink-0"
                    style={{ borderColor: mundo.cor }}
                  />
                  <div className="flex-1">
                    <p
                      className="font-semibold text-[var(--c-text)] group-hover:text-[var(--c-accent)] transition-colors"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {mundo.titulo}
                    </p>
                    <p className="text-xs text-[var(--c-muted)] mt-1 leading-relaxed">{mundo.descricaoCurta}</p>
                  </div>
                  <ChevronRight size={18} className="text-[var(--c-muted)] group-hover:text-[var(--c-accent)] flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
