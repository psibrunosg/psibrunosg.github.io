import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem { label: string; href: string }

interface Props {
  items: NavItem[];
  crp: string;
  whatsappLink: string;
}

export function MobileMenu({ items, crp, whatsappLink }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger trigger — fixed top-right, only on mobile */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className={cn(
          "fixed top-4 right-4 z-[70]",
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

      {/* Full-screen overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className={cn(
              "fixed inset-0 z-[65]",
              "bg-[var(--c-bg)] flex flex-col items-center justify-center gap-8"
            )}
          >
            <nav aria-label="Menu mobile">
              <ul className="flex flex-col items-center gap-6">
                {items.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="text-2xl font-light text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: items.length * 0.07 + 0.2 }}
              className="px-8 py-3 rounded-full bg-[var(--c-accent)] text-white font-medium text-lg"
              onClick={() => setOpen(false)}
            >
              Agendar conversa
            </motion.a>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-[var(--c-muted)] tracking-widest uppercase"
            >
              {crp}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
