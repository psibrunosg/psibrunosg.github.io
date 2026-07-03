import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export default function ExerciciosRestritos() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string | null>(null);
  const [restricted, setRestricted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Exercícios Restritos | Bruno SG Psicologo | Pelotas";

    const stored = localStorage.getItem("exercise_patient_code");
    const unlocked = localStorage.getItem("exercise_restricted_unlocked");

    if (!stored) {
      // Sem código: tela de bloqueio
      setLoading(false);
      return;
    }

    setCode(stored);
    try {
      setRestricted(JSON.parse(unlocked || "[]"));
    } catch {
      setRestricted([]);
    }
    setLoading(false);

    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-[var(--c-muted)]">Carregando...</div>;
  }

  if (!code) {
    return (
      <>
        <SkipLink />
        <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
        <WhatsAppFloat />
        <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6" data-theme="c">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/exercicios"
              className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
            >
              <ArrowLeft size={16} />
              Voltar aos exercícios
            </Link>

            <motion.div variants={stagger.container} initial="hidden" animate="visible">
              <div className="rounded-3xl border-2 border-[var(--c-accent)]/30 bg-[var(--c-accent)]/5 p-12 text-center">
                <motion.div variants={fadeUp} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--c-accent)]/20">
                  <Lock size={32} className="text-[var(--c-accent)]" />
                </motion.div>
                <motion.h1
                  variants={fadeUp}
                  className="text-2xl font-semibold text-[var(--c-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Acesso restrito
                </motion.h1>
                <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-md mx-auto mb-6">
                  Esses exercícios requerem um código de paciente. Peça ao seu terapeuta para gerar um código e insira-o aqui.
                </motion.p>
                <motion.button
                  variants={fadeUp}
                  onClick={() => navigate("/exercicios")}
                  className="rounded-full px-6 py-3 font-semibold text-white"
                  style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}
                >
                  Voltar aos exercícios públicos
                </motion.button>
              </div>
            </motion.div>
          </div>
        </main>
        <EthicalFooter />
      </>
    );
  }

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />
      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6" data-theme="c">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/exercicios"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar aos exercícios
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Sob supervisão
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Exercícios Restritos
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-12 leading-relaxed">
              Técnicas para praticar entre sessões com o terapeuta. Liberação individual conforme recomendação clínica.
            </motion.p>

            {restricted.length === 0 ? (
              <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 text-center">
                <AlertCircle size={32} className="mx-auto mb-3 text-[var(--c-accent)]" />
                <h3 className="text-lg font-semibold text-[var(--c-text)] mb-2">Nenhum exercício liberado ainda</h3>
                <p className="text-sm text-[var(--c-muted)]">Peça ao seu terapeuta para liberar exercícios restritos conforme necessário.</p>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <p className="text-sm text-[var(--c-muted)] md:col-span-2">
                  {restricted.length} exercício{restricted.length !== 1 ? "s" : ""} liberado{restricted.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <EthicalFooter />
    </>
  );
}
