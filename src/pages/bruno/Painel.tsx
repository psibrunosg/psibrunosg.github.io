import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Trash2, Lock, BarChart3, FileText, PenLine, ExternalLink, RefreshCw } from "lucide-react";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";
import { gerarPDF } from "@/lib/pdf-generator";
import { posts } from "@/content/posts-loader";
import { fadeUp, stagger } from "@/lib/motion";
import { AppAurora } from "@/components/ui/AppAurora";

const SENHA = "bspsi2024";

const perguntasPHQ9 = [
  "Pouco interesse ou prazer em fazer as coisas",
  "Se sentir para baixo, deprimido(a) ou sem perspectiva",
  "Dificuldade para adormecer ou permanecer dormindo",
  "Se sentir cansado(a) ou com pouca energia",
  "Falta de apetite ou comer demais",
  "Se sentir mal consigo mesmo(a)",
  "Dificuldade para se concentrar",
  "Falar ou se mover mais devagar do que o habitual",
  "Pensar em se machucar ou que seria melhor estar morto(a)",
];
const perguntasGAD7 = [
  "Se sentir nervoso(a), ansioso(a) ou no limite",
  "Nao conseguir parar ou controlar a preocupacao",
  "Se preocupar muito com diversas coisas",
  "Dificuldade para relaxar",
  "Ficar tao agitado(a) que se torna dificil ficar parado(a)",
  "Ficar facilmente irritado(a) ou irritavel",
  "Sentir medo como se algo horrivel pudesse acontecer",
];

function classNivel(tipo: string, s: number) {
  if (tipo === "phq9") {
    if (s <= 4) return "Minima"; if (s <= 9) return "Leve"; if (s <= 14) return "Moderada"; if (s <= 19) return "Mod. grave"; return "Grave";
  }
  if (s <= 4) return "Minima"; if (s <= 9) return "Leve"; if (s <= 14) return "Moderada"; return "Grave";
}

function CountUp({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 700;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

interface Resposta { id: number; tipo: string; nome: string; telefone?: string; nascimento?: string; respostas: number[]; pontuacao: number; criado_em: string; }

export default function BrunoPainel() {
  const [auth, setAuth] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [tab, setTab] = useState<"respostas" | "blog">("respostas");
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Painel | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  async function carregar() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from("respostas_questionarios").select("*").order("criado_em", { ascending: false });
    setRespostas((data as Resposta[]) ?? []);
    setLoading(false);
  }

  function login() {
    if (senha === SENHA) { setAuth(true); setErro(false); carregar(); } else setErro(true);
  }

  function toggle(id: number) { const n = new Set(selecionados); if (n.has(id)) n.delete(id); else n.add(id); setSelecionados(n); }
  function toggleAll() { setSelecionados(selecionados.size === respostas.length ? new Set() : new Set(respostas.map((r) => r.id))); }

  async function exportar() {
    const items = respostas.filter((r) => selecionados.has(r.id));
    if (!items.length) return;
    setExportando(true);
    const zip = new JSZip();
    for (const r of items) {
      const perguntas = r.tipo === "phq9" ? perguntasPHQ9 : perguntasGAD7;
      const dt = new Date(r.criado_em).toLocaleDateString("pt-BR");
      const doc = gerarPDF({ tipo: r.tipo === "phq9" ? "PHQ-9" : "GAD-7", nome: r.nome, pontuacao: r.pontuacao, nivel: classNivel(r.tipo, r.pontuacao), respostas: r.respostas, perguntas, data: dt });
      zip.file(r.tipo.toUpperCase() + "_" + r.nome.replace(/\s+/g, "_") + "_" + dt.replace(/\//g, "-") + ".pdf", doc.output("arraybuffer"));
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "respostas_" + new Date().toISOString().slice(0, 10) + ".zip"; a.click();
    setExportando(false);
  }

  async function deletar() {
    if (!supabase || !selecionados.size) return;
    await supabase.from("respostas_questionarios").delete().in("id", Array.from(selecionados));
    setSelecionados(new Set()); carregar();
  }

  const totalPHQ9 = respostas.filter((r) => r.tipo === "phq9").length;
  const totalGAD7 = respostas.filter((r) => r.tipo === "gad7").length;

  if (!auth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6" data-theme="c">
        <AppAurora />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card relative z-10 w-full max-w-sm rounded-3xl p-8 text-center">
          <motion.div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(140deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 16px 40px -12px var(--c-accent)" }}
            initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <Lock size={26} className="text-white" />
          </motion.div>
          <h1 className="mb-1 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Painel Bruno SG</h1>
          <p className="mb-6 text-xs text-[var(--c-muted)]">Acesso restrito ao psicologo</p>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }}
            placeholder="Senha" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
          {erro && <p className="mb-3 text-xs text-red-500">Senha incorreta</p>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={login}
            className="w-full rounded-full px-6 py-3 font-medium text-white"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 12px 30px -10px var(--c-accent)" }}>
            Entrar
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const tabBtn = (id: "respostas" | "blog") =>
    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all " + (tab === id ? "text-white shadow-[0_8px_20px_-8px_var(--c-accent)]" : "text-[var(--c-muted)] hover:text-[var(--c-text)]");

  return (
    <div className="relative min-h-screen" data-theme="c">
      <AppAurora />

      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-[var(--c-text)] transition-colors hover:text-[var(--c-accent)]">Bruno SG</Link>
          <div className="flex gap-1">
            <button onClick={() => setTab("respostas")} className={tabBtn("respostas")} style={tab === "respostas" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Respostas</button>
            <button onClick={() => setTab("blog")} className={tabBtn("blog")} style={tab === "blog" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Blog</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            {/* STATS */}
            <motion.div variants={fadeUp} className="mb-8 grid grid-cols-3 gap-4">
              <div className="glass-card relative overflow-hidden rounded-2xl p-5 text-center">
                <span className="absolute left-0 top-0 h-full w-1.5 bg-[var(--c-accent)]" aria-hidden="true" />
                <BarChart3 size={20} className="mx-auto mb-2 text-[var(--c-accent)]" />
                <p className="text-3xl font-bold text-[var(--c-text)]"><CountUp value={respostas.length} /></p>
                <p className="text-xs text-[var(--c-muted)]">Total</p>
              </div>
              <div className="glass-card relative overflow-hidden rounded-2xl p-5 text-center">
                <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: "#B05D3A" }} aria-hidden="true" />
                <p className="text-3xl font-bold" style={{ color: "#B05D3A" }}><CountUp value={totalPHQ9} /></p>
                <p className="text-xs text-[var(--c-muted)]">PHQ-9</p>
              </div>
              <div className="glass-card relative overflow-hidden rounded-2xl p-5 text-center">
                <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: "#4A6B47" }} aria-hidden="true" />
                <p className="text-3xl font-bold" style={{ color: "#4A6B47" }}><CountUp value={totalGAD7} /></p>
                <p className="text-xs text-[var(--c-muted)]">GAD-7</p>
              </div>
            </motion.div>

            {tab === "respostas" && (
              <>
                <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas</h2>
                  <div className="flex gap-2">
                    <button onClick={carregar} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><RefreshCw size={15} /></button>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={exportar} disabled={!selecionados.size || exportando}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                      style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                      <Download size={14} /> {exportando ? "..." : "PDF (" + selecionados.size + ")"}
                    </motion.button>
                    <button onClick={deletar} disabled={!selecionados.size}
                      className="flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 disabled:opacity-40">
                      <Trash2 size={14} /> ({selecionados.size})
                    </button>
                  </div>
                </motion.div>

                {loading ? (
                  <p className="py-12 text-center text-[var(--c-muted)]">Carregando...</p>
                ) : respostas.length === 0 ? (
                  <p className="py-12 text-center text-[var(--c-muted)]">Nenhuma resposta.</p>
                ) : (
                  <motion.div variants={fadeUp} className="glass-card overflow-x-auto rounded-2xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--c-border)] text-left">
                          <th className="px-4 py-3"><input type="checkbox" checked={selecionados.size === respostas.length && respostas.length > 0} onChange={toggleAll} /></th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Tipo</th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Paciente</th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Nasc.</th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Score</th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Nivel</th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {respostas.map((r) => {
                          const cor = r.tipo === "phq9" ? "#B05D3A" : r.tipo === "gad7" ? "#4A6B47" : "var(--c-accent)";
                          return (
                            <tr key={r.id} className="border-b border-[var(--c-border)]/60 transition-colors hover:bg-[var(--c-surface)]/40">
                              <td className="px-4 py-3"><input type="checkbox" checked={selecionados.has(r.id)} onChange={() => toggle(r.id)} /></td>
                              <td className="px-4 py-3">
                                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: cor + "1A", color: cor }}>{r.tipo.toUpperCase()}</span>
                              </td>
                              <td className="px-4 py-3 font-medium text-[var(--c-text)]">{r.nome}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{r.nascimento ?? "-"}</td>
                              <td className="px-4 py-3 font-semibold text-[var(--c-text)]">{r.pontuacao}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{classNivel(r.tipo, r.pontuacao)}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </>
            )}

            {tab === "blog" && (
              <>
                <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Posts do Blog</h2>
                  <a href="/admin/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                    <PenLine size={14} /> Novo post (CMS)
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-3">
                  {posts.map((p) => (
                    <div key={p.slug} className="glass-card flex items-center justify-between rounded-2xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-accent)]/12">
                          <FileText size={17} className="text-[var(--c-accent)]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--c-text)]">{p.titulo}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs font-medium text-[var(--c-accent)]">{p.categoria}</span>
                            <span className="text-xs text-[var(--c-muted)]">{p.tempoLeitura}</span>
                          </div>
                        </div>
                      </div>
                      <Link to={"/blog/" + p.slug} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title="Ver post">
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="glass-card mt-8 rounded-2xl p-6 text-sm text-[var(--c-muted)]">
                  <strong className="mb-2 block text-[var(--c-text)]">Como criar posts</strong>
                  <ol className="list-decimal space-y-1 pl-4">
                    <li>Clique em "Novo post (CMS)" acima para abrir o editor visual</li>
                    <li>Ou edite diretamente em <code className="rounded bg-[var(--c-bg)] px-1.5 py-0.5 text-xs">src/content/blog/*.json</code> no GitHub</li>
                    <li>Commit na main, deploy automatico em ~3 min</li>
                  </ol>
                </motion.div>
              </>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
}