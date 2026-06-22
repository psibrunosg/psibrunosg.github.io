import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X, Download } from "lucide-react";
import jsPDF from "jspdf";
import { anexos } from "@/content/anexos";
import { exercicios } from "@/content/exercicios";
import { AppAurora } from "@/components/ui/AppAurora";

interface UnifiedExercise {
  id: string;
  numero: string;
  titulo: string;
  fonte: "te" | "tcc" | "curado";
  esquema?: string;
  publico?: string;
  instrucoes: string[];
  exemplo?: string;
  referencia: string;
  tempoEstimado?: string;
}

const allExercises: UnifiedExercise[] = [
  ...exercicios.map((e) => ({
    id: e.id, numero: e.categoria, titulo: e.titulo,
    fonte: "curado" as const, publico: e.publico,
    instrucoes: e.instrucoes, exemplo: e.exemplo,
    referencia: e.referencia, tempoEstimado: e.tempoEstimado,
  })),
  ...anexos.map((a) => ({
    id: a.id, numero: a.numero, titulo: a.titulo,
    fonte: a.fonte, esquema: a.esquema,
    instrucoes: a.instrucoes, referencia: a.referencia,
  })),
];

const esquemasTe = [...new Set(anexos.filter((a) => a.fonte === "te").map((a) => a.esquema!))];

function exportPDF(a: UnifiedExercise) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 180; const ML = 15; let y = 20;
  function txt(text: string, size = 10, bold = false, color: [number, number, number] = [40, 40, 40]) {
    doc.setFontSize(size); doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setTextColor(...color);
    for (const line of doc.splitTextToSize(text, W)) {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, ML, y); y += size * 0.45;
    }
  }
  txt(`${a.numero} — ${a.titulo}`, 14, true, [30, 30, 30]); y += 3;
  if (a.esquema) { txt(`Esquema: ${a.esquema}`, 9, false, [120, 120, 120]); y += 1; }
  if (a.publico) { txt(`Público: ${a.publico}`, 9, false, [120, 120, 120]); y += 1; }
  if (a.tempoEstimado) { txt(`Tempo estimado: ${a.tempoEstimado}`, 9, false, [120, 120, 120]); y += 1; }
  txt(a.fonte === "te" ? "Terapia do Esquema" : a.fonte === "curado" ? "Exercício Curado" : "Terapia Cognitivo-Comportamental", 9, false, [120, 120, 120]); y += 5;
  doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
  txt("INSTRUÇÕES", 11, true); y += 2;
  a.instrucoes.forEach((inst, i) => { txt(`${i + 1}. ${inst}`); y += 2; }); y += 4;
  if (a.exemplo) { txt("EXEMPLO", 11, true); y += 2; txt(a.exemplo); y += 4; }
  doc.setDrawColor(200, 200, 200); doc.line(ML, y, ML + W, y); y += 6;
  txt(a.referencia, 8, false, [120, 120, 120]); y += 6;
  txt("Bruno SG — Psicólogo CRP 07/44472", 9, true, [120, 120, 120]);
  doc.save(`${a.id}.pdf`);
}

export default function Exercicios() {
  const [filtro, setFiltro] = useState<"todos" | "te" | "tcc" | "curado" | "infantojuvenil">("todos");
  const [esquemaFiltro, setEsquemaFiltro] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<UnifiedExercise | null>(null);

  const filtered = useMemo(() => {
    let list = allExercises;
    if (filtro === "te") list = list.filter((a) => a.fonte === "te");
    else if (filtro === "tcc") list = list.filter((a) => a.fonte === "tcc" || (a.fonte === "curado" && a.publico === "adulto"));
    else if (filtro === "curado") list = list.filter((a) => a.fonte === "curado");
    else if (filtro === "infantojuvenil") list = list.filter((a) => a.publico === "infantojuvenil");
    if (esquemaFiltro !== "todos") list = list.filter((a) => a.esquema === esquemaFiltro);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      list = list.filter((a) => a.titulo.toLowerCase().includes(q) || a.esquema?.toLowerCase().includes(q) || a.publico?.toLowerCase().includes(q) || a.instrucoes.some((i) => i.toLowerCase().includes(q)));
    }
    return list;
  }, [filtro, esquemaFiltro, busca]);

  const teCount = allExercises.filter((a) => a.fonte === "te").length;
  const tccCount = allExercises.filter((a) => a.fonte === "tcc").length;
  const curadoCount = allExercises.filter((a) => a.fonte === "curado").length;
  const infantoCount = allExercises.filter((a) => a.publico === "infantojuvenil").length;

  return (
    <div className="relative min-h-screen" data-theme="c">
      <AppAurora />

      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
            <ChevronLeft size={16} /> Voltar
          </Link>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--c-accent)]">Exercícios Terapêuticos</span>
          <span className="text-xs text-[var(--c-muted)]">{filtered.length} de {allExercises.length}</span>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl">

          <AnimatePresence mode="wait">
            {aberto ? (
              <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAberto(null)} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{aberto.numero}</p>
                      <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{aberto.titulo}</h2>
                    </div>
                  </div>
                  <button onClick={() => exportPDF(aberto)}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
                    <Download size={14} /> PDF
                  </button>
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${aberto.fonte === "te" ? "bg-emerald-100 text-emerald-700" : aberto.publico === "infantojuvenil" ? "bg-purple-100 text-purple-600" : aberto.fonte === "curado" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                      {aberto.fonte === "te" ? "Terapia do Esquema" : aberto.publico === "infantojuvenil" ? "Infantojuvenil" : aberto.fonte === "curado" ? "Exercício Curado" : "TCC"}
                    </span>
                    {aberto.esquema && <span className="rounded-full bg-[var(--c-surface)] px-3 py-1 text-[10px] font-medium text-[var(--c-muted)]">{aberto.esquema}</span>}
                    {aberto.tempoEstimado && <span className="rounded-full bg-[var(--c-surface)] px-3 py-1 text-[10px] font-medium text-[var(--c-muted)]">⏱ {aberto.tempoEstimado}</span>}
                  </div>

                  <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Instruções</p>
                  <ol className="space-y-3">
                    {aberto.instrucoes.map((inst, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-[var(--c-text)]">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[var(--c-accent)]/10 text-[10px] font-bold text-[var(--c-accent)]">{i + 1}</span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ol>

                  {aberto.exemplo && (
                    <>
                      <p className="mt-6 mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">Exemplo</p>
                      <div className="rounded-xl bg-[var(--c-surface)] p-4 text-sm italic leading-relaxed text-[var(--c-muted)]">{aberto.exemplo}</div>
                    </>
                  )}

                  <div className="mt-6 rounded-xl border border-[var(--c-border)] p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-muted)]">Referência</p>
                    <p className="mt-1 text-xs text-[var(--c-muted)]">{aberto.referencia}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Filtros */}
                <div className="mb-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {([["todos", `Todos (${allExercises.length})`], ["curado", `Curados (${curadoCount})`], ["te", `Terapia do Esquema (${teCount})`], ["tcc", `TCC (${tccCount})`], ["infantojuvenil", `Infantojuvenil (${infantoCount})`]] as const).map(([id, label]) => (
                      <button key={id} onClick={() => { setFiltro(id); setEsquemaFiltro("todos"); }}
                        className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (filtro === id ? "text-white shadow" : "text-[var(--c-muted)] border border-[var(--c-border)] hover:text-[var(--c-text)]")}
                        style={filtro === id ? { background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {filtro === "te" && (
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => setEsquemaFiltro("todos")} className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${esquemaFiltro === "todos" ? "bg-emerald-100 text-emerald-700" : "text-[var(--c-muted)] hover:text-[var(--c-text)]"}`}>Todos</button>
                      {esquemasTe.map((e) => (
                        <button key={e} onClick={() => setEsquemaFiltro(e)} className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${esquemaFiltro === e ? "bg-emerald-100 text-emerald-700" : "text-[var(--c-muted)] hover:text-[var(--c-text)]"}`}>{e}</button>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-muted)]" />
                    <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar exercício..."
                      className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 py-2.5 pl-9 pr-4 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                    {busca && <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-muted)]"><X size={14} /></button>}
                  </div>
                </div>

                {/* Grid */}
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((a, i) => (
                    <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      className="glass-card cursor-pointer rounded-2xl p-4 transition-colors hover:border-[var(--c-accent)]/30" onClick={() => setAberto(a)}>
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{a.numero}</p>
                          <h3 className="text-sm font-semibold leading-snug text-[var(--c-text)]">{a.titulo}</h3>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); exportPDF(a); }} className="flex-shrink-0 rounded-full border border-[var(--c-border)] p-1.5 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
                          <Download size={11} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${a.fonte === "te" ? "bg-emerald-100 text-emerald-700" : a.publico === "infantojuvenil" ? "bg-purple-100 text-purple-600" : a.fonte === "curado" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                          {a.fonte === "te" ? "TE" : a.publico === "infantojuvenil" ? "Infantojuvenil" : a.fonte === "curado" ? "Curado" : "TCC"}
                        </span>
                        {a.esquema && <span className="rounded-full bg-[var(--c-surface)] px-2 py-0.5 text-[8px] font-medium text-[var(--c-muted)]">{a.esquema}</span>}
                        {a.tempoEstimado && <span className="rounded-full bg-[var(--c-surface)] px-2 py-0.5 text-[8px] font-medium text-[var(--c-muted)]">{a.tempoEstimado}</span>}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <p className="py-16 text-center text-sm text-[var(--c-muted)]">Nenhum exercício encontrado.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
