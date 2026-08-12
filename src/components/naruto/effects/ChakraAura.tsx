import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface ChakraAuraProps {
  children: ReactNode;
  color?: string;
  intensity?: "low" | "medium" | "high";
  className?: string;
}

const intensityMap = {
  low: { blur: 16, spread: 8 },
  medium: { blur: 32, spread: 16 },
  high: { blur: 56, spread: 28 },
};

export default function ChakraAura({
  children,
  color = "#F97316",
  intensity = "medium",
  className = "",
}: ChakraAuraProps) {
  const { blur, spread } = intensityMap[intensity];

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        filter: [
          `drop-shadow(0 0 ${spread}px ${color})`,
          `drop-shadow(0 0 ${blur}px ${color})`,
          `drop-shadow(0 0 ${spread}px ${color})`,
        ],
      }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
