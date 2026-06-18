import { useEffect, useRef } from "react";

export function Spotlight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };

    parent.addEventListener("mousemove", onMouseMove);
    return () => parent.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 ${className}`}
      style={{
        background:
          "radial-gradient(circle 400px at var(--x, 50%) var(--y, 50%), rgba(107,165,133,0.15), transparent 70%)",
        inset: 0,
        transition: "background 0.1s ease",
      }}
    />
  );
}
