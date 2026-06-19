import { motion, useReducedMotion } from "framer-motion";

interface Blob {
  size: number;
  x: string;
  y: string;
  color: string;
  delay: number;
}

const blobs: Blob[] = [
  { size: 320, x: "8%",  y: "12%", color: "var(--c-accent)",    delay: 0 },
  { size: 240, x: "78%", y: "22%", color: "var(--c-moss)",      delay: 2 },
  { size: 200, x: "62%", y: "74%", color: "var(--c-warm)",      delay: 4 },
  { size: 160, x: "22%", y: "68%", color: "var(--c-accent-lt)", delay: 1.5 },
];

/**
 * Fundo aurora reutilizavel para as areas de paciente e admin.
 * Malha de gradientes (CSS, classe .app-aurora) + blobs flutuantes.
 * Respeita prefers-reduced-motion.
 */
export function AppAurora() {
  const reduced = useReducedMotion();

  return (
    <div className="app-aurora" aria-hidden="true">
      {!reduced &&
        blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: b.size,
              height: b.size,
              left: b.x,
              top: b.y,
              background: b.color,
              opacity: 0.07,
            }}
            animate={{
              x: [0, 26, -18, 0],
              y: [0, -22, 14, 0],
              scale: [1, 1.12, 0.94, 1],
            }}
            transition={{
              duration: 20 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.delay,
            }}
          />
        ))}
    </div>
  );
}