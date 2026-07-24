import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "tema-noturno";

export function ThemeToggle() {
  const [noturno, setNoturno] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (noturno) document.documentElement.setAttribute("data-mode", "noturno");
    else document.documentElement.removeAttribute("data-mode");
    localStorage.setItem(STORAGE_KEY, String(noturno));
  }, [noturno]);

  return (
    <button
      onClick={() => setNoturno((v) => !v)}
      aria-label={noturno ? "Ativar modo claro" : "Ativar modo noturno"}
      aria-pressed={noturno}
      className="fixed top-4 left-4 z-[70] flex h-11 w-11 items-center justify-center rounded-full bg-[var(--c-bg)]/90 backdrop-blur-md border border-[var(--c-border)] shadow-md transition-colors hover:border-[var(--c-accent)]"
    >
      {noturno ? <Sun size={18} className="text-[var(--c-accent)]" /> : <Moon size={18} className="text-[var(--c-text)]" />}
    </button>
  );
}
