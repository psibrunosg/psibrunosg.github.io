import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Lock, FileText, ExternalLink, RefreshCw, Plus, Save, Eye, EyeOff, Edit3, X, Bold, Italic, Heading2, List, RotateCcw, Bell, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import JSZip from "jszip";
import { supabase, listarPostsBlog, salvarPostBlog, atualizarPostBlog, deletarPostBlog, type BlogPostDB } from "@/lib/supabase";
import { gerarPDF } from "@/lib/pdf-generator";
import { processarTeste, gerarParecerPDF, type DadosPaciente, type ResultadoTeste } from "@/lib/parecer-generator";
import {
  testesDisponiveis, neoFacetasPorDominio, neoFacetasNomes, neoDominioNomes,
  type TesteId, type NeoFFIDominio,
} from "@/content/normative-tables";
import { escalas } from "@/content/escalas";
import { escalasGerais } from "@/content/escalas-gerais";
import type { BDIItem } from "@/content/escalas-gerais";
import { ferramentas, type FerramentaTerapeuta } from "@/content/ferramentas-terapeuta";
import { posts as staticPosts, type BlogPost } from "@/content/posts-loader";
import { fadeUp, stagger } from "@/lib/motion";
import { AppAurora } from "@/components/ui/AppAurora";
import { detectarRiscos, type RespostaRegistro as Resposta } from "@/lib/scoring";
import {
  interpretarResposta, correlacoesFactuais,
  type RespostaInterpretada, type RodadaInterpretada, type EsquemaInterpretado, type Correlacao,
} from "@/lib/interpret";


const allScaleConfigs: Record<string, { itens: (string | BDIItem)[]; opcoes?: { label: string; valor: number }[] }> = {};
for (const [k, v] of Object.entries(escalas)) {
  allScaleConfigs[k] = { itens: v.itens, opcoes: v.opcoes };
}
for (const [k, v] of Object.entries(escalasGerais)) {
  allScaleConfigs[k] = { itens: v.itens as (string | BDIItem)[], opcoes: v.opcoes };
}
allScaleConfigs["phq9"] = {
  itens: [
    "Pouco interesse ou prazer em fazer as coisas",
    "Se sentir para baixo, deprimido(a) ou sem perspectiva",
    "Dificuldade para adormecer ou permanecer dormindo",
    "Se sentir cansado(a) ou com pouca energia",
    "Falta de apetite ou comer demais",
    "Se sentir mal consigo mesmo(a)",
    "Dificuldade para se concentrar",
    "Falar ou se mover mais devagar do que o habitual",
    "Pensar em se machucar ou que seria melhor estar morto(a)",
  ],
  opcoes: [{ label: "Nenhuma vez", valor: 0 }, { label: "Varios dias", valor: 1 }, { label: "Mais da metade", valor: 2 }, { label: "Quase todos", valor: 3 }],
};
allScaleConfigs["gad7"] = {
  itens: [
    "Se sentir nervoso(a), ansioso(a) ou no limite",
    "Nao conseguir parar ou controlar a preocupacao",
    "Se preocupar muito com diversas coisas",
    "Dificuldade para relaxar",
    "Ficar tao agitado(a) que se torna dificil ficar parado(a)",
    "Ficar facilmente irritado(a) ou irritavel",
    "Sentir medo como se algo horrivel pudesse acontecer",
  ],
  opcoes: [{ label: "Nenhuma vez", valor: 0 }, { label: "Varios dias", valor: 1 }, { label: "Mais da metade", valor: 2 }, { label: "Quase todos", valor: 3 }],
};

function getItemText(item: string | BDIItem, index: number): string {
  if (typeof item === "string") return item;
  return item.opcoes?.map((o) => o.texto).join(" / ") || `Item ${index + 1}`;
}

function getOptionLabel(tipo: string, valor: number): string | null {
  const cfg = allScaleConfigs[tipo];
  if (!cfg?.opcoes) return null;
  return cfg.opcoes.find((o) => o.valor === valor)?.label ?? null;
}

interface Notificacao { id: number; tipo: string; nome: string; tempo: string; critico?: boolean; }

function EvolucaoChart({ serie, maxVal, titulo }: { serie: { data: string; valor: number }[]; maxVal: number; titulo: string }) {
  if (serie.length < 2) return null;
  const mv = maxVal > 0 ? maxVal : Math.max(...serie.map((d) => d.valor), 1);
  const W = 400; const H = 160; const PAD = 30;
  const pw = (W - PAD * 2) / (serie.length - 1);
  const points = serie.map((d, i) => ({
    x: PAD + i * pw,
    y: PAD + (1 - d.valor / mv) * (H - PAD * 2),
    score: d.valor,
    data: d.data,
  }));
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Evolucao ({titulo})</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--c-border)" strokeWidth="1" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--c-border)" strokeWidth="1" />
        <text x={PAD - 4} y={PAD + 4} textAnchor="end" fontSize="9" fill="var(--c-muted)">{mv}</text>
        <text x={PAD - 4} y={H - PAD + 4} textAnchor="end" fontSize="9" fill="var(--c-muted)">0</text>
        <path d={line} fill="none" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="var(--c-accent)" stroke="var(--c-bg)" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--c-text)">{p.score}</text>
            <text x={p.x} y={H - PAD + 14} textAnchor="middle" fontSize="8" fill="var(--c-muted)">{p.data.slice(0, 5)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Série temporal por família (reusa interpret): nº de ativos / defesas / escore total.
function serieEvolucao(historico: Resposta[]): { serie: { data: string; valor: number }[]; maxVal: number; titulo: string } | null {
  const ordenado = [...historico].sort((a, b) => new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime());
  if (ordenado.length < 2) return null;
  const interps = ordenado.map((h) => ({ h, i: interpretarResposta(h.tipo, h.respostas, h.pontuacao) }));
  const fam = interps[0].i.familia;
  const serie = interps.map(({ h, i }) => {
    const valor = fam === "schema" ? (i.totalAtivos ?? 0)
      : fam === "threshold" ? (i.flagged?.length ?? 0)
      : (i.total ?? h.pontuacao);
    return { data: new Date(h.criado_em).toLocaleDateString("pt-BR"), valor };
  });
  const first = interps[0].i;
  const maxVal = fam === "schema" ? (first.totalEsquemas ?? Math.max(...serie.map((s) => s.valor), 1))
    : fam === "threshold" ? (first.respostas.length || Math.max(...serie.map((s) => s.valor), 1))
    : (first.max ?? Math.max(...serie.map((s) => s.valor), 1));
  const titulo = fam === "schema" ? `${first.sigla} · ${first.unidade}s ativos`
    : fam === "threshold" ? `${first.sigla} · ${first.unidadeDefesa}s`
    : first.sigla;
  return { serie, maxVal, titulo };
}

// ===== Componentes de interpretação (painel) =====
function BarraMini({ pct, cor, delay = 0 }: { pct: number; cor: string; delay?: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-[var(--c-border)]">
      <motion.div className="h-full rounded-full" style={{ background: cor }}
        initial={{ width: 0 }} animate={{ width: Math.min(100, pct) + "%" }}
        transition={{ duration: 0.7, ease: "easeOut", delay }} />
    </div>
  );
}

function SchemaDrill({ rodada, cor }: { rodada: RodadaInterpretada; cor: string }) {
  const grupos = new Map<string, EsquemaInterpretado[]>();
  for (const e of rodada.esquemas) {
    const arr = grupos.get(e.dominio) ?? [];
    arr.push(e);
    grupos.set(e.dominio, arr);
  }
  const verde = "#4A8B6B";
  return (
    <div className="space-y-3">
      {Array.from(grupos.entries()).map(([dom, esquemas]) => (
        <div key={dom} className="rounded-xl border border-[var(--c-border)] p-4">
          <h4 className="mb-3 text-xs font-semibold text-[var(--c-text)]">{dom}</h4>
          <div className="space-y-2.5">
            {esquemas.map((e, i) => {
              const ativo = e.ativo && !e.positivo;
              const destaque = ativo || (e.positivo && e.ativo);
              const corItem = e.positivo ? verde : ativo ? cor : "var(--c-muted)";
              return (
                <div key={e.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className={destaque ? "font-semibold" : "text-[var(--c-muted)]"} style={destaque ? { color: corItem } : undefined}>
                      {e.nome}{e.positivo ? " (saudável)" : ""}
                    </span>
                    <span className={destaque ? "font-bold" : "text-[var(--c-muted)]"} style={destaque ? { color: corItem } : undefined}>{e.media.toFixed(1)}</span>
                  </div>
                  <BarraMini pct={(e.media / 6) * 100} cor={e.positivo ? verde : ativo ? cor : "var(--c-muted)"} delay={i * 0.03} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function RawItens({ interp }: { interp: RespostaInterpretada }) {
  const [aberto, setAberto] = useState(false);
  const cfg = allScaleConfigs[interp.tipo];
  return (
    <div className="pt-1">
      <button onClick={() => setAberto(!aberto)} className="text-[11px] font-medium text-[var(--c-accent)] hover:underline">
        {aberto ? "Ocultar respostas item a item" : `Ver respostas item a item (${interp.respostas.length})`}
      </button>
      {aberto && (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {interp.respostas.map((val, i) => {
            const itemRaw = cfg?.itens?.[i];
            const pergunta = itemRaw ? getItemText(itemRaw, i) : `Item ${i + 1}`;
            const optLabel = getOptionLabel(interp.tipo, val);
            const maxOp = cfg?.opcoes ? Math.max(...cfg.opcoes.map((o) => o.valor)) : 6;
            const ratio = maxOp > 0 ? val / maxOp : 0;
            return (
              <div key={i} className="flex items-start gap-3 rounded-lg p-2 hover:bg-[var(--c-surface)]/30">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--c-accent)]/10 text-[10px] font-bold text-[var(--c-accent)]">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs text-[var(--c-text)]">{pergunta}</p>
                  <p className="text-[10px] font-medium" style={{ color: ratio >= 0.75 ? "#c53030" : ratio >= 0.5 ? "#d69e2e" : ratio > 0 ? "#38a169" : "var(--c-muted)" }}>
                    {optLabel ? `${optLabel} (${val})` : `${val}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ResumoCard({ interp }: { interp: RespostaInterpretada }) {
  const cor = "var(--c-accent)";
  let valor: number; let sub: string; let pct: number; let nivel: string | undefined;
  if (interp.familia === "schema") {
    valor = interp.totalAtivos ?? 0;
    sub = `de ${interp.totalEsquemas} ${interp.unidade}s mapeados`;
    pct = interp.totalEsquemas ? ((interp.totalAtivos ?? 0) / interp.totalEsquemas) * 100 : 0;
    nivel = `${interp.unidade === "modo" ? "Modos" : "Esquemas"} ativos`;
  } else if (interp.familia === "threshold") {
    valor = interp.flagged?.length ?? 0;
    sub = `${interp.unidadeDefesa}s ativas (item ≥ 5)`;
    pct = interp.respostas.length ? ((interp.flagged?.length ?? 0) / interp.respostas.length) * 100 : 0;
  } else {
    valor = interp.total ?? 0;
    sub = `de ${interp.max} pontos`;
    pct = interp.pct ?? 0;
    nivel = interp.classificacao;
  }
  return (
    <div className="text-center">
      <span className="rounded-full bg-[var(--c-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">{interp.sigla}</span>
      <p className="mt-3 text-4xl font-bold" style={{ color: cor }}>{valor}</p>
      <p className="text-xs text-[var(--c-muted)]">{sub}</p>
      <div className="mx-auto mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--c-border)]">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full" style={{ background: cor }} />
      </div>
      {nivel && <p className="mt-2 text-sm font-semibold" style={{ color: cor }}>{nivel}</p>}
    </div>
  );
}

function InterpretBlock({ interp }: { interp: RespostaInterpretada }) {
  const cores = ["#B05D3A", "#3A6B8C", "#6B3A8C", "#4A6B47"];

  if (interp.familia === "schema") {
    return (
      <div className="space-y-5">
        {interp.rodadas!.map((rd, ri) => {
          const cor = cores[ri % cores.length];
          const naoPositivos = rd.esquemas.filter((e) => !e.positivo).length;
          return (
            <div key={rd.label || ri}>
              <div className="mb-2 flex items-center gap-2">
                {(interp.rodadas!.length > 1 || rd.label) && (
                  <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: cor + "1A", color: cor }}>{rd.label || "Resultado"}</span>
                )}
                <span className="text-xs text-[var(--c-muted)]">{rd.ativos.length} de {naoPositivos} {interp.unidade}s ativos</span>
              </div>
              {rd.ativos.length > 0 ? (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {rd.ativos.map((e) => (
                    <span key={e.id} className="rounded-lg px-2.5 py-1 text-[11px] font-semibold" style={{ background: cor + "1A", color: cor }} title={e.dominio}>
                      {e.nome} · {e.media.toFixed(1)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mb-3 text-xs text-[var(--c-muted)]">Nenhum {interp.unidade} ativo (média acima de {LIMIAR_TXT}).</p>
              )}
              {rd.saudavelAtivo && (
                <p className="mb-3 text-[11px] font-medium" style={{ color: "#4A8B6B" }}>
                  Modo saudável presente: {rd.saudavelAtivo.nome} ({rd.saudavelAtivo.media.toFixed(1)}) — recurso protetor.
                </p>
              )}
              <SchemaDrill rodada={rd} cor={cor} />
            </div>
          );
        })}
        <RawItens interp={interp} />
      </div>
    );
  }

  if (interp.familia === "threshold") {
    return (
      <div className="space-y-3">
        {(!interp.flagged || interp.flagged.length === 0) ? (
          <p className="text-xs text-[var(--c-muted)]">Nenhuma {interp.unidadeDefesa} ativada (nenhum item com nota ≥ 5).</p>
        ) : (
          <ul className="space-y-2">
            {interp.flagged.map((f) => (
              <li key={f.index} className="flex items-start gap-3 text-xs">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ background: f.valor >= 6 ? "#c53030" : "var(--c-accent)" }}>{f.valor}</span>
                <span className="leading-snug text-[var(--c-text)]">{f.texto}</span>
              </li>
            ))}
          </ul>
        )}
        <RawItens interp={interp} />
      </div>
    );
  }

  // faixa / dominio
  return (
    <div className="space-y-3">
      {interp.classificacao && (
        <div className="rounded-lg bg-[var(--c-surface)] p-3">
          <p className="text-xs font-semibold text-[var(--c-accent)]">{interp.classificacao}</p>
          {interp.descricao && <p className="mt-0.5 text-xs text-[var(--c-muted)]">{interp.descricao}</p>}
        </div>
      )}
      {interp.dominios && interp.dominios.length > 0 && (
        <div className="space-y-2.5">
          {interp.dominios.map((d, i) => (
            <div key={d.id}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--c-text)]">{d.nome}</span>
                <span className="font-semibold text-[var(--c-accent)]">{d.media.toFixed(1)} <span className="text-[var(--c-muted)]">(soma {d.soma})</span></span>
              </div>
              <BarraMini pct={(d.media / 6) * 100} cor="var(--c-accent)" delay={i * 0.05} />
            </div>
          ))}
        </div>
      )}
      <RawItens interp={interp} />
    </div>
  );
}

const LIMIAR_TXT = "3.5";

// ===== Perfil por paciente (lista + perfil) =====
function chavePaciente(r: Resposta): string {
  return r.nome.trim().toLowerCase() + "|" + (r.nascimento ?? "");
}

function PacientesLista({ respostas, onAbrir }: { respostas: Resposta[]; onAbrir: (chave: string) => void }) {
  const grupos = (() => {
    const m = new Map<string, Resposta[]>();
    for (const r of respostas) { const k = chavePaciente(r); const a = m.get(k) ?? []; a.push(r); m.set(k, a); }
    return Array.from(m.entries())
      .map(([chave, rs]) => ({ chave, nome: rs[0].nome, nascimento: rs[0].nascimento, rs: [...rs].sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()) }))
      .sort((a, b) => new Date(b.rs[0].criado_em).getTime() - new Date(a.rs[0].criado_em).getTime());
  })();
  if (grupos.length === 0) return <p className="py-12 text-center text-[var(--c-muted)]">Nenhum paciente.</p>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {grupos.map((g) => {
        const tipos = Array.from(new Set(g.rs.map((r) => r.tipo)));
        const risco = detectarRiscos(g.rs);
        const ultima = new Date(g.rs[0].criado_em).toLocaleDateString("pt-BR");
        return (
          <div key={g.chave} onClick={() => onAbrir(g.chave)} className="glass-card cursor-pointer rounded-2xl p-5 transition-colors hover:border-[var(--c-accent)]/30">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[var(--c-text)]">{g.nome}</h3>
                <p className="text-[10px] text-[var(--c-muted)]">{g.nascimento ?? "—"} · última {ultima}</p>
              </div>
              {risco.length > 0 && <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase" style={{ background: "#dc26261A", color: "#dc2626" }}>risco</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {tipos.map((t) => <span key={t} className="rounded-full bg-[var(--c-accent)]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--c-accent)]">{t}</span>)}
            </div>
            <p className="mt-2 text-[10px] text-[var(--c-muted)]">{g.rs.length} resposta{g.rs.length !== 1 ? "s" : ""} · {tipos.length} escala{tipos.length !== 1 ? "s" : ""}</p>
          </div>
        );
      })}
    </div>
  );
}

function PainelCorrelacoes({ correls }: { correls: Correlacao[] }) {
  if (correls.length === 0) return null;
  return (
    <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-5">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Correlações entre escalas <span className="normal-case text-[var(--c-muted)]">(factual — confirme clinicamente)</span></p>
      <ul className="space-y-2">
        {correls.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: c.nivel === "atencao" ? "#f59e0b" : "var(--c-accent)" }}>•</span>
            <span className="leading-snug text-[var(--c-text)]">{c.texto}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PerfilPaciente({ respostas, onVoltar, onAbrirResposta, onExcluir }: { respostas: Resposta[]; onVoltar: () => void; onAbrirResposta: (r: Resposta) => void; onExcluir: () => void }) {
  const [confirmNome, setConfirmNome] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const ordenado = [...respostas].sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
  const nome = ordenado[0]?.nome ?? "Paciente";
  const nascimento = ordenado[0]?.nascimento;
  const riscos = detectarRiscos(ordenado);
  const latestPorTipo = (() => {
    const m = new Map<string, Resposta>();
    for (const r of ordenado) if (!m.has(r.tipo)) m.set(r.tipo, r); // ordenado desc → primeiro é o mais recente
    return Array.from(m.values());
  })();
  const interps = latestPorTipo.map((r) => interpretarResposta(r.tipo, r.respostas, r.pontuacao));
  const correls = correlacoesFactuais(interps);

  return (
    <>
      <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
        <button onClick={onVoltar} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
        <div>
          <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{nome}</h2>
          <p className="text-[10px] text-[var(--c-muted)]">{nascimento ?? "—"} · {ordenado.length} resposta{ordenado.length !== 1 ? "s" : ""} · {latestPorTipo.length} escala{latestPorTipo.length !== 1 ? "s" : ""}</p>
        </div>
      </motion.div>

      {riscos.length > 0 && (
        <motion.div variants={fadeUp} className="mb-6 space-y-2">
          {riscos.map((r, i) => (
            <div key={i} className="flex items-start gap-3 rounded-2xl border-2 p-4" style={{ borderColor: r.nivel === "critico" ? "#dc2626" : "#f59e0b", background: r.nivel === "critico" ? "#dc26260A" : "#f59e0b0A" }}>
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" style={{ color: r.nivel === "critico" ? "#dc2626" : "#f59e0b" }} />
              <div>
                <p className="text-xs font-bold" style={{ color: r.nivel === "critico" ? "#dc2626" : "#f59e0b" }}>{r.nivel === "critico" ? "ALERTA CRITICO" : "ALERTA DE RISCO"}</p>
                <p className="text-xs text-[var(--c-text)]">{r.mensagem}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <PainelCorrelacoes correls={correls} />

      <motion.div variants={fadeUp} className="mb-4 grid gap-4 md:grid-cols-2">
        {latestPorTipo.map((r) => {
          const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
          return (
            <div key={r.tipo} className="glass-card rounded-2xl p-5">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="rounded-full bg-[var(--c-accent)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">{interp.sigla}</span>
                  <p className="mt-1.5 text-xs font-semibold text-[var(--c-text)]">{interp.resumo}</p>
                  <p className="text-[10px] text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</p>
                </div>
                <button onClick={() => onAbrirResposta(r)} className="flex-shrink-0 text-[10px] font-medium text-[var(--c-accent)] hover:underline">Abrir / parecer</button>
              </div>
              <InterpretBlock interp={interp} />
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Linha do tempo ({ordenado.length})</p>
        <div className="space-y-1.5">
          {ordenado.map((r) => {
            const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
            return (
              <div key={r.id} onClick={() => onAbrirResposta(r)} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer hover:bg-[var(--c-surface)]/40">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[var(--c-accent)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--c-accent)]">{r.tipo}</span>
                  <span className="text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</span>
                </div>
                <span className="font-medium text-[var(--c-text)]">{interp.resumo}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card mt-4 rounded-2xl border border-red-200/50 p-5">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-red-500">LGPD — Direito ao esquecimento</p>
        {!confirmando ? (
          <button onClick={() => setConfirmando(true)} className="rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-500 transition-all hover:bg-red-50">
            Excluir todos os dados deste paciente
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[var(--c-muted)]">Digite o nome para confirmar: <span className="font-semibold text-[var(--c-text)]">{nome}</span></p>
            <input value={confirmNome} onChange={(e) => setConfirmNome(e.target.value)} placeholder={nome}
              className="w-full rounded-xl border border-red-300 bg-[var(--c-bg)]/60 px-4 py-2 text-sm text-[var(--c-text)] focus:outline-none focus:border-red-500" />
            <div className="flex gap-2">
              <button onClick={() => { setConfirmando(false); setConfirmNome(""); }}
                className="rounded-full border border-[var(--c-border)] px-4 py-2 text-xs text-[var(--c-muted)]">Cancelar</button>
              <button onClick={onExcluir} disabled={confirmNome.trim().toLowerCase() !== nome.trim().toLowerCase()}
                className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">
                Confirmar exclusão permanente
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}

export default function BrunoPainel() {
  const [auth, setAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loginLoading, setLoginLoading] = useState(true);
  const [tab, setTab] = useState<"respostas" | "blog" | "ferramentas">("respostas");
  const [respView, setRespView] = useState<"lista" | "pacientes">("lista");
  const [pacienteChave, setPacienteChave] = useState<string | null>(null);
  const [respostaAberta, setRespostaAberta] = useState<Resposta | null>(null);
  const [historicoAberto, setHistoricoAberto] = useState<Resposta[]>([]);
  const [parecerAvulso, setParecerAvulso] = useState(false);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
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
  const [ferramentaAberta, setFerramentaAberta] = useState<FerramentaTerapeuta | null>(null);
  const [ferramentaDados, setFerramentaDados] = useState<Record<string, string>>({});

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
        (payload: { new: { id: number; tipo: string; nome: string; criado_em: string; respostas: number[]; pontuacao: number } }) => {
          const r = payload.new;
          const riscos = detectarRiscos([{ id: r.id, tipo: r.tipo, nome: r.nome, respostas: r.respostas ?? [], pontuacao: r.pontuacao ?? 0, criado_em: r.criado_em }]);
          const critico = riscos.some((x) => x.nivel === "critico");
          const nota: Notificacao = { id: r.id, tipo: r.tipo, nome: r.nome, tempo: "agora", critico };
          setNotificacoes((prev) => [nota, ...prev].slice(0, 5));
          if (!critico) setTimeout(() => setNotificacoes((prev) => prev.filter((n) => n.id !== r.id)), 8000);
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

  // Edita um post estatico (JSON): abre o editor pre-preenchido. Ao salvar, cria uma
  // linha no Supabase com o MESMO slug, que sobrepoe o estatico no blog (getAllPosts
  // deduplica por slug com o dinamico primeiro). setEditando(null) forca INSERT.
  function editarEstatico(p: BlogPost) {
    setEditando(null);
    setBlogForm({
      slug: p.slug, titulo: p.titulo, subtitulo: p.subtitulo, categoria: p.categoria,
      tempo_leitura: p.tempoLeitura, resumo: p.resumo, tags: p.tags.join(", "),
      conteudo: p.conteudo, publicado: true,
    });
    setBlogMsg("Editando copia do post estatico — ao salvar, cria versao editavel no Supabase que sobrepoe o original no site.");
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
    for (let i = 0; i < items.length; i++) {
      const r = items[i];
      setExportProgress(`${i + 1}/${items.length}`);
      const cfg = allScaleConfigs[r.tipo];
      const perguntas = cfg?.itens?.map((item, idx) => getItemText(item, idx)) ?? r.respostas.map((_, idx) => `Item ${idx + 1}`);
      const dt = new Date(r.criado_em).toLocaleDateString("pt-BR");
      const sigla = testesDisponiveis.find((t) => t.id === r.tipo)?.sigla ?? r.tipo.toUpperCase();
      const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
      const doc = gerarPDF({ tipo: sigla, nome: r.nome, pontuacao: r.pontuacao, nivel: interp.resumo, respostas: r.respostas, perguntas, data: dt, interp, optionLabel: (v) => getOptionLabel(r.tipo, v) });
      zip.file(sigla + "_" + r.nome.replace(/\s+/g, "_") + "_" + dt.replace(/\//g, "-") + ".pdf", doc.output("arraybuffer"));
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "respostas_" + new Date().toISOString().slice(0, 10) + ".zip"; a.click();
    setExportando(false);
    setExportProgress("");
  }

  async function deletar() {
    if (!supabase || !selecionados.size) return;
    await supabase.from("respostas_questionarios").delete().in("id", Array.from(selecionados));
    setSelecionados(new Set()); carregar();
  }

  async function excluirPaciente(chave: string) {
    if (!supabase) return;
    const ids = respostas.filter((r) => chavePaciente(r) === chave).map((r) => r.id);
    if (!ids.length) return;
    await supabase.from("respostas_questionarios").delete().in("id", ids);
    setPacienteChave(null);
    carregar();
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

  function abrirDashboard(r: Resposta) {
    setRespostaAberta(r);
    const hist = respostas.filter((x) => x.nome.toLowerCase() === r.nome.toLowerCase());
    setHistoricoAberto(hist);
    setPaciente({ nome: r.nome, idade: r.nascimento ?? "", dataAvaliacao: new Date(r.criado_em).toLocaleDateString("pt-BR"), escolaridade: "" });
    const testeInfo = testesDisponiveis.find((t) => t.id === r.tipo);
    if (testeInfo) {
      const novoTeste: ResultadoTeste = { testeId: testeInfo.id, sigla: testeInfo.sigla, nome: testeInfo.nome, dados: { escore: r.pontuacao }, respostasCruas: r.respostas };
      const outros = hist.filter((x) => x.id !== r.id && testesDisponiveis.some((t) => t.id === x.tipo)).map((x) => {
        const info = testesDisponiveis.find((t) => t.id === x.tipo)!;
        return processarTeste({ testeId: info.id, sigla: info.sigla, nome: info.nome, dados: { escore: x.pontuacao }, respostasCruas: x.respostas });
      });
      setParecerTestes([processarTeste(novoTeste), ...outros]);
    }
    setSintese("");
    setConsideracoes("");
  }

  function abrirParecerAvulso() {
    setRespostaAberta(null);
    setHistoricoAberto([]);
    setParecerAvulso(true);
    resetParecer();
  }

  function fecharDashboard() {
    setRespostaAberta(null);
    setHistoricoAberto([]);
    setParecerAvulso(false);
    resetParecer();
  }

  function exportarFerramentaPDF(f: FerramentaTerapeuta, dados: Record<string, string>) {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 180; const ML = 15; let y = 20;
    function txt(text: string, size = 10, bold = false, color: [number, number, number] = [40, 40, 40]) {
      doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setTextColor(...color);
      for (const line of doc.splitTextToSize(text, W)) { if (y > 275) { doc.addPage(); y = 20; } doc.text(line, ML, y); y += size * 0.45; }
    }
    txt(f.titulo, 14, true, [30, 30, 30]); y += 3;
    txt(f.categoria, 9, false, [120, 120, 120]); y += 5;
    doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    for (const campo of f.campos) {
      txt(campo.label, 10, true); y += 1;
      const val = dados[campo.label]?.trim();
      txt(val || "(não preenchido)", 10, false, val ? [40, 40, 40] : [180, 180, 180]); y += 4;
    }
    y += 4; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    txt(f.referencia, 8, false, [120, 120, 120]); y += 6;
    txt("Bruno SG — Psicólogo CRP 07/44472", 9, true, [120, 120, 120]);
    doc.save(`${f.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  const tabBtn = (id: "respostas" | "blog" | "ferramentas") =>
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
            <button onClick={() => { setTab("respostas"); fecharDashboard(); }} className={tabBtn("respostas")} style={tab === "respostas" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Respostas</button>
            <button onClick={() => { setTab("ferramentas"); setFerramentaAberta(null); }} className={tabBtn("ferramentas")} style={tab === "ferramentas" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Ferramentas</button>
            <button onClick={() => setTab("blog")} className={tabBtn("blog")} style={tab === "blog" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Blog</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            {tab === "respostas" && !respostaAberta && !parecerAvulso && (() => {
              const riscos = detectarRiscos(respostas);
              const emPerfil = respView === "pacientes" && pacienteChave;
              return (
              <>
                {riscos.length > 0 && !emPerfil && (
                  <motion.div variants={fadeUp} className="mb-4 space-y-2">
                    {riscos.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-2xl border-2 p-4"
                        style={{ borderColor: r.nivel === "critico" ? "#dc2626" : "#f59e0b", background: r.nivel === "critico" ? "#dc26260A" : "#f59e0b0A" }}>
                        <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" style={{ color: r.nivel === "critico" ? "#dc2626" : "#f59e0b" }} />
                        <div>
                          <p className="text-xs font-bold" style={{ color: r.nivel === "critico" ? "#dc2626" : "#f59e0b" }}>
                            {r.nivel === "critico" ? "ALERTA CRITICO" : "ALERTA DE RISCO"}
                          </p>
                          <p className="text-xs text-[var(--c-text)]">{r.mensagem}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                <motion.div variants={fadeUp} className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas</h2>
                    <div className="flex gap-0.5 rounded-full bg-[var(--c-surface)]/60 p-0.5">
                      {(["lista", "pacientes"] as const).map((v) => (
                        <button key={v} onClick={() => { setRespView(v); setPacienteChave(null); }}
                          className={"rounded-full px-3 py-1 text-[11px] font-semibold capitalize transition-all " + (respView === v ? "text-white" : "text-[var(--c-muted)] hover:text-[var(--c-text)]")}
                          style={respView === v ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>{v}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={abrirParecerAvulso}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                      <Plus size={14} /> Novo Parecer
                    </button>
                    <button onClick={carregar} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><RefreshCw size={15} /></button>
                    {respView === "lista" && <motion.button whileTap={{ scale: 0.96 }} onClick={exportar} disabled={!selecionados.size || exportando}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                      style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                      <Download size={14} /> {exportando ? (exportProgress ? `Gerando ${exportProgress}...` : "...") : "PDF (" + selecionados.size + ")"}
                    </motion.button>}
                    {respView === "lista" && <button onClick={deletar} disabled={!selecionados.size}
                      className="flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-xs font-semibold text-red-500 transition-all hover:bg-red-50 disabled:opacity-40">
                      <Trash2 size={14} /> ({selecionados.size})
                    </button>}
                  </div>
                </motion.div>

                {loading ? (
                  <p className="py-12 text-center text-[var(--c-muted)]">Carregando...</p>
                ) : respView === "pacientes" ? (
                  pacienteChave ? (
                    <PerfilPaciente
                      respostas={respostas.filter((r) => chavePaciente(r) === pacienteChave)}
                      onVoltar={() => setPacienteChave(null)}
                      onAbrirResposta={(r) => abrirDashboard(r)}
                      onExcluir={() => excluirPaciente(pacienteChave!)} />
                  ) : (
                    <PacientesLista respostas={respostas} onAbrir={(k) => setPacienteChave(k)} />
                  )
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
                            <tr key={r.id} className="border-b border-[var(--c-border)]/60 transition-colors hover:bg-[var(--c-surface)]/40 cursor-pointer" onClick={() => abrirDashboard(r)}>
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selecionados.has(r.id)} onChange={() => toggle(r.id)} /></td>
                              <td className="px-4 py-3">
                                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: cor + "1A", color: cor }}>{r.tipo.toUpperCase()}</span>
                              </td>
                              <td className="px-4 py-3 font-medium text-[var(--c-text)]">{r.nome}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{r.nascimento ?? "-"}</td>
                              <td className="px-4 py-3 font-semibold text-[var(--c-text)]">{r.pontuacao}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{interpretarResposta(r.tipo, r.respostas, r.pontuacao).resumo}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </>
              );
            })()}

            {/* ===== DASHBOARD / RELATÓRIO ===== */}
            {tab === "respostas" && (respostaAberta || parecerAvulso) && (
              <>
                <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={fecharDashboard} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
                      <X size={15} />
                    </button>
                    <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{respostaAberta ? respostaAberta.nome : "Novo Parecer"}</h2>
                  </div>
                  <motion.button whileTap={{ scale: 0.96 }} onClick={exportarParecer} disabled={!parecerTestes.length}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
                    style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                    <Download size={14} /> Gerar Parecer PDF
                  </motion.button>
                </motion.div>

                {/* Dados + Score visual */}
                <div className={`mb-6 grid gap-4 ${respostaAberta ? "md:grid-cols-3" : ""}`}>
                  <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Paciente</p>
                    <div className="space-y-2">
                      <input value={paciente.nome} onChange={(e) => setPaciente({ ...paciente, nome: e.target.value })}
                        className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm font-medium text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={paciente.idade} onChange={(e) => setPaciente({ ...paciente, idade: e.target.value })} placeholder="Idade"
                          className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-1.5 text-xs text-[var(--c-text)] focus:outline-none" />
                        <input value={paciente.dataAvaliacao} onChange={(e) => setPaciente({ ...paciente, dataAvaliacao: e.target.value })} placeholder="Data"
                          className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-1.5 text-xs text-[var(--c-text)] focus:outline-none" />
                      </div>
                      <input value={paciente.escolaridade} onChange={(e) => setPaciente({ ...paciente, escolaridade: e.target.value })} placeholder="Escolaridade"
                        className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-1.5 text-xs text-[var(--c-text)] focus:outline-none" />
                    </div>
                  </motion.div>

                  {respostaAberta && <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Resultado Atual</p>
                    <ResumoCard interp={interpretarResposta(respostaAberta.tipo, respostaAberta.respostas, respostaAberta.pontuacao)} />
                  </motion.div>}

                  {respostaAberta && <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Histórico ({historicoAberto.length})</p>
                    {historicoAberto.length <= 1 ? (
                      <p className="py-4 text-center text-xs text-[var(--c-muted)]">Primeira resposta deste paciente.</p>
                    ) : (
                      <div className="max-h-40 space-y-1.5 overflow-y-auto">
                        {historicoAberto.map((h) => {
                          const hcor = h.tipo === "phq9" ? "#B05D3A" : h.tipo === "gad7" ? "#4A6B47" : "var(--c-accent)";
                          return (
                            <div key={h.id} className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs ${h.id === respostaAberta!.id ? "bg-[var(--c-accent)]/10 font-semibold" : "hover:bg-[var(--c-surface)]/40"}`}
                              onClick={() => abrirDashboard(h)} style={{ cursor: "pointer" }}>
                              <div className="flex items-center gap-2">
                                <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase" style={{ background: hcor + "1A", color: hcor }}>{h.tipo}</span>
                                <span className="text-[var(--c-muted)]">{new Date(h.criado_em).toLocaleDateString("pt-BR")}</span>
                              </div>
                              <span className="font-medium text-[var(--c-text)]">{h.pontuacao}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>}
                </div>

                {respostaAberta && (() => {
                  const ev = serieEvolucao(historicoAberto.filter((h) => h.tipo === respostaAberta.tipo));
                  return ev ? <div className="mb-6"><EvolucaoChart serie={ev.serie} maxVal={ev.maxVal} titulo={ev.titulo} /></div> : null;
                })()}

                {/* Interpretação clínica da escala */}
                {respostaAberta && (() => {
                  const interp = interpretarResposta(respostaAberta.tipo, respostaAberta.respostas, respostaAberta.pontuacao);
                  return (
                    <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-5">
                      <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Interpretacao — {interp.nomeEscala}</p>
                      <InterpretBlock interp={interp} />
                    </motion.div>
                  );
                })()}

                {/* Parecer — instrumentos + texto + síntese */}
                <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Parecer — Instrumentos ({parecerTestes.length})</p>
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

            {tab === "ferramentas" && (
              <>
                {ferramentaAberta ? (
                  <motion.div variants={fadeUp}>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => { setFerramentaAberta(null); setFerramentaDados({}); }} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{ferramentaAberta.categoria}</p>
                          <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{ferramentaAberta.titulo}</h2>
                        </div>
                      </div>
                      <button onClick={() => exportarFerramentaPDF(ferramentaAberta, ferramentaDados)}
                        className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                        style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                        <Download size={14} /> Salvar PDF
                      </button>
                    </div>
                    <div className="glass-card rounded-2xl p-6">
                      <div className="space-y-4">
                        {ferramentaAberta.campos.map((campo) => (
                          <div key={campo.label}>
                            <label className="mb-1 block text-[11px] font-medium text-[var(--c-accent)]">{campo.label}</label>
                            {campo.tipo === "area" ? (
                              <textarea value={ferramentaDados[campo.label] ?? ""} onChange={(e) => setFerramentaDados({ ...ferramentaDados, [campo.label]: e.target.value })} rows={3}
                                className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-y" />
                            ) : (
                              <input value={ferramentaDados[campo.label] ?? ""} onChange={(e) => setFerramentaDados({ ...ferramentaDados, [campo.label]: e.target.value })}
                                className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-2.5 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 rounded-xl border border-[var(--c-border)] p-3">
                        <p className="text-[9px] text-[var(--c-muted)]">{ferramentaAberta.referencia}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <motion.div variants={fadeUp} className="mb-6">
                      <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Ferramentas do Terapeuta</h2>
                    </motion.div>
                    <motion.div variants={fadeUp} className="grid gap-3 md:grid-cols-2">
                      {ferramentas.map((f) => (
                        <div key={f.id} className="glass-card cursor-pointer rounded-2xl p-5 transition-colors hover:border-[var(--c-accent)]/30"
                          onClick={() => { setFerramentaAberta(f); setFerramentaDados({}); }}>
                          <h3 className="text-sm font-semibold text-[var(--c-text)]">{f.titulo}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="rounded-full bg-[var(--c-accent)]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--c-accent)]">{f.categoria}</span>
                            <span className="text-[9px] text-[var(--c-muted)]">{f.campos.length} campos</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </>
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

                        {staticPosts.filter((p) => !blogPosts.some((b) => b.slug === p.slug)).length > 0 && (
                          <p className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-[var(--c-muted)]">Estaticos ({staticPosts.filter((p) => !blogPosts.some((b) => b.slug === p.slug)).length})</p>
                        )}
                        {staticPosts.filter((p) => !blogPosts.some((b) => b.slug === p.slug)).map((p) => (
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
                            <div className="flex gap-1">
                              <button onClick={() => editarEstatico(p)} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title="Editar (cria copia editavel no Supabase)">
                                <Edit3 size={14} />
                              </button>
                              <Link to={"/blog/" + p.slug} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]" title="Ver post">
                                <ExternalLink size={14} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </>
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
              className="glass-card flex items-center gap-3 rounded-2xl p-4 shadow-lg"
              style={{ borderLeft: n.critico ? "3px solid #dc2626" : "3px solid var(--c-accent)", background: n.critico ? "#dc26260D" : undefined }}>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full" style={{ background: n.critico ? "#dc26261A" : "var(--c-accent)/15" }}>
                {n.critico ? <AlertTriangle size={14} style={{ color: "#dc2626" }} /> : <Bell size={14} className="text-[var(--c-accent)]" />}
              </div>
              <div className="min-w-0">
                {n.critico && <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#dc2626" }}>Alerta Crítico</p>}
                <p className="text-xs font-semibold text-[var(--c-text)] truncate">{n.nome} respondeu</p>
                <p className="text-[10px] text-[var(--c-muted)]">{n.tipo.toUpperCase()} · {n.tempo}</p>
              </div>
              <div className="ml-auto flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => { setNotificacoes((prev) => prev.filter((x) => x.id !== n.id)); setTab("respostas"); carregar(); }}
                  className="text-[10px] font-medium text-[var(--c-accent)] hover:underline">Ver</button>
                {n.critico && <button onClick={() => setNotificacoes((prev) => prev.filter((x) => x.id !== n.id))}
                  className="text-[10px] text-[var(--c-muted)] hover:underline">Dispensar</button>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}