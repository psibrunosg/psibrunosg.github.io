import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Trash2, Lock } from "lucide-react";
import JSZip from "jszip";
import { supabase } from "@/lib/supabase";
import { gerarPDF } from "@/lib/pdf-generator";
import { fadeUp, stagger } from "@/lib/motion";

const SENHA_ADMIN = "bspsi2024";

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

function classificarPHQ9(s: number) {
  if (s <= 4) return "Minima";
  if (s <= 9) return "Leve";
  if (s <= 14) return "Moderada";
  if (s <= 19) return "Moderadamente grave";
  return "Grave";
}

function classificarGAD7(s: number) {
  if (s <= 4) return "Minima";
  if (s <= 9) return "Leve";
  if (s <= 14) return "Moderada";
  return "Grave";
}

interface Resposta {
  id: number;
  tipo: string;
  nome: string;
  respostas: number[];
  pontuacao: number;
  criado_em: string;
}

export default function AdminRespostas() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Admin Respostas | Bruno SG";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  async function carregarRespostas() {
    if (!supabase) return;
    setLoading(true);
    const { data } = await supabase
      .from("respostas_questionarios")
      .select("*")
      .order("criado_em", { ascending: false });
    setRespostas((data as Resposta[]) ?? []);
    setLoading(false);
  }

  function login() {
    if (senha === SENHA_ADMIN) {
      setAutenticado(true);
      setErroSenha(false);
      carregarRespostas();
    } else {
      setErroSenha(true);
    }
  }

  function toggleSelecionado(id: number) {
    const novo = new Set(selecionados);
    if (novo.has(id)) novo.delete(id); else novo.add(id);
    setSelecionados(novo);
  }

  function selecionarTodos() {
    if (selecionados.size === respostas.length) {
      setSelecionados(new Set());
    } else {
      setSelecionados(new Set(respostas.map(r => r.id)));
    }
  }

  async function exportarLote() {
    const items = respostas.filter(r => selecionados.has(r.id));
    if (items.length === 0) return;
    setExportando(true);

    const zip = new JSZip();

    for (const r of items) {
      const perguntas = r.tipo === "phq9" ? perguntasPHQ9 : perguntasGAD7;
      const nivel = r.tipo === "phq9" ? classificarPHQ9(r.pontuacao) : classificarGAD7(r.pontuacao);
      const dataFormatada = new Date(r.criado_em).toLocaleDateString("pt-BR");

      const doc = gerarPDF({
        tipo: r.tipo === "phq9" ? "PHQ-9" : "GAD-7",
        nome: r.nome,
        pontuacao: r.pontuacao,
        nivel,
        respostas: r.respostas,
        perguntas,
        data: dataFormatada,
      });

      const pdfBlob = doc.output("arraybuffer");
      const fileName = r.tipo.toUpperCase() + "_" + r.nome.replace(/\s+/g, "_") + "_" + dataFormatada.replace(/\//g, "-") + ".pdf";
      zip.file(fileName, pdfBlob);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "respostas_" + new Date().toISOString().slice(0, 10) + ".zip";
    a.click();
    URL.revokeObjectURL(url);
    setExportando(false);
  }

  async function deletarSelecionados() {
    if (!supabase || selecionados.size === 0) return;
    const ids = Array.from(selecionados);
    await supabase.from("respostas_questionarios").delete().in("id", ids);
    setSelecionados(new Set());
    carregarRespostas();
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-6" data-theme="c">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full text-center">
          <Lock size={32} className="mx-auto mb-4 text-[var(--c-accent)]" />
          <h1 className="text-2xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>Admin</h1>
          <p className="text-[var(--c-muted)] text-sm mb-6">Acesso restrito ao psicologo.</p>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") login(); }}
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-text)] mb-3 focus:outline-none focus:border-[var(--c-accent)]"
          />
          {erroSenha && <p className="text-red-500 text-xs mb-3">Senha incorreta</p>}
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
          <span className="text-xs text-[var(--c-muted)]">Admin · Respostas</span>
        </div>
      </header>

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas dos pacientes</h1>
                <p className="text-sm text-[var(--c-muted)]">{respostas.length} registro(s)</p>
              </div>
              <div className="flex gap-2">
                <button onClick={exportarLote} disabled={selecionados.size === 0 || exportando}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--c-accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity">
                  <Download size={15} /> {exportando ? "Gerando..." : "Exportar PDF (" + selecionados.size + ")"}
                </button>
                <button onClick={deletarSelecionados} disabled={selecionados.size === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 disabled:opacity-40 transition-all">
                  <Trash2 size={15} /> Limpar ({selecionados.size})
                </button>
              </div>
            </motion.div>

            {loading ? (
              <p className="text-[var(--c-muted)] text-center py-12">Carregando...</p>
            ) : respostas.length === 0 ? (
              <p className="text-[var(--c-muted)] text-center py-12">Nenhuma resposta registrada ainda.</p>
            ) : (
              <motion.div variants={fadeUp}>
                <div className="rounded-2xl border border-[var(--c-border)] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[var(--c-surface)] border-b border-[var(--c-border)]">
                        <th className="px-4 py-3 text-left">
                          <input type="checkbox" checked={selecionados.size === respostas.length && respostas.length > 0} onChange={selecionarTodos} />
                        </th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Tipo</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Paciente</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Score</th>
                        <th className="px-4 py-3 text-left text-[var(--c-muted)] font-medium">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {respostas.map((r) => (
                        <tr key={r.id} className="border-b border-[var(--c-border)] hover:bg-[var(--c-surface)]/50 transition-colors">
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={selecionados.has(r.id)} onChange={() => toggleSelecionado(r.id)} />
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: r.tipo === "phq9" ? "#B05D3A" : "#4A6B47" }}>
                              {r.tipo.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[var(--c-text)] font-medium">{r.nome}</td>
                          <td className="px-4 py-3 text-[var(--c-text)]">{r.pontuacao}</td>
                          <td className="px-4 py-3 text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}