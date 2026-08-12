import { motion, AnimatePresence } from "framer-motion";

export type TransitionType = "fade" | "wipe" | "radial" | "flash" | "none";

interface AnimeTransitionProps {
  type: TransitionType;
  isActive: boolean;
  color?: string;
  onComplete?: () => void;
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  wipe: {
    initial: { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
    animate: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" },
    exit: { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" },
  },
  radial: {
    initial: { clipPath: "circle(0% at 50% 50%)", opacity: 1 },
    animate: { clipPath: "circle(150% at 50% 50%)", opacity: 1 },
    exit: { clipPath: "circle(150% at 50% 50%)", opacity: 0 },
  },
  flash: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export default function AnimeTransition({
  type,
  isActive,
  color = "#ffffff",
  onComplete,
}: AnimeTransitionProps) {
  if (type === "none") return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isActive && (
        <motion.div
          key={type}
          initial={variants[type].initial}
          animate={variants[type].animate}
          exit={variants[type].exit}
          transition={{ duration: type === "flash" ? 0.2 : 0.55, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ background: color }}
        />
      )}
    </AnimatePresence>
  );
}
