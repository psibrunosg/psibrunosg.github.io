import type { ReactNode } from "react";
import { useState } from "react";

export interface SimuladorControle {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  valorInicial: number;
  formatarValor?: (v: number) => string;
}

interface SimuladorProps {
  controles: SimuladorControle[];
  children: (valores: Record<string, number>) => ReactNode;
  titulo?: string;
}

/**
 * Wrapper genérico para simuladores visuais interativos: um ou mais
 * sliders alteram valores que são repassados para a visualização (SVG,
 * gráfico, etc.) via render-prop (children function). Os módulos 4c
 * (ciclo do pânico, janela de tolerância, sono) usam este componente.
 */
export function Simulador({ controles, children, titulo }: SimuladorProps) {
  const [valores, setValores] = useState<Record<string, number>>(() =>
    Object.fromEntries(controles.map((c) => [c.id, c.valorInicial]))
  );

  return (
    <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8">
      {titulo && (
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-4">
          {titulo}
        </p>
      )}

      <div className="mb-6">{children(valores)}</div>

      <div className="space-y-4">
        {controles.map((c) => (
          <div key={c.id}>
            <label className="flex justify-between text-xs font-semibold text-[var(--c-text)] mb-1">
              <span>{c.label}</span>
              <span className="text-[var(--c-accent)]">
                {c.formatarValor ? c.formatarValor(valores[c.id]) : valores[c.id]}
              </span>
            </label>
            <input
              type="range"
              min={c.min}
              max={c.max}
              step={c.step ?? 1}
              value={valores[c.id]}
              onChange={(e) =>
                setValores((prev) => ({ ...prev, [c.id]: Number(e.target.value) }))
              }
              className="w-full accent-[var(--c-accent)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Simulador;
