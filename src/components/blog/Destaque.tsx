import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Lightbulb, AlertTriangle, Info, Scale } from "lucide-react";
import type { DestaqueData, DestaqueTipo } from "./types";

const ESTILOS: Record<DestaqueTipo, { cor: string; bg: string; Icon: typeof Lightbulb; label: string }> = {
  dica: { cor: "#3E7A4E", bg: "#E9F5EC", Icon: Lightbulb, label: "Dica" },
  alerta: { cor: "#B8722A", bg: "#FBF0E1", Icon: AlertTriangle, label: "Alerta" },
  info: { cor: "var(--c-accent)", bg: "var(--c-bg)", Icon: Info, label: "Info" },
  mito: { cor: "var(--c-warm)", bg: "#FBF0E1", Icon: Scale, label: "Mito vs Fato" },
};

function MarkdownInline({ children }: { children: string }) {
  return (
    <div className="text-sm leading-relaxed text-[var(--c-text)] [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:font-bold [&_a]:text-[var(--c-accent)] [&_a]:underline">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function Destaque({ data }: { data: DestaqueData }) {
  const estilo = ESTILOS[data.tipo] ?? ESTILOS.info;
  const { Icon } = estilo;

  if (data.tipo === "mito" && data.texto.includes("|")) {
    const [mito, fato] = data.texto.split("|").map((s) => s.trim());
    return (
      <div className="not-prose my-6 overflow-hidden rounded-2xl border" style={{ borderColor: estilo.cor + "55" }}>
        {data.titulo && (
          <div className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white" style={{ background: estilo.cor }}>
            <Icon size={14} aria-hidden="true" />
            {data.titulo}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="p-4" style={{ background: "#FBEDED" }}>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#B24444]">Mito</p>
            <MarkdownInline>{mito}</MarkdownInline>
          </div>
          <div className="p-4" style={{ background: "#E9F5EC" }}>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3E7A4E]">Fato</p>
            <MarkdownInline>{fato ?? ""}</MarkdownInline>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-6 rounded-2xl p-4 sm:p-5" style={{ background: estilo.bg, border: `1px solid ${estilo.cor}55` }}>
      <div className="flex gap-3">
        <Icon size={18} className="mt-0.5 shrink-0" style={{ color: estilo.cor }} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          {data.titulo && (
            <p className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: estilo.cor }}>
              {data.titulo}
            </p>
          )}
          <MarkdownInline>{data.texto}</MarkdownInline>
        </div>
      </div>
    </div>
  );
}
