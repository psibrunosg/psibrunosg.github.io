import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Printer } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Navbar } from "@/components/ui/Navbar";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Documentos", href: "/documentos" },
];

interface Props {
  eyebrow: string;
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  pdfHref?: string;
}

export function DocumentLayout({ eyebrow, titulo, subtitulo, children, pdfHref }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = `${titulo} | Bruno Souza Psicólogo`;
    return () => document.documentElement.removeAttribute("data-theme");
  }, [titulo]);

  return (
    <>
      <style>{`
        @media print {
          .doc-no-print { display: none !important; }
          .doc-print-header { display: flex !important; }
          main.doc-main { padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
          body, .doc-print-content { background: #fff !important; color: #1a1a1a !important; }
          .doc-print-content { box-shadow: none !important; border: none !important; padding: 0 !important; }
          a { color: inherit !important; text-decoration: none !important; }
          h1, h2, h3 { break-after: avoid; }
          .doc-section { break-inside: avoid; }
          @page { margin: 18mm 16mm; }
        }
        .doc-print-header { display: none; }
      `}</style>

      <SkipLink />
      <div className="doc-no-print">
        <Navbar items={navItems} whatsappLink={contato.whatsappLink} />
        <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
        <WhatsAppFloat />
      </div>

      <main id="main" className="doc-main min-h-screen bg-[var(--c-bg)] px-6 pb-24 pt-28">
        {/* Print-only header with logo */}
        <div className="doc-print-header items-center gap-4 mb-8">
          <img src="/documentos/logo-clinica.png" alt="" className="h-14 w-auto" />
          <div>
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
              Clínica Bruno Souza · Psicólogo
            </p>
            <p className="text-xs text-gray-600">{contato.crp}</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="doc-no-print mb-10 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/documentos"
              className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar aos documentos
            </Link>
            <div className="flex items-center gap-3">
              {pdfHref && (
                <a
                  href={pdfHref}
                  className="text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors underline underline-offset-2"
                >
                  Baixar PDF
                </a>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--c-accent-lt)] transition-colors"
              >
                <Printer size={16} aria-hidden="true" />
                Salvar / Imprimir
              </button>
            </div>
          </div>

          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="doc-print-content rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-10"
          >
            <div className="doc-no-print mb-8 flex items-center gap-4">
              <img
                src="/documentos/logo-clinica.png"
                alt="Logo Clínica Bruno Souza"
                className="h-12 w-auto"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--c-accent)]">
                {eyebrow}
              </p>
            </div>

            <motion.h1
              variants={fadeUp}
              className="mb-2 text-2xl font-semibold text-[var(--c-text)] md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {titulo}
            </motion.h1>
            {subtitulo && (
              <motion.p variants={fadeUp} className="mb-10 text-sm leading-relaxed text-[var(--c-muted)]">
                {subtitulo}
              </motion.p>
            )}

            <div className="space-y-8 text-sm leading-relaxed text-[var(--c-text)]">{children}</div>
          </motion.div>
        </div>
      </main>

      <div className="doc-no-print">
        <EthicalFooter />
      </div>
    </>
  );
}

export function DocSection({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="doc-section">
      <h2
        className="mb-3 text-lg font-semibold text-[var(--c-text)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {titulo}
      </h2>
      <div className="space-y-3 text-[var(--c-muted)]">{children}</div>
    </section>
  );
}

export function SignatureBlock({ lines }: { lines: string[] }) {
  return (
    <div className="doc-section mt-4 space-y-8 pt-6">
      {lines.map((label) => (
        <div key={label}>
          <div className="mb-1 h-px w-full max-w-sm bg-[var(--c-border)]" />
          <p className="text-xs text-[var(--c-muted)]">{label}</p>
        </div>
      ))}
    </div>
  );
}
