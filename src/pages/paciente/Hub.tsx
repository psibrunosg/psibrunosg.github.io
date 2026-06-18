import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Brain, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const ferramentas = [
  {
    href: "/paciente/phq9",
    icon: Brain,
    sigla: "PHQ-9",
    nome: "Rastreio de Depressao",
    descricao: "9 perguntas sobre como você tem se sentido nas últimas duas semanas. Leva cerca de 3 minutos.",
    cor: "#B05D3A",
  },
  {
    href: "/paciente/gad7",
    icon: ClipboardList,
    sigla: "GAD-7",
    nome: "Rastreio de Ansiedade",
    descricao: "7 perguntas sobre sintomas de ansiedade e preocupacao nas últimas duas semanas. Leva cerca de 2 minutos.",
    cor: "#4A6B47",
  },
];

export default function PacienteHub() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Area do Paciente | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors">
            Bruno SG · Psicologo
          </Link>
          <span className="text-xs text-[var(--c-muted)]">{contato.crp}</span>
        </div>
      </header>

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Area restrita
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Area do Paciente
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-4 leading-relaxed">
              Ferramentas de autoavaliacao indicadas pelo seu psicologo. Seus dados ficam protegidos e sao compartilhados apenas com Bruno SG.
            </motion.p>
            <motion.p variants={fadeUp} className="text-xs text-[var(--c-muted)] mb-16 italic">
              Estas ferramentas sao de rastreio, nao de diagnostico. Os resultados sao analisados em conjunto com o psicologo.
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-xl font-semibold text-[var(--c-text)] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Questionarios disponíveis
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-5 mb-16">
              {ferramentas.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.sigla} variants={fadeUp} custom={i}>
                    <Link
                      to={f.href}
                      className="block rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 hover:border-[var(--c-accent)]/50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl p-3 flex-shrink-0" style={{ background: f.cor + "18" }}>
                          <Icon size={22} style={{ color: f.cor }} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: f.cor }}>
                            {f.sigla}
                          </span>
                          <h3 className="text-lg font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                            {f.nome}
                          </h3>
                          <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-4">{f.descricao}</p>
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all" style={{ color: f.cor }}>
                            Responder <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6 text-sm text-[var(--c-muted)] leading-relaxed"
            >
              <strong className="text-[var(--c-text)] block mb-1">Sobre o sigilo</strong>
              Tudo o que voce responde aqui é protegido pelo sigilo profissional. Os dados sao armazenados de forma segura e acessados exclusivamente por Bruno SG, {contato.crp}. Nenhuma informacao é compartilhada com terceiros.
            </motion.div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}