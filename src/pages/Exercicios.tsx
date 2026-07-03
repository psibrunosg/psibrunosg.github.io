import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wind, Anchor, NotebookPen, Footprints, Lock, X } from "lucide-react";
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

const exercicios = [
  {
    Icon: Footprints,
    titulo: "Acerte a Distorção",
    resumo: "Jogo arcade: identifique pensamentos distorcidos em tempo real. Bata nos distorcidos, deixe passar os equilibrados.",
    tempo: "3 min",
    href: "/exercicios/acerte-distorcao",
  },
  {
    Icon: NotebookPen,
    titulo: "Muralha de Evidências",
    resumo: "Teste seus pensamentos contra a realidade. Construa uma muralha de evidências para reformular crenças limitantes.",
    tempo: "10 min",
    href: "/exercicios/muralha-evidencias",
  },
  {
    Icon: Wind,
    titulo: "Registro de Pensamentos",
    resumo: "Chat interativo guiado para examinar e reformular pensamentos automáticos com gamificação.",
    tempo: "8 min",
    href: "/exercicios/registro",
  },
  {
    Icon: Anchor,
    titulo: "Jardim da Mente",
    resumo: "Visualize seu progresso: cada sessão completa rega uma planta que cresce ao longo de semanas.",
    tempo: "1 min",
    href: "/exercicios/jardim",
  },
];

export default function Exercicios() {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeSaving, setCodeSaving] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [hasCode, setHasCode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Exercicios | Bruno SG Psicologo | Pelotas";
    const stored = localStorage.getItem("exercise_patient_code");
    setHasCode(!!stored);
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleValidateCode = async () => {
    if (!/^\d{5}$/.test(codeInput)) {
      setCodeError("Código deve ter 5 dígitos");
      return;
    }
    setCodeSaving(true);
    setCodeError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeInput }),
        }
      );
      if (!response.ok) {
        setCodeError("Código inválido ou inativo");
        setCodeSaving(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem("exercise_patient_code", data.code);
      localStorage.setItem("exercise_restricted_unlocked", JSON.stringify(data.restricted_unlocked || []));
      setHasCode(true);
      setShowCodeModal(false);
      setCodeInput("");
    } catch (e) {
      setCodeError("Erro ao validar código");
      console.error(e);
    }
    setCodeSaving(false);
  };

  const handleClearCode = () => {
    localStorage.removeItem("exercise_patient_code");
    localStorage.removeItem("exercise_restricted_unlocked");
    setHasCode(false);
  };

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <div className="flex items-center justify-between mb-4">
              <div>
                <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
                  Praticar para mudar
                </motion.p>
                <motion.h1
                  variants={fadeUp}
                  className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Exercicios
                </motion.h1>
              </div>
              <div className="flex gap-2">
                {!hasCode ? (
                  <motion.button
                    variants={fadeUp}
                    onClick={() => setShowCodeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)] font-semibold text-sm transition-colors hover:bg-[var(--c-accent)]/20"
                  >
                    <Lock size={16} /> Já tenho código
                  </motion.button>
                ) : (
                  <motion.button
                    variants={fadeUp}
                    onClick={handleClearCode}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs bg-[var(--c-accent)]/10 text-[var(--c-accent)] font-semibold transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    <X size={14} /> Sair
                  </motion.button>
                )}
              </div>
            </div>

            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-12 leading-relaxed">
              Praticas guiadas para usar no dia a dia. Pequenas ferramentas, baseadas em evidencia, para regular emocoes e construir habitos mais saudaveis.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
              {exercicios.map((e, i) => {
                const Icon = e.Icon;
                return (
                  <Link key={e.titulo} to={e.href as string}>
                    <motion.article
                      variants={fadeUp}
                      custom={i}
                      className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 transition-all hover:border-[var(--c-accent)] hover:shadow-lg cursor-pointer"
                      style={{ borderLeftWidth: 4, borderLeftColor: "var(--c-accent)" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                          <Icon size={20} />
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                          {e.tempo}
                        </span>
                      </div>
                      <h2
                        className="text-xl font-semibold text-[var(--c-text)] mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {e.titulo}
                      </h2>
                      <p className="text-[var(--c-muted)] text-sm leading-relaxed">{e.resumo}</p>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCodeModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card w-full max-w-sm rounded-3xl p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-[var(--c-text)] mb-2">Insira seu código</h3>
              <p className="text-xs text-[var(--c-muted)] mb-4">Código de 5 dígitos fornecido pelo terapeuta</p>
              <input
                type="text"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 5));
                  setCodeError("");
                }}
                maxLength={5}
                placeholder="00000"
                className="w-full text-center text-2xl letter-spacing-2 font-bold rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none mb-3"
              />
              {codeError && <p className="text-xs text-red-500 mb-3">{codeError}</p>}
              <button
                onClick={handleValidateCode}
                disabled={codeInput.length !== 5 || codeSaving}
                className="w-full rounded-full px-4 py-2 font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}
              >
                {codeSaving ? "Validando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="mt-3 w-full rounded-full px-4 py-2 font-semibold text-[var(--c-text)] border border-[var(--c-border)] transition-colors hover:bg-[var(--c-surface)]"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EthicalFooter />
    </>
  );
}
