import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { 
  listarFormulariosAnonimos, 
  criarFormularioAnonimo, 
  deletarFormularioAnonimo, 
  listarRespostasFormularioAnonimo, 
  type FormularioAnonimoDB, 
  type RespostaFormularioAnonimoDB,
  type FormCampo
} from "@/lib/supabase";
import { Plus, Trash2, Edit, Save, X, ExternalLink, RefreshCw, BarChart2, Eye, Copy, Check } from "lucide-react";

export function PainelFormularios() {
  const [formularios, setFormularios] = useState<FormularioAnonimoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"lista" | "form">("lista");
  const [editando, setEditando] = useState<Partial<FormularioAnonimoDB>>({ titulo: "", descricao: "", campos: [] });
  const [respostas, setRespostas] = useState<RespostaFormularioAnonimoDB[]>([]);
  const [verRespostasId, setVerRespostasId] = useState<string | null>(null);
  const [loadingRespostas, setLoadingRespostas] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    carregarFormularios();
  }, []);

  async function carregarFormularios() {
    setLoading(true);
    const data = await listarFormulariosAnonimos();
    setFormularios(data);
    setLoading(false);
  }

  async function salvarFormulario() {
    if (!editando.titulo || !editando.campos?.length) {
      alert("Preencha título e pelo menos uma pergunta.");
      return;
    }
    
    // Validar IDs dos campos para não irem vazios
    const formFinal = {
      ...editando,
      campos: editando.campos.map(c => ({
        ...c,
        id: c.id || Math.random().toString(36).substring(7)
      }))
    } as Omit<FormularioAnonimoDB, "id" | "criado_em" | "atualizado_em">;

    const { error } = await criarFormularioAnonimo(formFinal);
    if (error) {
      alert("Erro ao salvar formulário: " + error.message);
    } else {
      setView("lista");
      setEditando({ titulo: "", descricao: "", campos: [] });
      carregarFormularios();
    }
  }

  async function excluirFormulario(id: string) {
    if (!confirm("Tem certeza? Isso excluirá o formulário e TODAS as respostas recebidas.")) return;
    await deletarFormularioAnonimo(id);
    carregarFormularios();
  }

  async function abrirRespostas(formId: string) {
    setVerRespostasId(formId);
    setLoadingRespostas(true);
    const data = await listarRespostasFormularioAnonimo(formId);
    setRespostas(data);
    setLoadingRespostas(false);
  }

  function addCampo(tipo: FormCampo["tipo"]) {
    const novo: FormCampo = { id: Math.random().toString(36).substring(7), tipo, pergunta: "" };
    setEditando(prev => ({ ...prev, campos: [...(prev.campos || []), novo] }));
  }

  function removerCampo(id: string) {
    setEditando(prev => ({ ...prev, campos: (prev.campos || []).filter(c => c.id !== id) }));
  }

  function updateCampo(id: string, texto: string) {
    setEditando(prev => ({
      ...prev,
      campos: (prev.campos || []).map(c => c.id === id ? { ...c, pergunta: texto } : c)
    }));
  }

  function copiarLink(id: string) {
    const url = `${window.location.origin}/pesquisa/${id}`;
    navigator.clipboard.writeText(url);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  }

  if (view === "form") {
    return (
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--c-text)]">Novo Formulário Anônimo</h2>
          <button onClick={() => setView("lista")} className="rounded-full border border-[var(--c-border)] p-2 hover:bg-[var(--c-surface)]"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--c-text)]">Título do Formulário (Ex: Percepção de Modos - Barbearia)</label>
            <input 
              value={editando.titulo} 
              onChange={e => setEditando({...editando, titulo: e.target.value})} 
              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-2 text-sm focus:border-[var(--c-accent)] focus:outline-none" 
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-[var(--c-text)]">Descrição (Opcional)</label>
            <textarea 
              value={editando.descricao} 
              onChange={e => setEditando({...editando, descricao: e.target.value})} 
              className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-2 text-sm focus:border-[var(--c-accent)] focus:outline-none" 
              rows={2}
            />
          </div>

          <div className="my-6 border-t border-[var(--c-border)] pt-6">
            <h3 className="mb-4 text-sm font-bold text-[var(--c-text)]">Perguntas</h3>
            
            <div className="space-y-3">
              {(editando.campos || []).map((c, i) => (
                <div key={c.id} className="flex items-start gap-3 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/30 p-3">
                  <div className="mt-2 text-xs font-bold text-[var(--c-accent)]">{i + 1}.</div>
                  <div className="flex-1">
                    <input 
                      value={c.pergunta} 
                      onChange={e => updateCampo(c.id, e.target.value)} 
                      placeholder="Digite a pergunta..."
                      className="w-full rounded bg-transparent px-2 py-1 text-sm focus:bg-[var(--c-bg)] focus:outline-none"
                    />
                    <div className="mt-1 px-2 text-[10px] uppercase text-[var(--c-muted)]">
                      Tipo: {c.tipo.replace("_", " ")}
                    </div>
                  </div>
                  <button onClick={() => removerCampo(c.id)} className="p-2 text-[var(--c-danger)] hover:bg-[var(--c-danger)]/10 rounded-lg"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => addCampo("texto_curto")} className="rounded-lg bg-[var(--c-surface)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-accent)]">+ Texto Curto</button>
              <button onClick={() => addCampo("texto_longo")} className="rounded-lg bg-[var(--c-surface)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-accent)]">+ Texto Longo</button>
              <button onClick={() => addCampo("escala_1_5")} className="rounded-lg bg-[var(--c-surface)] px-3 py-1.5 text-xs font-semibold hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-accent)]">+ Escala 1 a 5</button>
            </div>
          </div>

          <div className="flex justify-end border-t border-[var(--c-border)] pt-4">
            <button onClick={salvarFormulario} className="flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-6 py-2 text-sm font-bold text-white hover:bg-[var(--c-accent-lt)]">
              <Save size={16} /> Salvar Formulário
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (verRespostasId) {
    const form = formularios.find(f => f.id === verRespostasId);
    if (!form) return null;

    return (
      <motion.div variants={fadeUp} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => setVerRespostasId(null)} className="mb-2 text-xs font-semibold text-[var(--c-accent)] hover:underline">← Voltar para lista</button>
            <h2 className="text-xl font-bold text-[var(--c-text)]">Respostas: {form.titulo}</h2>
            <p className="text-sm text-[var(--c-muted)]">Total de {respostas.length} respostas recebidas</p>
          </div>
          <button onClick={() => abrirRespostas(verRespostasId)} className="rounded-full border border-[var(--c-border)] p-2 hover:bg-[var(--c-surface)]"><RefreshCw size={16} /></button>
        </div>

        {loadingRespostas ? (
          <p className="text-sm text-[var(--c-muted)]">Carregando respostas...</p>
        ) : respostas.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-[var(--c-muted)]">Nenhuma resposta recebida ainda.</div>
        ) : (
          <div className="space-y-6">
            {respostas.map((r, index) => (
              <div key={r.id} className="glass-card rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between border-b border-[var(--c-border)] pb-2">
                  <span className="text-xs font-bold text-[var(--c-accent)]">Resposta #{respostas.length - index}</span>
                  <span className="text-xs text-[var(--c-muted)]">{new Date(r.criado_em!).toLocaleString("pt-BR")}</span>
                </div>
                <div className="space-y-4">
                  {form.campos.map(campo => (
                    <div key={campo.id}>
                      <p className="mb-1 text-xs font-semibold text-[var(--c-text)]">{campo.pergunta}</p>
                      <div className="rounded-lg bg-[var(--c-surface)]/50 p-3 text-sm text-[var(--c-text)]">
                        {r.respostas[campo.id] !== undefined ? r.respostas[campo.id] : <span className="text-[var(--c-muted)]">Não respondido</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--c-text)]">Formulários Anônimos</h2>
        <div className="flex gap-2">
          <button onClick={carregarFormularios} className="rounded-full border border-[var(--c-border)] p-2 hover:bg-[var(--c-surface)]"><RefreshCw size={16} /></button>
          <button onClick={() => { setEditando({ titulo: "", descricao: "", campos: [] }); setView("form"); }} className="flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-sm font-bold text-white">
            <Plus size={16} /> Novo Formulário
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--c-muted)]">Carregando formulários...</p>
      ) : formularios.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-[var(--c-muted)]">Nenhum formulário criado.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {formularios.map(f => (
            <div key={f.id} className="glass-card flex flex-col justify-between rounded-2xl p-5">
              <div>
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="font-bold text-[var(--c-text)]">{f.titulo}</h3>
                  <span className={`flex h-2 w-2 flex-shrink-0 rounded-full ${f.ativo ? "bg-[#38a169]" : "bg-[var(--c-muted)]"}`} title={f.ativo ? "Ativo" : "Inativo"}></span>
                </div>
                <p className="mb-4 text-xs text-[var(--c-muted)] line-clamp-2">{f.descricao || "Sem descrição"}</p>
                <div className="mb-4 flex flex-wrap gap-2 text-[10px] uppercase text-[var(--c-accent)]">
                  <span className="rounded-full bg-[var(--c-accent)]/10 px-2 py-1 font-bold">{f.campos.length} Perguntas</span>
                  <span className="rounded-full bg-[var(--c-accent)]/10 px-2 py-1 font-bold">Criado em {new Date(f.criado_em!).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-[var(--c-border)] pt-4">
                <div className="flex gap-2">
                  <button onClick={() => abrirRespostas(f.id!)} className="flex items-center gap-1.5 rounded-lg border border-[var(--c-accent)] bg-[var(--c-accent)]/5 px-3 py-1.5 text-xs font-semibold text-[var(--c-accent)] hover:bg-[var(--c-accent)]/20">
                    <BarChart2 size={14} /> Respostas
                  </button>
                  <button onClick={() => copiarLink(f.id!)} className="flex items-center gap-1.5 rounded-lg border border-[var(--c-border)] px-3 py-1.5 text-xs font-semibold text-[var(--c-text)] hover:bg-[var(--c-surface)]">
                    {copiado === f.id ? <Check size={14} className="text-[#38a169]" /> : <Copy size={14} />} Link
                  </button>
                </div>
                <button onClick={() => excluirFormulario(f.id!)} className="text-[var(--c-danger)] hover:bg-[var(--c-danger)]/10 rounded-lg p-2"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
