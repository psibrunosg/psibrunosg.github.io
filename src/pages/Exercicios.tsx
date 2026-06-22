import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Search, X, Download, Check, RotateCcw, Sparkles, Clock, Star } from "lucide-react";
import jsPDF from "jspdf";
import { anexos } from "@/content/anexos";
import { exercicios } from "@/content/exercicios";
import { AppAurora } from "@/components/ui/AppAurora";
import { temas, corExercicio } from "@/content/temas-exercicios";
import { CampoExercicio, tipoCampo, valorLegivel } from "@/components/exercicios/ExerciseWidgets";
import { Mascote, CenaTema } from "@/components/exercicios/MascoteCena";

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

function getCompleted(): Set<string> {
  try {
    const raw = localStorage.getItem("exercicios-completados");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function setCompleted(ids: Set<string>) {
  localStorage.setItem("exercicios-completados", JSON.stringify([...ids]));
}

function getResponses(id: string): Record<number, string> {
  try {
    const raw = localStorage.getItem(`exercicio-${id}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveResponses(id: string, data: Record<number, string>) {
  localStorage.setItem(`exercicio-${id}`, JSON.stringify(data));
}

function ExerciseTimer({ tempoEstimado }: { tempoEstimado?: string }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setRunning(!running)}
        className="flex items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[10px] font-medium text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)] hover:border-[var(--c-accent)]"
      >
        <Clock size={12} />
        <span className="font-mono">{mm}:{ss}</span>
      </button>
      {seconds > 0 && (
        <button onClick={() => { setSeconds(0); setRunning(false); }}
          className="text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
          <RotateCcw size={12} />
        </button>
      )}
      {tempoEstimado && <span className="text-[9px] text-[var(--c-muted)]">~{tempoEstimado}</span>}
    </div>
  );
}

function exportFilledPDF(a: UnifiedExercise, responses: Record<number, string>) {
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
  if (a.publico) { txt(`Publico: ${a.publico}`, 9, false, [120, 120, 120]); y += 1; }
  txt(a.fonte === "te" ? "Terapia do Esquema" : a.fonte === "curado" ? "Exercicio Curado" : "TCC", 9, false, [120, 120, 120]); y += 5;
  doc.setDrawColor(200); doc.line(ML, y, ML + W, y); y += 6;

  a.instrucoes.forEach((inst, i) => {
    txt(`${i + 1}. ${inst}`, 10, true); y += 2;
    const resp = valorLegivel(tipoCampo(inst), responses[i] ?? "").trim();
    if (resp) {
      doc.setFillColor(245, 245, 240);
      const lines = doc.splitTextToSize(resp, W - 8);
      const blockH = lines.length * 4.5 + 4;
      if (y + blockH > 275) { doc.addPage(); y = 20; }
      doc.roundedRect(ML, y - 1, W, blockH, 2, 2, "F");
      doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
      lines.forEach((line: string) => { doc.text(line, ML + 4, y + 3); y += 4.5; });
      y += 4;
    } else {
      txt("(nao preenchido)", 9, false, [180, 180, 180]); y += 3;
    }
  });

  if (a.exemplo) { y += 3; txt("EXEMPLO", 11, true); y += 2; txt(a.exemplo); y += 4; }
  y += 2; doc.setDrawColor(200); doc.line(ML, y, ML + W, y); y += 6;
  txt(a.referencia, 8, false, [120, 120, 120]); y += 6;
  txt("Bruno SG — Psicologo CRP 07/44472", 9, true, [120, 120, 120]);
  txt(`Preenchido em ${new Date().toLocaleDateString("pt-BR")}`, 8, false, [160, 160, 160]);
  doc.save(`${a.id}_preenchido.pdf`);
}

function ExerciseDetail({ exercise, onClose }: { exercise: UnifiedExercise; onClose: () => void }) {
  const [responses, setResponses] = useState<Record<number, string>>(() => getResponses(exercise.id));
  const [completed, setCompletedState] = useState(() => getCompleted().has(exercise.id));
  const isInfantil = exercise.publico === "infantojuvenil";
  const { cor, corBg, tema } = corExercicio(exercise.numero, exercise.esquema);

  const tipos = exercise.instrucoes.map(tipoCampo);
  const isStepFilled = (i: number) => valorLegivel(tipos[i], responses[i] ?? "").trim().length > 0;
  // passos "info" sao opcionais — progresso conta so passos acionaveis
  const passosAtivos = exercise.instrucoes.map((_, i) => i).filter((i) => tipos[i] !== "info");
  const filledCount = passosAtivos.filter(isStepFilled).length;
  const totalSteps = passosAtivos.length || exercise.instrucoes.length;
  const progressPct = totalSteps > 0 ? Math.round((filledCount / totalSteps) * 100) : 0;

  const updateResponse = useCallback((idx: number, val: string) => {
    setResponses((prev) => {
      const next = { ...prev, [idx]: val };
      saveResponses(exercise.id, next);
      return next;
    });
  }, [exercise.id]);

  function markComplete() {
    const ids = getCompleted();
    ids.add(exercise.id);
    setCompleted(ids);
    setCompletedState(true);
  }

  function resetExercise() {
    setResponses({});
    saveResponses(exercise.id, {});
    const ids = getCompleted();
    ids.delete(exercise.id);
    setCompleted(ids);
    setCompletedState(false);
  }

  const falaMascote = progressPct >= 100 ? "Voce conseguiu! 🌟"
    : filledCount === 0 ? "Oi! Vamos juntos?"
    : `Muito bem! ${filledCount} de ${totalSteps} ✨`;

  return (
    <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {isInfantil && <Mascote progresso={progressPct / 100} cor={cor} fala={falaMascote} />}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="rounded-full border border-[var(--c-border)] p-2 text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><X size={15} /></button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{exercise.numero}</p>
            <h2 className="text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{exercise.titulo}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ExerciseTimer tempoEstimado={exercise.tempoEstimado} />
          <button onClick={() => exportFilledPDF(exercise, responses)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-medium text-[var(--c-muted)]">{isInfantil ? "Sua jornada" : "Progresso"}</span>
          <span className="text-[10px] font-bold" style={{ color: cor }}>{filledCount}/{totalSteps} passos · {progressPct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[var(--c-border)]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: progressPct === 100 ? "linear-gradient(90deg, #4A6B47, #6B8C3A)" : `linear-gradient(90deg, ${cor}, ${cor}AA)` }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl" style={{ borderTop: `3px solid ${cor}` }}>
        <CenaTema cor={cor} variante={exercise.titulo.length % 2} />
        <div className="p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ background: corBg, color: cor }}>
            {tema.label}
          </span>
          {exercise.esquema && <span className="rounded-full px-3 py-1 text-[10px] font-medium" style={{ background: corBg, color: cor }}>{exercise.esquema}</span>}
          <span className="rounded-full bg-[var(--c-surface)] px-3 py-1 text-[10px] font-medium text-[var(--c-muted)]">
            {exercise.fonte === "te" ? "Terapia do Esquema" : isInfantil ? "Infantojuvenil" : exercise.fonte === "curado" ? "Curado" : "TCC"}
          </span>
          {completed && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700">
              <Check size={10} /> Concluido
            </span>
          )}
        </div>

        <p className="mb-4 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">
          {isInfantil ? "Vamos comecar a aventura!" : "Instrucoes — preencha cada passo"}
        </p>

        <div className="space-y-5">
          {exercise.instrucoes.map((inst, i) => {
            const tipo = tipos[i];
            const filled = isStepFilled(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border p-4 transition-colors"
                style={{ borderColor: filled ? cor + "66" : "var(--c-border)", background: filled ? cor + "0A" : undefined }}
              >
                <div className="mb-1 flex items-start gap-3">
                  <motion.span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                    style={{
                      background: filled ? cor : `color-mix(in oklab, ${cor} 15%, transparent)`,
                      color: filled ? "#fff" : cor,
                    }}
                    animate={filled ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {filled ? <Check size={13} /> : i + 1}
                  </motion.span>
                  <p className={`leading-relaxed text-[var(--c-text)] ${isInfantil ? "text-base" : "text-sm"}`}>
                    {inst}
                  </p>
                </div>
                <CampoExercicio tipo={tipo} value={responses[i] ?? ""} onChange={(v) => updateResponse(i, v)} cor={cor} isInfantil={isInfantil} />
              </motion.div>
            );
          })}
        </div>

        {exercise.exemplo && (
          <>
            <p className="mt-6 mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--c-accent)]">
              {isInfantil ? "Olha um exemplo!" : "Exemplo"}
            </p>
            <div className="rounded-xl bg-[var(--c-surface)] p-4 text-sm italic leading-relaxed text-[var(--c-muted)]">{exercise.exemplo}</div>
          </>
        )}

        <div className="mt-6 rounded-xl border border-[var(--c-border)] p-4">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--c-muted)]">Referencia</p>
          <p className="mt-1 text-xs text-[var(--c-muted)]">{exercise.referencia}</p>
        </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex items-center justify-between">
        <button onClick={resetExercise}
          className="flex items-center gap-1.5 rounded-full border border-[var(--c-border)] px-4 py-2 text-xs font-medium text-[var(--c-muted)] transition-colors hover:text-red-500 hover:border-red-300">
          <RotateCcw size={13} /> Recomecar
        </button>
        {!completed && filledCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={markComplete}
            className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(120deg, #4A6B47, #6B8C3A)", boxShadow: "0 8px 24px -8px #4A6B47" }}
          >
            <Sparkles size={16} /> {isInfantil ? "Missao Completa!" : "Marcar como concluido"}
          </motion.button>
        )}
        {completed && (
          <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
            <Star size={16} className="fill-green-600" /> Exercicio concluido!
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function Exercicios() {
  const [filtro, setFiltro] = useState<"todos" | "te" | "tcc" | "curado" | "infantojuvenil">("todos");
  const [esquemaFiltro, setEsquemaFiltro] = useState<string>("todos");
  const [objetivoFiltro, setObjetivoFiltro] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<UnifiedExercise | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => getCompleted());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Exercicios Terapeuticos | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const isInfantilFilter = filtro === "infantojuvenil";

  const filtered = useMemo(() => {
    let list = allExercises;
    if (filtro === "te") list = list.filter((a) => a.fonte === "te");
    else if (filtro === "tcc") list = list.filter((a) => a.fonte === "tcc" || (a.fonte === "curado" && a.publico === "adulto"));
    else if (filtro === "curado") list = list.filter((a) => a.fonte === "curado");
    else if (filtro === "infantojuvenil") list = list.filter((a) => a.publico === "infantojuvenil");
    if (esquemaFiltro !== "todos") list = list.filter((a) => a.esquema === esquemaFiltro);
    if (objetivoFiltro !== "todos") list = list.filter((a) => corExercicio(a.numero, a.esquema).tema.id === objetivoFiltro);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      list = list.filter((a) => a.titulo.toLowerCase().includes(q) || a.esquema?.toLowerCase().includes(q) || a.publico?.toLowerCase().includes(q) || a.instrucoes.some((i) => i.toLowerCase().includes(q)));
    }
    return list;
  }, [filtro, esquemaFiltro, objetivoFiltro, busca]);

  const teCount = allExercises.filter((a) => a.fonte === "te").length;
  const tccCount = allExercises.filter((a) => a.fonte === "tcc").length;
  const curadoCount = allExercises.filter((a) => a.fonte === "curado").length;
  const infantoCount = allExercises.filter((a) => a.publico === "infantojuvenil").length;
  const completedCount = completedIds.size;

  return (
    <div className="relative min-h-screen" data-theme="c">
      <AppAurora />

      <header className="fixed left-0 right-0 top-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
            <ChevronLeft size={16} /> Voltar
          </Link>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--c-accent)]">
            {isInfantilFilter ? "Aventuras Terapeuticas" : "Exercicios Terapeuticos"}
          </span>
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
                <Star size={10} className="fill-green-700" /> {completedCount}
              </span>
            )}
            <span className="text-xs text-[var(--c-muted)]">{filtered.length} de {allExercises.length}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-16 pt-24">
        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {aberto ? (
              <ExerciseDetail
                key={aberto.id}
                exercise={aberto}
                onClose={() => { setAberto(null); setCompletedIds(getCompleted()); }}
              />
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Stats banner */}
                {completedCount > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-5 flex items-center gap-3 rounded-2xl p-4"
                    style={{ background: "linear-gradient(120deg, #4A6B4720, #6B8C3A10)", border: "1px solid #4A6B4730" }}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                      <Star size={20} className="fill-green-600 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--c-text)]">{completedCount} exercicio{completedCount > 1 ? "s" : ""} concluido{completedCount > 1 ? "s" : ""}!</p>
                      <p className="text-xs text-[var(--c-muted)]">Continue praticando para fortalecer seu bem-estar.</p>
                    </div>
                  </motion.div>
                )}

                {/* Filtros */}
                <div className="mb-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {([["todos", `Todos (${allExercises.length})`], ["curado", `Curados (${curadoCount})`], ["te", `Terapia do Esquema (${teCount})`], ["tcc", `TCC (${tccCount})`], ["infantojuvenil", `Infantojuvenil (${infantoCount})`]] as const).map(([id, label]) => (
                      <button key={id} onClick={() => { setFiltro(id); setEsquemaFiltro("todos"); setObjetivoFiltro("todos"); }}
                        className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (filtro === id ? "text-white shadow" : "text-[var(--c-muted)] border border-[var(--c-border)] hover:text-[var(--c-text)]")}
                        style={filtro === id ? { background: id === "infantojuvenil" ? "linear-gradient(120deg, #7A4A8C, #A06BC0)" : "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" } : undefined}>
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

                  {/* Filtro por objetivo (cor) */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-[var(--c-muted)]">Objetivo:</span>
                    <button onClick={() => setObjetivoFiltro("todos")}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${objetivoFiltro === "todos" ? "bg-[var(--c-accent)] text-white" : "border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)]"}`}>
                      Todos
                    </button>
                    {Object.values(temas).map((t) => (
                      <button key={t.id} onClick={() => setObjetivoFiltro(t.id)}
                        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all"
                        style={objetivoFiltro === t.id
                          ? { background: t.cor, color: "#fff" }
                          : { background: t.corBg, color: t.cor }}>
                        <span className="h-2 w-2 rounded-full" style={{ background: objetivoFiltro === t.id ? "#fff" : t.cor }} />
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--c-muted)]" />
                    <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={isInfantilFilter ? "Buscar aventura..." : "Buscar exercicio..."}
                      className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 py-2.5 pl-9 pr-4 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none" />
                    {busca && <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--c-muted)]"><X size={14} /></button>}
                  </div>
                </div>

                {/* Trilha (infantil) */}
                {isInfantilFilter ? (
                  <div className="relative mx-auto max-w-lg py-2">
                    <div className="absolute bottom-6 left-1/2 top-6 w-1 -translate-x-1/2 rounded-full bg-[var(--c-border)]" aria-hidden="true" />
                    <div className="space-y-3">
                      {filtered.map((a, i) => {
                        const done = completedIds.has(a.id);
                        const current = !done && filtered.findIndex((x) => !completedIds.has(x.id)) === i;
                        const { cor } = corExercicio(a.numero, a.esquema);
                        const lado = i % 2 === 0;
                        return (
                          <motion.button
                            key={a.id}
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: Math.min(i * 0.04, 0.4) }}
                            onClick={() => setAberto(a)}
                            className={`relative flex w-full items-center gap-3 ${lado ? "flex-row" : "flex-row-reverse"}`}
                          >
                            <div className={`flex-1 ${lado ? "text-right" : "text-left"}`}>
                              <div className="inline-block max-w-[90%] rounded-2xl px-4 py-2.5 text-left shadow-sm transition-shadow hover:shadow-md"
                                style={{ background: done ? cor + "1A" : "var(--c-surface)", border: `1.5px solid ${current ? cor : "var(--c-border)"}` }}>
                                <p className="text-xs font-semibold text-[var(--c-text)]">{a.titulo}</p>
                                {a.tempoEstimado && <p className="text-[9px] text-[var(--c-muted)]">⏱ {a.tempoEstimado}</p>}
                              </div>
                            </div>
                            <motion.span
                              className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                              style={{ background: done ? cor : current ? cor : "var(--c-border)" }}
                              animate={current ? { scale: [1, 1.12, 1] } : {}}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            >
                              {done ? <Star size={18} className="fill-white" /> : i + 1}
                              {current && <span className="absolute inset-0 rounded-full ring-2 ring-offset-2" style={{ color: cor }} />}
                            </motion.span>
                            <div className="flex-1" aria-hidden="true" />
                          </motion.button>
                        );
                      })}
                    </div>
                    {filtered.length > 0 && (
                      <p className="mt-4 text-center text-xs text-[var(--c-muted)]">
                        {completedIds.size > 0 ? `Voce ja completou ${filtered.filter((x) => completedIds.has(x.id)).length} de ${filtered.length}! 🌟` : "Toque na primeira parada para comecar!"}
                      </p>
                    )}
                  </div>
                ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((a, i) => {
                    const done = completedIds.has(a.id);
                    const hasDraft = (() => { try { const r = localStorage.getItem(`exercicio-${a.id}`); return r && Object.values(JSON.parse(r)).some((v: unknown) => typeof v === "string" && (v as string).trim()); } catch { return false; } })();
                    const { cor, corBg, tema } = corExercicio(a.numero, a.esquema);
                    return (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                        whileHover={{ y: -4 }}
                        className="glass-card relative cursor-pointer overflow-hidden rounded-2xl p-4 pl-5 transition-shadow hover:shadow-[0_14px_36px_-16px_rgba(58,42,31,0.35)]"
                        onClick={() => setAberto(a)}
                        style={{ borderLeft: `4px solid ${cor}`, background: done ? "color-mix(in oklab, #4A6B47 5%, transparent)" : undefined }}
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: cor }}>{tema.label}</p>
                            <h3 className="text-sm font-semibold leading-snug text-[var(--c-text)]">{a.titulo}</h3>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-1">
                            {done && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100"><Check size={12} className="text-green-600" /></span>}
                            {hasDraft && !done && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100"><Clock size={10} className="text-amber-600" /></span>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {a.esquema && <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ background: corBg, color: cor }}>{a.esquema}</span>}
                          <span className="rounded-full bg-[var(--c-surface)] px-2 py-0.5 text-[8px] font-medium text-[var(--c-muted)]">
                            {a.fonte === "te" ? "TE" : a.publico === "infantojuvenil" ? "Infantil" : a.fonte === "curado" ? "Curado" : "TCC"}
                          </span>
                          {a.tempoEstimado && <span className="rounded-full bg-[var(--c-surface)] px-2 py-0.5 text-[8px] font-medium text-[var(--c-muted)]">{a.tempoEstimado}</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                )}

                {filtered.length === 0 && (
                  <p className="py-16 text-center text-sm text-[var(--c-muted)]">Nenhum exercicio encontrado.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
