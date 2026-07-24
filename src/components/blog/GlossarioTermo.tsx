import { useState, useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface GlossarioTermoProps {
  termo: string;
  definicao: string;
  children: React.ReactNode;
}

export function GlossarioTermo({ definicao, children }: GlossarioTermoProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const shouldReduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Escape") {
      if (open) {
        setOpen(false);
        (e.currentTarget as HTMLSpanElement).focus();
        e.preventDefault();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      // Toggle on Enter/Space for keyboard/touch users without hover support
      setOpen(!open);
      e.preventDefault();
    }
  };

  return (
    <span
      className="relative border-b border-dotted border-[var(--c-accent)] cursor-help transition-colors hover:border-solid"
      tabIndex={0}
      role="button"
      aria-describedby={tooltipId}
      aria-expanded={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={handleKeyDown}
    >
      {children}

      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            id={tooltipId}
            className="absolute bottom-full mb-2 z-50 max-w-64 rounded-lg p-2 text-xs glass-card text-[var(--c-text)] pointer-events-none"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
          >
            {definicao}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
