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

type AnyConfig = EscalaConfig | EscalaGeralConfig;

function isEscalaGeral(config: AnyConfig): config is EscalaGeralConfig {
  return "tipo" in config;
}

function isBDIItem(item: unknown): item is BDIItem {
  return typeof item === "object" && item !== null && "opcoes" in item;
}

// ===== Original schema scoring for YSQ/YPI/YCI =====
interface SchemaResult {
  id: string;
  nome: string;
  media: number;
  dominio: string;
}

function computeSchemaAvg(config: EscalaConfig, respostas: number[]): { schemas: SchemaResult[]; pontuacao: number } {
  const schemas: SchemaResult[] = [];
  let highest = 0;
  for (const dominio of config.dominios ?? []) {
    for (const esquema of dominio.esquemas) {
      let soma = 0;
      for (const idx of esquema.itens) {
        let val = respostas[idx - 1] ?? 1;
        if (esquema.invertido) val = 7 - val;
        soma += val;
      }
      const media = soma / esquema.itens.length;
      if (media > highest) highest = media;
      schemas.push({ id: esquema.id, nome: esquema.nome, media, dominio: dominio.nome });
    }
  }
  return { schemas, pontuacao: Math.round(highest * 10) / 10 };
}

function computeThreshold(respostas: number[]): { flagged: { index: number; valor: number }[]; pontuacao: number } {
  const flagged: { index: number; valor: number }[] = [];
  for (let i = 0; i < respostas.length; i++) {
    if (respostas[i] >= 5) flagged.push({ index: i, valor: respostas[i] });
  }
  return { flagged, pontuacao: flagged.length };
}

// ===== General scale scoring =====
interface DominioResult {
  id: string;
  nome: string;
  soma: number;
  media: number;
  itensCount: number;
}

function computeGeralScore(config: EscalaGeralConfig, respostas: number[]): { total: number; dominios: DominioResult[] } {
  let total = 0;
  const dominios: DominioResult[] = [];

  if (config.tipo === "binary" && config.chaveCorrecao) {
    for (let i = 0; i < respostas.length; i++) {
      const chave = config.chaveCorrecao[i + 1];
      const resposta = respostas[i] === 1 ? "C" : "E";
      if (resposta === chave) total++;
    }
  } else if (config.tipo === "likert-statements") {
    total = respostas.reduce((a, b) => a + b, 0);
  } else {
    if (config.dominios && config.dominios.length > 0) {
      for (const dom of config.dominios) {
        let soma = 0;
        const invertidos = dom.invertidos ?? [];
        const globalInvertidos = config.invertidos ?? [];
        for (const idx of dom.itens) {
          let val = respostas[idx - 1] ?? 0;
          const isInverted = invertidos.includes(idx) || globalInvertidos.includes(idx);
          if (isInverted) {
            const maxVal = config.opcoes ? Math.max(...config.opcoes.map((o) => o.valor)) : 4;
            const minVal = config.opcoes ? Math.min(...config.opcoes.map((o) => o.valor)) : 0;
            val = maxVal + minVal - val;
          }
          soma += val;
        }
        const media = Math.round((soma / dom.itens.length) * 100) / 100;
        dominios.push({ id: dom.id, nome: dom.nome, soma, media, itensCount: dom.itens.length });
        total += soma;
      }
    } else {
      total = respostas.reduce((a, b) => a + b, 0);
    }
  }

  return { total, dominios };
}

// ===== Merged config lookup =====
const allConfigs: Record<string, AnyConfig> = { ...escalas, ...escalasGerais };

// ===== Shared visual bits =====
function ScoreRing({ value, max, color = "var(--c-accent)", caption }: { value: number; max: number; color?: string; caption?: string }) {
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative mx-auto mb-5 h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--c-border)" strokeWidth="10" opacity="0.5" />
        <motion.circle
          cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }} className="text-3xl font-bold text-[var(--c-text)]">
          {value}
        </motion.span>
        {caption && <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--c-muted)]">{caption}</span>}
      </div>
    </div>
  );
}

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--c-border)]">
      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: Math.min(100, pct) + "%" }} transition={{ duration: 0.8, ease: "easeOut", delay }} />
    </div>
  );
}

export default function Escala() {
  const { escalaId } = useParams<{ escalaId: string }>();
  const config = escalaId ? allConfigs[escalaId] : undefined;

  const [etapa, setEtapa] = useState<"dados" | "intro" | "form" | "resultado">("dados");
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [respostas, setRespostas] = useState<(number | null)[]>([]);
  const [atual, setAtual] = useState(0);

  const total = useMemo(() => {
    if (!config) return 0;
    if (isEscalaGeral(config)) return Array.isArray(config.itens) ? config.itens.length : 0;
    return config.itens.length;
  }, [config]);

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

  if (!config) return <Navigate to="/paciente" replace />;

  const dadosValidos = nome.trim().length > 2 && nascimento.length > 0;
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
    salvarResposta({ tipo: config!.id, nome: nome.trim(), telefone: telefone.trim(), nascimento, respostas: r, pontuacao });
    setEtapa("resultado");
  }

  function getCurrentItemText(): string {
    if (!config) return "";
    if (isEscalaGeral(config)) {
      const item = config.itens[atual];
      if (typeof item === "string") return item;
      return `Item ${atual + 1}`;
    }
    return (config as EscalaConfig).itens[atual];
  }

  function getCurrentOptions(): { label: string; valor: number }[] {
    if (!config) return [];
    if (isEscalaGeral(config)) {
      if (config.tipo === "likert-statements") {
        const item = config.itens[atual];
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
              <motion.div key={"q" + atual} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-[var(--c-muted)]">
                  <span>Pergunta {atual + 1} de {total}</span>
                  <span className="text-[var(--c-accent)]">{pct}%</span>
                </div>
                <div className="mb-6 h-2 overflow-hidden rounded-full bg-[var(--c-border)]">
                  <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--c-accent), var(--c-accent-lt))" }} animate={{ width: pct + "%" }} transition={{ duration: 0.4, ease: "easeOut" }} />
                </div>

                <div className="glass-card mb-5 rounded-2xl p-6">
                  {!isBDI ? (
                    <h2 className="text-xl font-semibold leading-snug text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{getCurrentItemText()}</h2>
                  ) : (
                    <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Escolha a afirmacao que melhor descreve voce:</h2>
                  )}
                </div>

                <div className="space-y-3">
                  {getCurrentOptions().map((op, i) => {
                    const selected = respostas[atual] === op.valor;
                    return (
                      <motion.button
                        key={op.valor}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
                        onClick={() => handleResposta(op.valor)}
                        className="flex w-full items-center gap-3 rounded-xl border px-5 py-4 text-left transition-colors"
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
                      </motion.button>
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
  if (isEscalaGeral(config)) return <ResultadoGeral config={config} respostas={respostas} />;
  if (config.scoring === "schema-avg") return <ResultadoSchemaAvg config={config} respostas={respostas} />;
  return <ResultadoThreshold config={config} respostas={respostas} />;
}

function ResultadoGeral({ config, respostas }: { config: EscalaGeralConfig; respostas: number[] }) {
  const result = useMemo(() => computeGeralScore(config, respostas), [config, respostas]);
  const maxPossible = config.pontuacaoMaxima ?? (config.opcoes ? Math.max(...config.opcoes.map((o) => o.valor)) * respostas.length : result.total);
  const maxOp = config.opcoes ? Math.max(...config.opcoes.map((o) => o.valor)) : 6;

  return (
    <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <ScoreRing value={result.total} max={maxPossible} caption="Total" />
      <h2 className="mb-3 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas registradas</h2>
      <p className="mx-auto mb-7 max-w-sm leading-relaxed text-[var(--c-muted)]">
        Pontuacao: {result.total}{maxPossible > 0 ? ` de ${maxPossible}` : ""}. Converse com seu psicologo sobre estes resultados.
      </p>

      {result.dominios.length > 0 && (
        <div className="mb-8 space-y-3 text-left">
          {result.dominios.map((dom, i) => (
            <div key={dom.id} className="glass-card rounded-xl p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-[var(--c-text)]">{dom.nome}</span>
                <span className="font-bold text-[var(--c-accent)]">{dom.media.toFixed(1)} (soma: {dom.soma})</span>
              </div>
              <AnimatedBar pct={(dom.media / maxOp) * 100} color="var(--c-accent)" delay={i * 0.08} />
            </div>
          ))}
        </div>
      )}

      <p className="mb-8 text-xs italic text-[var(--c-muted)]">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
      <Link to="/paciente" className="rounded-full border border-[var(--c-border)] px-6 py-3 text-sm text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">Voltar</Link>
    </motion.div>
  );
}

function ResultadoSchemaAvg({ config, respostas }: { config: EscalaConfig; respostas: number[] }) {
  const { schemas } = useMemo(() => computeSchemaAvg(config, respostas), [config, respostas]);
  const ativos = schemas.filter((s) => s.media > 3.5);
  const dominioGroups = useMemo(() => {
    const map = new Map<string, SchemaResult[]>();
    for (const s of schemas) {
      const arr = map.get(s.dominio) ?? [];
      arr.push(s);
      map.set(s.dominio, arr);
    }
    return map;
  }, [schemas]);

  return (
    <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <ScoreRing value={ativos.length} max={schemas.length} caption="Ativos" />
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[var(--c-accent)]">
        {ativos.length === 0 ? "Nenhum esquema ativado" : `${ativos.length} esquema${ativos.length > 1 ? "s" : ""} ativo${ativos.length > 1 ? "s" : ""}`}
      </span>
      <h2 className="mb-3 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas registradas</h2>
      <p className="mx-auto mb-7 max-w-sm leading-relaxed text-[var(--c-muted)]">Esquemas com media acima de 3.5 sao considerados ativos. Converse com seu psicologo sobre estes resultados.</p>

      <div className="mb-8 space-y-4 text-left">
        {Array.from(dominioGroups.entries()).map(([domNome, esquemas]) => (
          <div key={domNome} className="glass-card rounded-xl p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--c-text)]">{domNome}</h3>
            <div className="space-y-2.5">
              {esquemas.map((e, i) => (
                <div key={e.id}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className={e.media > 3.5 ? "font-bold text-[var(--c-accent)]" : "text-[var(--c-muted)]"}>{e.nome}</span>
                    <span className={e.media > 3.5 ? "font-bold text-[var(--c-accent)]" : "text-[var(--c-muted)]"}>{e.media.toFixed(1)}</span>
                  </div>
                  <AnimatedBar pct={(e.media / 6) * 100} color={e.media > 3.5 ? "var(--c-accent)" : "var(--c-muted)"} delay={i * 0.05} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mb-8 text-xs italic text-[var(--c-muted)]">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
      <Link to="/paciente" className="rounded-full border border-[var(--c-border)] px-6 py-3 text-sm text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">Voltar</Link>
    </motion.div>
  );
}

function ResultadoThreshold({ config, respostas }: { config: EscalaConfig; respostas: number[] }) {
  const { flagged, pontuacao } = useMemo(() => computeThreshold(respostas), [respostas]);

  return (
    <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <ScoreRing value={pontuacao} max={respostas.length} caption="Defesas" />
      <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-[var(--c-accent)]">
        {pontuacao === 0 ? "Nenhuma defesa ativada" : `${pontuacao} defesa${pontuacao > 1 ? "s" : ""} ativa${pontuacao > 1 ? "s" : ""}`}
      </span>
      <h2 className="mb-3 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas registradas</h2>
      <p className="mx-auto mb-7 max-w-sm leading-relaxed text-[var(--c-muted)]">Itens com nota 5 ou 6 indicam forte ativacao da estrategia compensatoria. Compartilhe esses resultados com seu psicologo.</p>

      {flagged.length > 0 && (
        <div className="glass-card mb-8 rounded-xl border border-[var(--c-accent)]/30 p-4 text-left">
          <h3 className="mb-3 text-sm font-semibold text-[var(--c-accent)]">Defesas ativas</h3>
          <ul className="space-y-2">
            {flagged.map((f, i) => (
              <motion.li key={f.index} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 text-sm">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--c-accent)] text-xs font-bold text-white">{f.valor}</span>
                <span className="leading-snug text-[var(--c-text)]">{config.itens[f.index]}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <p className="mb-8 text-xs italic text-[var(--c-muted)]">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
      <Link to="/paciente" className="rounded-full border border-[var(--c-border)] px-6 py-3 text-sm text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">Voltar</Link>
    </motion.div>
  );
}