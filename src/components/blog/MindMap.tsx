import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { MindMapData, MindMapNo } from "./types";

const CORES_DEFAULT = ["var(--c-accent)", "var(--c-warm)", "var(--c-moss-dk)", "var(--c-accent-lt)"];

const SIZE = 340;
const CENTRO = SIZE / 2;
const RAIO_NOS = 118;
const RAIO_FILHOS = 66;

function ponto(cx: number, cy: number, raio: number, anguloDeg: number) {
  const rad = (anguloDeg * Math.PI) / 180;
  return { x: cx + raio * Math.cos(rad), y: cy + raio * Math.sin(rad) };
}

export function MindMap({ data }: { data: MindMapData }) {
  const [abertos, setAbertos] = useState<Set<number>>(new Set());
  const baseId = useId();
  const reduzirMovimento = useReducedMotion();

  function alternar(i: number) {
    setAbertos((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const n = data.nos.length;
  const anguloPasso = n > 0 ? 360 / n : 0;

  const transition = reduzirMovimento ? { duration: 0.01 } : { type: "spring" as const, stiffness: 260, damping: 24 };

  return (
    <div className="not-prose my-8 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 sm:p-6">
      {/* layout radial: visivel em telas medias+ */}
      <div className="hidden md:block">
        <div className="relative mx-auto" style={{ width: SIZE, height: SIZE, maxWidth: "100%" }}>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
            {data.nos.map((no, i) => {
              const ang = -90 + i * anguloPasso;
              const p = ponto(CENTRO, CENTRO, RAIO_NOS, ang);
              const cor = no.cor ?? CORES_DEFAULT[i % CORES_DEFAULT.length];
              return (
                <line
                  key={`linha-${i}`}
                  x1={CENTRO}
                  y1={CENTRO}
                  x2={p.x}
                  y2={p.y}
                  stroke={cor}
                  strokeWidth={2}
                  strokeOpacity={0.45}
                />
              );
            })}
            {data.nos.map((no, i) => {
              if (!abertos.has(i) || !no.filhos?.length) return null;
              const ang = -90 + i * anguloPasso;
              const pai = ponto(CENTRO, CENTRO, RAIO_NOS, ang);
              const cor = no.cor ?? CORES_DEFAULT[i % CORES_DEFAULT.length];
              const arco = 46;
              return no.filhos.map((_, j) => {
                const totalFilhos = no.filhos!.length;
                const offset = (j - (totalFilhos - 1) / 2) * (arco / Math.max(totalFilhos, 1));
                const angFilho = ang + offset;
                const pf = ponto(pai.x, pai.y, RAIO_FILHOS, angFilho);
                return (
                  <line
                    key={`linha-filho-${i}-${j}`}
                    x1={pai.x}
                    y1={pai.y}
                    x2={pf.x}
                    y2={pf.y}
                    stroke={cor}
                    strokeWidth={1.5}
                    strokeOpacity={0.35}
                    strokeDasharray="3 3"
                  />
                );
              });
            })}
          </svg>

          {/* centro */}
          <div
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
            style={{ left: CENTRO, top: CENTRO, background: "var(--c-bg-dark)", maxWidth: 140 }}
          >
            {data.centro}
          </div>

          {/* nos principais */}
          {data.nos.map((no, i) => {
            const ang = -90 + i * anguloPasso;
            const p = ponto(CENTRO, CENTRO, RAIO_NOS, ang);
            const cor = no.cor ?? CORES_DEFAULT[i % CORES_DEFAULT.length];
            const temFilhos = !!no.filhos?.length;
            const aberto = abertos.has(i);
            const idNo = `${baseId}-no-${i}`;
            return (
              <button
                key={i}
                type="button"
                onClick={() => temFilhos && alternar(i)}
                aria-expanded={temFilhos ? aberto : undefined}
                aria-controls={temFilhos ? `${idNo}-filhos` : undefined}
                disabled={!temFilhos}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border-2 px-3 py-1.5 text-xs font-semibold shadow-sm transition-transform hover:scale-105 disabled:cursor-default"
                style={{ left: p.x, top: p.y, borderColor: cor, color: cor, background: "var(--c-surface)", maxWidth: 128 }}
              >
                <span className="truncate">{no.titulo}</span>
                {temFilhos && (
                  <ChevronDown size={12} className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`} aria-hidden="true" />
                )}
              </button>
            );
          })}

          {/* filhos */}
          <AnimatePresence>
            {data.nos.map((no, i) => {
              if (!abertos.has(i) || !no.filhos?.length) return null;
              const ang = -90 + i * anguloPasso;
              const pai = ponto(CENTRO, CENTRO, RAIO_NOS, ang);
              const cor = no.cor ?? CORES_DEFAULT[i % CORES_DEFAULT.length];
              const arco = 46;
              const idNo = `${baseId}-no-${i}`;
              return (
                <div key={`filhos-${i}`} id={`${idNo}-filhos`}>
                  {no.filhos.map((filho, j) => {
                    const totalFilhos = no.filhos!.length;
                    const offset = (j - (totalFilhos - 1) / 2) * (arco / Math.max(totalFilhos, 1));
                    const angFilho = ang + offset;
                    const pf = ponto(pai.x, pai.y, RAIO_FILHOS, angFilho);
                    return (
                      <motion.span
                        key={filho}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={transition}
                        className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium shadow-sm"
                        style={{ left: pf.x, top: pf.y, borderColor: cor + "88", color: "var(--c-text)", background: "var(--c-bg)" }}
                      >
                        {filho}
                      </motion.span>
                    );
                  })}
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* lista hierarquica: mobile */}
      <div className="md:hidden">
        <p className="mb-4 text-center text-sm font-semibold" style={{ color: "var(--c-accent)" }}>
          {data.centro}
        </p>
        <ul className="space-y-2">
          {data.nos.map((no, i) => {
            const cor = no.cor ?? CORES_DEFAULT[i % CORES_DEFAULT.length];
            const temFilhos = !!no.filhos?.length;
            const aberto = abertos.has(i);
            const idNo = `${baseId}-mobile-${i}`;
            return (
              <li key={i} className="rounded-xl border" style={{ borderColor: cor + "55" }}>
                <button
                  type="button"
                  onClick={() => temFilhos && alternar(i)}
                  aria-expanded={temFilhos ? aberto : undefined}
                  aria-controls={temFilhos ? `${idNo}-filhos` : undefined}
                  disabled={!temFilhos}
                  className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-semibold disabled:cursor-default"
                  style={{ color: cor }}
                >
                  {no.titulo}
                  {temFilhos && (
                    <ChevronDown size={14} className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`} aria-hidden="true" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {temFilhos && aberto && (
                    <motion.div
                      id={`${idNo}-filhos`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={transition}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-1 px-4 pb-3">
                        {no.filhos!.map((filho) => (
                          <li key={filho} className="text-xs text-[var(--c-muted)]">
                            &bull; {filho}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export type { MindMapNo };
