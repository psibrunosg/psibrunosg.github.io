import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, Check, Brain } from "lucide-react";
import { salvarResposta } from "@/lib/supabase";
import { AppAurora } from "@/components/ui/AppAurora";

const perguntas = [
  "Pouco interesse ou prazer em fazer as coisas",
  "Se sentir para baixo, deprimido(a) ou sem perspectiva",
  "Dificuldade para adormecer ou permanecer dormindo, ou dormir mais do que de costume",
  "Se sentir cansado(a) ou com pouca energia",
  "Falta de apetite ou comer demais",
  "Se sentir mal consigo mesmo(a), achar que e um fracasso ou que decepcionou sua familia",
  "Dificuldade para se concentrar nas coisas",
  "Falar ou se mover mais devagar do que o habitual, ou ficar inquieto(a) demais",
  "Pensar em se machucar ou que seria melhor estar morto(a)",
];

const opcoes = [
  { label: "Nenhuma vez", valor: 0 },
  { label: "Varios dias", valor: 1 },
  { label: "Mais da metade dos dias", valor: 2 },
  { label: "Quase todos os dias", valor: 3 },
];

function classificar(score: number) {
  if (score <= 4) return { nivel: "Minima ou nenhuma", cor: "#4A6B47", orientacao: "Seu rastreio indica ausencia ou nivel minimo de sintomas depressivos." };
  if (score <= 9) return { nivel: "Leve", cor: "#8A6A3A", orientacao: "Ha indicios leves. Compartilhe com seu psicologo para avaliacao conjunta." };
  if (score <= 14) return { nivel: "Moderada", cor: "#B05D3A", orientacao: "Nivel moderado. E importante discutir esses resultados com seu psicologo." };
  if (score <= 19) return { nivel: "Moderadamente grave", cor: "#A0522D", orientacao: "Nivel significativo. Traga esses resultados para a proxima sessao." };
  return { nivel: "Grave", cor: "#8B1A1A", orientacao: "Nivel elevado. Entre em contato com seu psicologo o quanto antes." };
}

export default function PHQ9() {
  const [etapa, setEtapa] = useState<"dados" | "intro" | "form" | "resultado">("dados");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [respostas, setRespostas] = useState<(number | null)[]>(Array(9).fill(null));
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "PHQ-9 | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const dadosValidos = nome.trim().length > 2 && nascimento.length > 0;
  const pontuacao = respostas.reduce<number>((acc, r) => acc + (r ?? 0), 0);
  const resultado = classificar(pontuacao);
  const pct = Math.round(((atual + 1) / perguntas.length) * 100);
  const ringMax = 27, r = 52, circ = 2 * Math.PI * r;

  function finalizar() {
    salvarResposta({ tipo: "phq9", nome: nome.trim(), telefone: telefone.trim(), nascimento, respostas: respostas as number[], pontuacao });
    setEtapa("resultado");
  }

  return (
    <div className="relative flex min-h-screen flex-col" data-theme="c">
      <AppAurora />
      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link to="/paciente" className="text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Voltar</Link>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--c-accent)]">PHQ-9</span>
          {etapa === "form" ? <span className="text-xs font-medium text-[var(--c-muted)]">{atual + 1} / {perguntas.length}</span> : <span className="w-12" />}
        </div>
      </header>

      <main id="main" className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12 pt-24">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {etapa === "dados" && (
              <motion.div key="dados" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-md">
                <div className="glass-card rounded-3xl p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: "linear-gradient(140deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 10px 26px -10px var(--c-accent)" }}>
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Seus dados</h2>
                      <p className="text-xs text-[var(--c-muted)]">Necessarios para gerar o relatorio</p>
                    </div>
                  </div>
                  <div className="mb-6 space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--c-text)]">Nome completo <span className="text-[var(--c-accent)]">*</span></label>
                      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome"
                        className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors placeholder:text-[var(--c-muted)]/50 focus:border-[var(--c-accent)] focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--c-text)]">Data de nascimento <span className="text-[var(--c-accent)]">*</span></label>
                      <input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)}
                        className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[var(--c-text)]">Telefone / WhatsApp <span className="text-xs font-normal text-[var(--c-muted)]">(opcional)</span></label>
                      <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(53) 9 9999-9999"
                        className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors placeholder:text-[var(--c-muted)]/50 focus:border-[var(--c-accent)] focus:outline-none" />
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: dadosValidos ? 1.02 : 1 }} whileTap={{ scale: 0.98 }} onClick={() => setEtapa("intro")} disabled={!dadosValidos}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium text-white transition-opacity disabled:opacity-40"
                    style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 12px 30px -10px var(--c-accent)" }}>
                    Continuar <ChevronRight size={16} />
                  </motion.button>
                  <p className="mt-4 text-center text-xs text-[var(--c-muted)]">Dados protegidos pelo sigilo profissional e acessiveis apenas ao seu psicologo.</p>
                </div>
              </motion.div>
            )}

            {etapa === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <motion.div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
                  style={{ background: "linear-gradient(140deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 16px 40px -12px var(--c-accent)" }}
                  initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
                  <Brain size={30} className="text-white" />
                </motion.div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--c-accent)]">PHQ-9</span>
                <h1 className="mb-3 text-3xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Rastreio de Depressao</h1>
                <p className="mb-5 text-sm text-[var(--c-muted)]">Ola, <strong className="text-[var(--c-text)]">{nome.trim()}</strong>.</p>
                <p className="mx-auto mb-6 max-w-md leading-relaxed text-[var(--c-muted)]">Este questionario pergunta sobre como voce tem se sentido nas <strong>ultimas duas semanas</strong>. Sao 9 perguntas, leva cerca de 3 minutos.</p>
                <div className="mb-8 flex items-center justify-center gap-2">
                  <span className="rounded-full bg-[var(--c-surface)] px-3 py-1 text-xs font-medium text-[var(--c-muted)]">9 perguntas</span>
                  <span className="rounded-full bg-[var(--c-surface)] px-3 py-1 text-xs font-medium text-[var(--c-muted)]">Rastreio, nao diagnostico</span>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setEtapa("form")}
                  className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-medium text-white"
                  style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 12px 30px -10px var(--c-accent)" }}>
                  Iniciar <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {etapa === "form" && (
              <motion.div key={"q" + atual} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-[var(--c-muted)]">
                  <span>Pergunta {atual + 1} de {perguntas.length}</span><span className="text-[var(--c-accent)]">{pct}%</span>
                </div>
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--c-border)]">
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--c-accent), var(--c-accent-lt))" }} animate={{ width: pct + "%" }} transition={{ duration: 0.4 }} />
                </div>
                <div className="glass-card mb-5 rounded-2xl p-6">
                  <p className="mb-2 text-xs text-[var(--c-muted)]">Nas ultimas duas semanas, com que frequencia voce foi incomodado(a) por:</p>
                  <h2 className="text-xl font-semibold leading-snug text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{perguntas[atual]}</h2>
                </div>
                <div className="space-y-3">
                  {opcoes.map((op, i) => {
                    const selected = respostas[atual] === op.valor;
                    return (
                      <motion.button key={op.valor} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          const novo = [...respostas]; novo[atual] = op.valor; setRespostas(novo);
                          setTimeout(() => { if (atual < perguntas.length - 1) setAtual(atual + 1); else finalizar(); }, 220);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl border px-5 py-4 text-left transition-colors"
                        style={{ borderColor: selected ? "var(--c-accent)" : "var(--c-border)", background: selected ? "color-mix(in oklab, var(--c-accent) 12%, transparent)" : "color-mix(in oklab, var(--c-bg) 60%, transparent)", color: "var(--c-text)" }}>
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold" style={{ background: selected ? "var(--c-accent)" : "var(--c-surface)", color: selected ? "#fff" : "var(--c-muted)" }}>
                          {selected ? <Check size={14} /> : op.valor}
                        </span>
                        <span className="flex-1">{op.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {atual > 0 && (
                  <button onClick={() => setAtual(atual - 1)} className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
                    <ChevronLeft size={16} /> Voltar
                  </button>
                )}
              </motion.div>
            )}

            {etapa === "resultado" && (
              <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="relative mx-auto mb-5 h-32 w-32">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r={r} fill="none" stroke="var(--c-border)" strokeWidth="10" opacity="0.5" />
                    <motion.circle cx="60" cy="60" r={r} fill="none" stroke={resultado.cor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ}
                      initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - Math.min(1, pontuacao / ringMax)) }} transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="text-3xl font-bold text-[var(--c-text)]">{pontuacao}</motion.span>
                  </div>
                </div>
                <span className="mb-1 block text-xs font-bold uppercase tracking-widest" style={{ color: resultado.cor }}>{resultado.nivel}</span>
                <h2 className="mb-3 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas registradas</h2>
                <p className="mx-auto mb-7 max-w-sm leading-relaxed text-[var(--c-muted)]">{resultado.orientacao}</p>
                <p className="mb-8 text-xs italic text-[var(--c-muted)]">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
                <Link to="/paciente" className="rounded-full border border-[var(--c-border)] px-6 py-3 text-sm text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">Voltar</Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}