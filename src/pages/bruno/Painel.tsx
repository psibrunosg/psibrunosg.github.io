import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Lock, FileText, ExternalLink, RefreshCw, Plus, Save, Eye, EyeOff, Edit3, X, Bold, Italic, Heading2, List, RotateCcw, Bell, AlertTriangle, Sun, Moon } from "lucide-react";
import { PainelPacientes } from "@/components/painelPacientes";
import jsPDF from "jspdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import JSZip from "jszip";
import { supabase, listarPostsBlog, salvarPostBlog, atualizarPostBlog, deletarPostBlog, mensagemErroEdgeFunction, type BlogPostDB } from "@/lib/supabase";
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
import { ConceituacaoCognitiva } from "@/components/ConceituacaoCognitiva";
import { detectarRiscos, type RespostaRegistro } from "@/lib/scoring";

// Decisão clínica (09/07/2026): respostas_questionarios não grava mais nome/telefone
// diretamente — identificação passa a ser via patient_code. Extensão local do tipo
// (sem alterar src/lib/scoring.ts) para incluir as colunas usadas apenas aqui.
// Feature 10 (painel de risco persistente): risco_status é nullable e pode não existir
// ainda no banco (migração separada) — sempre tratado como opcional/null = "aberto".
type Resposta = RespostaRegistro & { patient_code?: string; email?: string; risco_status?: string | null };

// Identificação segura para exibição: nome (dados históricos) > patient_code > id da resposta.
function nomeSeguro(r: Resposta): string {
  return r.nome?.trim() || (r.patient_code ? `Código ${r.patient_code}` : `Paciente #${r.id}`);
}
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

// Feature 5a: dossiê consolidado do paciente — um único PDF com resumo por escala +
// evolução (texto, já que jsPDF não embute o SVG do EvolucaoChart) + parecer livre, se houver.
function gerarDossiePDF(nome: string, nascimento: string | undefined, ordenado: Resposta[], sintese?: string, consideracoes?: string): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 180; const ML = 15; let y = 20;
  function txt(text: string, size = 10, bold = false, color: [number, number, number] = [40, 40, 40]) {
    doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setTextColor(...color);
    for (const line of doc.splitTextToSize(text, W)) { if (y > 275) { doc.addPage(); y = 20; } doc.text(line, ML, y); y += size * 0.45; }
  }
  txt("DOSSIÊ CONSOLIDADO DO PACIENTE", 15, true, [30, 30, 30]); y += 2;
  txt(nome, 12, true);
  if (nascimento) txt(`Nascimento: ${nascimento}`, 9, false, [120, 120, 120]);
  y += 3; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;

  const latestPorTipo = (() => {
    const m = new Map<string, Resposta>();
    for (const r of ordenado) if (!m.has(r.tipo)) m.set(r.tipo, r);
    return Array.from(m.values());
  })();

  txt("RESUMO POR ESCALA", 12, true); y += 2;
  for (const r of latestPorTipo) {
    const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
    txt(`${interp.sigla} — ${interp.nomeEscala}`, 10, true);
    txt(interp.resumo, 9);
    if (interp.classificacao) txt(`Classificação: ${interp.classificacao}`, 9);
    if (interp.familia === "schema") {
      for (const rd of interp.rodadas ?? []) {
        if (rd.ativos.length) txt(`${rd.label ? rd.label + ": " : ""}${rd.ativos.map((e) => e.nome).join(", ")}`, 8, false, [90, 90, 90]);
      }
    } else if (interp.familia === "threshold" && interp.flagged?.length) {
      txt(interp.flagged.map((f) => f.texto).join("; "), 8, false, [90, 90, 90]);
    }
    txt(`Data: ${new Date(r.criado_em).toLocaleDateString("pt-BR")}`, 8, false, [120, 120, 120]);
    y += 2;
  }

  y += 2; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
  txt("EVOLUÇÃO (histórico de pontos)", 12, true); y += 2;
  let temEvolucao = false;
  for (const tipo of Array.from(new Set(ordenado.map((r) => r.tipo)))) {
    const hist = ordenado.filter((r) => r.tipo === tipo);
    const ev = serieEvolucao(hist);
    if (!ev) continue;
    temEvolucao = true;
    txt(ev.titulo, 9, true);
    for (const p of ev.serie) txt(`  ${p.data}: ${p.valor}`, 8, false, [90, 90, 90]);
    y += 1;
  }
  if (!temEvolucao) txt("Sem histórico suficiente (mínimo 2 respostas por escala) para evolução.", 9, false, [140, 140, 140]);

  if (sintese?.trim() || consideracoes?.trim()) {
    y += 2; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
    if (sintese?.trim()) { txt("SÍNTESE", 11, true); txt(sintese, 9); y += 2; }
    if (consideracoes?.trim()) { txt("CONSIDERAÇÕES", 11, true); txt(consideracoes, 9); y += 2; }
  }

  y += 4; doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
  txt("Bruno de Souza Gonçalves · CRP 07/44472", 9, true, [120, 120, 120]);
  return doc;
}

// Feature 4: comparação item-a-item entre duas respostas da MESMA escala.
function CompararRespostas({ a, b }: { a: Resposta; b: Resposta }) {
  const [antiga, nova] = new Date(a.criado_em).getTime() <= new Date(b.criado_em).getTime() ? [a, b] : [b, a];
  const cfg = allScaleConfigs[a.tipo];
  const interpNova = interpretarResposta(nova.tipo, nova.respostas, nova.pontuacao);
  const maiorMelhor = !!interpNova.maiorMelhor;
  const n = Math.max(antiga.respostas.length, nova.respostas.length);

  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">
        Comparação item a item — {interpNova.sigla}
      </p>
      <p className="mb-3 text-[10px] text-[var(--c-muted)]">
        {new Date(antiga.criado_em).toLocaleDateString("pt-BR")} → {new Date(nova.criado_em).toLocaleDateString("pt-BR")}
      </p>
      <div className="space-y-2">
        {Array.from({ length: n }).map((_, i) => {
          const itemRaw = cfg?.itens?.[i];
          const pergunta = itemRaw ? getItemText(itemRaw, i) : `Item ${i + 1}`;
          const vAntigo = antiga.respostas[i];
          const vNovo = nova.respostas[i];
          if (vAntigo === undefined || vNovo === undefined) return null;
          const diff = vNovo - vAntigo;
          const piora = diff === 0 ? false : maiorMelhor ? diff < 0 : diff > 0;
          const melhora = diff === 0 ? false : maiorMelhor ? diff > 0 : diff < 0;
          const cor = piora ? "#c53030" : melhora ? "#38a169" : "var(--c-muted)";
          const labelAntigo = getOptionLabel(a.tipo, vAntigo);
          const labelNovo = getOptionLabel(a.tipo, vNovo);
          return (
            <div key={i} className="flex items-start gap-3 rounded-lg p-2 hover:bg-[var(--c-surface)]/30">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--c-accent)]/10 text-[10px] font-bold text-[var(--c-accent)]">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--c-text)]">{pergunta}</p>
                <p className="text-[11px] font-medium" style={{ color: cor }}>
                  {labelAntigo ?? vAntigo} → {labelNovo ?? vNovo} {diff !== 0 && (piora ? "(piora)" : "(melhora)")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
  if (r.patient_code) return "code:" + r.patient_code;
  if (r.nome && r.nome.trim()) return "nome:" + r.nome.trim().toLowerCase() + "|" + (r.nascimento ?? "");
  return "resp:" + r.id;
}

// ponytail: agrupamento simples reaproveitado pela Visão geral e pela lista "Por paciente".
function agruparPacientes(respostas: Resposta[]): Map<string, Resposta[]> {
  const m = new Map<string, Resposta[]>();
  for (const r of respostas) { const k = chavePaciente(r); const a = m.get(k) ?? []; a.push(r); m.set(k, a); }
  return m;
}

function PacientesLista({ respostas, onAbrir }: { respostas: Resposta[]; onAbrir: (chave: string) => void }) {
  const grupos = (() => {
    const m = new Map<string, Resposta[]>();
    for (const r of respostas) { const k = chavePaciente(r); const a = m.get(k) ?? []; a.push(r); m.set(k, a); }
    return Array.from(m.entries())
      .map(([chave, rs]) => ({ chave, nome: rs[0].nome, nascimento: rs[0].nascimento, patientCode: rs[0].patient_code, email: rs[0].email, rs: [...rs].sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()) }))
      .sort((a, b) => new Date(b.rs[0].criado_em).getTime() - new Date(a.rs[0].criado_em).getTime());
  })();
  if (grupos.length === 0) return <p className="py-12 text-center text-[var(--c-muted)]">Nenhum paciente.</p>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {grupos.map((g) => {
        const tipos = Array.from(new Set(g.rs.map((r) => r.tipo)));
        const risco = detectarRiscos(g.rs);
        const ultima = new Date(g.rs[0].criado_em).toLocaleDateString("pt-BR");
        const identificacao = g.nome?.trim() || (g.patientCode ? `Código ${g.patientCode}` : `Resposta #${g.rs[0].id}`);
        return (
          <div key={g.chave} onClick={() => onAbrir(g.chave)} className="glass-card cursor-pointer rounded-2xl p-5 transition-colors hover:border-[var(--c-accent)]/30">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-[var(--c-text)]">{identificacao}</h3>
                <p className="text-[10px] text-[var(--c-muted)]">{g.nascimento ?? "—"} · última {ultima}{g.email ? ` · ${g.email}` : ""}</p>
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

// Controle da psicoeducação personalizada por paciente (território "De onde vêm
// seus padrões"). Decisão clínica: nada liberado por padrão; revelar escore
// nomeado ao paciente nasce desligado. Resolve/cria o paciente_id (mesma lógica
// da Conceituação) e faz upsert em paciente_psicoed.
function ControlePsicoedPaciente({ patientCode, nome, nascimento }: { patientCode?: string; nome?: string | null; nascimento?: string }) {
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [liberado, setLiberado] = useState(false);
  const [revelar, setRevelar] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!supabase) { setCarregando(false); return; }
    let cancel = false;
    (async () => {
      // Resolve o paciente na tabela âncora (cria se não existir).
      let id: number | null = null;
      if (patientCode) {
        const { data } = await supabase!.from("pacientes").select("id").eq("patient_code", patientCode).maybeSingle();
        id = data?.id ?? null;
        if (id == null) {
          const { data: novo } = await supabase!.from("pacientes").insert({ patient_code: patientCode, nome_paciente: nome ?? null }).select("id").single();
          id = novo?.id ?? null;
        }
      } else if (nome && nome.trim()) {
        const { data } = await supabase!.from("pacientes").select("id").is("patient_code", null).ilike("nome_paciente", nome.trim()).eq("nascimento", nascimento ?? "").maybeSingle();
        id = data?.id ?? null;
        if (id == null) {
          const { data: novo } = await supabase!.from("pacientes").insert({ nome_paciente: nome.trim(), nascimento: nascimento ?? null }).select("id").single();
          id = novo?.id ?? null;
        }
      }
      if (cancel) return;
      setPacienteId(id);
      if (id != null) {
        const { data } = await supabase!.from("paciente_psicoed").select("liberado, revelar_escore").eq("paciente_id", id).maybeSingle();
        if (!cancel && data) { setLiberado(!!data.liberado); setRevelar(!!data.revelar_escore); }
      }
      if (!cancel) setCarregando(false);
    })();
    return () => { cancel = true; };
  }, [patientCode, nome, nascimento]);

  async function salvar(next: { liberado?: boolean; revelar?: boolean }) {
    if (!supabase || pacienteId == null) return;
    const novoLiberado = next.liberado ?? liberado;
    const novoRevelar = next.revelar ?? revelar;
    setSalvando(true);
    setLiberado(novoLiberado);
    setRevelar(novoRevelar);
    await supabase.from("paciente_psicoed").upsert(
      { paciente_id: pacienteId, liberado: novoLiberado, revelar_escore: novoRevelar, atualizado_em: new Date().toISOString() },
      { onConflict: "paciente_id" }
    );
    setSalvando(false);
  }

  if (!supabase) return null;

  const Switch = ({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) => (
    <button onClick={onToggle} disabled={disabled}
      className="relative h-6 w-11 flex-shrink-0 rounded-full transition-colors disabled:opacity-50"
      style={{ background: on ? "var(--c-accent)" : "var(--c-border)" }} aria-pressed={on}>
      <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all" style={{ left: on ? "22px" : "2px" }} />
    </button>
  );

  return (
    <motion.div variants={fadeUp} className="glass-card mb-6 rounded-2xl p-5">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Psicoeducação personalizada</p>
      {carregando ? (
        <p className="text-xs text-[var(--c-muted)]">Carregando...</p>
      ) : pacienteId == null ? (
        <p className="text-xs text-[var(--c-muted)]">Paciente sem código/identificação estável — não é possível personalizar.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--c-text)]">Liberar território "De onde vêm seus padrões"</p>
              <p className="mt-0.5 text-xs text-[var(--c-muted)]">Ao ligar, o paciente (com o código dele) vê a jornada ajustada aos esquemas ativos no YSQ dele.</p>
            </div>
            <Switch on={liberado} disabled={salvando} onToggle={() => salvar({ liberado: !liberado })} />
          </div>
          <div className={`flex items-start justify-between gap-4 border-t border-[var(--c-border)] pt-4 ${liberado ? "" : "opacity-50"}`}>
            <div>
              <p className="text-sm font-medium text-[var(--c-text)]">Revelar o escore/nome do esquema</p>
              <p className="mt-0.5 text-xs text-[var(--c-muted)]">Desligado: o paciente vê a narrativa sem o escore cru. Ligue só quando fizer sentido clínico para este paciente.</p>
            </div>
            <Switch on={revelar} disabled={salvando || !liberado} onToggle={() => salvar({ revelar: !revelar })} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PerfilPaciente({ respostas, onVoltar, onAbrirResposta, onExcluir, sintese, consideracoes }: { respostas: Resposta[]; onVoltar: () => void; onAbrirResposta: (r: Resposta) => void; onExcluir: () => void; sintese?: string; consideracoes?: string }) {
  const [confirmNome, setConfirmNome] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [comparar, setComparar] = useState<Set<number>>(new Set());
  const ordenado = [...respostas].sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
  const primeiro = ordenado[0];
  const nome = primeiro ? nomeSeguro(primeiro) : "Paciente";
  const nascimento = primeiro?.nascimento;
  const email = primeiro?.email;
  const riscos = detectarRiscos(ordenado);
  const latestPorTipo = (() => {
    const m = new Map<string, Resposta>();
    for (const r of ordenado) if (!m.has(r.tipo)) m.set(r.tipo, r); // ordenado desc → primeiro é o mais recente
    return Array.from(m.values());
  })();
  const interps = latestPorTipo.map((r) => interpretarResposta(r.tipo, r.respostas, r.pontuacao));
  const correls = correlacoesFactuais(interps);

  function toggleComparar(id: number) {
    setComparar((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else { if (n.size >= 2) return prev; n.add(id); }
      return n;
    });
  }
  const selecionadasComparar = ordenado.filter((r) => comparar.has(r.id));
  const mesmoTipoComparar = selecionadasComparar.length === 2 && selecionadasComparar[0].tipo === selecionadasComparar[1].tipo;

  function exportarDossie() {
    const doc = gerarDossiePDF(nome, nascimento, ordenado, sintese, consideracoes);
    doc.save(`dossie_${nome.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <>
      <motion.div variants={fadeUp} className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onVoltar} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
          <div>
            <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{nome}</h2>
            <p className="text-[10px] text-[var(--c-muted)]">{nascimento ?? "—"} · {ordenado.length} resposta{ordenado.length !== 1 ? "s" : ""} · {latestPorTipo.length} escala{latestPorTipo.length !== 1 ? "s" : ""}{email ? ` · ${email}` : ""}</p>
          </div>
        </div>
        <button onClick={exportarDossie}
          className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          <Download size={14} /> Exportar dossiê (PDF)
        </button>
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

      <ControlePsicoedPaciente patientCode={primeiro?.patient_code} nome={primeiro?.nome} nascimento={nascimento} />

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
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Linha do tempo ({ordenado.length})</p>
          <p className="text-[10px] text-[var(--c-muted)]">Marque 2 respostas da mesma escala para comparar</p>
        </div>
        <div className="space-y-1.5">
          {ordenado.map((r) => {
            const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
            return (
              <div key={r.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-[var(--c-surface)]/40">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={comparar.has(r.id)} onChange={() => toggleComparar(r.id)} onClick={(e) => e.stopPropagation()} title="Selecionar para comparar" />
                  <span onClick={() => onAbrirResposta(r)} className="cursor-pointer rounded bg-[var(--c-accent)]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[var(--c-accent)]">{r.tipo}</span>
                  <span onClick={() => onAbrirResposta(r)} className="cursor-pointer text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</span>
                </div>
                <span onClick={() => onAbrirResposta(r)} className="cursor-pointer font-medium text-[var(--c-text)]">{interp.resumo}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {selecionadasComparar.length === 2 && (
        <motion.div variants={fadeUp} className="mt-4">
          {mesmoTipoComparar ? (
            <CompararRespostas a={selecionadasComparar[0]} b={selecionadasComparar[1]} />
          ) : (
            <p className="rounded-xl border border-[var(--c-danger)]/30 bg-[var(--c-danger)]/5 p-3 text-xs text-[var(--c-danger)]">
              Só é possível comparar duas respostas da mesma escala.
            </p>
          )}
        </motion.div>
      )}

      <motion.div variants={fadeUp} className="glass-card mt-4 rounded-2xl border border-[var(--c-danger)]/25 p-5">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-danger)]">LGPD — Direito ao esquecimento</p>
        {!confirmando ? (
          <button onClick={() => setConfirmando(true)} className="rounded-full border border-[var(--c-danger)]/40 px-4 py-2 text-xs font-semibold text-[var(--c-danger)] transition-all hover:bg-[var(--c-danger)]/10">
            Excluir todos os dados deste paciente
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[var(--c-muted)]">Digite o nome para confirmar: <span className="font-semibold text-[var(--c-text)]">{nome}</span></p>
            <input value={confirmNome} onChange={(e) => setConfirmNome(e.target.value)} placeholder={nome}
              className="w-full rounded-xl border border-[var(--c-danger)]/40 bg-[var(--c-bg)]/60 px-4 py-2 text-sm text-[var(--c-text)] focus:outline-none focus:border-[var(--c-danger)]" />
            <div className="flex gap-2">
              <button onClick={() => { setConfirmando(false); setConfirmNome(""); }}
                className="rounded-full border border-[var(--c-border)] px-4 py-2 text-xs text-[var(--c-muted)]">Cancelar</button>
              <button onClick={onExcluir} disabled={confirmNome.trim().toLowerCase() !== nome.trim().toLowerCase()}
                className="rounded-full bg-[var(--c-danger)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">
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
  const [tab, setTab] = useState<"overview" | "respostas" | "pacientes" | "blog" | "ferramentas">("overview");
  const [respView, setRespView] = useState<"lista" | "pacientes">("lista");
  // ponytail: busca/filtros/ordenação da lista de respostas — estado local simples, sem lib de tabela.
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<"todos" | "7d" | "30d">("todos");
  const [soRisco, setSoRisco] = useState(false);
  const [sortKey, setSortKey] = useState<"paciente" | "score" | "data">("data");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  // ponytail: dismiss é só de sessão (não persiste) — reaparece ao recarregar a página.
  const [dismissedRiscos, setDismissedRiscos] = useState<Set<number>>(new Set());
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
  // Feature 10: status persistente do risco (aberto/em acompanhamento/resolvido) — "resolvido" fica
  // oculto por padrão; dismissedRiscos (acima) continua sendo o dispensar só-de-sessão.
  const [mostrarResolvidos, setMostrarResolvidos] = useState(false);
  const [riscoStatusErro, setRiscoStatusErro] = useState("");
  // Feature 5b: "Melhorar com IA" do parecer — reaproveita provider/model persistidos por
  // ConceituacaoCognitiva (mesma chave de localStorage = mesma preferência de provedor no app).
  const [parecerIaProvider, setParecerIaProvider] = useState(() => localStorage.getItem("conceituacao_provider") || "nvidia");
  const [parecerIaLoading, setParecerIaLoading] = useState<"sintese" | "consideracoes" | null>(null);
  const [parecerIaAplicado, setParecerIaAplicado] = useState<Set<"sintese" | "consideracoes">>(new Set());
  const [parecerIaErro, setParecerIaErro] = useState("");
  const [ferramentaAberta, setFerramentaAberta] = useState<FerramentaTerapeuta | null>(null);
  const [ferramentaDados, setFerramentaDados] = useState<Record<string, string>>({});
  // Preferencia de UI do proprio terapeuta (nao e dado clinico) — persistida so localmente.
  const [darkMode, setDarkMode] = useState(() => typeof window !== "undefined" && localStorage.getItem("painel_dark_mode") === "true");

  useEffect(() => {
    if (darkMode) document.documentElement.setAttribute("data-mode", "dark");
    else document.documentElement.removeAttribute("data-mode");
    localStorage.setItem("painel_dark_mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Painel | Bruno de Souza Gonçalves";
    if (!supabase) {
      setLoginLoading(false);
      return () => { document.documentElement.removeAttribute("data-theme"); document.documentElement.removeAttribute("data-mode"); };
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setAuth(true); carregar(); carregarBlog(); }
      setLoginLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(!!session);
    });
    const channel = supabase.channel("respostas-realtime").on(
      "postgres_changes", { event: "INSERT", schema: "public", table: "respostas_questionarios" },
      (payload: { new: { id: number; tipo: string; nome: string | null; patient_code?: string | null; criado_em: string; respostas: number[]; pontuacao: number } }) => {
        const r = payload.new;
        const nomeExibicao = r.nome?.trim() || (r.patient_code ? `Código ${r.patient_code}` : `Resposta #${r.id}`);
        const riscos = detectarRiscos([{ id: r.id, tipo: r.tipo, nome: nomeExibicao, respostas: r.respostas ?? [], pontuacao: r.pontuacao ?? 0, criado_em: r.criado_em }]);
        const critico = riscos.some((x) => x.nivel === "critico");
        const nota: Notificacao = { id: r.id, tipo: r.tipo, nome: nomeExibicao, tempo: "agora", critico };
        setNotificacoes((prev) => [nota, ...prev].slice(0, 5));
        if (!critico) setTimeout(() => setNotificacoes((prev) => prev.filter((n) => n.id !== r.id)), 8000);
      }
    ).subscribe();
    return () => { document.documentElement.removeAttribute("data-theme"); document.documentElement.removeAttribute("data-mode"); subscription.unsubscribe(); channel.unsubscribe(); };
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
      const nomeResp = nomeSeguro(r);
      const doc = gerarPDF({ tipo: sigla, nome: nomeResp, pontuacao: r.pontuacao, nivel: interp.resumo, respostas: r.respostas, perguntas, data: dt, interp, optionLabel: (v) => getOptionLabel(r.tipo, v) });
      zip.file(sigla + "_" + nomeResp.replace(/\s+/g, "_") + "_" + dt.replace(/\//g, "-") + ".pdf", doc.output("arraybuffer"));
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

  // Feature 10: persiste o status do alerta de risco na própria resposta flagrada.
  // Otimista na UI; se a coluna ainda não existir (migração não aplicada), captura o
  // erro e avisa sem quebrar o restante do painel.
  async function atualizarRiscoStatus(respostaId: number, status: string) {
    setRespostas((prev) => prev.map((r) => (r.id === respostaId ? { ...r, risco_status: status } : r)));
    setRiscoStatusErro("");
    if (!supabase) return;
    try {
      const { error } = await supabase.from("respostas_questionarios").update({ risco_status: status }).eq("id", respostaId);
      if (error) throw error;
    } catch {
      setRiscoStatusErro("Não foi possível salvar o status no banco (a coluna risco_status pode ainda não existir — aplique a migração).");
    }
  }

  // Feature 5b: envia o texto de-identificado (síntese/considerações) para o mesmo edge
  // function multi-provedor, em modo "parecer" (revisor de texto, não gera fatos novos).
  async function melhorarComIA(campo: "sintese" | "consideracoes") {
    if (!supabase) { setParecerIaErro("Supabase não configurado."); return; }
    const texto = campo === "sintese" ? sintese : consideracoes;
    if (!texto.trim()) return;
    setParecerIaLoading(campo);
    setParecerIaErro("");
    try {
      const { data, error } = await supabase.functions.invoke("conceituacao-draft", {
        body: { modo: "parecer", texto, provider: parecerIaProvider, model: localStorage.getItem("conceituacao_model") || undefined },
      });
      if (error) throw error;
      if (data?.error) { setParecerIaErro(data.error); return; }
      const revisado: string | undefined = data?.texto;
      if (revisado) {
        if (campo === "sintese") setSintese(revisado); else setConsideracoes(revisado);
        setParecerIaAplicado((prev) => new Set(prev).add(campo));
      }
    } catch (e) {
      setParecerIaErro(await mensagemErroEdgeFunction(e, "Erro ao melhorar texto."));
    } finally {
      setParecerIaLoading(null);
    }
  }


  if (loginLoading && !auth) {
    return <div className="flex min-h-screen items-center justify-center"><AppAurora /><p className="relative z-10 text-[var(--c-muted)]">Carregando...</p></div>;
  }

  if (!auth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <AppAurora />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass-card relative z-10 w-full max-w-sm rounded-3xl p-8 text-center">
          <motion.div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(140deg, var(--c-accent), var(--c-accent-lt))", boxShadow: "0 16px 40px -12px var(--c-accent)" }}
            initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
            <Lock size={26} className="text-white" />
          </motion.div>
          <h1 className="mb-1 text-2xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Painel Bruno de Souza Gonçalves</h1>
          <p className="mb-6 text-xs text-[var(--c-muted)]">Acesso restrito ao psicologo</p>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") login(); }}
            placeholder="Senha" className="mb-3 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none" />
          {erro && <p className="mb-3 text-xs text-[var(--c-danger)]">{erro}</p>}
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
    const hist = respostas.filter((x) => chavePaciente(x) === chavePaciente(r));
    setHistoricoAberto(hist);
    setPaciente({ nome: nomeSeguro(r), idade: r.nascimento ?? "", dataAvaliacao: new Date(r.criado_em).toLocaleDateString("pt-BR"), escolaridade: "" });
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
    txt("Bruno de Souza Gonçalves · CRP 07/44472", 9, true, [120, 120, 120]);
    doc.save(`${f.id}_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  const tabBtn = (id: "overview" | "respostas" | "pacientes" | "blog" | "ferramentas") =>
    "px-4 py-1.5 rounded-full text-xs font-semibold transition-all " + (tab === id ? "text-white shadow-[0_8px_20px_-8px_var(--c-accent)]" : "text-[var(--c-muted)] hover:text-[var(--c-text)]");

  return (
    <div className="relative min-h-screen">
      <AppAurora />

      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold text-[var(--c-text)] transition-colors hover:text-[var(--c-accent)]">Bruno de Souza Gonçalves</Link>
            <button onClick={() => setDarkMode((d) => !d)} title={darkMode ? "Modo claro" : "Modo escuro"}
              className="rounded-full border border-[var(--c-border)] p-1.5 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button onClick={logout} className="rounded-full border border-[var(--c-border)] px-3 py-1 text-[10px] text-[var(--c-muted)] transition-colors hover:text-[var(--c-danger)] hover:border-[var(--c-danger)]/40">Sair</button>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setTab("overview")} className={tabBtn("overview")} style={tab === "overview" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Visão geral</button>
            <button onClick={() => { setTab("respostas"); fecharDashboard(); }} className={tabBtn("respostas")} style={tab === "respostas" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Respostas</button>
            <button onClick={() => setTab("pacientes")} className={tabBtn("pacientes")} style={tab === "pacientes" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Acessos</button>
            <button onClick={() => { setTab("ferramentas"); setFerramentaAberta(null); }} className={tabBtn("ferramentas")} style={tab === "ferramentas" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Ferramentas</button>
            <button onClick={() => setTab("blog")} className={tabBtn("blog")} style={tab === "blog" ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>Blog</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            {tab === "overview" && (() => {
              const pacientesUnicos = new Set(respostas.map((r) => chavePaciente(r))).size;
              const seteDiasAtras = Date.now() - 7 * 86400000;
              const recentes7d = respostas.filter((r) => new Date(r.criado_em).getTime() >= seteDiasAtras).length;
              let pacientesRisco = 0;
              for (const rs of agruparPacientes(respostas).values()) if (detectarRiscos(rs).length > 0) pacientesRisco++;
              const porTipo = new Map<string, number>();
              for (const r of respostas) porTipo.set(r.tipo, (porTipo.get(r.tipo) ?? 0) + 1);
              const recentes = respostas.slice(0, 8);
              // Feature 8: métricas agregadas anônimas — nenhum nome de paciente aparece aqui.
              const pctPacientesRisco = pacientesUnicos > 0 ? Math.round((pacientesRisco / pacientesUnicos) * 100) : 0;
              const recentes30d = respostas.filter((r) => new Date(r.criado_em).getTime() >= Date.now() - 30 * 86400000).length;
              const severidadePorEscala = (() => {
                const m = new Map<string, Map<string, number>>();
                for (const r of respostas) {
                  const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
                  const bucket = interp.classificacao || interp.resumo;
                  const inner = m.get(r.tipo) ?? new Map<string, number>();
                  inner.set(bucket, (inner.get(bucket) ?? 0) + 1);
                  m.set(r.tipo, inner);
                }
                return m;
              })();
              const metrics: { label: string; valor: number; destaque?: boolean }[] = [
                { label: "Pacientes únicos", valor: pacientesUnicos },
                { label: "Total de respostas", valor: respostas.length },
                { label: "Respostas (7 dias)", valor: recentes7d },
                { label: "Pacientes com risco aberto", valor: pacientesRisco, destaque: pacientesRisco > 0 },
              ];
              return (
                <>
                  <motion.div variants={fadeUp} className="mb-6">
                    <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Visão geral</h2>
                  </motion.div>
                  <motion.div variants={fadeUp} className="mb-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {metrics.map((m) => (
                      <div key={m.label} className="glass-card rounded-2xl p-5 text-center">
                        <p className="text-3xl font-bold" style={{ color: m.destaque ? "var(--c-danger)" : "var(--c-accent)" }}>{m.valor}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--c-muted)]">{m.label}</p>
                      </div>
                    ))}
                  </motion.div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
                      <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Atividade recente</p>
                      {recentes.length === 0 ? (
                        <p className="py-6 text-center text-xs text-[var(--c-muted)]">Nenhuma resposta ainda.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {recentes.map((r) => {
                            const cor = r.tipo === "phq9" ? "#B05D3A" : r.tipo === "gad7" ? "#4A6B47" : "var(--c-accent)";
                            return (
                              <div key={r.id} onClick={() => { setTab("respostas"); abrirDashboard(r); }}
                                className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors hover:bg-[var(--c-surface)]/40">
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className="flex-shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase" style={{ background: cor + "1A", color: cor }}>{r.tipo}</span>
                                  <span className="truncate font-medium text-[var(--c-text)]">{nomeSeguro(r)}</span>
                                </div>
                                <span className="flex-shrink-0 text-[var(--c-muted)]">{new Date(r.criado_em).toLocaleDateString("pt-BR")}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                    <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5">
                      <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Respostas por escala</p>
                      {porTipo.size === 0 ? (
                        <p className="py-6 text-center text-xs text-[var(--c-muted)]">Sem dados ainda.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {Array.from(porTipo.entries()).map(([t, n]) => (
                            <span key={t} className="rounded-full bg-[var(--c-accent)]/10 px-3 py-1 text-[10px] font-bold uppercase text-[var(--c-accent)]">{t} · {n}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </div>

                  <motion.div variants={fadeUp} className="glass-card mt-4 rounded-2xl p-5">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Métricas agregadas (anônimas)</p>
                    <div className="mb-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-[var(--c-border)] p-4 text-center">
                        <p className="text-2xl font-bold" style={{ color: pctPacientesRisco > 0 ? "var(--c-danger)" : "var(--c-accent)" }}>{pctPacientesRisco}%</p>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--c-muted)]">Pacientes com risco aberto</p>
                      </div>
                      <div className="rounded-xl border border-[var(--c-border)] p-4 text-center">
                        <p className="text-2xl font-bold text-[var(--c-accent)]">{recentes30d}</p>
                        <p className="text-[10px] uppercase tracking-wider text-[var(--c-muted)]">Respostas nos últimos 30 dias</p>
                      </div>
                    </div>
                    {severidadePorEscala.size === 0 ? (
                      <p className="py-4 text-center text-xs text-[var(--c-muted)]">Sem dados suficientes ainda.</p>
                    ) : (
                      <div className="space-y-4">
                        {Array.from(severidadePorEscala.entries()).map(([tipo, buckets]) => {
                          const total = Array.from(buckets.values()).reduce((a, b) => a + b, 0);
                          return (
                            <div key={tipo}>
                              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--c-text)]">{tipo} <span className="font-normal normal-case text-[var(--c-muted)]">({total} resposta{total !== 1 ? "s" : ""})</span></p>
                              <div className="space-y-1.5">
                                {Array.from(buckets.entries()).map(([bucket, n]) => (
                                  <div key={bucket}>
                                    <div className="mb-0.5 flex items-center justify-between text-[10px]">
                                      <span className="text-[var(--c-muted)]">{bucket}</span>
                                      <span className="font-medium text-[var(--c-text)]">{n}</span>
                                    </div>
                                    <BarraMini pct={(n / total) * 100} cor="var(--c-accent)" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </>
              );
            })()}

            {tab === "respostas" && !respostaAberta && !parecerAvulso && (() => {
              const riscos = detectarRiscos(respostas);
              // Feature 10: status persistente (aberto/em acompanhamento/resolvido) lido direto da
              // resposta flagrada — cada risco já referencia uma resposta específica (respostaId),
              // então não é preciso "achar a mais recente do grupo" separadamente.
              const riscosComStatus = riscos
                .filter((r) => !dismissedRiscos.has(r.respostaId))
                .map((r) => ({ ...r, status: respostas.find((x) => x.id === r.respostaId)?.risco_status || "aberto" }));
              const riscosResolvidosCount = riscosComStatus.filter((r) => r.status === "resolvido").length;
              const riscosAtivos = riscosComStatus
                .filter((r) => mostrarResolvidos || r.status !== "resolvido")
                .sort((a, b) => (a.nivel === "critico" ? 0 : 1) - (b.nivel === "critico" ? 0 : 1));
              const riscoIds = new Set(riscos.map((r) => r.respostaId));
              const emPerfil = respView === "pacientes" && pacienteChave;
              const tiposPresentes = Array.from(new Set(respostas.map((r) => r.tipo)));

              const filtradas = respostas.filter((r) => {
                if (filtroTipo !== "todos" && r.tipo !== filtroTipo) return false;
                if (soRisco && !riscoIds.has(r.id)) return false;
                if (filtroPeriodo !== "todos") {
                  const dias = filtroPeriodo === "7d" ? 7 : 30;
                  if (new Date(r.criado_em).getTime() < Date.now() - dias * 86400000) return false;
                }
                if (busca.trim() && !nomeSeguro(r).toLowerCase().includes(busca.trim().toLowerCase())) return false;
                return true;
              }).sort((a, b) => {
                let cmp = 0;
                if (sortKey === "paciente") cmp = nomeSeguro(a).localeCompare(nomeSeguro(b));
                else if (sortKey === "score") cmp = a.pontuacao - b.pontuacao;
                else cmp = new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime();
                return sortDir === "asc" ? cmp : -cmp;
              });

              function alternarSort(key: "paciente" | "score" | "data") {
                if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                else { setSortKey(key); setSortDir(key === "paciente" ? "asc" : "desc"); }
              }

              function toggleAllFiltradas() {
                const todasSelecionadas = filtradas.length > 0 && filtradas.every((r) => selecionados.has(r.id));
                const n = new Set(selecionados);
                for (const r of filtradas) { if (todasSelecionadas) n.delete(r.id); else n.add(r.id); }
                setSelecionados(n);
              }

              return (
              <>
                {(riscosAtivos.length > 0 || riscosResolvidosCount > 0) && !emPerfil && (
                  <motion.div variants={fadeUp} className="mb-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-danger)]">Triagem de risco ({riscosAtivos.length})</p>
                      {riscosResolvidosCount > 0 && (
                        <button onClick={() => setMostrarResolvidos((v) => !v)} className="text-[10px] font-medium text-[var(--c-muted)] hover:text-[var(--c-accent)] hover:underline">
                          {mostrarResolvidos ? "Ocultar resolvidos" : `Mostrar resolvidos (${riscosResolvidosCount})`}
                        </button>
                      )}
                    </div>
                    {riscoStatusErro && <p className="text-[10px] text-[var(--c-danger)]">{riscoStatusErro}</p>}
                    {riscosAtivos.map((r) => (
                      <div key={r.tipo + "-" + r.respostaId}
                        className="flex items-center gap-3 rounded-xl border p-3 text-xs transition-colors hover:brightness-95"
                        style={{ borderColor: r.nivel === "critico" ? "#dc2626" : "#f59e0b", background: r.nivel === "critico" ? "#dc26260A" : "#f59e0b0A", opacity: r.status === "resolvido" ? 0.6 : 1 }}>
                        <AlertTriangle size={14} className="flex-shrink-0" style={{ color: r.nivel === "critico" ? "#dc2626" : "#f59e0b" }} />
                        <span onClick={() => { const resp = respostas.find((x) => x.id === r.respostaId); if (resp) abrirDashboard(resp); }} className="flex-1 cursor-pointer text-[var(--c-text)]">{r.mensagem}</span>
                        <select value={r.status} onChange={(e) => atualizarRiscoStatus(r.respostaId, e.target.value)} onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/70 px-2 py-1 text-[10px] text-[var(--c-text)] focus:outline-none">
                          <option value="aberto">Aberto</option>
                          <option value="em acompanhamento">Em acompanhamento</option>
                          <option value="resolvido">Resolvido</option>
                        </select>
                        <button onClick={(e) => { e.stopPropagation(); setDismissedRiscos((prev) => new Set(prev).add(r.respostaId)); }}
                          className="flex-shrink-0 text-[var(--c-muted)] transition-colors hover:text-[var(--c-text)]" title="Dispensar (só nesta sessão)">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}

                <motion.div variants={fadeUp} className="mb-1 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>Respostas</h2>
                    <div className="flex gap-0.5 rounded-full bg-[var(--c-surface)]/60 p-0.5">
                      {(["lista", "pacientes"] as const).map((v) => (
                        <button key={v} onClick={() => { setRespView(v); setPacienteChave(null); }}
                          className={"rounded-full px-3 py-1 text-[11px] font-semibold transition-all " + (respView === v ? "text-white" : "text-[var(--c-muted)] hover:text-[var(--c-text)]")}
                          style={respView === v ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>{v === "lista" ? "Lista" : "Por paciente"}</button>
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
                      className="flex items-center gap-1.5 rounded-full border border-[var(--c-danger)]/40 px-4 py-2 text-xs font-semibold text-[var(--c-danger)] transition-all hover:bg-[var(--c-danger)]/10 disabled:opacity-40">
                      <Trash2 size={14} /> ({selecionados.size})
                    </button>}
                  </div>
                </motion.div>
                <p className="mb-5 text-[10px] text-[var(--c-muted)]">
                  {respView === "lista" ? "Todas as respostas individuais, uma por linha." : "Agrupado por paciente — histórico, evolução e risco em um só lugar."}
                </p>

                {respView === "lista" && (
                  <motion.div variants={fadeUp} className="mb-4 flex flex-wrap items-center gap-2">
                    <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por paciente ou código..."
                      className="min-w-[200px] flex-1 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                    <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
                      className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none">
                      <option value="todos">Todos os tipos</option>
                      {tiposPresentes.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                    <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value as typeof filtroPeriodo)}
                      className="rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:outline-none">
                      <option value="todos">Todo o período</option>
                      <option value="7d">Últimos 7 dias</option>
                      <option value="30d">Últimos 30 dias</option>
                    </select>
                    <button onClick={() => setSoRisco((v) => !v)}
                      className={"rounded-full border px-3 py-2 text-xs font-semibold transition-colors " + (soRisco ? "border-[var(--c-danger)] bg-[var(--c-danger)]/10 text-[var(--c-danger)]" : "border-[var(--c-border)] text-[var(--c-muted)]")}>
                      Só risco
                    </button>
                  </motion.div>
                )}

                {loading ? (
                  <p className="py-12 text-center text-[var(--c-muted)]">Carregando...</p>
                ) : respView === "pacientes" ? (
                  pacienteChave ? (
                    <PerfilPaciente
                      respostas={respostas.filter((r) => chavePaciente(r) === pacienteChave)}
                      onVoltar={() => setPacienteChave(null)}
                      onAbrirResposta={(r) => abrirDashboard(r)}
                      onExcluir={() => excluirPaciente(pacienteChave!)}
                      sintese={sintese}
                      consideracoes={consideracoes} />
                  ) : (
                    <PacientesLista respostas={respostas} onAbrir={(k) => setPacienteChave(k)} />
                  )
                ) : filtradas.length === 0 ? (
                  <p className="py-12 text-center text-[var(--c-muted)]">{respostas.length === 0 ? "Nenhuma resposta." : "Nenhuma resposta corresponde aos filtros."}</p>
                ) : (
                  <motion.div variants={fadeUp} className="glass-card overflow-x-auto rounded-2xl">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--c-border)] text-left">
                          <th className="px-4 py-3"><input type="checkbox" checked={filtradas.length > 0 && filtradas.every((r) => selecionados.has(r.id))} onChange={toggleAllFiltradas} /></th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Tipo</th>
                          <th className="cursor-pointer select-none px-4 py-3 font-medium text-[var(--c-muted)]" onClick={() => alternarSort("paciente")}>Paciente {sortKey === "paciente" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                          <th className="px-4 py-3 font-medium text-[var(--c-muted)]">Nasc.</th>
                          <th className="cursor-pointer select-none px-4 py-3 font-medium text-[var(--c-muted)]" onClick={() => alternarSort("score")}>Score / Nível {sortKey === "score" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                          <th className="cursor-pointer select-none px-4 py-3 font-medium text-[var(--c-muted)]" onClick={() => alternarSort("data")}>Data {sortKey === "data" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtradas.map((r) => {
                          const cor = r.tipo === "phq9" ? "#B05D3A" : r.tipo === "gad7" ? "#4A6B47" : "var(--c-accent)";
                          const interp = interpretarResposta(r.tipo, r.respostas, r.pontuacao);
                          return (
                            <tr key={r.id} className="border-b border-[var(--c-border)]/60 transition-colors hover:bg-[var(--c-surface)]/40 cursor-pointer" onClick={() => abrirDashboard(r)}>
                              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selecionados.has(r.id)} onChange={() => toggle(r.id)} /></td>
                              <td className="px-4 py-3">
                                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: cor + "1A", color: cor }}>{r.tipo.toUpperCase()}</span>
                              </td>
                              <td className="px-4 py-3 font-medium text-[var(--c-text)]">{nomeSeguro(r)}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{r.nascimento ?? "-"}</td>
                              <td className="px-4 py-3 text-xs text-[var(--c-muted)]">{interp.resumo}</td>
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
                    <h2 className="text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{respostaAberta ? nomeSeguro(respostaAberta) : "Novo Parecer"}</h2>
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
                              <span className="font-medium text-[var(--c-text)]">{interpretarResposta(h.tipo, h.respostas, h.pontuacao).resumo}</span>
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
                          <button onClick={() => removerTeste(idx)} className="text-[var(--c-danger)]/70 transition-colors hover:text-[var(--c-danger)]"><X size={14} /></button>
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
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--c-accent)]">Síntese e Considerações</p>
                      <div className="flex items-center gap-1.5">
                        <select value={parecerIaProvider} onChange={(e) => { setParecerIaProvider(e.target.value); localStorage.setItem("conceituacao_provider", e.target.value); }}
                          className="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-2 py-1 text-[10px] text-[var(--c-text)] focus:outline-none">
                          <option value="nvidia">NVIDIA</option>
                          <option value="openai">OpenAI</option>
                          <option value="groq">Groq</option>
                          <option value="openrouter">OpenRouter</option>
                          <option value="deepseek">DeepSeek</option>
                          <option value="anthropic">Anthropic (Claude)</option>
                        </select>
                      </div>
                    </div>
                    <p className="mb-2 text-[10px] text-[var(--c-muted)]">A IA recebe este texto — não inclua nome/CPF.</p>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-muted)]">Síntese</span>
                      <button onClick={() => melhorarComIA("sintese")} disabled={parecerIaLoading === "sintese" || !sintese.trim()}
                        className="flex items-center gap-1 text-[10px] font-medium text-[var(--c-accent)] hover:underline disabled:opacity-40 disabled:no-underline">
                        {parecerIaLoading === "sintese" ? "Melhorando..." : "Melhorar com IA"}
                      </button>
                    </div>
                    <textarea value={sintese} onChange={(e) => setSintese(e.target.value)} rows={4}
                      placeholder="Síntese dos resultados (campo livre — será incluído no parecer)"
                      className="mb-1 w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none" />
                    {parecerIaAplicado.has("sintese") && <p className="mb-3 text-[10px] text-[var(--c-accent)]">Texto revisado por IA — revise antes de usar.</p>}
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-muted)]">Considerações</span>
                      <button onClick={() => melhorarComIA("consideracoes")} disabled={parecerIaLoading === "consideracoes" || !consideracoes.trim()}
                        className="flex items-center gap-1 text-[10px] font-medium text-[var(--c-accent)] hover:underline disabled:opacity-40 disabled:no-underline">
                        {parecerIaLoading === "consideracoes" ? "Melhorando..." : "Melhorar com IA"}
                      </button>
                    </div>
                    <textarea value={consideracoes} onChange={(e) => setConsideracoes(e.target.value)} rows={3}
                      placeholder="Considerações finais"
                      className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none" />
                    {parecerIaAplicado.has("consideracoes") && <p className="mt-1 text-[10px] text-[var(--c-accent)]">Texto revisado por IA — revise antes de usar.</p>}
                    {parecerIaErro && <p className="mt-2 text-xs text-[var(--c-danger)]">{parecerIaErro}</p>}
                  </motion.div>
                )}
              </>
            )}

            {tab === "pacientes" && (
              <PainelPacientes />
            )}

            {tab === "ferramentas" && (
              <>
                {ferramentaAberta?.id === "conceituacao-cognitiva" ? (
                  <div>
                    <button onClick={() => { setFerramentaAberta(null); setFerramentaDados({}); }} className="mb-4 rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
                    <ConceituacaoCognitiva respostas={respostas} />
                  </div>
                ) : ferramentaAberta ? (
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

                    {blogMsg && <p className={`text-xs ${blogMsg.startsWith("Erro") ? "text-[var(--c-danger)]" : "text-[var(--c-success)]"}`}>{blogMsg}</p>}

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
                                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${p.publicado ? "bg-[var(--c-success-bg)] text-[var(--c-success)]" : "bg-[var(--c-warning-bg)] text-[var(--c-warning)]"}`}>
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
                              <button onClick={() => deletarPost(p.id!)} className="rounded-full border border-[var(--c-danger)]/25 p-2 text-[var(--c-danger)]/70 transition-colors hover:text-[var(--c-danger)]" title="Deletar">
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
                                  <span className="rounded-full bg-[var(--c-neutral-bg)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--c-neutral-text)]">JSON</span>
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