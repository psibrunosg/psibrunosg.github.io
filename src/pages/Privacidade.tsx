import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
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

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <motion.section variants={fadeUp} className="mb-10">
      <h2
        className="mb-3 text-xl font-semibold text-[var(--c-text)]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {titulo}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--c-muted)]">{children}</div>
    </motion.section>
  );
}

export default function Privacidade() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Política de Privacidade | Bruno de Souza Gonçalves Psicólogo";
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
              <Shield size={20} className="text-[var(--c-accent)]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--c-accent)]">
                LGPD
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mb-4 text-3xl font-semibold text-[var(--c-text)] md:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Política de Privacidade
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-12 text-sm leading-relaxed text-[var(--c-muted)]">
              Este texto explica, de forma simples, quais dados este site coleta, para que servem
              e quais são os seus direitos sobre eles. Se algo não ficar claro, entre em contato
              pelo WhatsApp.
            </motion.p>

            <Secao titulo="Quais dados coletamos">
              <p>
                Desde julho de 2026, as respostas das escalas e questionários de autoavaliação
                disponíveis na Área do Paciente são coletadas <strong>sem nome nem telefone</strong>.
                Coletamos:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Data de nascimento, usada apenas para normatização estatística da escala respondida;</li>
                <li>E-mail, de forma opcional, em escalas que envolvem risco (por exemplo, ideação suicida), para viabilizar contato caso necessário;</li>
                <li>Código de acesso fornecido pelo seu psicólogo, usado para vincular respostas ao acompanhamento clínico sem exigir identificação direta;</li>
                <li>Registros de sessões dos exercícios terapêuticos interativos, vinculados a esse mesmo código.</li>
              </ul>
            </Secao>

            <Secao titulo="Para que usamos esses dados">
              <p>
                Os dados coletados são usados exclusivamente para fins de avaliação clínica pelo
                psicólogo responsável, {contato.nome} ({contato.crp}), como parte do acompanhamento
                terapêutico. Não são usados para fins de marketing, publicidade ou venda a terceiros.
              </p>
            </Secao>

            <Secao titulo="Base legal">
              <p>
                O tratamento desses dados se baseia no seu consentimento, manifestado ao preencher
                as escalas e exercícios, e na hipótese de tutela da saúde, prevista no art. 11 da
                Lei Geral de Proteção de Dados (LGPD, Lei 13.709/2018), conduzida por profissional
                de saúde sujeito a sigilo profissional.
              </p>
            </Secao>

            <Secao titulo="Onde os dados ficam armazenados">
              <p>
                As respostas e registros são armazenados de forma segura na plataforma Supabase,
                com acesso restrito ao psicólogo responsável.
              </p>
            </Secao>

            <Secao titulo="Cookies e rastreamento">
              <p>
                Este site não utiliza cookies de rastreamento nem ferramentas de analytics de
                terceiros (como Google Analytics ou similares). Nenhum dado de navegação é
                compartilhado com empresas de publicidade.
              </p>
            </Secao>

            <Secao titulo="Seus direitos">
              <p>
                Como titular dos dados, você tem direito a acessar, corrigir ou solicitar a
                eliminação das suas informações a qualquer momento. Para exercer esses direitos,
                entre em contato:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  WhatsApp:{" "}
                  <a
                    href={contato.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--c-accent)] hover:underline"
                  >
                    enviar mensagem
                  </a>
                </li>
              </ul>
            </Secao>

            <Secao titulo="Alterações desta política">
              <p>
                Esta política pode ser atualizada conforme necessário. A data da última revisão
                relevante é julho de 2026.
              </p>
            </Secao>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
