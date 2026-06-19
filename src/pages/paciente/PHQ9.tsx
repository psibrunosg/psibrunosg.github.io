import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User } from "lucide-react";
import { salvarResposta } from "@/lib/supabase";

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

  function finalizar() {
    salvarResposta({ tipo: "phq9", nome: nome.trim(), telefone: telefone.trim(), nascimento, respostas: respostas as number[], pontuacao });
    setEtapa("resultado");
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex flex-col" data-theme="c">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/paciente" className="text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors">Voltar</Link>
          <span className="text-xs font-semibold text-[var(--c-text)]">PHQ-9</span>
          {etapa === "form" ? <span className="text-xs text-[var(--c-muted)]">{atual + 1} / {perguntas.length}</span> : <span />}
        </div>
      </header>

      <main id="main" className="flex-1 flex items-center justify-center pt-20 pb-12 px-6">
        <div className="max-w-lg w-full">
          <AnimatePresence mode="wait">

            {etapa === "dados" && (
              <motion.div key="dados" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto">
                <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--c-accent)" + "15" }}>
                      <User size={20} style={{ color: "var(--c-accent)" }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Seus dados</h2>
                      <p className="text-xs text-[var(--c-muted)]">Necessarios para gerar o relatorio</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-[var(--c-text)] block mb-1.5">Nome completo <span className="text-[var(--c-accent)]">*</span></label>
                      <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text)] placeholder:text-[var(--c-muted)]/50 focus:outline-none focus:border-[var(--c-accent)] transition-colors" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--c-text)] block mb-1.5">Data de nascimento <span className="text-[var(--c-accent)]">*</span></label>
                      <input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text)] focus:outline-none focus:border-[var(--c-accent)] transition-colors" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--c-text)] block mb-1.5">Telefone / WhatsApp <span className="text-[var(--c-muted)] text-xs font-normal">(opcional)</span></label>
                      <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(53) 9 9999-9999"
                        className="w-full px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] text-[var(--c-text)] placeholder:text-[var(--c-muted)]/50 focus:outline-none focus:border-[var(--c-accent)] transition-colors" />
                    </div>
                  </div>

                  <button onClick={() => setEtapa("intro")} disabled={!dadosValidos}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--c-accent)] text-white font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
                    Continuar <ChevronRight size={16} />
                  </button>

                  <p className="text-xs text-[var(--c-muted)] mt-4 text-center">
                    Dados protegidos pelo sigilo profissional e acessiveis apenas ao seu psicologo.
                  </p>
                </div>
              </motion.div>
            )}

            {etapa === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-[var(--c-accent)] mb-3 block">PHQ-9</span>
                <h1 className="text-3xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Rastreio de Depressao</h1>
                <p className="text-sm text-[var(--c-muted)] mb-6">Ola, <strong className="text-[var(--c-text)]">{nome.trim()}</strong>.</p>
                <p className="text-[var(--c-muted)] mb-4 leading-relaxed">
                  Este questionario pergunta sobre como voce tem se sentido nas <strong>ultimas duas semanas</strong>. Sao 9 perguntas, leva cerca de 3 minutos.
                </p>
                <p className="text-xs text-[var(--c-muted)] mb-10 italic">Ferramenta de rastreio, nao de diagnostico.</p>
                <button onClick={() => setEtapa("form")} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--c-accent)] text-white font-medium hover:opacity-90 transition-opacity">
                  Iniciar <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {etapa === "form" && (
              <motion.div key={"q" + atual} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="h-1.5 bg-[var(--c-border)] rounded-full overflow-hidden mb-6">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: ((atual + 1) / perguntas.length) * 100 + "%", background: "var(--c-accent)" }} />
                </div>
                <p className="text-xs text-[var(--c-muted)] mb-2">Nas ultimas duas semanas, com que frequencia voce foi incomodado(a) por:</p>
                <h2 className="text-xl font-semibold text-[var(--c-text)] mb-8" style={{ fontFamily: "var(--font-heading)" }}>{perguntas[atual]}</h2>
                <div className="space-y-3">
                  {opcoes.map((op) => (
                    <button key={op.valor} onClick={() => {
                      const novo = [...respostas]; novo[atual] = op.valor; setRespostas(novo);
                      setTimeout(() => {
                        if (atual < perguntas.length - 1) setAtual(atual + 1);
                        else finalizar();
                      }, 200);
                    }}
                      className="w-full text-left px-5 py-4 rounded-xl border transition-all"
                      style={{ borderColor: respostas[atual] === op.valor ? "var(--c-accent)" : "var(--c-border)", background: respostas[atual] === op.valor ? "var(--c-accent)10" : "var(--c-surface)", color: "var(--c-text)" }}
                    >{op.label}</button>
                  ))}
                </div>
                {atual > 0 && (
                  <button onClick={() => setAtual(atual - 1)} className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors">
                    <ChevronLeft size={16} /> Voltar
                  </button>
                )}
              </motion.div>
            )}

            {etapa === "resultado" && (
              <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white" style={{ background: resultado.cor }}>{pontuacao}</div>
                <span className="text-xs tracking-widest uppercase font-semibold block mb-1" style={{ color: resultado.cor }}>{resultado.nivel}</span>
                <h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Respostas registradas</h2>
                <p className="text-[var(--c-muted)] leading-relaxed mb-6 max-w-sm mx-auto">{resultado.orientacao}</p>
                <p className="text-xs text-[var(--c-muted)] mb-10 italic">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
                <Link to="/paciente" className="px-6 py-3 rounded-full border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent)] transition-colors text-sm">Voltar</Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}