import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  label: string;
  sublabel?: string;
  sublabelClassName?: string;
  className?: string;
}

export function AnimatedCTA({ href, label, sublabel, sublabelClassName, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.3);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ x: sx, y: sy }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative overflow-hidden px-8 py-4 rounded-full font-medium text-lg",
          "bg-[var(--c-accent)] text-white shadow-lg",
          "focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] focus-visible:ring-offset-2"
        )}
        aria-label={label}
      >
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)",
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
          aria-hidden="true"
        />
        <span className="relative z-10">{label}</span>
      </motion.a>
      {sublabel && (
        <span className={cn("text-xs", sublabelClassName ?? "text-[var(--c-muted)]")}>
          {sublabel}
        </span>
      )}
    </div>
  );
}
