import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface StickyItem {
  titulo: string;
  descricao: string;
  numero: string;
}

export function StickyScrollReveal({ items, sticky, className }: {
  items: StickyItem[];
  sticky: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  return (
    <div ref={containerRef} className={cn("relative flex gap-12", className)} style={{ minHeight: `${items.length * 60}vh` }}>
      <div className="sticky top-1/4 h-fit w-1/2 hidden md:block">
        {sticky}
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-24 py-24">
        {items.map((item, i) => {
          const start = i / items.length;
          const end = (i + 1) / items.length;
          const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);

          return (
            <motion.div key={item.numero} style={{ opacity }} className="min-h-[40vh] flex flex-col justify-center">
              <span className="text-6xl font-light text-[var(--c-accent)] opacity-30 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                {item.numero}
              </span>
              <h3 className="text-2xl font-semibold text-[var(--c-text)] mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                {item.titulo}
              </h3>
              <p className="text-[var(--c-muted)] leading-relaxed">{item.descricao}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
