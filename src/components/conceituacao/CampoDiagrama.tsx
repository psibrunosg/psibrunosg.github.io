// Primitivas visuais compartilhadas por todos os diagramas de conceituação —
// puro CSS/JSX, sem lógica de IA (essa vive em useConceituacaoIA). Cada
// diagrama continua livre pra montar seu próprio layout com essas peças.
import { ArrowDown } from "lucide-react";

export const box = "rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/60 p-4";
export const labelCls = "mb-1 block text-[11px] font-medium text-[var(--c-accent)]";
export const inputCls = "w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none";

export function Campo({ label, valor, onChange, area }: { label: string; valor: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {area ? (
        <textarea value={valor} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
      ) : (
        <input value={valor} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </div>
  );
}

export const Seta = () => (
  <div className="flex justify-center py-1 text-[var(--c-muted)]"><ArrowDown size={16} /></div>
);
