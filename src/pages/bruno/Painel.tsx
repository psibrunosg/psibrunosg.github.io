import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Trash2, Lock, BarChart3, FileText, PenLine, ExternalLink, RefreshCw } from "lucide-react";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";
import { gerarPDF } from "@/lib/pdf-generator";
import { posts } from "@/content/posts-loader";
import { fadeUp, stagger } from "@/lib/motion";

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
  function toggleAll() { setSelecionados(selecionados.size === respostas.length ? new Set() : new Set(respostas.map(r => r.id))); }

  async function exportar() {
    const items = respostas.filter(r => selecionados.has(r.id));
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

  const totalPHQ9 = respostas.filter(r => r.tipo === "phq9").length;
  const totalGAD7 = respostas.filter(r => r.tipo === "gad7").length;

  if (!auth) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-6" data-theme="c">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full text-center">
          <Lock size={32} className="mx-auto mb-4 text-[var(--c-accent)]" />
          <h1 className="text-2xl font-semibold text-[var(--c-text)] mb-6" style={{ fontFamily: "var(--font-heading)" }}>Painel Bruno SG</h1>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }}
            placeholder="Senha" className="w-full px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-text)] mb-3 focus:outline-none focus:border-[var(--c-accent)]" />
          {erro && <p className="text-red-500 text-xs mb-3">Senha incorreta</p>}
          <button onClick={login} className="w-full px-6 py-3 rounded-full bg-[var(--c-accent)] text-white font-medium hover:opacity-90">Entrar</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)]" data-theme="c">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-[var(--c-text)]">Bruno SG</Link>
          <div className="flex gap-1">
            <button onClick={() => setTab("respostas")} className={"px-4 py-1.5 rounded-full text-xs font-medium transition-colors " + (tab === "respostas" ? "bg-[var(--c-accent)] text-white" : "text-[var(--c-muted)] hover:text-[var(--c-text)]")}>Respostas</button>
            <button onClick={() => setTab("blog")} className={"px-4 py-1.5 rounded-full text-xs font-medium transition-colors " + (tab === "blog" ? "bg-[var(--c-accent)] text-white" : "text-[var(--c-muted)] hover:text-[var(--c-text)]")}>Blog</button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            {/* STATS */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 text-center">
                <BarChart3 size={20} className="mx-auto mb-2 text-[var(--c-accent)]" />
                <p className="text-2xl font-bold text-[var(--c-text)]">{respostas.length}</p>
                <p className="text-xs text-[var(--c-muted)]">Total</p>
              </div>
              <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 text-center">
                <p className="text-2xl font-bold" style={{ color: "#B05D3A" }}>{totalPHQ9}</p>
                <p className="text-xs text-[var(--c-muted)]">PHQ-9</p>
              </div>
              <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-5 text-center">
                <p className="text-2xl font-bold" style={{ color: "#4A6B47" }}>{totalGAD7}</p>
                <p className="text-xs text-[var(--c-muted)]">GAD-7</p>
              </div>
            </motion.div>

            {tab === "respostas" && (
              <>
                <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas</h2>
                  <div className="flex gap-2">
                    <button onClick={carregar} className="p-2 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"><RefreshCw size={15} /></button>
                    <button onClick={exportar} disabled={!selecionados.size || exportando}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--c-accent)] text-white text-xs font-medium hover:opacity-90 disabled:opacity-40">
                      <Download size={14} /> {exportando ? "..." : "PDF (" + selecionados.size + ")"}
                    </button>
                    <button onClick={deletar} disabled={!selecionados.size}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-300 text-red-500 text-xs font-medium hover:bg-red-50 disabled:opacity-40">
                      <Trash2 size={14} /> ({selecionados.size})
                    </button>
                  </div>
                </motion.div>

                {loading ? <p className="text-[var(--c-muted)] text-center py-12">Carregando...</p> :
                respostas.length === 0 ? <p className="text-[var(--c-muted)] text-center py-12">Nenhuma resposta.</p> : (
                  <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--c-border)] overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-[var(--c-surface)] border-b border-[var(--c-border)]">
                        <th className="px-4 py-3 text-left"><input type="checkbox" checked={selecionados.size === respostas.length && respostas.length > 0} onChange={toggleAll} /></th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Tipo</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Paciente</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Nasc.</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Score</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Nivel</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Data</th>
                      </tr></thead>
                      <tbody>{respostas.map((r) => (
                        <tr key={r.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-surface)]/50">
                          <td className="px-4 py-3"><input type="checkbox" checked={selecionados.has(r.id)} onChange={() => toggle(r.id)} /></td>
                          <td className="px-4 py-3"><span className="text-xs font-semibold tracking-widest uppercase" style={{ color: r.tipo === "phq9" ? "#B05D3A" : "#4A6B47" }}>{r.tipo.toUpperCase()}</span></td>
                          <td className="px-4 py-3 text-[var(--c-text)] font-medium">{r.nome}</td>
                          <td className="px-4 py-3 text-[var(--c-muted)] text-xs">{r.nascimento ?? "-"}</td>
                          <td className="px-4 py-3 text-[var(--c-text)]">{r.pontuacao}</td>
                          <td className="px-4 py-3 text-[var(--c-muted)] text-xs">{classNivel(r.tipo, r.pontuacao)}</td>
                          <td className="px-4 py-3 text-[var(--c-muted)] text-xs">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </motion.div>
                )}
              </>
            )}

            {tab === "blog" && (
              <>
                <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Posts do Blog</h2>
                  <a href="/admin/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--c-accent)] text-white text-xs font-medium hover:opacity-90">
                    <PenLine size={14} /> Novo post (CMS)
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="space-y-3">
                  {posts.map((p) => (
                    <div key={p.slug} className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <FileText size={18} className="text-[var(--c-accent)] mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-sm font-semibold text-[var(--c-text)]">{p.titulo}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-[var(--c-accent)] font-medium">{p.categoria}</span>
                            <span className="text-xs text-[var(--c-muted)]">{p.tempoLeitura}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={"/blog/" + p.slug} className="p-2 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors" title="Ver post">
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="mt-8 rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6 text-sm text-[var(--c-muted)]">
                  <strong className="text-[var(--c-text)] block mb-2">Como criar posts</strong>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Clique em "Novo post (CMS)" acima para abrir o editor visual</li>
                    <li>Ou edite diretamente em <code className="text-xs bg-[var(--c-bg)] px-1.5 py-0.5 rounded">src/content/blog/*.json</code> no GitHub</li>
                    <li>Commit na main → deploy automatico em ~3 min</li>
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