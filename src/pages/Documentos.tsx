import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Download, ArrowRight } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Navbar } from "@/components/ui/Navbar";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Início", href: "/" },
  { label: "FAQ", href: "/faq" },
];

const documentos = [
  {
    id: "tcle-online",
    titulo: "TCLE — Atendimento On-line",
    descricao:
      "Termo de Consentimento Livre e Esclarecido para atendimento psicológico realizado à distância.",
    href: "/documentos/tcle-online",
    pdf: null as string | null,
  },
  {
    id: "tcle-presencial",
    titulo: "TCLE — Atendimento Presencial",
    descricao:
      "Termo de Consentimento Livre e Esclarecido para atendimento psicológico realizado presencialmente.",
    href: "/documentos/tcle-presencial",
    pdf: null as string | null,
  },
  {
    id: "contrato",
    titulo: "Contrato Terapêutico",
    descricao:
      "Condições do acompanhamento: sessões, honorários, política de faltas, sigilo e proteção de dados.",
    href: "/documentos/contrato",
    pdf: "/documentos/contrato-terapeutico.pdf",
  },
  {
    id: "guia",
    titulo: "Guia de Boas-Vindas",
    descricao:
      "Uma apresentação da clínica: como cuidamos, as linhas de atendimento e o que esperar da primeira sessão.",
    href: "/documentos/guia",
    pdf: null as string | null,
  },
];

export default function Documentos() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Documentos | Bruno Souza Psicólogo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <Navbar items={navItems} whatsappLink={contato.whatsappLink} />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] px-6 pb-24 pt-28">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.p
              variants={fadeUp}
              className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--c-accent)]"
            >
              Documentos da clínica
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mb-6 text-3xl font-semibold text-[var(--c-text)] md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Documentos e termos
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-14 max-w-xl text-[var(--c-muted)] leading-relaxed">
              Aqui você encontra os documentos que fazem parte do processo terapêutico — termos de
              consentimento, contrato terapêutico e o guia de boas-vindas. Você pode ler online ou
              salvar/imprimir para os seus registros.
            </motion.p>

            <div className="mb-16 space-y-5">
              {documentos.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  variants={fadeUp}
                  custom={i}
                  className="flex flex-col gap-4 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-accent)]/10">
                      <FileText size={20} className="text-[var(--c-accent)]" aria-hidden="true" />
                    </div>
                    <div>
                      <h2
                        className="mb-1 text-lg font-semibold text-[var(--c-text)]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {doc.titulo}
                      </h2>
                      <p className="text-sm leading-relaxed text-[var(--c-muted)]">{doc.descricao}</p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-3 sm:flex-col sm:items-stretch sm:gap-2">
                    <Link
                      to={doc.href}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--c-accent-lt)] transition-colors"
                    >
                      Ler online
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                    {doc.pdf && (
                      <a
                        href={doc.pdf}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--c-border)] px-4 py-2 text-sm font-medium text-[var(--c-text)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)] transition-colors"
                      >
                        <Download size={14} aria-hidden="true" />
                        Baixar PDF
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
