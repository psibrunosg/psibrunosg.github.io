import { useState, useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, Check, ClipboardList } from "lucide-react";
import { salvarResposta } from "@/lib/supabase";
import { escalas } from "@/content/escalas";
import type { EscalaConfig } from "@/content/escalas";
import { escalasGerais } from "@/content/escalas-gerais";
import type { EscalaGeralConfig, BDIItem } from "@/content/escalas-gerais";
import { AppAurora } from "@/components/ui/AppAurora";
import {
  computeGeralScore, computeSchemaAvg, computeThreshold,
  pacienteEmRisco,
} from "@/lib/scoring";
import { CrisisCard } from "@/components/shared/CrisisCard";

type AnyConfig = EscalaConfig | EscalaGeralConfig;

function isEscalaGeral(config: AnyConfig): config is EscalaGeralConfig {
  return "tipo" in config;
}

function isBDIItem(item: unknown): item is BDIItem {
  return typeof item === "object" && item !== null && "opcoes" in item;
}

// ===== Merged config lookup =====
const allConfigs: Record<string, AnyConfig> = { ...escalas, ...escalasGerais };
const ESCALAS_RESTRITAS = new Set(["neoffir", "neopir", "bdi", "bai", "bhs", "bss"]);

type Rascunho = { nome: string; nascimento: string; telefone: string; consentimento: boolean; respostas: (number | null)[]; atual: number };

export default function Escala() {
  const { escalaId } = useParams<{ escalaId: string }>();
  const config = escalaId ? allConfigs[escalaId] : undefined;
  const requerCodigo = Boolean(config && ESCALAS_RESTRITAS.has(config.id));

  const [etapa, setEtapa] = useState<"codigo" | "dados" | "intro" | "form" | "resultado">("dados");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [patientCode, setPatientCode] = useState("");
  const [erroCodigo, setErroCodigo] = useState("");
  const [validandoCodigo, setValidandoCodigo] = useState(false);
  const [consentimento, setConsentimento] = useState(false);
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [respostas, setRespostas] = useState<(number | null)[]>([]);
  const [atual, setAtual] = useState(0);

  const rodadas = !config ? [] : (!isEscalaGeral(config) && config.rodadas) ? config.rodadas : [];
  const numRodadas = rodadas.length || 1;
  const itensBase = useMemo(() => {
    if (!config) return 0;
    if (isEscalaGeral(config)) return Array.isArray(config.itens) ? config.itens.length : 0;
    return config.itens.length;
  }, [config]);
  const total = itensBase * numRodadas;

  useEffect(() => {
    if (total > 0) setRespostas(Array(total).fill(null));
  }, [total]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    if (config) {
      const sigla = "sigla" in config ? config.sigla : "";
      document.title = `${sigla} | Bruno SG Psicologo`;
    }
    return () => document.documentElement.removeAttribute("data-theme");
  }, [config]);

  useEffect(() => {
    if (requerCodigo && etapa === "dados" && !patientCode) setEtapa("codigo");
  }, [requerCodigo, etapa, patientCode]);
  const storageKey = escalaId ? `escala-rascunho-${escalaId}` : "";

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const d = JSON.parse(raw);
        if (Array.isArray(d.respostas) && d.respostas.some((x: number | null) => x !== null)) setRascunho(d as Rascunho);
      }
    } catch { /* rascunho inválido, ignora */ }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || etapa !== "form") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ nome, nascimento, telefone, consentimento, respostas, atual }));
    } catch { /* storage indisponível, ignora */ }
  }, [storageKey, etapa, nome, nascimento, telefone, consentimento, respostas, atual]);

  if (!config) return <Navigate to="/paciente" replace />;

  const dadosValidos = nome.trim().length > 2 && nascimento.length > 0 && consentimento;
  const respondidas = respostas as number[];
  const sigla = config.sigla;

  function handleResposta(valor: number) {
    const novo = [...respostas];
    novo[atual] = valor;
    setRespostas(novo);
    setTimeout(() => {
      if (atual < total - 1) setAtual(atual + 1);
      else finalizar(novo as number[]);
    }, 220);
  }

  function finalizar(r: number[]) {
    let pontuacao = 0;
    if (isEscalaGeral(config!)) pontuacao = computeGeralScore(config!, r).total;
    else if (config!.scoring === "schema-avg") pontuacao = computeSchemaAvg(config! as EscalaConfig, r).pontuacao;
    else pontuacao = computeThreshold(r).pontuacao;
    salvarResposta({ tipo: config!.id, nome: nome.trim(), telefone: telefone.trim(), nascimento, patient_code: patientCode || undefined, respostas: r, pontuacao, consentimento_lgpd: consentimento });
    if (storageKey) localStorage.removeItem(storageKey);
    setEtapa("resultado");
  }

  async function validarCodigo() {
    if (!config || !/^\d{8}$/.test(codigoDigitado)) {
      setErroCodigo("Informe o código de 8 dígitos fornecido pelo psicólogo.");
      return;
    }
    setValidandoCodigo(true);
    setErroCodigo("");
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codigoDigitado, scale: config.id }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid) throw new Error(data.error || "Código não autorizado.");
      setPatientCode(codigoDigitado);
      setEtapa("dados");
    } catch (error) {
      setErroCodigo(error instanceof Error ? error.message : "Não foi possível validar o código.");
    } finally {
      setValidandoCodigo(false);
    }
  }
  function retomarRascunho() {
    if (!rascunho) return;
    setNome(rascunho.nome); setNascimento(rascunho.nascimento); setTelefone(rascunho.telefone);
    setConsentimento(rascunho.consentimento); setRespostas(rascunho.respostas); setAtual(rascunho.atual);
    setRascunho(null); setEtapa("form");
  }

  function descartarRascunho() {
    if (storageKey) localStorage.removeItem(storageKey);
    setRascunho(null);
  }

  const rodadaAtual = numRodadas > 1 ? Math.floor(atual / itensBase) : 0;
  const itemIndex = numRodadas > 1 ? atual % itensBase : atual;
  const rodadaLabel = rodadas[rodadaAtual] ?? "";

  function getCurrentItemText(): string {
    if (!config) return "";
    if (isEscalaGeral(config)) {
      const item = config.itens[itemIndex];
      if (typeof item === "string") return item;
      return `Item ${itemIndex + 1}`;
    }
    return (config as EscalaConfig).itens[itemIndex];
  }

  function getCurrentOptions(): { label: string; valor: number }[] {
    if (!config) return [];
    if (isEscalaGeral(config)) {
      if (config.tipo === "likert-statements") {
        const item = config.itens[itemIndex];
        if (isBDIItem(item)) return item.opcoes.map((o) => ({ label: o.texto, valor: o.valor }));
      }
      if (config.tipo === "binary") return [{ label: "Certo", valor: 1 }, { label: "Errado", valor: 0 }];
      return config.opcoes ?? [];
    }
    return (config as EscalaConfig).opcoes;
  }

  const isBDI = isEscalaGeral(config) && config.tipo === "likert-statements";
  const pct = total > 0 ? Math.round(((atual + 1) / total) * 100) : 0;

  return (
    <div className="relative flex min-h-screen flex-col" data-theme="c">
      <AppAurora />

      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link to="/paciente" className="text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">Voltar</Link>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--c-accent)]">{sigla}</span>
          {etapa === "form" ? <span className="text-xs font-medium text-[var(--c-muted)]">{atual + 1} / {total}</span> : <span className="w-12" />}
        </div>
      </header>

      <main id="main" className="relative z-10 flex flex-1 items-center justify-center px-6 pb-12 pt-24">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {etapa === "codigo" && (
              <motion.div key="codigo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md">
                <div className="glass-card rounded-3xl p-8">
                  <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--c-accent)]">Acesso protegido</span>
                  <h1 className="mb-3 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{config.nome}</h1>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--c-muted)]">Esta escala foi liberada pelo seu psicólogo. Informe o código recebido para continuar.</p>
                  <input value={codigoDigitado} onChange={(event) => setCodigoDigitado(event.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" autoComplete="one-time-code" placeholder="Código de 8 dígitos" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-center font-mono text-lg tracking-[0.25em] text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                  {erroCodigo && <p className="mb-3 text-sm text-red-400">{erroCodigo}</p>}
                  <button onClick={validarCodigo} disabled={validandoCodigo || codigoDigitado.length !== 8} className="flex w-full items-center justify-center rounded-full px-6 py-3.5 font-medium text-white disabled:opacity-40" style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                    {validandoCodigo ? "Validando..." : "Continuar"}
                  </button>
                </div>
              </motion.div>
            )}
            {etapa === "dados" && (
              <motion.div key="dados" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-md">
                <div className="glass-card rounded-3xl p-8">
                  {rascunho && (
                    <div className="mb-5 rounded-xl border border-[var(--c-accent)]/40 p-4" style={{ background: "color-mix(in oklab, var(--c-accent) 8%, transparent)" }}>
                      <p className="mb-2 text-sm font-medium text-[var(--c-text)]">Você tem um questionário em andamento.</p>
                      <div className="flex gap-2">
                        <button onClick={retomarRascunho} className="rounded-full px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>Retomar</button>
                        <button onClick={descartarRascunho} className="rounded-full border border-[var(--c-border)] px-4 py-2 text-xs font-semibold text-[var(--c-muted)] transition-colors hover:text-[var(--c-text)]">Recomeçar</button>
                      </div>
                    </div>
                  )}
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

                  <label className="mb-5 flex items-start gap-3 cursor-pointer rounded-xl border border-[var(--c-border)] p-4 transition-colors hover:border-[var(--c-accent)]/50">
                    <input type="checkbox" checked={consentimento} onChange={(e) => setConsentimento(e.target.checked)}
                      className="mt-0.5 accent-[var(--c-accent)]" />
                    <span className="text-xs leading-relaxed text-[var(--c-muted)]">
                      Autorizo a coleta e o armazenamento dos meus dados pessoais e respostas para fins exclusivos de acompanhamento psicologico, conforme a <strong className="text-[var(--c-text)]">LGPD (Lei 13.709/2018)</strong>. Esses dados serao acessiveis apenas ao psicologo responsavel.
                    </span>
                  </label>

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
                  <ClipboardList size={30} className="text-white" />
                </motion.div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--c-accent)]">{sigla}</span>
                <h1 className="mb-3 text-3xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{config.nome}</h1>
                <p className="mb-5 text-sm text-[var(--c-muted)]">Ola, <strong className="text-[var(--c-text)]">{nome.trim()}</strong>.</p>
                <p className="mx-auto mb-6 max-w-md leading-relaxed text-[var(--c-muted)]">{config.instrucoes}</p>
                <div className="mb-8 flex items-center justify-center gap-2">
                  <span className="rounded-full bg-[var(--c-surface)] px-3 py-1 text-xs font-medium text-[var(--c-muted)]">{total} perguntas</span>
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
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-[var(--c-muted)]" aria-live="polite">
                  <span>Pergunta {atual + 1} de {total}</span>
                  <span className="text-[var(--c-accent)]">{pct}%</span>
                </div>
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--c-border)]" role="progressbar" aria-valuenow={atual + 1} aria-valuemin={1} aria-valuemax={total} aria-label="Progresso do questionário">
                  <div className="h-full rounded-full transition-[width] duration-300 ease-out" style={{ width: pct + "%", background: "linear-gradient(90deg, var(--c-accent), var(--c-accent-lt))" }} />
                </div>

                {rodadaLabel && (
                  <div className="mb-3 rounded-xl p-3 text-center" style={{ background: "color-mix(in oklab, var(--c-accent) 10%, transparent)", border: "1px solid color-mix(in oklab, var(--c-accent) 25%, transparent)" }}>
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--c-accent)]">
                      Pensando no seu {rodadaLabel} {rodadaAtual === 0 ? "(figura paterna)" : "(figura materna)"}
                    </p>
                    <p className="text-[10px] text-[var(--c-muted)]">Rodada {rodadaAtual + 1} de {numRodadas} · Pergunta {itemIndex + 1} de {itensBase}</p>
                  </div>
                )}

                <div className="glass-card mb-5 rounded-2xl p-6">
                  {!isBDI ? (
                    <h2 className="text-xl font-semibold leading-snug text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{getCurrentItemText()}</h2>
                  ) : (
                    <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Escolha a afirmacao que melhor descreve voce:</h2>
                  )}
                </div>

                <div className="space-y-3" role="radiogroup" aria-label={getCurrentItemText()}>
                  {getCurrentOptions().map((op) => {
                    const selected = respostas[atual] === op.valor;
                    return (
                      <button
                        key={op.valor}
                        role="radio" aria-checked={selected} aria-label={op.label}
                        onClick={() => handleResposta(op.valor)}
                        className="flex w-full items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all duration-150 hover:translate-x-1 active:scale-[0.99]"
                        style={{
                          borderColor: selected ? "var(--c-accent)" : "var(--c-border)",
                          background: selected ? "color-mix(in oklab, var(--c-accent) 12%, transparent)" : "color-mix(in oklab, var(--c-bg) 60%, transparent)",
                          color: "var(--c-text)",
                        }}
                      >
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors"
                          style={{ background: selected ? "var(--c-accent)" : "var(--c-surface)", color: selected ? "#fff" : "var(--c-muted)" }}>
                          {selected ? <Check size={14} /> : op.valor}
                        </span>
                        <span className="flex-1">{op.label}</span>
                      </button>
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

            {etapa === "resultado" && <ResultadoScreen config={config} respostas={respondidas} pacienteNome={nome.trim()} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ===== RESULT SCREENS =====
function ResultadoScreen({ config, respostas }: { config: AnyConfig; respostas: number[]; pacienteNome: string }) {
  let emRisco = false;
  let crisisVariant: "suicida" | "apoio" = "apoio";
  if (isEscalaGeral(config)) {
    const total = computeGeralScore(config, respostas).total;
    emRisco = pacienteEmRisco(config.id, total, respostas);
    crisisVariant = config.id === "bhs" || config.id === "bdi" ? "suicida" : "apoio";
  }

  return (
    <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      {emRisco && <CrisisCard variant={crisisVariant} />}
      <div className="glass-card mb-6 rounded-3xl p-8">
        <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--c-accent)]">Envio concluído</span>
        <h2 className="mb-3 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas registradas</h2>
        <p className="mx-auto max-w-sm leading-relaxed text-[var(--c-muted)]">Suas respostas foram enviadas ao seu psicólogo. A correção e a devolutiva serão realizadas em conjunto com ele.</p>
      </div>
      <Link to="/paciente" className="rounded-full border border-[var(--c-border)] px-6 py-3 text-sm text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">Voltar</Link>
    </motion.div>
  );
}
