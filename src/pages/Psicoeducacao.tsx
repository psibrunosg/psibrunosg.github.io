import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import MapaExploratorio from "@/components/psicoed/MapaExploratorio";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export default function Psicoeducacao() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Psicoeducacao | Bruno Souza Psicologo | Pelotas";
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
              Psicoeducação
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-4 leading-relaxed">
              Um mapa para explorar, no seu ritmo. Cada território é um tema — clique em qualquer um deles, não há ordem certa nem prazo.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <MapaExploratorio />
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
