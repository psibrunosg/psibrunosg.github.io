import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  mode?: "words" | "chars";
}

export function TextGenerateEffect({ text, className, delay = 0, mode = "words" }: Props) {
  const lines = text.split("\n");
  let counter = 0;

  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
      variants={{ visible: { transition: { staggerChildren: mode === "words" ? 0.08 : 0.025, delayChildren: delay } } }}
      aria-label={text}
    >
      {lines.map((line, li) => {
        const tokens = mode === "words" ? line.split(" ") : Array.from(line);
        return (
          <span key={li} className="block">
            {tokens.map((token) => {
              const i = counter++;
              const isSpace = token === " ";
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  style={isSpace ? { whiteSpace: "pre" } : undefined}
                  variants={{
                    hidden:  { opacity: 0, y: 20, filter: "blur(8px)" },
                    visible: { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.5, ease: [0.0, 0.0, 0.2, 1.0] } },
                  }}
                >
                  {isSpace ? " " : token}
                  {mode === "words" && " "}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </motion.span>
  );
}
