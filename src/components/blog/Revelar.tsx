import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { RevelarData } from "./types";

export function Revelar({ data }: { data: RevelarData }) {
  const [aberto, setAberto] = useState(false);
  const id = useId();
  const reduzirMovimento = useReducedMotion();

  return (
    <div className="not-prose my-6 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls={`${id}-conteudo`}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-[var(--c-text)]">{data.titulo}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${aberto ? "rotate-180" : ""}`}
          style={{ color: "var(--c-accent)" }}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            id={`${id}-conteudo`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduzirMovimento ? { duration: 0.01 } : { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--c-muted)] [&_p]:m-0 [&_p+p]:mt-2 [&_strong]:text-[var(--c-text)] [&_strong]:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.conteudo}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
