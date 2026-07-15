import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem { label: string; href: string }

interface Props {
  items: NavItem[];
  crp: string;
  whatsappLink: string;
}

export function MobileMenu({ items, crp, whatsappLink }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="md:hidden fixed top-4 right-4 z-[70]">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className={cn(
          "w-11 h-11 rounded-full flex flex-col items-center justify-center gap-1.5",
          "bg-[var(--c-bg)]/90 backdrop-blur-md border border-[var(--c-border)] shadow-md",
          "transition-colors hover:border-[var(--c-accent)]"
        )}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }}
          className="block w-5 h-px bg-[var(--c-text)] origin-center"
          transition={{ duration: 0.25 }}
        />
        <motion.span
          animate={{ opacity: open ? 0 : 1 }}
          className="block w-5 h-px bg-[var(--c-text)]"
          transition={{ duration: 0.15 }}
        />
        <motion.span
          animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
          className="block w-5 h-px bg-[var(--c-text)] origin-center"
          transition={{ duration: 0.25 }}
        />
      </button>

      {/* Dropdown panel — sem exit animation: AnimatePresence com spring+scale
          travava indefinidamente sem desmontar (opacity:0 mas pointer-events:auto
          continuava interceptando cliques). Fecha instantaneamente por design. */}
      {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "absolute top-14 right-0 w-56",
              "rounded-2xl overflow-hidden",
              "bg-[var(--c-bg)]/95 backdrop-blur-xl border border-[var(--c-border)]",
              "shadow-xl"
            )}
          >
            <nav aria-label="Menu de navegação" className="py-2">
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href}>
                    {item.href.startsWith("/") ? (
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-5 py-2.5 text-sm text-[var(--c-text)] hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-accent)] transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-5 py-2.5 text-sm text-[var(--c-text)] hover:bg-[var(--c-accent)]/10 hover:text-[var(--c-accent)] transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-[var(--c-border)] px-5 py-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2 rounded-full bg-[var(--c-accent)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Agendar conversa
              </a>
            </div>

            <div className="px-5 pb-3">
              <p className="text-[10px] text-[var(--c-muted)] tracking-widest uppercase text-center">
                {crp}
              </p>
            </div>
          </motion.div>
      )}
    </div>
  );
}
