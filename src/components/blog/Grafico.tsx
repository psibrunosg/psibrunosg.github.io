import { motion, useReducedMotion } from "framer-motion";
import type { GraficoData } from "./types";

const CORES = ["var(--c-accent)", "var(--c-warm)", "var(--c-moss-dk)", "var(--c-accent-lt)"];

function formatarValor(v: number, unidade?: string) {
  const casasDecimais = Number.isInteger(v) ? 0 : 1;
  return `${v.toFixed(casasDecimais)}${unidade ?? ""}`;
}

function GraficoBarras({ dados, unidade }: { dados: GraficoData["dados"]; unidade?: string }) {
  const reduzirMovimento = useReducedMotion();
  const max = Math.max(...dados.map((d) => d.valor), 0.0001);

  return (
    <div className="space-y-3">
      {dados.map((d, i) => (
        <div key={d.label}>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
            <span className="font-medium text-[var(--c-text)]">{d.label}</span>
            <span className="font-semibold" style={{ color: CORES[i % CORES.length] }}>
              {formatarValor(d.valor, unidade)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--c-bg)]">
            <motion.div
              className="h-full rounded-full"
              style={{ background: CORES[i % CORES.length] }}
              initial={{ width: 0 }}
              whileInView={{ width: `${(d.valor / max) * 100}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={reduzirMovimento ? { duration: 0.01 } : { duration: 0.8, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function GraficoLinha({ dados, unidade }: { dados: GraficoData["dados"]; unidade?: string }) {
  const reduzirMovimento = useReducedMotion();
  const w = 560;
  const h = 220;
  const padX = 32;
  const padY = 24;
  const max = Math.max(...dados.map((d) => d.valor), 0.0001);
  const min = Math.min(...dados.map((d) => d.valor), 0);
  const faixa = max - min || 1;

  const pontos = dados.map((d, i) => {
    const x = dados.length > 1 ? padX + (i / (dados.length - 1)) * (w - padX * 2) : w / 2;
    const y = h - padY - ((d.valor - min) / faixa) * (h - padY * 2);
    return { x, y, ...d };
  });

  const path = pontos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full min-w-[320px]" role="img" aria-label="Gráfico de linha">
        <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} stroke="var(--c-border)" strokeWidth={1} />
        <motion.path
          d={path}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={reduzirMovimento ? { duration: 0.01 } : { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {pontos.map((p, i) => (
          <g key={p.label}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={4}
              fill="var(--c-warm)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={reduzirMovimento ? { duration: 0.01 } : { duration: 0.4, delay: 0.6 + i * 0.05 }}
            />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={11} fill="var(--c-text)" fontWeight={600}>
              {formatarValor(p.valor, unidade)}
            </text>
            <text x={p.x} y={h - padY + 16} textAnchor="middle" fontSize={10} fill="var(--c-muted)">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Grafico({ data }: { data: GraficoData }) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5 sm:p-6">
      {data.titulo && <p className="mb-4 text-sm font-bold text-[var(--c-text)]">{data.titulo}</p>}
      {data.tipo === "linha" ? (
        <GraficoLinha dados={data.dados} unidade={data.unidade} />
      ) : (
        <GraficoBarras dados={data.dados} unidade={data.unidade} />
      )}
      {data.fonte && <p className="mt-4 text-[11px] text-[var(--c-muted)]">Fonte: {data.fonte}</p>}
    </div>
  );
}
