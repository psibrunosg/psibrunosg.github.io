import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Navbar } from "@/components/ui/Navbar";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato, faqs as faqsBase } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Como funciona", href: "/como-funciona" },
];

const faqsExtra = [
  {
    pergunta: "Quanto custa a sessão?",
    resposta:
      "Os valores são informados diretamente por WhatsApp, para que possamos conversar com clareza sobre o que faz sentido para o seu momento.",
  },
  {
    pergunta: "Você atende por convênio ou dá reembolso?",
    resposta:
      "O atendimento é particular. Se o seu convênio ou plano de saúde oferecer reembolso, posso fornecer recibo para que você solicite o reembolso junto à sua operadora.",
  },
  {
    pergunta: "Como funciona o cancelamento ou remarcação de sessão?",
    resposta:
      "As condições de cancelamento e remarcação são combinadas diretamente com você no início do acompanhamento. Em caso de dúvida, é só perguntar por WhatsApp.",
  },
  {
    pergunta: "O atendimento online funciona mesmo?",
    resposta:
      "Sim. O atendimento online segue os mesmos princípios éticos e técnicos do presencial, e pode ser feito de qualquer lugar do Brasil, no conforto do seu espaço.",
  },
];

const faqs = [...faqsBase, ...faqsExtra];

export default function FAQ() {
  const [aberto, setAberto] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Perguntas Frequentes | Bruno Souza Psicólogo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <Navbar items={navItems} whatsappLink={contato.whatsappLink} />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] px-6 pb-24 pt-28">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar ao site
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-2 flex items-center gap-2">
              <HelpCircle size={20} className="text-[var(--c-accent)]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--c-accent)]">
                FAQ
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mb-4 text-3xl font-semibold text-[var(--c-text)] md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Perguntas frequentes
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-12 text-[var(--c-muted)] leading-relaxed">
              Dúvidas comuns antes de começar a terapia. Se a sua não estiver aqui, fale comigo
              diretamente pelo WhatsApp.
            </motion.p>

            <motion.div variants={fadeUp} className="space-y-2">
              {faqs.map((faq, i) => {
                const open = aberto === i;
                return (
                  <details
                    key={i}
                    open={open}
                    onToggle={(e) => {
                      const isOpen = (e.target as HTMLDetailsElement).open;
                      setAberto(isOpen ? i : null);
                    }}
                    className="group rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden"
                  >
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-sm font-medium text-[var(--c-text)] hover:bg-[var(--c-bg)] transition-colors marker:content-none [&::-webkit-details-marker]:hidden"
                    >
                      {faq.pergunta}
                      <span
                        className="flex-shrink-0 text-[var(--c-accent)] transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      >
                        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 7l5 5 5-5" />
                        </svg>
                      </span>
                    </summary>
                    <p className="px-6 pb-4 text-sm leading-relaxed text-[var(--c-muted)]">
                      {faq.resposta}
                    </p>
                  </details>
                );
              })}
            </motion.div>

            <motion.p variants={fadeUp} className="mt-10 text-center text-sm text-[var(--c-muted)]">
              Não encontrou o que precisava?{" "}
              <a
                href={contato.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--c-accent)] hover:underline"
              >
                Fale comigo pelo WhatsApp
              </a>
              .
            </motion.p>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
