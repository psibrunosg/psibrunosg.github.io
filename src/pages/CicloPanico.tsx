import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Waves, LifeBuoy } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { cicloPanico, mensagemReinterpretacao, panicoQuiz } from "@/content/psicoed/panico";
import Simulador from "@/components/psicoed/Simulador";
import QuizEngine from "@/components/psicoed/QuizEngine";
import Badge from "@/components/psicoed/Badge";
import { useProgresso } from "@/components/psicoed/useProgresso";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

type Etapa = "intro" | "simulador" | "quiz" | "concluido";

const RAIO = 108;
const CENTRO = 150;

function posicaoElo(i: number, total: number) {
  const angulo = (i / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTRO + RAIO * Math.cos(angulo),
    y: CENTRO + RAIO * Math.sin(angulo),
  };
}

function CicloVisual({ reinterpretacao }: { reinterpretacao: number }) {
  const reduced = useReducedMotion();
  const [eloSelecionado, setEloSelecionado] = useState<string | null>(null);
  const total = cicloPanico.length;
  const quebrando = reinterpretacao >= 67;
  const eloAtivo = cicloPanico.find((e) => e.id === eloSelecionado) ?? null;

  return (
    <div>
      <svg viewBox="0 0 300 300" className="w-full max-w-sm mx-auto" role="img" aria-label="Diagrama circular do ciclo do pânico">
        {/* Arcos conectando os elos, em sequência */}
        {cicloPanico.map((elo, i) => {
          const atual = posicaoElo(i, total);
          const proximo = posicaoElo((i + 1) % total, total);
          // O último arco (medo -> gatilho, fechando o ciclo) é o que "quebra"
          // quando a reinterpretação está alta.
          const ultimoArco = i === total - 1;
          const opacidadeArco = ultimoArco && quebrando ? 0.15 : 0.5;
          const tracejado = ultimoArco && quebrando ? "2 6" : "3 3";
          return (
            <motion.line
              key={elo.id}
              x1={atual.x}
              y1={atual.y}
              x2={proximo.x}
              y2={proximo.y}
              stroke="var(--c-accent)"
              strokeWidth={2}
              strokeDasharray={tracejado}
              animate={{ opacity: opacidadeArco }}
              transition={{ duration: reduced ? 0 : 0.4 }}
            />
          );
        })}

        {cicloPanico.map((elo, i) => {
          const pos = posicaoElo(i, total);
          const selecionado = eloSelecionado === elo.id;
          return (
            <g key={elo.id} transform={`translate(${pos.x}, ${pos.y})`}>
              <motion.circle
                r={34}
                fill={selecionado ? "var(--c-accent)" : "var(--c-surface)"}
                stroke="var(--c-accent)"
                strokeWidth={selecionado ? 0 : 1.5}
                className="cursor-pointer"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setEloSelecionado((prev) => (prev === elo.id ? null : elo.id))}
                role="button"
                tabIndex={0}
                aria-pressed={selecionado}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setEloSelecionado((prev) => (prev === elo.id ? null : elo.id));
                }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fontWeight={600}
                fill={selecionado ? "white" : "var(--c-text)"}
                className="pointer-events-none select-none"
              >
                {quebrarTexto(elo.titulo).map((linha, li) => (
                  <tspan key={li} x={0} dy={li === 0 ? -((quebrarTexto(elo.titulo).length - 1) * 5) : 10}>
                    {linha}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <AnimatePresence mode="wait">
        {eloAtivo && (
          <motion.div
            key={eloAtivo.id}
            initial={reduced ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-xl border border-[var(--c-accent)]/30 bg-[var(--c-accent)]/5 p-4"
          >
            <p className="text-sm font-semibold text-[var(--c-text)] mb-1">{eloAtivo.titulo}</p>
            <p className="text-xs text-[var(--c-muted)] italic mb-2">{eloAtivo.curto}</p>
            <p className="text-xs text-[var(--c-muted)] leading-relaxed">{eloAtivo.explicacao}</p>
          </motion.div>
        )}
        {!eloAtivo && (
          <motion.p
            key="dica"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-xs text-[var(--c-muted)] italic"
          >
            Toque em cada elo do ciclo para entender essa etapa.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] p-4">
        <p className="text-xs text-[var(--c-muted)] leading-relaxed">{mensagemReinterpretacao(reinterpretacao)}</p>
      </div>
    </div>
  );
}

function quebrarTexto(titulo: string): string[] {
  const palavras = titulo.split(" ");
  if (palavras.length <= 1) return [titulo];
  const meio = Math.ceil(palavras.length / 2);
  return [palavras.slice(0, meio).join(" "), palavras.slice(meio).join(" ")];
}

export default function CicloPanico() {
  const [etapa, setEtapa] = useState<Etapa>("intro");
  const { hasCode, save, complete } = useProgresso("ciclo-do-panico");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Ciclo do Pânico | Psicoeducação | Bruno de Souza Gonçalves";
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
                <Waves size={20} />
              </span>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold">
                Território · Ciclo do Pânico
              </p>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ciclo do Pânico
            </motion.h1>
            {etapa === "intro" && (
              <motion.p variants={fadeUp} className="text-[var(--c-muted)] leading-relaxed">
                O pânico é um alarme falso do corpo: desconfortável, assustador, mas não perigoso. O problema é que
                a mente costuma interpretar essas sensações como sinal de perigo real — e é essa interpretação que
                realimenta o ciclo. Aqui você vai explorar cada etapa e ver o que acontece quando a interpretação
                muda.
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
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 1 · Explore o ciclo</p>
              <Simulador
                controles={[
                  {
                    id: "reinterpretacao",
                    label: "E se eu interpretar diferente?",
                    min: 0,
                    max: 100,
                    valorInicial: 0,
                    formatarValor: (v) => (v < 34 ? "É perigo real" : v < 67 ? "Será que é só desconforto?" : "É um alarme falso"),
                  },
                ]}
              >
                {(valores) => <CicloVisual reinterpretacao={valores.reinterpretacao} />}
              </Simulador>

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
              <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Parte 2 · Sensação vs. perigo real</p>
              <QuizEngine config={panicoQuiz} onComplete={handleQuizCompleto} />
            </div>
          )}

          {etapa === "concluido" && (
            <div className="space-y-6">
              <Badge titulo="Ciclo do Pânico" />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setEtapa("simulador")}
                  className="flex-1 px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-semibold text-sm hover:border-[var(--c-accent)]/60 transition-colors"
                >
                  Explorar o ciclo de novo
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

          <div className="mt-10 flex items-start gap-2 text-xs text-[var(--c-muted)] border-t border-[var(--c-border)] pt-6">
            <LifeBuoy size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              Se você está em crise agora, isso não substitui ajuda imediata. Ligue para o{" "}
              <a href="tel:188" className="underline hover:text-[var(--c-accent)]">CVV — 188</a> (gratuito, 24h) ou
              veja a página{" "}
              <Link to="/crise" className="underline hover:text-[var(--c-accent)]">/crise</Link>.
            </p>
          </div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
