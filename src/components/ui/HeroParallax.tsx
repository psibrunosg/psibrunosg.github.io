import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface Props {
  foto: string;
  children: React.ReactNode;
}

export function HeroParallax({ foto, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y2 = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.08]);

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden flex items-center">
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale }}
        aria-hidden="true"
      >
        <img
          src={foto}
          alt=""
          className="w-full h-full object-cover object-top"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-[var(--c-bg-dark)]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg-dark)]/60 via-transparent to-transparent" />
      </motion.div>

      {/* Hero content — pushed slightly above center */}
      <motion.div className="relative z-10 w-full pb-24" style={{ y: y2, opacity }}>
        {children}
      </motion.div>

      {/* Scroll indicator — apenas linha, sem texto, fixado no rodapé */}
      {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center"
          style={{ opacity }}
          aria-hidden="true"
        >
          <motion.div
            className="w-px h-10 bg-white/25 rounded-full"
            animate={{ scaleY: [0.2, 1, 0.2], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </div>
  );
}