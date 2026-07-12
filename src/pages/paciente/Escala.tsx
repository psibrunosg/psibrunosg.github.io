import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, User, Check, ClipboardList, AlertTriangle, Loader2 } from "lucide-react";
import { salvarResposta } from "@/lib/supabase";
import { escalas } from "@/content/escalas";
import type { EscalaConfig } from "@/content/escalas";
import { escalasGerais } from "@/content/escalas-gerais";
import type { EscalaGeralConfig, BDIItem } from "@/content/escalas-gerais";
import { ESCALAS_RESTRITAS_IDS } from "@/content/escalas-restritas";
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

type Rascunho = { nascimento: string; email: string; consentimento: boolean; respostas: (number | null)[]; atual: number; etapa: "form" | "dados" };

export default function Escala() {
  const { escalaId } = useParams<{ escalaId: string }>();
  const [searchParams] = useSearchParams();
  const config = escalaId ? allConfigs[escalaId] : undefined;
  const requerCodigo = Boolean(config && ESCALAS_RESTRITAS_IDS.has(config.id));

  const [etapa, setEtapa] = useState<"codigo" | "intro" | "form" | "dados" | "enviando" | "erro" | "resultado">(requerCodigo ? "codigo" : "intro");
  const [nascimento, setNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [codigoDigitado, setCodigoDigitado] = useState("");
  const [patientCode, setPatientCode] = useState("");
  const [erroCodigo, setErroCodigo] = useState("");
  const [validandoCodigo, setValidandoCodigo] = useState(false);
  const [consentimento, setConsentimento] = useState(false);
  const [rascunho, setRascunho] = useState<Rascunho | null>(null);
  const [respostas, setRespostas] = useState<(number | null)[]>([]);
  const [atual, setAtual] = useState(0);
  const [erroEnvio, setErroEnvio] = useState("");
  const [rovingIndex, setRovingIndex] = useState(0);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

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
    document.documentElement.setAttribute("data-theme", "lobo");
    if (config) {
      const sigla = "sigla" in config ? config.sigla : "";
      document.title = `${sigla} | Bruno Souza Psicologo`;
    }
    return () => document.documentElement.removeAttribute("data-theme");
  }, [config]);

  // Pré-preenche e, se o formato for válido, valida automaticamente o
  // código recebido via ?codigo= na URL (link direto gerado no painel).
  useEffect(() => {
    if (!requerCodigo) return;
    const paramCodigo = searchParams.get("codigo");
    if (!paramCodigo) return;
    const digits = paramCodigo.replace(/\D/g, "").slice(0, 8);
    if (!digits) return;
    setCodigoDigitado(digits);
    if (/^\d{5}(\d{3})?$/.test(digits)) {
      validarCodigo(digits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requerCodigo]);

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
    if (!storageKey || (etapa !== "form" && etapa !== "dados" && etapa !== "erro")) return;
    try {
      const etapaRascunho: "form" | "dados" = etapa === "form" ? "form" : "dados";
      localStorage.setItem(storageKey, JSON.stringify({ nascimento, email, consentimento, respostas, atual, etapa: etapaRascunho }));
    } catch { /* storage indisponível, ignora */ }
  }, [storageKey, etapa, nascimento, email, consentimento, respostas, atual]);

  useEffect(() => {
    const answered = respostas[atual];
    if (answered === null || answered === undefined) {
      setRovingIndex(0);
      return;
    }
    const options = getCurrentOptions();
    const idx = options.findIndex((o) => o.valor === answered);
    setRovingIndex(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atual]);

  useEffect(() => {
    if (etapa === "form" && questionHeadingRef.current) {
      questionHeadingRef.current.focus({ preventScroll: true });
    }
  }, [atual, etapa]);

  if (!config) return <Navigate to="/paciente" replace />;

  const dadosValidos = nascimento.length > 0 && consentimento;
  const respondidas = respostas as number[];
  const sigla = config.sigla;

  function handleResposta(valor: number) {
    const novo = [...respostas];
    novo[atual] = valor;
    setRespostas(novo);
    setTimeout(() => {
      if (atual < total - 1) setAtual(atual + 1);
      else setEtapa("dados");
    }, 220);
  }

  async function enviarRespostas() {
    const r = respostas as number[];
    let pontuacao = 0;
    if (isEscalaGeral(config!)) pontuacao = computeGeralScore(config!, r).total;
    else if (config!.scoring === "schema-avg") pontuacao = computeSchemaAvg(config! as EscalaConfig, r).pontuacao;
    else pontuacao = computeThreshold(r).pontuacao;

    setErroEnvio("");
    setEtapa("enviando");
    try {
      const { error } = await salvarResposta({ tipo: config!.id, nascimento, patient_code: patientCode || undefined, email: email.trim() || undefined, respostas: r, pontuacao, consentimento_lgpd: consentimento });
      if (error) throw error;
      if (storageKey) localStorage.removeItem(storageKey);
      setEtapa("resultado");
    } catch (err) {
      const mensagem = err instanceof Error ? err.message
        : (typeof err === "object" && err !== null && "message" in err && typeof (err as { message?: unknown }).message === "string")
          ? (err as { message: string }).message
          : "Não foi possível enviar suas respostas. Verifique sua conexão e tente novamente.";
      setErroEnvio(mensagem);
      setEtapa("erro");
    }
  }

  async function validarCodigo(codigoParam?: string) {
    const codigo = codigoParam ?? codigoDigitado;
    if (!config || !/^\d{5}(\d{3})?$/.test(codigo)) {
      setErroCodigo("Informe o código de 5 ou 8 dígitos fornecido pelo psicólogo.");
      return;
    }
    setValidandoCodigo(true);
    setErroCodigo("");
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codigo, scale: config.id }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid) throw new Error(data.error || "Código não autorizado.");
      setPatientCode(codigo);
      setEtapa("intro");
    } catch (error) {
      setErroCodigo(error instanceof Error ? error.message : "Não foi possível validar o código.");
    } finally {
      setValidandoCodigo(false);
    }
  }
  function retomarRascunho() {
    if (!rascunho) return;
    setNascimento(rascunho.nascimento); setEmail(rascunho.email ?? "");
    setConsentimento(rascunho.consentimento); setRespostas(rascunho.respostas); setAtual(rascunho.atual);
    setEtapa(rascunho.etapa === "dados" ? "dados" : "form");
    setRascunho(null);
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
    <div className="relative flex min-h-screen flex-col" data-theme="lobo">
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
                  <input value={codigoDigitado} onChange={(event) => setCodigoDigitado(event.target.value.replace(/\D/g, "").slice(0, 8))} inputMode="numeric" autoComplete="one-time-code" placeholder="Código de 5 ou 8 dígitos" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-center font-mono text-lg tracking-[0.25em] text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                  {erroCodigo && <p className="mb-3 text-sm" style={{ color: "var(--c-danger)" }}>{erroCodigo}</p>}
                  <button onClick={() => validarCodigo()} disabled={validandoCodigo || !/^\d{5}(\d{3})?$/.test(codigoDigitado)} className="flex w-full items-center justify-center rounded-full px-6 py-3.5 font-medium text-white disabled:opacity-40" style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                    {validandoCodigo ? "Validando..." : "Continuar"}
                  </button>
                </div>
              </motion.div>
            )}
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
                      <label htmlFor="escala-nascimento" className="mb-1.5 block text-sm font-medium text-[var(--c-text)]">Data de nascimento <span className="text-[var(--c-accent)]">*</span></label>
                      <input id="escala-nascimento" type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)}
                        className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
                    </div>
                    {requerCodigo && (
                      <div>
                        <label htmlFor="escala-email" className="mb-1.5 block text-sm font-medium text-[var(--c-text)]">E-mail <span className="text-xs font-normal text-[var(--c-muted)]">(opcional)</span></label>
                        <input id="escala-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com"
                          className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors placeholder:text-[var(--c-muted)]/50 focus:border-[var(--c-accent)] focus:outline-none" />
                        <p className="mt-1.5 text-xs text-[var(--c-muted)]">Usado apenas para contato do seu psicólogo em caso de necessidade clínica.</p>
                      </div>
                    )}
                  </div>

                  <label className="mb-5 flex items-start gap-3 cursor-pointer rounded-xl border border-[var(--c-border)] p-4 transition-colors hover:border-[var(--c-accent)]/50">
                    <input type="checkbox" checked={consentimento} onChange={(e) => setConsentimento(e.target.checked)}
                      className="mt-0.5 accent-[var(--c-accent)]" />
                    <span className="text-xs leading-relaxed text-[var(--c-muted)]">
                      Autorizo a coleta e o armazenamento dos meus dados pessoais e respostas para fins exclusivos de acompanhamento psicologico, conforme a <strong className="text-[var(--c-text)]">LGPD (Lei 13.709/2018)</strong>. Esses dados serao acessiveis apenas ao psicologo responsavel.
                    </span>
                  </label>

                  <motion.button whileHover={{ scale: dadosValidos ? 1.02 : 1 }} whileTap={{ scale: 0.98 }} onClick={enviarRespostas} disabled={!dadosValidos}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium text-white transition-opacity disabled:opacity-40"
                    style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 12px 30px -10px var(--c-accent)" }}>
                    Enviar respostas <Check size={16} />
                  </motion.button>
                  <p className="mt-4 text-center text-xs text-[var(--c-muted)]">Dados protegidos pelo sigilo profissional e acessiveis apenas ao seu psicologo.</p>
                </div>
              </motion.div>
            )}

            {etapa === "enviando" && (
              <motion.div key="enviando" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-md text-center">
                <div className="glass-card rounded-3xl p-8">
                  <Loader2 size={32} className="mx-auto mb-4 animate-spin text-[var(--c-accent)]" />
                  <h2 className="mb-2 text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Enviando suas respostas...</h2>
                  <p className="text-sm text-[var(--c-muted)]">Isso pode levar alguns segundos. Não feche esta página.</p>
                </div>
              </motion.div>
            )}

            {etapa === "erro" && (
              <motion.div key="erro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mx-auto max-w-md text-center">
                <div className="glass-card rounded-3xl p-8">
                  <AlertTriangle size={32} className="mx-auto mb-4 text-red-400" />
                  <h2 className="mb-2 text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Não foi possível enviar suas respostas</h2>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--c-muted)]">{erroEnvio || "Ocorreu um erro inesperado ao enviar seus dados."} Suas respostas foram salvas neste dispositivo e nada foi perdido — tente novamente.</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={enviarRespostas} className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-medium text-white"
                      style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 12px 30px -10px var(--c-accent)" }}>
                      Tentar novamente
                    </button>
                    <button onClick={() => setEtapa("dados")} className="w-full rounded-full border border-[var(--c-border)] px-6 py-3 text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-text)]">
                      Revisar meus dados
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {etapa === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                {rascunho && (
                  <div className="mx-auto mb-6 max-w-md rounded-xl border border-[var(--c-accent)]/40 p-4 text-left" style={{ background: "color-mix(in oklab, var(--c-accent) 8%, transparent)" }}>
                    <p className="mb-2 text-sm font-medium text-[var(--c-text)]">Você tem um questionário em andamento.</p>
                    <div className="flex gap-2">
                      <button onClick={retomarRascunho} className="rounded-full px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>Retomar</button>
                      <button onClick={descartarRascunho} className="rounded-full border border-[var(--c-border)] px-4 py-2 text-xs font-semibold text-[var(--c-muted)] transition-colors hover:text-[var(--c-text)]">Recomeçar</button>
                    </div>
                  </div>
                )}
                <motion.div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
                  style={{ background: "linear-gradient(140deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 16px 40px -12px var(--c-accent)" }}
                  initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
                  <ClipboardList size={30} className="text-white" />
                </motion.div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--c-accent)]">{sigla}</span>
                <h1 className="mb-3 text-3xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{config.nome}</h1>
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
                  <span className="tabular-nums">Pergunta {atual + 1} de {total}</span>
                  <span className="tabular-nums text-[var(--c-accent)]">{pct}%</span>
                </div>
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--c-border)]" role="progressbar" aria-valuenow={atual + 1} aria-valuemin={1} aria-valuemax={total} aria-label="Progresso do questionário">
                  <div className="h-full w-full rounded-full transition-transform duration-300 ease-out" style={{ transform: `scaleX(${pct / 100})`, transformOrigin: "left", background: "linear-gradient(90deg, var(--c-accent), var(--c-accent-lt))" }} />
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
                    <h2 ref={questionHeadingRef} tabIndex={-1} className="text-xl font-semibold leading-snug text-[var(--c-text)] focus:outline-none" style={{ fontFamily: "var(--font-heading)" }}>{getCurrentItemText()}</h2>
                  ) : (
                    <h2 ref={questionHeadingRef} tabIndex={-1} className="text-lg font-semibold text-[var(--c-text)] focus:outline-none" style={{ fontFamily: "var(--font-heading)" }}>Escolha a afirmacao que melhor descreve voce:</h2>
                  )}
                </div>

                <div
                  className="space-y-3"
                  role="radiogroup"
                  aria-label={getCurrentItemText()}
                  onKeyDown={(e) => {
                    const options = getCurrentOptions();
                    const count = options.length;
                    if (count === 0) return;
                    let nextIndex: number | null = null;
                    if (e.key === "ArrowDown" || e.key === "ArrowRight") nextIndex = (rovingIndex + 1) % count;
                    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") nextIndex = (rovingIndex - 1 + count) % count;
                    else if (e.key === "Home") nextIndex = 0;
                    else if (e.key === "End") nextIndex = count - 1;
                    if (nextIndex === null) return;
                    e.preventDefault();
                    setRovingIndex(nextIndex);
                    optionRefs.current[nextIndex]?.focus();
                  }}
                >
                  {getCurrentOptions().map((op, index) => {
                    const selected = respostas[atual] === op.valor;
                    return (
                      <button
                        key={op.valor}
                        ref={(el) => { optionRefs.current[index] = el; }}
                        role="radio" aria-checked={selected} aria-label={op.label}
                        tabIndex={index === rovingIndex ? 0 : -1}
                        onClick={() => { setRovingIndex(index); handleResposta(op.valor); }}
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

            {etapa === "resultado" && <ResultadoScreen config={config} respostas={respondidas} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ===== RESULT SCREENS =====
function ResultadoScreen({ config, respostas }: { config: AnyConfig; respostas: number[] }) {
  let emRisco = false;
  let crisisVariant: "suicida" | "apoio" = "apoio";
  if (isEscalaGeral(config)) {
    const total = computeGeralScore(config, respostas).total;
    emRisco = pacienteEmRisco(config.id, total, respostas);
    crisisVariant = config.id === "bhs" || config.id === "bdi" || config.id === "cssrs" || config.id === "phq9" ? "suicida" : "apoio";
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
