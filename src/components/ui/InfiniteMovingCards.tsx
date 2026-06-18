import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

const durations = { slow: "40s", normal: "25s", fast: "15s" };

export function InfiniteMovingCards({ items, speed = "slow", className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && containerRef.current) {
      containerRef.current.style.animationPlayState = "paused";
    }
  }, []);

  return (
    <div
      className={cn("overflow-hidden relative", className)}
      aria-label="Princípios éticos"
    >
      <div
        ref={containerRef}
        className="flex gap-4 w-max"
        style={{
          animation: `scroll-x ${durations[speed]} linear infinite`,
        }}
        aria-hidden="true"
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex-shrink-0 px-6 py-3 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-sm text-[var(--c-muted)] whitespace-nowrap"
          >
            {item}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flex.gap-4.w-max { animation-play-state: paused !important; }
        }
      `}</style>

      <ul className="sr-only" aria-label="Princípios éticos">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
