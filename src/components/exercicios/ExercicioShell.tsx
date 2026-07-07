import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";

interface ExercicioShellProps {
  titulo: string;
  subtitulo: string;
  tempo: string;
  children: ReactNode;
  // "c" = paleta legada dos exercícios originais (default, não mexe no que já existe).
  // "lobo" = paleta oficial do Manual de Identidade Visual v1.0 (verde integral).
  theme?: "c" | "lobo";
}

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export function ExercicioShell({ titulo, subtitulo, tempo, children, theme = "c" }: ExercicioShellProps) {
  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6" data-theme={theme}>
        <div className="max-w-2xl mx-auto">
          <Link
            to="/exercicios"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar aos exercícios
          </Link>

          <div className="mb-8">
            <h1
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-2"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {titulo}
            </h1>
            <p className="text-[var(--c-muted)] mb-2">{subtitulo}</p>
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
              ⏱ {tempo}
            </span>
          </div>

          {children}
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
