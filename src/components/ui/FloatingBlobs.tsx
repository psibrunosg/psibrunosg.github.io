import { motion, useReducedMotion } from "framer-motion";

interface BlobProps {
  size: number;
  x: string;
  y: string;
  delay: number;
  color: string;
  duration: number;
  reduced: boolean;
}

function Blob({ size, x, y, delay, color, duration, reduced }: BlobProps) {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(40px)",
        opacity: 0.18,
        pointerEvents: "none",
      }}
      animate={reduced ? {} : {
        x: [0, 18, -12, 8, 0],
        y: [0, -14, 10, -6, 0],
        scale: [1, 1.05, 0.97, 1.03, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function FloatingBlobs() {
  const reduced = useReducedMotion() ?? false;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <Blob size={260} x="5%"  y="10%" delay={0}   color="var(--c-accent)"    duration={9}  reduced={reduced} />
      <Blob size={200} x="70%" y="20%" delay={2}   color="var(--c-moss)"      duration={11} reduced={reduced} />
      <Blob size={180} x="40%" y="60%" delay={4}   color="var(--c-warm)"      duration={13} reduced={reduced} />
      <Blob size={140} x="80%" y="70%" delay={1.5} color="var(--c-accent-lt)" duration={10} reduced={reduced} />
      <Blob size={120} x="15%" y="75%" delay={3}   color="var(--c-moss)"      duration={12} reduced={reduced} />
    </div>
  );
}