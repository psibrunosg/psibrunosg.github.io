import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, Clock, Video, Lock, Sprout } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Navbar } from "@/components/ui/Navbar";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { contato, abordagens } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Início", href: "/" },
  { label: "FAQ", href: "/faq" },
];

const topicos = [
  {
    icon: MessageCircle,
    titulo: "A primeira sessão",
    texto:
      "O primeiro encontro é uma conversa de acolhimento, sem compromisso. Você fala um pouco sobre o que está vivendo e o que te trouxe até aqui, e juntos avaliamos se o processo terapêutico faz sentido para o seu momento. Não há certo ou errado no que trazer — o espaço é seu.",
  },
  {
    icon: Clock,
    titulo: "Frequência e duração",
    texto:
      "Em geral, as sessões acontecem semanalmente, especialmente no início do acompanhamento. Com o tempo, a frequência pode ser ajustada de acordo com as suas necessidades. A duração do processo varia de pessoa para pessoa — não existe um tempo certo, existe o tempo necessário para cada um.",
  },
  {
    icon: Video,
    titulo: "Online ou presencial",
    texto:
      "O atendimento é oferecido presencialmente em Pelotas/RS e também online para qualquer lugar do Brasil. Ambos os formatos seguem os mesmos princípios éticos e técnicos — a escolha depende da sua preferência e rotina.",
  },
  {
    icon: Lock,
    titulo: "Sigilo profissional",
    texto:
      "Tudo o que é compartilhado nas sessões é protegido por sigilo profissional, um dever ético e legal previsto no Código de Ética Profissional do Psicólogo (CFP). As exceções são situações específicas de risco iminente à vida, previstas na legislação.",
  },
];

export default function ComoFunciona() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Como funciona a terapia | Bruno de Souza Gonçalves Psicólogo";
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
            <motion.p variants={fadeUp} className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--c-accent)]">
              Antes de começar
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mb-6 text-3xl font-semibold text-[var(--c-text)] md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Como funciona a terapia
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-14 max-w-xl text-[var(--c-muted)] leading-relaxed">
              Começar um processo terapêutico pode gerar dúvidas. Reunimos aqui o que você pode
              esperar, para que a primeira conversa seja mais tranquila.
            </motion.p>

            <div className="mb-16 space-y-6">
              {topicos.map((t, i) => (
                <motion.div
                  key={t.titulo}
                  variants={fadeUp}
                  custom={i}
                  className="flex gap-5 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-accent)]/10">
                    <t.icon size={20} className="text-[var(--c-accent)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h2
                      className="mb-2 text-lg font-semibold text-[var(--c-text)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {t.titulo}
                    </h2>
                    <p className="text-sm leading-relaxed text-[var(--c-muted)]">{t.texto}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Abordagem */}
            <motion.div variants={fadeUp} className="mb-16">
              <div className="mb-6 flex items-center gap-2">
                <Sprout size={20} className="text-[var(--c-accent)]" aria-hidden="true" />
                <h2
                  className="text-2xl font-semibold text-[var(--c-text)]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Abordagem de trabalho
                </h2>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-[var(--c-muted)]">
                O trabalho é conduzido a partir de abordagens com base em evidências científicas.
                Cada processo é único, e essas ferramentas são adaptadas à sua história — elas podem
                ajudar a entender padrões e desenvolver caminhos mais funcionais, sem que isso
                represente uma promessa de resultado específico.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {abordagens.map((ab) => (
                  <div
                    key={ab.id}
                    className="rounded-2xl border-2 border-[var(--c-accent)]/20 bg-[var(--c-bg)] p-6"
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[var(--c-accent)]">
                      {ab.sigla}
                    </span>
                    <h3
                      className="mb-2 mt-1 text-lg font-semibold text-[var(--c-text)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {ab.nome}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--c-muted)]">{ab.descricao}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl bg-[var(--c-bg-dark)] px-8 py-12 text-center text-white"
            >
              <h2
                className="mb-3 text-2xl font-semibold md:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Pronto para agendar uma conversa?
              </h2>
              <p className="mb-8 text-white/80">
                O primeiro contato é sem compromisso. Vamos ver juntos se faz sentido para você.
              </p>
              <AnimatedCTA href={contato.whatsappLink} label="Agendar uma conversa" />
            </motion.div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
