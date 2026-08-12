import { motion } from "framer-motion";

interface OnomatopoeiaProps {
  text: string;
  className?: string;
  color?: string;
  delay?: number;
}

export default function Onomatopoeia({
  text,
  className = "",
  color = "#C65C2E",
  delay = 0,
}: OnomatopoeiaProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 1.5, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: -4 }}
      transition={{ duration: 0.35, delay, type: "spring", stiffness: 200 }}
      className={`inline-block font-black uppercase tracking-tighter ${className}`}
      style={{
        color,
        textShadow:
          "3px 3px 0 #1a1a1a, -1px -1px 0 #1a1a1a, 1px -1px 0 #1a1a1a, -1px 1px 0 #1a1a1a",
        fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
      }}
    >
      {text}
    </motion.span>
  );
}
