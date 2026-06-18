import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

interface BentoItem {
  titulo: string;
  descricao: string;
  id: string;
  large?: boolean;
}

export function BentoGrid({ items, className }: { items: BentoItem[]; className?: string }) {
  return (
    <motion.div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}
      variants={stagger.container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          variants={fadeUp}
          custom={i}
          className={cn(
            "rounded-2xl border border-[var(--c-border)] p-6",
            "bg-[var(--c-surface)] hover:border-[var(--c-accent)] transition-colors duration-300",
            item.large && "md:col-span-2"
          )}
        >
          <h3
            className="text-xl font-semibold text-[var(--c-text)] mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {item.titulo}
          </h3>
          <p className="text-[var(--c-muted)] leading-relaxed text-sm">{item.descricao}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
