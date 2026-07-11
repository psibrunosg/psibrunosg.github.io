import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { PassosData } from "./types";

export function Passos({ data }: { data: PassosData }) {
  const [marcados, setMarcados] = useState<Set<number>>(new Set());
  const baseId = useId();
  const reduzirMovimento = useReducedMotion();

  function alternar(i: number) {
    setMarcados((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const total = data.passos.length;
  const progresso = total > 0 ? (marcados.size / total) * 100 : 0;

  return (
    <div className="not-prose my-6 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 sm:p-6">
      {data.titulo && <p className="mb-4 text-sm font-bold text-[var(--c-text)]">{data.titulo}</p>}

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--c-bg)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--c-accent)" }}
          animate={{ width: `${progresso}%` }}
          transition={reduzirMovimento ? { duration: 0.01 } : { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>

      <ol className="space-y-2">
        {data.passos.map((passo, i) => {
          const marcado = marcados.has(i);
          const id = `${baseId}-passo-${i}`;
          return (
            <li key={i}>
              <button
                type="button"
                id={id}
                onClick={() => alternar(i)}
                aria-pressed={marcado}
                className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors"
                style={{
                  borderColor: marcado ? "var(--c-accent)" : "var(--c-border)",
                  background: marcado ? "color-mix(in oklab, var(--c-accent) 8%, transparent)" : "transparent",
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold"
                  style={{
                    borderColor: "var(--c-accent)",
                    background: marcado ? "var(--c-accent)" : "transparent",
                    color: marcado ? "white" : "var(--c-accent)",
                  }}
                  aria-hidden="true"
                >
                  {marcado ? <Check size={13} /> : i + 1}
                </span>
                <span className={marcado ? "text-[var(--c-muted)] line-through" : "text-[var(--c-text)]"}>{passo}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
