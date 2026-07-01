import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

type Props = {
  eyebrow: string;
  titulo: string;
  descricao: string;
  children: ReactNode;
  maxWidth?: string;
};

export function ExercicioShell({ eyebrow, titulo, descricao, children, maxWidth = "max-w-4xl" }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = `${titulo} | Bruno SG Psicologo | Pelotas`;
    return () => document.documentElement.removeAttribute("data-theme");
  }, [titulo]);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className={`${maxWidth} mx-auto`}>
          <Link
            to="/exercicios"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Todos os exercicios
          </Link>

          <p className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">{eyebrow}</p>
          <h1
            className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {titulo}
          </h1>
          <p className="text-[var(--c-muted)] max-w-xl mb-10 leading-relaxed">{descricao}</p>

          {children}
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
