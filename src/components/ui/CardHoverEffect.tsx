import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardItem {
  titulo: string;
  descricao: string;
  id: string;
}

interface Props {
  items: CardItem[];
  className?: string;
}

export function CardHoverEffect({ items, className }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          className="relative rounded-2xl border border-[var(--c-border)] p-6 cursor-default overflow-hidden"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          {hovered === i && (
            <motion.div
              className="absolute inset-0 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: "radial-gradient(circle at 50% 50%, var(--c-accent) 0%, transparent 70%)",
                opacity: 0.08,
              }}
              aria-hidden="true"
            />
          )}
          <h3
            className="font-semibold text-[var(--c-text)] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {item.titulo}
          </h3>
          <p className="text-sm text-[var(--c-muted)] leading-relaxed">{item.descricao}</p>
        </motion.div>
      ))}
    </div>
  );
}
