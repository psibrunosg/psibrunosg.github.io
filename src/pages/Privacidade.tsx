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
                As escalas e questionários de autoavaliação disponíveis na Área do Paciente
                coletam dados de identificação, necessários para o correto registro no prontuário
                clínico e para a segurança do acompanhamento. Coletamos:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Nome completo;</li>
                <li>CPF;</li>
                <li>Data de nascimento;</li>
                <li>E-mail;</li>
                <li>Telefone;</li>
                <li>Contato de emergência (nome e telefone);</li>
                <li>
                  Para pacientes menores de 18 anos: nome e telefone do responsável legal;
                </li>
                <li>Registros de sessões dos exercícios terapêuticos interativos, vinculados ao seu acompanhamento.</li>
              </ul>
            </Secao>

            <Secao titulo="Para que usamos esses dados">
              <p>
                Os dados coletados são usados exclusivamente para fins de registro em prontuário e
                cuidado clínico, pelo psicólogo responsável, {contato.nome} ({contato.crp}), como
                parte do acompanhamento terapêutico. Não são usados para fins de marketing,
                publicidade ou venda a terceiros.
              </p>
            </Secao>

            <Secao titulo="Base legal">
              <p>
                O tratamento desses dados se baseia no seu consentimento (art. 7º da Lei Geral de
                Proteção de Dados — LGPD, Lei 13.709/2018) e na hipótese de tutela da saúde (art.
                11 da LGPD), conduzido por profissional de saúde sujeito a sigilo profissional. A
                finalidade do tratamento é exclusivamente o registro em prontuário e o cuidado
                clínico do paciente.
              </p>
            </Secao>

            <Secao titulo="Tempo de guarda">
              <p>
                Os dados e registros de prontuário são mantidos por, no mínimo, 5 (cinco) anos,
                conforme normativa do Conselho Federal de Psicologia (CFP).
              </p>
            </Secao>

            <Secao titulo="Quem tem acesso">
              <p>
                O acesso aos dados coletados é restrito ao psicólogo responsável pelo
                acompanhamento clínico. Consulte também os{" "}
                <Link to="/documentos" className="text-[var(--c-accent)] hover:underline">
                  documentos e termos da clínica
                </Link>
                , incluindo o Termo de Consentimento Livre e Esclarecido e o Contrato Terapêutico,
                que detalham as condições do tratamento de dados no atendimento.
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
