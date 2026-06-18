import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function MagneticCursor() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 18 });
  const springY = useSpring(y, { stiffness: 100, damping: 18 });
  const visible = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      visible.current = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] top-0 left-0 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--c-accent)] opacity-70 mix-blend-difference"
      style={{ x: springX, y: springY }}
    />
  );
}
