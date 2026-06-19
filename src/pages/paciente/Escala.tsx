import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { salvarResposta } from "@/lib/supabase";
import { escalas } from "@/content/escalas";
import type { EscalaConfig } from "@/content/escalas";

interface SchemaResult {
  id: string;
  nome: string;
  media: number;
  dominio: string;
}

function computeSchemaAvg(
  config: EscalaConfig,
  respostas: number[]
): { schemas: SchemaResult[]; pontuacao: number } {
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

function computeThreshold(respostas: number[]): {
  flagged: { index: number; valor: number }[];
  pontuacao: number;
} {
  const flagged: { index: number; valor: number }[] = [];
  for (let i = 0; i < respostas.length; i++) {
    if (respostas[i] >= 5) {
      flagged.push({ index: i, valor: respostas[i] });
    }
  }
  return { flagged, pontuacao: flagged.length };
}

export default function Escala() {
  const { escalaId } = useParams<{ escalaId: string }>();
  const location = useLocation();
  const paciente = (location.state as { nome?: string; nascimento?: string; telefone?: string }) ?? {};

  const config = escalaId ? escalas[escalaId] : undefined;

  const [etapa, setEtapa] = useState<"intro" | "form" | "resultado">("intro");
  const [respostas, setRespostas] = useState<(number | null)[]>([]);
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (config) {
      setRespostas(Array(config.itens.length).fill(null));
    }
  }, [config]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    if (config) document.title = `${config.sigla} | Bruno SG Psicologo`;
    return () => document.documentElement.removeAttribute("data-theme");
  }, [config]);

  if (!config) return <Navigate to="/paciente" replace />;
  if (!paciente.nome) return <Navigate to="/paciente" replace />;

  const total = config.itens.length;
  const respondidas = respostas as number[];

  function handleResposta(valor: number) {
    const novo = [...respostas];
    novo[atual] = valor;
    setRespostas(novo);
    setTimeout(() => {
      if (atual < total - 1) {
        setAtual(atual + 1);
      } else {
        finalizar(novo as number[]);
      }
    }, 200);
  }

  function finalizar(r: number[]) {
    let pontuacao = 0;
    if (config!.scoring === "schema-avg") {
      pontuacao = computeSchemaAvg(config!, r).pontuacao;
    } else {
      pontuacao = computeThreshold(r).pontuacao;
    }
    salvarResposta({
      tipo: config!.id,
      nome: paciente.nome!,
      telefone: paciente.telefone,
      nascimento: paciente.nascimento,
      respostas: r,
      pontuacao,
    });
    setEtapa("resultado");
  }

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex flex-col" data-theme="c">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link to="/paciente" className="text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors">
            Voltar
          </Link>
          <span className="text-xs font-semibold text-[var(--c-text)]">{config.sigla}</span>
          {etapa === "form" ? (
            <span className="text-xs text-[var(--c-muted)]">
              {atual + 1} / {total}
            </span>
          ) : (
            <span />
          )}
        </div>
      </header>

      <main id="main" className="flex-1 flex items-center justify-center pt-20 pb-12 px-6">
        <div className="max-w-lg w-full">
          <AnimatePresence mode="wait">
            {etapa === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-[var(--c-accent)] mb-3 block">
                  {config.sigla}
                </span>
                <h1 className="text-3xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  {config.nome}
                </h1>
                <p className="text-sm text-[var(--c-muted)] mb-6">
                  Ola, <strong className="text-[var(--c-text)]">{paciente.nome}</strong>.
                </p>
                <p className="text-[var(--c-muted)] mb-4 leading-relaxed">{config.instrucoes}</p>
                <p className="text-xs text-[var(--c-muted)] mb-2">
                  {total} perguntas
                </p>
                <p className="text-xs text-[var(--c-muted)] mb-10 italic">Ferramenta de rastreio, nao de diagnostico.</p>
                <button onClick={() => setEtapa("form")} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[var(--c-accent)] text-white font-medium hover:opacity-90 transition-opacity">
                  Iniciar <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {etapa === "form" && (
              <motion.div key={"q" + atual} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                <div className="h-1.5 bg-[var(--c-border)] rounded-full overflow-hidden mb-6">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: ((atual + 1) / total) * 100 + "%", background: "var(--c-accent)" }}
                  />
                </div>
                <p className="text-xs text-[var(--c-muted)] mb-1">Pergunta {atual + 1} de {total}</p>
                <h2 className="text-xl font-semibold text-[var(--c-text)] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
                  {config.itens[atual]}
                </h2>
                <div className="space-y-3">
                  {config.opcoes.map((op) => (
                    <button
                      key={op.valor}
                      onClick={() => handleResposta(op.valor)}
                      className="w-full text-left px-5 py-4 rounded-xl border transition-all"
                      style={{
                        borderColor: respostas[atual] === op.valor ? "var(--c-accent)" : "var(--c-border)",
                        background: respostas[atual] === op.valor ? "var(--c-accent)10" : "var(--c-surface)",
                        color: "var(--c-text)",
                      }}
                    >
                      <span className="font-semibold mr-2">{op.valor}.</span>
                      {op.label}
                    </button>
                  ))}
                </div>
                {atual > 0 && (
                  <button onClick={() => setAtual(atual - 1)} className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors">
                    <ChevronLeft size={16} /> Voltar
                  </button>
                )}
              </motion.div>
            )}

            {etapa === "resultado" && (
              <ResultadoScreen config={config} respostas={respondidas} pacienteNome={paciente.nome!} />
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function ResultadoScreen({
  config,
  respostas,
}: {
  config: EscalaConfig;
  respostas: number[];
  pacienteNome: string;
}) {
  if (config.scoring === "schema-avg") {
    return <ResultadoSchemaAvg config={config} respostas={respostas} />;
  }
  return <ResultadoThreshold config={config} respostas={respostas} />;
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
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white bg-[var(--c-accent)]">
        {ativos.length}
      </div>
      <span className="text-xs tracking-widest uppercase font-semibold block mb-1 text-[var(--c-accent)]">
        {ativos.length === 0 ? "Nenhum esquema ativado" : `${ativos.length} esquema${ativos.length > 1 ? "s" : ""} ativo${ativos.length > 1 ? "s" : ""}`}
      </span>
      <h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        Respostas registradas
      </h2>
      <p className="text-[var(--c-muted)] leading-relaxed mb-6 max-w-sm mx-auto">
        Esquemas com media acima de 3.5 sao considerados ativos. Converse com seu psicologo sobre estes resultados.
      </p>

      <div className="text-left space-y-4 mb-8">
        {Array.from(dominioGroups.entries()).map(([domNome, esquemas]) => (
          <div key={domNome} className="rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4">
            <h3 className="text-sm font-semibold text-[var(--c-text)] mb-3">{domNome}</h3>
            <div className="space-y-2">
              {esquemas.map((e) => (
                <div key={e.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={e.media > 3.5 ? "font-bold text-[var(--c-accent)]" : "text-[var(--c-muted)]"}>
                      {e.nome}
                    </span>
                    <span className={e.media > 3.5 ? "font-bold text-[var(--c-accent)]" : "text-[var(--c-muted)]"}>
                      {e.media.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--c-border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: (e.media / 6) * 100 + "%",
                        background: e.media > 3.5 ? "var(--c-accent)" : "var(--c-muted)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--c-muted)] mb-10 italic">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
      <Link to="/paciente" className="px-6 py-3 rounded-full border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent)] transition-colors text-sm">
        Voltar
      </Link>
    </motion.div>
  );
}

function ResultadoThreshold({ config, respostas }: { config: EscalaConfig; respostas: number[] }) {
  const { flagged, pontuacao } = useMemo(() => computeThreshold(respostas), [respostas]);

  return (
    <motion.div key="resultado" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white bg-[var(--c-accent)]">
        {pontuacao}
      </div>
      <span className="text-xs tracking-widest uppercase font-semibold block mb-1 text-[var(--c-accent)]">
        {pontuacao === 0 ? "Nenhuma defesa ativada" : `${pontuacao} defesa${pontuacao > 1 ? "s" : ""} ativa${pontuacao > 1 ? "s" : ""}`}
      </span>
      <h2 className="text-2xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        Respostas registradas
      </h2>
      <p className="text-[var(--c-muted)] leading-relaxed mb-6 max-w-sm mx-auto">
        Itens com nota 5 ou 6 indicam forte ativacao da estrategia compensatoria. Compartilhe esses resultados com seu psicologo.
      </p>

      {flagged.length > 0 && (
        <div className="text-left mb-8 rounded-xl border border-[var(--c-accent)]/30 bg-[var(--c-surface)] p-4">
          <h3 className="text-sm font-semibold text-[var(--c-accent)] mb-3">Defesas ativas</h3>
          <ul className="space-y-2">
            {flagged.map((f) => (
              <li key={f.index} className="flex items-start gap-3 text-sm">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--c-accent)] text-white font-bold flex items-center justify-center text-xs">
                  {f.valor}
                </span>
                <span className="text-[var(--c-text)] leading-snug">{config.itens[f.index]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-xs text-[var(--c-muted)] mb-10 italic">Suas respostas foram enviadas ao seu psicologo de forma segura.</p>
      <Link to="/paciente" className="px-6 py-3 rounded-full border border-[var(--c-border)] text-[var(--c-text)] hover:border-[var(--c-accent)] transition-colors text-sm">
        Voltar
      </Link>
    </motion.div>
  );
}