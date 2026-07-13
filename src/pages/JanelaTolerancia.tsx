import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { zonaPorValor, passosExpansao, janelaQuiz } from "@/content/psicoed/janela";
import QuizEngine from "@/components/psicoed/QuizEngine";
import Badge from "@/components/psicoed/Badge";
import { useProgresso } from "@/components/psicoed/useProgresso";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

type Etapa = "intro" | "simulador" | "expansao" | "quiz" | "concluido";

function SimuladorJanela() {
  const reduced = useReducedMotion();
  const [valor, setValor] = useState(50);
  const zona = zonaPorValor(valor);

  return (
    <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8">
      <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-6">
        Mova o nível de ativação
      </p>

      <div className="flex items-center gap-6 md:gap-10">
        {/* Trilha vertical com as 3 faixas */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-[10px] text-[var(--c-muted)] mb-1">Hiperativação</span>
          <div className="relative w-10 rounded-full overflow-hidden" style={{ height: 220 }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #6B8BA4, #7FA37F, #D97757)" }} />
            <motion.div
              className="absolute left-1/2 w-6 h-6 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2"
              style={{ backgroundColor: zona.cor, bottom: `${valor}%` }}
              animate={{ bottom: `${valor}%` }}
              transition={{ duration: reduced ? 0 : 0.15 }}
            />
          </div>
          <span className="text-[10px] text-[var(--c-muted)] mt-1">Hipoativação</span>

          <div className="mt-4" style={{ height: 40, display: "flex", alignItems: "center" }}>
            <input
              type="range"
              min={0}
              max={100}
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              style={{ width: 180, transform: "rotate(-90deg)" }}
              className="accent-[var(--c-accent)]"
              aria-label="Nível de ativação do sistema nervoso"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <motion.div
            key={zona.id}
            initial={reduced ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: zona.cor }}>
              {zona.nome}
            </p>
            <p className="text-sm text-[var(--c-muted)] leading-relaxed mb-4">{zona.descricao}</p>
            <p className="text-xs font-semibold text-[var(--c-text)] mb-2">Sinais comuns:</p>
            <ul className="space-y-1">
              {zona.sinais.map((s) => (
                <li key={s} className="text-xs text-[var(--c-muted)] flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: zona.cor }} />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function JanelaTolerancia() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const { hasCode, save, complete } = useProgresso("janela-de-tolerancia");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Janela de Tolerância | Psicoeducação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const handleQuizCompleto = (acertos: number, total: number) => {
    complete(acertos);
    save({ quiz: { acertos, total } }, { partial: false });
    setEtapa("concluido");
  };

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/psicoeducacao"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao mapa
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                <Compass size={20} />
              </span>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold">
                Território · Janela de Tolerância
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Janela de Tolerância
            </motion.h1>
            {etapa === "intro" && (
              <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
                Existe uma faixa de ativação do sistema nervoso em que conseguimos pensar com clareza e sentir sem
                sermos dominados pela emoção — a "janela de tolerância". Fora dela, o sistema nervoso vai para
                hiperativação (alerta máximo) ou hipoativação (desligamento). Mova o controle abaixo para explorar
                cada faixa.
              </motion.p>
            )}
            {!hasCode && (
              <motion.p variants={fadeUp} className="text-xs text-[var(--c-muted)]/80 italic mt-3">
                Você não está com um código de paciente ativo — seu progresso não será salvo, mas o módulo funciona normalmente.
              </motion.p>
            )}
          </motion.div>

          {etapa === "intro" && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setEtapa("simulador")}
              className="px-6 py-3 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
            >
              Começar
            </motion.button>
          )}

          {etapa === "simulador" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 1 · Explore as 3 faixas</p>
              <SimuladorJanela />
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEtapa("expansao")}
                className="mt-6 px-6 py-3 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
              >
                Continuar
              </motion.button>
            </div>
          )}

          {etapa === "expansao" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 2 · O que expande a janela</p>
              <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8 space-y-5">
                {passosExpansao.map((p, i) => (
                  <motion.div
                    key={p.titulo}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <p className="text-sm font-semibold text-[var(--c-text)]">{p.titulo}</p>
                    <p className="text-xs text-[var(--c-muted)] leading-relaxed mt-1">{p.descricao}</p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEtapa("quiz")}
                className="mt-6 px-6 py-3 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
              >
                Continuar para o quiz
              </motion.button>
            </div>
          )}

          {etapa === "quiz" && (
            <div>
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 3 · Reconhecendo as faixas</p>
              <QuizEngine config={janelaQuiz} onComplete={handleQuizCompleto} />
            </div>
          )}

          {etapa === "concluido" && (
            <div className="space-y-6">
              <Badge titulo="Janela de Tolerância" />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEtapa("simulador")}
                  className="flex-1 px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm hover:border-[var(--c-accent)]/60 transition-colors"
                >
                  Explorar de novo
                </button>
                <Link
                  to="/psicoeducacao"
                  className="flex-1 text-center px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
                >
                  Voltar ao mapa
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
