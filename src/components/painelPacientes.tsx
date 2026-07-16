import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Copy, Check, Unlock, Eye, EyeOff, Link2, Send, Trash2, Pencil, X, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fadeUp } from "@/lib/motion";
import { ESCALAS_RESTRITAS } from "@/content/escalas-restritas";

interface PacienteCodigo {
  codigo: string;
  nome: string;
  unlockedExercises: string[];
  allowedScales?: string[];
  expiresAt?: string | null;
  lastSeenAt?: string | null;
}

interface PatientCodeRow {
  code: string;
  nome_paciente: string | null;
  restricted_unlocked: string[] | null;
  allowed_scales: string[] | null;
  expires_at: string | null;
  last_seen_at: string | null;
  active: boolean;
  created_at: string;
}

function rowParaPaciente(row: PatientCodeRow): PacienteCodigo {
  return {
    codigo: row.code,
    nome: row.nome_paciente?.trim() || "Nome não informado",
    unlockedExercises: row.restricted_unlocked || [],
    allowedScales: row.allowed_scales || [],
    expiresAt: row.expires_at,
    lastSeenAt: row.last_seen_at,
  };
}

const LOCAL_STORAGE_KEY = "painel_pacientes_local";

const SITE_URL = "https://psibrunosg.github.io";

function labelDaEscala(id: string): string {
  return ESCALAS_RESTRITAS.find((e) => e.id === id)?.label ?? id.toUpperCase();
}

function linkDireto(escalaId: string, codigo: string): string {
  return `${SITE_URL}/paciente/escala/${escalaId}?codigo=${codigo}`;
}

function formatarValidade(expiresAt?: string | null): string {
  if (!expiresAt) return "";
  try {
    return new Date(expiresAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return "";
  }
}

function mensagemPaciente(escalaId: string, codigo: string, expiresAt?: string | null): string {
  const link = linkDireto(escalaId, codigo);
  const validade = formatarValidade(expiresAt);
  return `Olá! Segue o link para responder o questionário ${labelDaEscala(escalaId)}: ${link}${validade ? `\nVálido até ${validade}.` : ""}`;
}

// Feature 6: mensagem genérica de acesso (sem escala específica) — usada pelo botão WhatsApp do card.
function mensagemAcessoGenerica(codigo: string): string {
  return `Olá! Segue seu código de acesso: ${codigo}\nAcesse ${SITE_URL}/paciente e informe esse código para responder seu questionário.`;
}

// ponytail: nenhum telefone é salvo junto ao código, então o link wa.me abre sem
// destinatário (o terapeuta escolhe o contato na hora). Se um telefone por código
// passar a ser armazenado, dá pra montar https://wa.me/<numero>?text=... direto.
function abrirWhatsApp(texto: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank");
}

export function PainelPacientes() {
  const [pacientes, setPacientes] = useState<PacienteCodigo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [nomePaciente, setNomePaciente] = useState("");
  const [escalaRestrita, setEscalaRestrita] = useState("");
  const [validadeHoras, setValidadeHoras] = useState("48");
  const [showNomes, setShowNomes] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [unlockingCode, setUnlockingCode] = useState<string | null>(null);
  const [exercicioUnlock, setExercicioUnlock] = useState("");
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [editandoCodigo, setEditandoCodigo] = useState<string | null>(null);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [salvandoNome, setSalvandoNome] = useState(false);

  const carregarPacientes = async () => {
    if (!supabase) {
      setErroCarregar("Supabase não configurado.");
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErroCarregar(null);
    try {
      const { data, error } = await supabase
        .from("patient_codes")
        .select("code, nome_paciente, restricted_unlocked, allowed_scales, expires_at, last_seen_at, active, created_at")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPacientes(((data as PatientCodeRow[]) || []).map(rowParaPaciente));
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setErroCarregar("Erro ao carregar pacientes do banco.");
    }
    setCarregando(false);
  };

  // Fonte de verdade: Supabase. Carrega a lista ao montar e, se ainda
  // existir a chave antiga de localStorage, migra os nomes para o banco
  // (upsert em nome_paciente para codes que já existem) e remove a chave.
  useEffect(() => {
    (async () => {
      await carregarPacientes();

      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!stored) return;

      try {
        const entradasLocais: PacienteCodigo[] = JSON.parse(stored);
        for (const entrada of entradasLocais) {
          if (!entrada?.codigo || !entrada?.nome) continue;
          await supabase
            ?.from("patient_codes")
            .update({ nome_paciente: entrada.nome })
            .eq("code", entrada.codigo);
        }
      } catch (error) {
        console.warn("Erro ao migrar pacientes locais para o banco:", error);
      } finally {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        await carregarPacientes();
      }
    })();
  }, []);

  const handleGenerarCodigo = async () => {
    const nomeParaEnviar = nomePaciente.trim();
    if (!nomeParaEnviar) {
      alert("Informe o nome do paciente antes de gerar o código.");
      return;
    }
    setGerando(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase?.auth.getSession())?.data?.session?.access_token || ""}` },
          body: JSON.stringify({
            allowed_scales: escalaRestrita ? [escalaRestrita] : [],
            expires_in_hours: Number(validadeHoras),
            nome_paciente: nomeParaEnviar,
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao gerar código");

      const data = await response.json();
      const novoPaciente: PacienteCodigo = {
        codigo: data.code,
        nome: (data.nome_paciente as string | null)?.trim() || nomeParaEnviar,
        unlockedExercises: [],
        allowedScales: data.allowed_scales || [],
        expiresAt: data.expires_at || null,
        lastSeenAt: null,
      };
      setPacientes([novoPaciente, ...pacientes]);
      setNomePaciente("");
      // Expande automaticamente o código recém-gerado para exibir os
      // links diretos das escalas autorizadas, se houver.
      if (novoPaciente.allowedScales && novoPaciente.allowedScales.length > 0) {
        setExpandido(novoPaciente.codigo);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao gerar código");
    }
    setGerando(false);
  };

  const iniciarEdicaoNome = (paciente: PacienteCodigo) => {
    setEditandoCodigo(paciente.codigo);
    setNomeEdicao(paciente.nome === "Nome não informado" ? "" : paciente.nome);
  };

  const salvarNomePaciente = async (codigo: string) => {
    const nome = nomeEdicao.trim();
    if (!nome || !supabase) return;
    setSalvandoNome(true);
    try {
      const { error } = await supabase.from("patient_codes").update({ nome_paciente: nome }).eq("code", codigo);
      if (error) throw error;
      setPacientes((atuais) => atuais.map((paciente) => paciente.codigo === codigo ? { ...paciente, nome } : paciente));
      setEditandoCodigo(null);
      setNomeEdicao("");
    } catch (error) {
      console.error("Erro ao atualizar nome do paciente:", error);
      alert("Não foi possível atualizar o nome. Tente novamente.");
    } finally {
      setSalvandoNome(false);
    }
  };

  const copiarTexto = (chave: string, texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(chave);
    setTimeout(() => setCopiado(null), 2000);
  };

  const copiarCodigo = (codigo: string) => copiarTexto(codigo, codigo);

  const handleUnlockExercicio = async (codigo: string) => {
    if (!exercicioUnlock.trim()) {
      alert("Digite o slug do exercício");
      return;
    }

    setUnlockingCode(codigo);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/unlock-restricted`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase?.auth.getSession())?.data?.session?.access_token || ""}` },
          body: JSON.stringify({ code: codigo, slug: exercicioUnlock }),
        }
      );

      if (!response.ok) throw new Error("Erro ao liberar exercício");

      const data = await response.json();
      setPacientes((prev) =>
        prev.map((p) =>
          p.codigo === codigo ? { ...p, unlockedExercises: data.restricted_unlocked || [] } : p
        )
      );
      setExercicioUnlock("");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao liberar exercício");
    }
    setUnlockingCode(null);
  };

  const handleExcluirCodigo = async (codigo: string, nome: string) => {
    if (!window.confirm(`Excluir o código de ${nome}? O código também será desativado.`)) {
      return;
    }

    setExcluindo(codigo);
    try {
      // Desativa o código no Supabase (fonte de verdade); a lista já filtra
      // por active=true, então isso remove o paciente permanentemente da view.
      const { error } = await supabase?.from("patient_codes").update({ active: false }).eq("code", codigo) ?? {};
      if (error) throw error;
      setPacientes((prev) => prev.filter((p) => p.codigo !== codigo));
    } catch (error) {
      console.error("Erro ao desativar código no Supabase:", error);
      alert("Erro ao excluir código. Tente novamente.");
    }
    setExcluindo(null);
  };

  return (
    <motion.div variants={fadeUp}>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>
          Códigos de acesso
        </h2>
        <button
          onClick={() => setShowNomes(!showNomes)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--c-accent)] border border-[var(--c-accent)] hover:bg-[var(--c-accent)]/10 transition-colors"
        >
          {showNomes ? <EyeOff size={14} /> : <Eye size={14} />}
          {showNomes ? "Ocultar nomes" : "Mostrar nomes"}
        </button>
      </div>
      <p className="mb-6 text-[10px] text-[var(--c-muted)]">Geração e gestão dos códigos de acesso dos pacientes — não é a visão clínica de respostas.</p>

      {/* Novo paciente */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6 mb-6">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Gerar novo código</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={nomePaciente}
            onChange={(e) => setNomePaciente(e.target.value)}
            placeholder="Nome do paciente"
            required
            aria-label="Nome do paciente"
            className="flex-1 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && nomePaciente.trim() && handleGenerarCodigo()}
          />
          <button
            onClick={handleGenerarCodigo}
            disabled={gerando || !nomePaciente.trim()}
            className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white disabled:opacity-50 transition-all"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}
          >
            <Plus size={14} /> {gerando ? "..." : "Gerar"}
          </button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <select value={escalaRestrita} onChange={(e) => setEscalaRestrita(e.target.value)} className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none">
            <option value="">Código geral para exercícios</option>
            {ESCALAS_RESTRITAS.map((escala) => <option key={escala.id} value={escala.id}>{escala.label} · acesso restrito</option>)}
          </select>
          <select value={validadeHoras} onChange={(e) => setValidadeHoras(e.target.value)} disabled={!escalaRestrita} className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] disabled:opacity-40 focus:border-[var(--c-accent)] focus:outline-none">
            <option value="24">Válido por 24 horas</option>
            <option value="48">Válido por 48 horas</option>
            <option value="72">Válido por 72 horas</option>
            <option value="168">Válido por 7 dias</option>
          </select>
        </div>
      </motion.div>

      {/* Lista de pacientes */}
      {carregando ? (
        <motion.div variants={fadeUp} className="py-12 text-center text-[var(--c-muted)]">
          Carregando pacientes...
        </motion.div>
      ) : erroCarregar ? (
        <motion.div variants={fadeUp} className="py-12 text-center text-[#ff6b6b]">
          {erroCarregar}
        </motion.div>
      ) : pacientes.length === 0 ? (
        <motion.div variants={fadeUp} className="py-12 text-center text-[var(--c-muted)]">
          Nenhum paciente gerado ainda
        </motion.div>
      ) : (
        <div className="grid gap-3">
          {pacientes.map((p) => (
            <motion.div key={p.codigo} variants={fadeUp} className="glass-card rounded-2xl p-5 border border-[var(--c-border)]">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {editandoCodigo === p.codigo ? (
                    <div className="mb-2 flex items-center gap-1.5">
                      <input
                        value={nomeEdicao}
                        onChange={(event) => setNomeEdicao(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && salvarNomePaciente(p.codigo)}
                        autoFocus
                        aria-label="Corrigir nome do paciente"
                        className="min-w-0 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2.5 py-1.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
                      />
                      <button type="button" onClick={() => salvarNomePaciente(p.codigo)} disabled={salvandoNome || !nomeEdicao.trim()} aria-label="Salvar nome" className="rounded-lg p-2 text-[var(--c-accent)] hover:bg-[var(--c-accent)]/10 disabled:opacity-40">
                        <Check size={15} />
                      </button>
                      <button type="button" onClick={() => setEditandoCodigo(null)} aria-label="Cancelar edição" className="rounded-lg p-2 text-[var(--c-muted)] hover:bg-[var(--c-surface)]">
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="mb-1 flex items-center gap-1.5">
                      <p className="font-medium text-[var(--c-text)] text-sm">{showNomes ? p.nome : "Nome oculto"}</p>
                      {showNomes && (
                        <button type="button" onClick={() => iniciarEdicaoNome(p)} aria-label={`Editar nome de ${p.nome}`} className="rounded p-1 text-[var(--c-muted)] hover:text-[var(--c-accent)]">
                          <Pencil size={12} />
                        </button>
                      )}
                    </div>
                  )}
                  <p className="font-mono text-lg font-bold text-[var(--c-accent)] tracking-wider">{p.codigo}</p>
                  <p className="text-[10px] text-[var(--c-muted)]">
                    {p.unlockedExercises.length} exercício{p.unlockedExercises.length !== 1 ? "s" : ""} liberado{p.unlockedExercises.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex-shrink-0 flex gap-1">
                  <button
                    onClick={() => copiarCodigo(p.codigo)}
                    className="flex-shrink-0 p-2 rounded-lg text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
                    title="Copiar código"
                  >
                    {copiado === p.codigo ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => abrirWhatsApp(mensagemAcessoGenerica(p.codigo))}
                    className="flex-shrink-0 p-2 rounded-lg text-[var(--c-muted)] hover:text-[#25D366] transition-colors"
                    title="Enviar por WhatsApp"
                  >
                    <MessageCircle size={16} />
                  </button>
                  <button
                    onClick={() => copiarTexto(`msg-generica-${p.codigo}`, mensagemAcessoGenerica(p.codigo))}
                    className="flex-shrink-0 p-2 rounded-lg text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
                    title="Copiar mensagem"
                  >
                    {copiado === `msg-generica-${p.codigo}` ? <Check size={16} /> : <Send size={16} />}
                  </button>
                  <button
                    onClick={() => handleExcluirCodigo(p.codigo, p.nome)}
                    disabled={excluindo === p.codigo}
                    className="flex-shrink-0 p-2 rounded-lg text-[var(--c-muted)] hover:text-[#ff6b6b] transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {expandido === p.codigo && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 pt-3 border-t border-[var(--c-border)] space-y-3">
                  {p.allowedScales && p.allowedScales.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">
                        Links diretos das escalas autorizadas
                        {p.expiresAt && <span className="ml-1 font-normal normal-case text-[var(--c-muted)]">· válido até {formatarValidade(p.expiresAt)}</span>}
                      </p>
                      {p.allowedScales.map((escalaId) => {
                        const linkKey = `link-${p.codigo}-${escalaId}`;
                        const msgKey = `msg-${p.codigo}-${escalaId}`;
                        return (
                          <div key={escalaId} className="flex items-center justify-between gap-2 rounded-lg border border-[var(--c-border)] px-2.5 py-1.5">
                            <span className="text-xs font-semibold text-[var(--c-text)]">{labelDaEscala(escalaId)}</span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => copiarTexto(linkKey, linkDireto(escalaId, p.codigo))}
                                className="flex items-center gap-1 rounded-lg px-2.5 py-1 bg-[var(--c-accent)]/10 text-[var(--c-accent)] font-semibold text-[11px] hover:bg-[var(--c-accent)]/20 transition-colors"
                              >
                                {copiado === linkKey ? <Check size={12} /> : <Link2 size={12} />} Copiar link
                              </button>
                              <button
                                onClick={() => copiarTexto(msgKey, mensagemPaciente(escalaId, p.codigo, p.expiresAt))}
                                className="flex items-center gap-1 rounded-lg px-2.5 py-1 border border-[var(--c-border)] text-[var(--c-muted)] font-semibold text-[11px] hover:text-[var(--c-text)] transition-colors"
                              >
                                {copiado === msgKey ? <Check size={12} /> : <Send size={12} />} Copiar mensagem
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={exercicioUnlock}
                      onChange={(e) => setExercicioUnlock(e.target.value)}
                      placeholder="Slug do exercício"
                      className="flex-1 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2.5 py-1.5 text-xs text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
                    />
                    <button
                      onClick={() => handleUnlockExercicio(p.codigo)}
                      disabled={unlockingCode === p.codigo || !exercicioUnlock.trim()}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 bg-[var(--c-accent)]/10 text-[var(--c-accent)] font-semibold text-xs hover:bg-[var(--c-accent)]/20 transition-colors disabled:opacity-50"
                    >
                      <Unlock size={13} /> {unlockingCode === p.codigo ? "..." : "Liberar"}
                    </button>
                  </div>
                  {p.unlockedExercises.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.unlockedExercises.map((ex) => (
                        <span key={ex} className="rounded-full px-2.5 py-1 text-[10px] font-semibold bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              <button
                onClick={() => setExpandido(expandido === p.codigo ? null : p.codigo)}
                className="mt-3 w-full rounded-lg border border-[var(--c-border)] px-3 py-2 text-xs font-semibold text-[var(--c-text)] transition-colors hover:bg-[var(--c-surface)]"
              >
                {expandido === p.codigo ? "Recolher" : "Expandir"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
