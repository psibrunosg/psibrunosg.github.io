import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface MangaPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "tilted" | "burst" | "full";
  delay?: number;
}

const variants = {
  default: "rounded-lg border-4 border-[#1a1a1a] bg-white",
  tilted: "rounded-lg border-4 border-[#1a1a1a] bg-white rotate-1",
  burst: "rounded-lg border-4 border-[#1a1a1a] bg-white",
  full: "border-4 border-[#1a1a1a] bg-white",
};

export default function MangaPanel({
  children,
  className = "",
  variant = "default",
  delay = 0,
}: MangaPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,0.25)] ${variants[variant]} ${className}`}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />
    </motion.div>
  );
}
