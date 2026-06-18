import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem { label: string; href: string }

export function FloatingNav({ items, crp }: { items: NavItem[]; crp: string }) {
  const [visible, setVisible] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 100 && y < lastY);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50",
            "flex items-center gap-5 px-5 py-2.5 rounded-full",
            "bg-[var(--c-bg)]/92 backdrop-blur-md border border-[var(--c-border)]",
            "shadow-lg"
          )}
          role="navigation"
          aria-label="Navegação principal"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full ml-1",
              "bg-[var(--c-accent)]/10 text-[var(--c-accent)] border border-[var(--c-accent)]/25"
            )}
          >
            {crp}
          </span>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
