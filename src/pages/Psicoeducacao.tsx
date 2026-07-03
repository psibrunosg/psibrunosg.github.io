import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, ChevronDown, Lightbulb, AlertCircle, TrendingUp } from "lucide-react";
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

const topicos = [
  {
    Icon: Brain,
    titulo: "Pensamento não é realidade",
    tecnicas: "Cap.7: 4, 5",
    conteudo: "Seu cérebro gera pensamentos constantemente. Nem todos refletem a verdade. Alguns são automáticos, distorcidos, produto do medo ou do hábito.",
    miniGame: "distincao",
  },
  {
    Icon: AlertCircle,
    titulo: "Fábrica de Dúvida (Ciclo OCD)",
    tecnicas: "Cap.8: 1, 2",
    conteudo: "Quanto mais você testa uma dúvida (checando, perguntando, analisando), mais dúvidas surgem. É um ciclo que se alimenta.",
    miniGame: "fabrica",
  },
  {
    Icon: TrendingUp,
    titulo: "Continuum de Risco",
    tecnicas: "Cap.8: 22",
    conteudo: "Sua ansiedade amplifica o risco real. Mapeie cenários prováveis com seus percentuais reais, não suas emoções.",
    miniGame: "continuum",
  },
  {
    Icon: Lightbulb,
    titulo: "Valores vs. Energia Gasta",
    tecnicas: "Cap.4: 5",
    conteudo: "Você gasta muita energia em áreas que não alinham com seus valores? Identifique o desalinhamento.",
    miniGame: "valores",
  },
  {
    Icon: Brain,
    titulo: "Ciclo de Preocupação",
    tecnicas: "Cap.8: 8, 9, 24",
    conteudo: "Preocupação → Hipervigilância → Confirmação enviesada → Mais preocupação. Como quebrar?",
    miniGame: "ciclo",
  },
  {
    Icon: AlertCircle,
    titulo: "Memórias Precoces & Esquemas",
    tecnicas: "Cap.10: 7",
    conteudo: "Qual memória ensinou você este padrão? Traumas e aprendizados precoces criam esquemas que guiam você hoje.",
    miniGame: "memoria",
  },
];

export default function Psicoeducacao() {
  const [expandido, setExpandido] = useState<number | null>(null);
  const [resultadoValores, setResultadoValores] = useState<{ area: string; valor: number }[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Psicoeducacao | Bruno SG Psicologo | Pelotas";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const renderMiniGame = (tipo: string) => {
    if (tipo === "distincao") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--c-text)]">Exercício: Pensamento vs. Fato</p>
          <div className="grid gap-2">
            <div className="glass-card rounded-lg p-3">
              <p className="text-xs font-semibold text-[var(--c-accent)] mb-1">PENSAMENTO:</p>
              <p className="text-sm text-[var(--c-muted)]">"Vou ser rejeitado"</p>
            </div>
            <div className="text-center text-xs text-[var(--c-muted)]">vs</div>
            <div className="glass-card rounded-lg p-3">
              <p className="text-xs font-semibold text-green-600 mb-1">FATO:</p>
              <p className="text-sm text-[var(--c-muted)]">"Essa pessoa não respondeu minha mensagem ainda"</p>
            </div>
          </div>
        </motion.div>
      );
    }

    if (tipo === "fabrica") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--c-text)]">O Ciclo OCD:</p>
          <div className="space-y-2 text-xs">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--c-accent)]/20 flex items-center justify-center text-[var(--c-accent)] font-bold flex-shrink-0">1</div>
              <div>Surge dúvida automática</div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--c-accent)]/20 flex items-center justify-center text-[var(--c-accent)] font-bold flex-shrink-0">2</div>
              <div>Você testa/checa para "ter certeza"</div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[var(--c-accent)]/20 flex items-center justify-center text-[var(--c-accent)] font-bold flex-shrink-0">3</div>
              <div>Alívio breve, mas...</div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 font-bold flex-shrink-0">4</div>
              <div className="font-semibold">Mais dúvidas surgem (o ciclo recomeça)</div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (tipo === "continuum") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--c-text)]">Mape o risco real:</p>
          <div className="space-y-2 text-xs">
            <div>
              <p className="text-[var(--c-accent)] font-semibold mb-1">Seu medo: "Vou fracassar completamente"</p>
              <div className="h-2 bg-[var(--c-border)] rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: "90%" }} />
              </div>
              <p className="text-[var(--c-muted)] mt-1">Chance real: ~10-20%</p>
            </div>
            <div>
              <p className="text-green-600 font-semibold mb-1">Realidade: "Vou aprender e melhorar"</p>
              <div className="h-2 bg-[var(--c-border)] rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: "70%" }} />
              </div>
              <p className="text-[var(--c-muted)] mt-1">Chance real: ~70-80%</p>
            </div>
          </div>
        </motion.div>
      );
    }

    if (tipo === "valores") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--c-text)]">Quiz rápido: Alinhamento?</p>
          <div className="space-y-2 text-xs">
            {["Relacionamentos", "Saúde", "Trabalho", "Diversão"].map((area, i) => (
              <div key={i}>
                <label className="flex justify-between mb-1">
                  <span>{area}</span>
                  <span className="text-[var(--c-accent)]">{resultadoValores[i]?.valor || 50}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={resultadoValores[i]?.valor || 50}
                  onChange={(e) => {
                    const novo = [...resultadoValores];
                    novo[i] = { area, valor: Number(e.target.value) };
                    setResultadoValores(novo);
                  }}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (tipo === "ciclo") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--c-text)]">Ciclo de Preocupação:</p>
          <div className="bg-[var(--c-surface)] rounded-lg p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--c-accent)]/20 flex items-center justify-center text-[var(--c-accent)] font-bold">1</div>
              <span>Pensamento ameaçador</span>
            </div>
            <div className="text-center">↓</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--c-accent)]/20 flex items-center justify-center text-[var(--c-accent)] font-bold">2</div>
              <span>Hipervigilância (atenção focada na ameaça)</span>
            </div>
            <div className="text-center">↓</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--c-accent)]/20 flex items-center justify-center text-[var(--c-accent)] font-bold">3</div>
              <span>Você encontra "evidência" (viés de confirmação)</span>
            </div>
            <div className="text-center">↓</div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center text-red-600 font-bold">↻</div>
              <span className="font-semibold">Ciclo recomeça (mais preocupação)</span>
            </div>
          </div>
        </motion.div>
      );
    }

    if (tipo === "memoria") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--c-text)]">Reflexão: Qual memória?</p>
          <div className="bg-[var(--c-surface)] rounded-lg p-4 space-y-2 text-xs">
            <p className="text-[var(--c-muted)]">Exemplo:</p>
            <div className="italic text-[var(--c-text)]">
              "Meu pai nunca estava presente. Aprendi que abandonam você, então hoje tenho medo de me aproximar de pessoas."
            </div>
            <p className="text-[var(--c-accent)] font-semibold mt-2">→ Esquema de Abandono criado.</p>
          </div>
        </motion.div>
      );
    }

    return null;
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
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Entender para cuidar
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Psicoeducação
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-12 leading-relaxed">
              Conteúdo claro para entender o que você sente. Saber como a mente funciona é o primeiro passo para cuidar dela com mais autonomia.
            </motion.p>

            <div className="space-y-4">
              {topicos.map((t, i) => {
                const Icon = t.Icon;
                const isExpandido = expandido === i;
                return (
                  <motion.div
                    key={t.titulo}
                    variants={fadeUp}
                    custom={i}
                    className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden"
                    style={{ borderLeftWidth: 4, borderLeftColor: "var(--c-accent)" }}
                  >
                    <button
                      onClick={() => setExpandido(isExpandido ? null : i)}
                      className="w-full p-6 flex items-start gap-4 hover:bg-[var(--c-bg)]/30 transition-colors text-left"
                    >
                      <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)] flex-shrink-0 mt-1">
                        <Icon size={20} />
                      </span>
                      <div className="flex-1">
                        <h2
                          className="text-xl font-semibold text-[var(--c-text)] mb-1"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {t.titulo}
                        </h2>
                        <p className="text-[10px] text-[var(--c-muted)] mb-2">Leahy {t.tecnicas}</p>
                        {!isExpandido && <p className="text-sm text-[var(--c-muted)]">{t.conteudo}</p>}
                      </div>
                      <motion.div
                        animate={{ rotate: isExpandido ? 180 : 0 }}
                        className="flex-shrink-0 mt-1"
                      >
                        <ChevronDown size={20} className="text-[var(--c-muted)]" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isExpandido && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-[var(--c-border)] bg-[var(--c-bg)]/20 px-6 pb-6 pt-4"
                        >
                          <p className="text-sm text-[var(--c-text)] mb-4">{t.conteudo}</p>
                          {renderMiniGame(t.miniGame)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
