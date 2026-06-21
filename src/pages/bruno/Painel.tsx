import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Lock, FileText, ExternalLink, RefreshCw, Plus, Save, Eye, EyeOff, Edit3, X, Bold, Italic, Heading2, List, RotateCcw, Bell } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import JSZip from "jszip";
import { supabase, listarPostsBlog, salvarPostBlog, atualizarPostBlog, deletarPostBlog, type BlogPostDB } from "@/lib/supabase";
import { gerarPDF } from "@/lib/pdf-generator";
import { processarTeste, gerarParecerPDF, type DadosPaciente, type ResultadoTeste } from "@/lib/parecer-generator";
import { testesDisponiveis, neoFacetasPorDominio, neoFacetasNomes, neoDominioNomes, type TesteId, type NeoFFIDominio } from "@/content/normative-tables";
import { posts as staticPosts } from "@/content/posts-loader";
import { fadeUp, stagger } from "@/lib/motion";
import { AppAurora } from "@/components/ui/AppAurora";


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

interface Notificacao { id: number; tipo: string; nome: string; tempo: string; }


interface Resposta { id: number; tipo: string; nome: string; telefone?: string; nascimento?: string; respostas: number[]; pontuacao: number; criado_em: string; }

export default function BrunoPainel() {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loginLoading, setLoginLoading] = useState(true);
  const [tab, setTab] = useState<"respostas" | "blog" | "pareceres">("respostas");
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());

  const [blogPosts, setBlogPosts] = useState<BlogPostDB[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [editando, setEditando] = useState<BlogPostDB | null>(null);
  const [blogForm, setBlogForm] = useState({ slug: "", titulo: "", subtitulo: "", categoria: "Geral", tempo_leitura: "5 min", resumo: "", tags: "", conteudo: "", publicado: false });
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogMsg, setBlogMsg] = useState("");

  const [paciente, setPaciente] = useState<DadosPaciente>({ nome: "", idade: "", dataAvaliacao: new Date().toLocaleDateString("pt-BR"), escolaridade: "" });
  const [parecerTestes, setParecerTestes] = useState<ResultadoTeste[]>([]);
  const [sintese, setSintese] = useState("");
  const [consideracoes, setConsideracoes] = useState("");
  const [addTesteId, setAddTesteId] = useState<TesteId>("phq9");
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Painel | Bruno SG";
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) { setAuth(true); carregar(); carregarBlog(); }
        setLoginLoading(false);
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setAuth(!!session);
      });
      const channel = supabase.channel("respostas-realtime").on(
        "postgres_changes", { event: "INSERT", schema: "public", table: "respostas_questionarios" },
        (payload: { new: { id: number; tipo: string; nome: string; criado_em: string } }) => {
          const r = payload.new;
          const nota: Notificacao = { id: r.id, tipo: r.tipo, nome: r.nome, tempo: "agora" };
          setNotificacoes((prev) => [nota, ...prev].slice(0, 5));
          setTimeout(() => setNotificacoes((prev) => prev.filter((n) => n.id !== r.id)), 8000);
        }
      ).subscribe();
      return () => { document.documentElement.removeAttribute("data-theme"); subscription.unsubscribe(); channel.unsubscribe(); };
    }
    setLoginLoading(false);
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  async function carregar() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase.from("respostas_questionarios").select("*").order("criado_em", { ascending: false });
    setRespostas((data as Resposta[]) ?? []);
    setLoading(false);
  }

  async function carregarBlog() {
    setBlogLoading(true);
    const data = await listarPostsBlog();
    setBlogPosts(data);
    setBlogLoading(false);
  }

  function resetBlogForm() {
    setBlogForm({ slug: "", titulo: "", subtitulo: "", categoria: "Geral", tempo_leitura: "5 min", resumo: "", tags: "", conteudo: "", publicado: false });
    setEditando(null);
    setBlogMsg("");
  }

  function editarPost(p: BlogPostDB) {
    setEditando(p);
    setBlogForm({ slug: p.slug, titulo: p.titulo, subtitulo: p.subtitulo, categoria: p.categoria, tempo_leitura: p.tempo_leitura, resumo: p.resumo, tags: p.tags.join(", "), conteudo: p.conteudo, publicado: p.publicado });
    setBlogMsg("");
  }

  function gerarSlug(titulo: string) {
    return titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function salvarBlog() {
    if (!blogForm.titulo.trim() || !blogForm.conteudo.trim()) { setBlogMsg("Titulo e conteudo obrigatorios"); return; }
    setBlogSaving(true);
    const slug = blogForm.slug || gerarSlug(blogForm.titulo);
    const payload = { slug, titulo: blogForm.titulo, subtitulo: blogForm.subtitulo, categoria: blogForm.categoria, tempo_leitura: blogForm.tempo_leitura, resumo: blogForm.resumo, tags: blogForm.tags.split(",").map((t) => t.trim()).filter(Boolean), conteudo: blogForm.conteudo, publicado: blogForm.publicado };

    if (editando) {
      const { error } = await atualizarPostBlog(editando.id!, payload);
      setBlogMsg(error ? "Erro: " + error.message : "Post atualizado!");
    } else {
      const { error } = await salvarPostBlog(payload);
      setBlogMsg(error ? "Erro: " + error.message : "Post criado!");
    }
    setBlogSaving(false);
    carregarBlog();
  }

  async function deletarPost(id: number) {
    if (!confirm("Deletar este post?")) return;
    await deletarPostBlog(id);
    if (editando?.id === id) resetBlogForm();
    carregarBlog();
  }

  async function togglePublicado(p: BlogPostDB) {
    await atualizarPostBlog(p.id!, { publicado: !p.publicado });
    carregarBlog();
  }

  async function login() {
    if (!supabase) { setErro("Supabase não configurado"); return; }
    setLoginLoading(true);
    setErro("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) { setErro("Email ou senha incorretos"); setLoginLoading(false); return; }
    setAuth(true);
    setLoginLoading(false);
    carregar();
    carregarBlog();
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setAuth(false);
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


  if (loginLoading && !auth) {
    return <div className="flex min-h-screen items-center justify-center" data-theme="c"><AppAurora /><p className="relative z-10 text-[var(--c-muted)]">Carregando...</p></div>;
  }

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
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }}
            placeholder="Senha" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
          {erro && <p className="mb-3 text-xs text-red-500">{erro}</p>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={login} disabled={loginLoading}
            className="w-full rounded-full px-6 py-3 font-medium text-white disabled:opacity-50"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 12px 30px -10px var(--c-accent)" }}>
            {loginLoading ? "Entrando..." : "Entrar"}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  function adicionarTeste() {
    const info = testesDisponiveis.find((t) => t.id === addTesteId);
    if (!info) return;
    const novo: ResultadoTeste = { testeId: info.id, sigla: info.sigla, nome: info.nome, dados: {} };
    setParecerTestes([...parecerTestes, novo]);
  }

  function atualizarDadosTeste(idx: number, key: string, value: string | number) {
    const copia = [...parecerTestes];
    copia[idx] = { ...copia[idx], dados: { ...copia[idx].dados, [key]: value } };
    copia[idx] = processarTeste(copia[idx]);
    setParecerTestes(copia);
  }

  function removerTeste(idx: number) {
    setParecerTestes(parecerTestes.filter((_, i) => i !== idx));
  }

  function exportarParecer() {
    const processados = parecerTestes.map(processarTeste);
    const doc = gerarParecerPDF(paciente, processados, sintese, consideracoes);
    doc.save(`parecer_${paciente.nome.replace(/\s+/g, "_") || "paciente"}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  function resetParecer() {
    setPaciente({ nome: "", idade: "", dataAvaliacao: new Date().toLocaleDateString("pt-BR"), escolaridade: "" });
    setParecerTestes([]);
    setSintese("");
    setConsideracoes("");
  }

  const tabBtn = (id: "respostas" | "blog" | "pareceres") =>
    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all " + (tab === id ? "text-white shadow-[0_8px_20px_-8px_var(--c-accent)]" : "text-[var(--c-muted)] hover:text-[var(--c-text)]");

  return (
    <div className="relative min-h-screen" data-theme="c">
      <AppAurora />

      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold text-[var(--c-text)] transition-colors hover:text-[var(--c-accent)]">Bruno SG</Link>
            <button onClick={logout} className="rounded-full border border-[var(--c-border)] px-3 py-1 text-[10px] text-[var(--c-muted)] transition-colors hover:text-red-500 hover:border-red-300">Sair</button>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setTab("respostas")} className={tabBtn("respostas")} style={tab === "respostas" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Respostas</button>
            <button onClick={() => setTab("blog")} className={tabBtn("blog")} style={tab === "blog" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Blog</button>
            <button onClick={() => setTab("pareceres")} className={tabBtn("pareceres")} style={tab === "pareceres" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Pareceres</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

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
                  <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>
                    {editando ? "Editar post" : blogForm.titulo ? "Novo post" : "Posts do Blog"}
                  </h2>
                  <div className="flex gap-2">
                    {(editando || blogForm.titulo) && (
                      <button onClick={resetBlogForm} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
                    )}
                    {!editando && !blogForm.titulo && (
                      <button onClick={() => setBlogForm({ ...blogForm, titulo: " " })}
                        className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                        style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                        <Plus size={14} /> Novo post
                      </button>
                    )}
                  </div>
                </motion.div>

                {(editando || blogForm.titulo) ? (
                  <motion.div variants={fadeUp} className="space-y-4">
                    <div className="glass-card rounded-2xl p-6">
                      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Metadados</p>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Título</label>
                          <input value={blogForm.titulo.trim() ? blogForm.titulo : ""} onChange={(e) => setBlogForm({ ...blogForm, titulo: e.target.value, slug: editando ? blogForm.slug : gerarSlug(e.target.value) })}
                            className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Slug</label>
                            <input value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-xs text-[var(--c-muted)] focus:border-[var(--c-accent)] focus:outline-none" />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Subtítulo</label>
                            <input value={blogForm.subtitulo} onChange={(e) => setBlogForm({ ...blogForm, subtitulo: e.target.value })}
                              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Categoria</label>
                            <input value={blogForm.categoria} onChange={(e) => setBlogForm({ ...blogForm, categoria: e.target.value })}
                              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Tempo leitura</label>
                            <input value={blogForm.tempo_leitura} onChange={(e) => setBlogForm({ ...blogForm, tempo_leitura: e.target.value })}
                              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                          </div>
                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Tags (vírgula)</label>
                            <input value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })}
                              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] font-medium text-[var(--c-muted)]">Resumo (exibido no card)</label>
                          <textarea value={blogForm.resumo} onChange={(e) => setBlogForm({ ...blogForm, resumo: e.target.value })} rows={2}
                            className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none" />
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Conteúdo</p>
                        <div className="flex gap-1">
                          {[
                            { icon: Bold, insert: "**", wrap: true, title: "Negrito" },
                            { icon: Italic, insert: "_", wrap: true, title: "Itálico" },
                            { icon: Heading2, insert: "## ", wrap: false, title: "Título" },
                            { icon: List, insert: "- ", wrap: false, title: "Lista" },
                          ].map(({ icon: Icon, insert, wrap, title }) => (
                            <button key={title} title={title} onClick={() => {
                              const ta = document.getElementById("blog-content") as HTMLTextAreaElement;
                              if (!ta) return;
                              const start = ta.selectionStart; const end = ta.selectionEnd;
                              const sel = blogForm.conteudo.substring(start, end);
                              const replacement = wrap ? `${insert}${sel || "texto"}${insert}` : `${insert}${sel || ""}`;
                              const newVal = blogForm.conteudo.substring(0, start) + replacement + blogForm.conteudo.substring(end);
                              setBlogForm({ ...blogForm, conteudo: newVal });
                              setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + replacement.length; }, 0);
                            }}
                              className="rounded-lg border border-[var(--c-border)] p-1.5 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)] hover:border-[var(--c-accent)]">
                              <Icon size={14} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <textarea id="blog-content" value={blogForm.conteudo} onChange={(e) => setBlogForm({ ...blogForm, conteudo: e.target.value })} rows={18}
                          placeholder="Escreva em Markdown..."
                          className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] font-mono leading-relaxed focus:border-[var(--c-accent)] focus:outline-none resize-none" />
                        <div className="overflow-y-auto rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/40 px-5 py-4" style={{ maxHeight: "460px" }}>
                          <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-muted)]">Preview</p>
                          <div className="prose prose-sm max-w-none text-[var(--c-text)]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blogForm.conteudo || "*Comece a escrever...*"}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>

                    {blogMsg && <p className={`text-xs ${blogMsg.startsWith("Erro") ? "text-red-500" : "text-green-600"}`}>{blogMsg}</p>}

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-sm text-[var(--c-muted)] cursor-pointer">
                        <input type="checkbox" checked={blogForm.publicado} onChange={(e) => setBlogForm({ ...blogForm, publicado: e.target.checked })} className="accent-[var(--c-accent)]" />
                        Publicar
                      </label>
                      <div className="flex gap-2">
                        <button onClick={resetBlogForm} className="rounded-full border border-[var(--c-border)] px-4 py-2.5 text-xs font-semibold text-[var(--c-muted)] transition-colors hover:text-[var(--c-text)]">Cancelar</button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={salvarBlog} disabled={blogSaving}
                          className="flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-opacity disabled:opacity-50"
                          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                          <Save size={14} /> {blogSaving ? "Salvando..." : editando ? "Atualizar" : "Salvar"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {blogLoading ? (
                      <p className="py-12 text-center text-[var(--c-muted)]">Carregando...</p>
                    ) : (
                      <motion.div variants={fadeUp} className="space-y-3">
                        {blogPosts.length > 0 && (
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Supabase ({blogPosts.length})</p>
                        )}
                        {blogPosts.map((p) => (
                          <div key={"db-" + p.id} className="glass-card flex items-center justify-between rounded-2xl p-5">
                            <div className="flex items-start gap-4">
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-accent)]/12">
                                <FileText size={17} className="text-[var(--c-accent)]" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-[var(--c-text)]">{p.titulo}</h3>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-xs font-medium text-[var(--c-accent)]">{p.categoria}</span>
                                  <span className="text-xs text-[var(--c-muted)]">{p.tempo_leitura}</span>
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.publicado ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {p.publicado ? "Publicado" : "Rascunho"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button onClick={() => togglePublicado(p)} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title={p.publicado ? "Despublicar" : "Publicar"}>
                                {p.publicado ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                              <button onClick={() => editarPost(p)} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title="Editar">
                                <Edit3 size={14} />
                              </button>
                              <button onClick={() => deletarPost(p.id!)} className="rounded-full border border-red-200 p-2 text-red-400 transition-colors hover:text-red-600" title="Deletar">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {staticPosts.length > 0 && (
                          <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-[var(--c-muted)]">Estaticos ({staticPosts.length})</p>
                        )}
                        {staticPosts.map((p) => (
                          <div key={"static-" + p.slug} className="glass-card flex items-center justify-between rounded-2xl p-5 opacity-70">
                            <div className="flex items-start gap-4">
                              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-surface)]">
                                <FileText size={17} className="text-[var(--c-muted)]" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold text-[var(--c-text)]">{p.titulo}</h3>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-xs font-medium text-[var(--c-accent)]">{p.categoria}</span>
                                  <span className="text-xs text-[var(--c-muted)]">{p.tempoLeitura}</span>
                                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-500">JSON</span>
                                </div>
                              </div>
                            </div>
                            <Link to={"/blog/" + p.slug} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title="Ver post">
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}

            {tab === "pareceres" && (
              <>
                <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Gerar Parecer</h2>
                  <div className="flex gap-2">
                    {parecerTestes.length > 0 && (
                      <button onClick={resetParecer} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title="Limpar tudo"><X size={15} /></button>
                    )}
                    <motion.button whileTap={{ scale: 0.96 }} onClick={exportarParecer} disabled={!parecerTestes.length || !paciente.nome}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                      style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                      <Download size={14} /> Exportar PDF
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Dados do Paciente</p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <input value={paciente.nome} onChange={(e) => setPaciente({ ...paciente, nome: e.target.value })}
                      placeholder="Nome completo" className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                    <input value={paciente.idade} onChange={(e) => setPaciente({ ...paciente, idade: e.target.value })}
                      placeholder="Idade" className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                    <input value={paciente.dataAvaliacao} onChange={(e) => setPaciente({ ...paciente, dataAvaliacao: e.target.value })}
                      placeholder="Data da avaliação" className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                    <input value={paciente.escolaridade} onChange={(e) => setPaciente({ ...paciente, escolaridade: e.target.value })}
                      placeholder="Escolaridade" className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Instrumentos ({parecerTestes.length})</p>
                    <div className="flex gap-2">
                      <select value={addTesteId} onChange={(e) => setAddTesteId(e.target.value as TesteId)}
                        className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none">
                        {testesDisponiveis.map((t) => <option key={t.id} value={t.id}>{t.sigla}</option>)}
                      </select>
                      <button onClick={adicionarTeste}
                        className="flex items-center gap-1 rounded-full border border-[var(--c-accent)] px-3 py-1.5 text-xs font-semibold text-[var(--c-accent)] transition-colors hover:bg-[var(--c-accent)]/10">
                        <Plus size={13} /> Adicionar
                      </button>
                    </div>
                  </div>

                  {parecerTestes.length === 0 && (
                    <p className="py-8 text-center text-sm text-[var(--c-muted)]">Nenhum instrumento adicionado. Selecione acima e clique em Adicionar.</p>
                  )}

                  <div className="space-y-4">
                    {parecerTestes.map((t, idx) => (
                      <div key={idx} className="rounded-xl border border-[var(--c-border)] p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-sm font-semibold text-[var(--c-text)]">{t.sigla} — {t.nome}</span>
                          <button onClick={() => removerTeste(idx)} className="text-red-400 transition-colors hover:text-red-600"><X size={14} /></button>
                        </div>

                        {(t.testeId === "neo-ffi") ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2">
                              <select value={String(t.dados.sexo ?? "combinado")} onChange={(e) => atualizarDadosTeste(idx, "sexo", e.target.value)}
                                className="col-span-3 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none">
                                <option value="combinado">Norma combinada</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                              </select>
                              {(["N", "E", "O", "A", "C"] as const).map((dom) => (
                                <input key={dom} type="number" placeholder={dom} value={t.dados[dom] ?? ""}
                                  onChange={(e) => atualizarDadosTeste(idx, dom, Number(e.target.value))}
                                  className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none" />
                              ))}
                            </div>
                          </div>
                        ) : (t.testeId === "neo-pi") ? (
                          <div className="space-y-3">
                            <p className="text-[10px] text-[var(--c-muted)]">Escores T por domínio e faceta (facetas opcionais)</p>
                            {(["N", "E", "O", "A", "C"] as const).map((dom) => (
                              <div key={dom} className="rounded-lg border border-[var(--c-border)]/50 p-3">
                                <div className="mb-2 flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-[var(--c-accent)]">{dom}</span>
                                  <span className="text-[10px] text-[var(--c-muted)]">{neoDominioNomes[dom]}</span>
                                  <input type="number" placeholder="T" value={t.dados[dom] ?? ""}
                                    onChange={(e) => atualizarDadosTeste(idx, dom, Number(e.target.value))}
                                    className="ml-auto w-16 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2 py-1 text-center text-xs text-[var(--c-text)] focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-3 gap-1.5">
                                  {neoFacetasPorDominio[dom as NeoFFIDominio].map((fac) => (
                                    <div key={fac} className="flex items-center gap-1">
                                      <span className="w-7 text-[9px] font-medium text-[var(--c-muted)]">{fac}</span>
                                      <input type="number" placeholder={neoFacetasNomes[fac]?.substring(0, 8)} value={t.dados[fac] ?? ""}
                                        onChange={(e) => atualizarDadosTeste(idx, fac, Number(e.target.value))}
                                        className="w-full rounded border border-[var(--c-border)]/50 bg-[var(--c-bg)]/40 px-2 py-1 text-[10px] text-[var(--c-text)] focus:outline-none" title={neoFacetasNomes[fac]} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (t.testeId === "g36") ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input type="number" placeholder="Acertos (0-36)" value={t.dados.escore ?? ""}
                              onChange={(e) => atualizarDadosTeste(idx, "escore", Number(e.target.value))}
                              className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none" />
                            <select value={String(t.dados.escolaridade ?? "geral")} onChange={(e) => atualizarDadosTeste(idx, "escolaridade", e.target.value)}
                              className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none">
                              <option value="geral">Geral</option>
                              <option value="ensMedio">Ensino Médio</option>
                              <option value="superior">Superior</option>
                            </select>
                          </div>
                        ) : (
                          <input type="number" placeholder="Escore total" value={t.dados.escore ?? ""}
                            onChange={(e) => atualizarDadosTeste(idx, "escore", Number(e.target.value))}
                            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none" />
                        )}

                        {t.resultado && (
                          <div className="mt-3 space-y-2">
                            <div className="rounded-lg bg-[var(--c-surface)] p-3">
                              <p className="mb-1 text-xs font-semibold text-[var(--c-accent)]">{t.resultado.classificacao}</p>
                              <p className="whitespace-pre-line text-xs text-[var(--c-muted)]">{t.resultado.detalhes}</p>
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-muted)]">Texto interpretativo</span>
                                {t.textoEditado && (
                                  <button onClick={() => {
                                    const copia = [...parecerTestes];
                                    copia[idx] = { ...copia[idx], textoEditado: false, texto: undefined };
                                    copia[idx] = processarTeste(copia[idx]);
                                    setParecerTestes(copia);
                                  }} className="flex items-center gap-1 text-[10px] text-[var(--c-accent)] hover:underline" title="Regenerar texto automático">
                                    <RotateCcw size={10} /> Regenerar
                                  </button>
                                )}
                              </div>
                              <textarea value={t.texto ?? ""} onChange={(e) => {
                                const copia = [...parecerTestes];
                                copia[idx] = { ...copia[idx], texto: e.target.value, textoEditado: true };
                                setParecerTestes(copia);
                              }} rows={4}
                                className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs leading-relaxed text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-y" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {parecerTestes.length > 0 && (
                  <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-6">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Síntese e Considerações</p>
                    <textarea value={sintese} onChange={(e) => setSintese(e.target.value)} rows={4}
                      placeholder="Síntese dos resultados (campo livre — será incluído no parecer)"
                      className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none" />
                    <textarea value={consideracoes} onChange={(e) => setConsideracoes(e.target.value)} rows={3}
                      placeholder="Considerações finais"
                      className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none" />
                  </motion.div>
                )}
              </>
            )}

          </motion.div>
        </div>
      </main>

      {/* Notificações realtime */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2" style={{ maxWidth: 320 }}>
        <AnimatePresence>
          {notificacoes.map((n) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.9 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-card flex items-center gap-3 rounded-2xl p-4 shadow-lg" style={{ borderLeft: `3px solid var(--c-accent)` }}>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--c-accent)]/15">
                <Bell size={14} className="text-[var(--c-accent)]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--c-text)] truncate">{n.nome} respondeu</p>
                <p className="text-[10px] text-[var(--c-muted)]">{n.tipo.toUpperCase()} · {n.tempo}</p>
              </div>
              <button onClick={() => { setNotificacoes((prev) => prev.filter((x) => x.id !== n.id)); setTab("respostas"); carregar(); }}
                className="ml-auto flex-shrink-0 text-[10px] font-medium text-[var(--c-accent)] hover:underline">Ver</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}