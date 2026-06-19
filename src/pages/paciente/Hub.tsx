import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Brain, ArrowRight, Shield, Lock } from "lucide-react";
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
    descricao: "9 perguntas sobre como voce tem se sentido nas ultimas duas semanas. Leva cerca de 3 minutos.",
    cor: "#B05D3A",
  },
  {
    href: "/paciente/gad7",
    icon: ClipboardList,
    sigla: "GAD-7",
    nome: "Rastreio de Ansiedade",
    descricao: "7 perguntas sobre sintomas de ansiedade e preocupacao nas ultimas duas semanas. Leva cerca de 2 minutos.",
    cor: "#4A6B47",
  },
];

function HubBlobs() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const blobs = [
    { size: 280, x: "10%", y: "15%", color: "var(--c-accent)", delay: 0 },
    { size: 200, x: "75%", y: "60%", color: "var(--c-moss)", delay: 2 },
    { size: 160, x: "50%", y: "80%", color: "var(--c-warm)", delay: 4 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.06] blur-3xl"
          style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: b.color }}
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}
    </div>
  );
}

export default function PacienteHub() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Area do Paciente | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <HubBlobs />

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors">
            Bruno SG
          </Link>
          <span className="text-xs text-[var(--c-muted)]">{contato.crp}</span>
        </div>
      </header>

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            <motion.div variants={fadeUp} className="text-center mb-16">
              <motion.div
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--c-accent)" + "15" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
              >
                <Shield size={28} style={{ color: "var(--c-accent)" }} />
              </motion.div>

              <h1
                className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Area do Paciente
              </h1>
              <p className="text-[var(--c-muted)] max-w-lg mx-auto leading-relaxed mb-6">
                Ferramentas de autoavaliacao indicadas pelo seu psicologo. Responda no seu tempo, baixe o PDF e compartilhe com o Bruno.
              </p>

              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 text-xs text-[var(--c-accent)] bg-[var(--c-accent)]/8 px-4 py-2 rounded-full"
              >
                <Lock size={13} />
                Dados protegidos pelo sigilo profissional e armazenados de forma segura.
              </motion.div>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="text-lg font-semibold text-[var(--c-text)] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Questionarios disponiveis
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-5 mb-16">
              {ferramentas.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div key={f.sigla} variants={fadeUp} custom={i}>
                    <Link
                      to={f.href}
                      className="block rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 hover:border-[var(--c-accent)]/50 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className="rounded-xl p-3 flex-shrink-0"
                          style={{ background: f.cor + "18" }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon size={22} style={{ color: f.cor }} aria-hidden="true" />
                        </motion.div>
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

            <motion.div variants={fadeUp} className="space-y-4">
              <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6">
                <div className="flex items-start gap-3">
                  <Lock size={18} className="text-[var(--c-accent)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--c-text)] text-sm block mb-1">Privacidade e LGPD</strong>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed">
                      Suas respostas sao armazenadas de forma segura e acessiveis exclusivamente por Bruno SG, CRP 07/44472. Voce tambem pode baixar o PDF e compartilhar por WhatsApp ou e-mail.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6">
                <div className="flex items-start gap-3">
                  <Shield size={18} className="text-[var(--c-accent)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--c-text)] text-sm block mb-1">Sobre o sigilo</strong>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed">
                      Estas ferramentas sao de rastreio, nao de diagnostico. Os resultados sao analisados em conjunto com Bruno SG, {contato.crp}, sob sigilo profissional conforme o Codigo de Etica do Psicologo.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}