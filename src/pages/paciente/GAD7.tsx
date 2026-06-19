import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Download, MessageCircle, Mail } from "lucide-react";
import { baixarPDF, gerarWhatsAppLink, gerarEmailLink } from "@/lib/pdf-generator";
import { salvarResposta } from "@/lib/supabase";

const perguntas = [
  "Se sentir nervoso(a), ansioso(a) ou no limite",
  "Nao conseguir parar ou controlar a preocupacao",
  "Se preocupar muito com diversas coisas",
  "Dificuldade para relaxar",
  "Ficar tao agitado(a) que se torna dificil ficar parado(a)",
  "Ficar facilmente irritado(a) ou irritavel",
  "Sentir medo como se algo horrivel pudesse acontecer",
];

const opcoes = [
  { label: "Nenhuma vez", valor: 0 },
  { label: "Varios dias", valor: 1 },
  { label: "Mais da metade dos dias", valor: 2 },
  { label: "Quase todos os dias", valor: 3 },
];

function classificar(score: number): { nivel: string; cor: string; orientacao: string } {
  if (score <= 4) return { nivel: "Minima ou nenhuma", cor: "#4A6B47", orientacao: "Seu rastreio indica ausencia ou nivel minimo de ansiedade. Continue atento ao seu bem-estar." };
  if (score <= 9) return { nivel: "Leve", cor: "#8A6A3A", orientacao: "Ha indicios leves de ansiedade. Compartilhe com seu psicologo para avaliacao conjunta." };
  if (score <= 14) return { nivel: "Moderada", cor: "#B05D3A", orientacao: "Nivel moderado de ansiedade. E importante discutir esses resultados com seu psicologo." };
  return { nivel: "Grave", cor: "#8B1A1A", orientacao: "Nivel elevado de ansiedade. Entre em contato com seu psicologo o quanto antes." };
}

export default function GAD7() {
  const [etapa, setEtapa] = useState<"intro" | "form" | "dados" | "resultado">("intro");
  const [respostas, setRespostas] = useState<(number | null)[]>(Array(7).fill(null));
  const [atual, setAtual] = useState(0);
  const [nome, setNome] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "GAD-7 | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const pontuacao = respostas.reduce<number>((acc, r) => acc + (r ?? 0), 0);
  const resultado = classificar(pontuacao);
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  const dadosPDF = {
    tipo: "GAD-7" as const,
    nome,
    pontuacao,
    nivel: resultado.nivel,
    respostas: respostas as number[],
    perguntas,
    data: dataHoje,
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex flex-col" data-theme="c">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/paciente" className="text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors">Voltar</Link>
          <span className="text-xs font-semibold text-[var(--c-text)]">GAD-7</span>
          {etapa === "form" ? <span className="text-xs text-[var(--c-muted)]">{atual + 1} / {perguntas.length}</span> : <span />}
        </div>
      </header>

      <main id="main" className="flex-1 flex items-center justify-center pt-20 pb-12 px-6">
        <div className="max-w-lg w-full">
          <AnimatePresence mode="wait">

            {etapa === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <span className="text-xs font-semibold tracking-widest uppercase block mb-3" style={{ color: "#4A6B47" }}>GAD-7</span>
                <h1 className="text-3xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Rastreio de Ansiedade</h1>
                <p className="text-[var(--c-muted)] mb-4 leading-relaxed">
                  Este questionario pergunta sobre como voce tem se sentido nas <strong>ultimas duas semanas</strong>. Sao 7 perguntas, leva cerca de 2 minutos.
                </p>
                <p className="text-xs text-[var(--c-muted)] mb-4 italic">Ferramenta de rastreio, nao de diagnostico. Dados protegidos pelo sigilo profissional.</p>
                <p className="text-xs text-[var(--c-muted)] mb-10 rounded-xl bg-[var(--c-surface)] border border-[var(--c-border)] p-4">
                  Seus dados sao processados apenas no seu navegador. Ao final, voce pode baixar o PDF e compartilhar diretamente com seu psicologo por WhatsApp ou e-mail.
                </p>
                <button onClick={() => setEtapa("form")} className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity" style={{ background: "#4A6B47" }}>
                  Iniciar <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {etapa === "form" && (
              <motion.div key={"q" + atual} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="h-1.5 bg-[var(--c-border)] rounded-full overflow-hidden mb-6">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: ((atual + 1) / perguntas.length) * 100 + "%", background: "#4A6B47" }} />
                </div>
                <p className="text-xs text-[var(--c-muted)] mb-2">Nas ultimas duas semanas, com que frequencia voce foi incomodado(a) por:</p>
                <h2 className="text-xl font-semibold text-[var(--c-text)] mb-8" style={{ fontFamily: "var(--font-heading)" }}>{perguntas[atual]}</h2>
                <div className="space-y-3">
                  {opcoes.map((op) => (
                    <button key={op.valor} onClick={() => {
                      const novo = [...respostas]; novo[atual] = op.valor; setRespostas(novo);
                      setTimeout(() => { if (atual < perguntas.length - 1) setAtual(atual + 1); else setEtapa("dados"); }, 200);
                    }}
                      className="w-full text-left px-5 py-4 rounded-xl border transition-all"
                      style={{ borderColor: respostas[atual] === op.valor ? "#4A6B47" : "var(--c-border)", background: respostas[atual] === op.valor ? "#4A6B4718" : "var(--c-surface)", color: "var(--c-text)" }}
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

            {etapa === "dados" && (
              <motion.div key="dados" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>Quase la</h2>
                <p className="text-[var(--c-muted)] mb-8 leading-relaxed">Informe seu nome para gerar o documento com os resultados.</p>
                <div className="mb-8">
                  <label className="text-sm font-medium text-[var(--c-text)] block mb-1.5">Nome <span className="text-[var(--c-accent)]">*</span></label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-text)] placeholder:text-[var(--c-muted)]/50 focus:outline-none focus:border-[var(--c-accent)] transition-colors"
                    onKeyDown={(e) => { if (e.key === "Enter" && nome.trim()) setEtapa("resultado"); }}
                  />
                </div>
                <button onClick={() => {
                    if (!nome.trim()) return;
                    salvarResposta({ tipo: "gad7", nome: nome.trim(), respostas: respostas as number[], pontuacao });
                    setEtapa("resultado");
                  }} disabled={!nome.trim()}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity" style={{ background: "#4A6B47" }}>
                  Ver resultado
                </button>
                <p className="text-xs text-[var(--c-muted)] mt-4 text-center">Seus dados sao armazenados de forma segura e acessados apenas pelo seu psicologo.</p>
              </motion.div>
            )}

            {etapa === "resultado" && (
              <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white" style={{ background: resultado.cor }}>{pontuacao}</div>
                <span className="text-xs tracking-widest uppercase font-semibold block mb-1" style={{ color: resultado.cor }}>{resultado.nivel}</span>
                <h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>Resultado do GAD-7</h2>
                <p className="text-[var(--c-muted)] leading-relaxed mb-8 max-w-sm mx-auto">{resultado.orientacao}</p>

                <div className="space-y-3 mb-8 max-w-xs mx-auto">
                  <button onClick={() => baixarPDF(dadosPDF)} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity" style={{ background: "#4A6B47" }}>
                    <Download size={16} /> Baixar PDF
                  </button>
                  <a href={gerarWhatsAppLink(dadosPDF, "5553991898309")} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#25D366] text-[#25D366] font-medium hover:bg-[#25D366]/10 transition-colors">
                    <MessageCircle size={16} /> Enviar por WhatsApp
                  </a>
                  <a href={gerarEmailLink(dadosPDF, "brunosg2711@gmail.com")} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[var(--c-border)] text-[var(--c-text)] font-medium hover:border-[var(--c-accent)] transition-colors">
                    <Mail size={16} /> Enviar por e-mail
                  </a>
                </div>

                <p className="text-xs text-[var(--c-muted)] mb-8 italic">GAD-7: escala validada de rastreio. Nao constitui diagnostico. Dados protegidos e acessiveis apenas ao seu psicologo.</p>
                <Link to="/paciente" className="text-sm text-[var(--c-accent)] hover:underline">Outros questionarios</Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}