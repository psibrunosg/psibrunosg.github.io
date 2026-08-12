import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, SkipForward } from "lucide-react";
import { irukaStages } from "@/content/naruto";
import { MangaPanel, SpeedLines, ScreenTone } from "@/components/naruto/effects";
import TypewriterText from "@/components/naruto/TypewriterText";
import type { SceneProps } from "./SceneEngine";

export default function SceneIruka({ onAdvance }: SceneProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const currentStage = irukaStages[stageIndex];
  const isLast = stageIndex === irukaStages.length - 1;

  const nextStage = useCallback(() => {
    if (stageIndex < irukaStages.length - 1) {
      setStageIndex((prev) => prev + 1);
    } else {
      onAdvance();
    }
  }, [stageIndex, onAdvance]);

  const skip = useCallback(() => {
    onAdvance();
  }, [onAdvance]);

  return (
    <div className="relative h-full w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Background atmosférico */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e2a] via-[#0f1a16] to-[#0a1210]" />
      <ScreenTone color="#ffffff" dotSize={6} opacity={0.05} />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end">
        {/* Painel do Iruka */}
        <MangaPanel
          variant="tilted"
          className="md:col-span-4 aspect-[3/4] md:aspect-auto md:h-[60vh] flex flex-col"
          delay={0.1}
        >
          <div className="relative flex-1 bg-gradient-to-b from-[#d4a574] to-[#a67c52] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentStage.id}
                src={currentStage.image}
                alt=""
                className="absolute inset-0 w-full h-full object-contain p-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
            <div className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              Iruka-sensei
            </div>
          </div>
        </MangaPanel>

        {/* Painel de diálogo */}
        <MangaPanel
          variant="burst"
          className="md:col-span-8 min-h-[280px] md:min-h-[50vh] flex flex-col justify-between p-5 md:p-8"
          delay={0.25}
        >
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[#C65C2E] rounded-tl-xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#C65C2E] mb-3">
                  Cena {stageIndex + 1} / {irukaStages.length}
                </p>
                <TypewriterText
                  text={currentStage.text}
                  speed={24}
                  className="text-base md:text-xl leading-relaxed text-[#1a1a1a] whitespace-pre-line font-medium"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t-2 border-dashed border-[#1a1a1a]/20">
            <button
              type="button"
              onClick={skip}
              className="inline-flex items-center gap-1.5 text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E] rounded px-2 py-1"
            >
              <SkipForward size={14} />
              Pular introdução
            </button>
            <button
              type="button"
              onClick={nextStage}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C65C2E] text-white text-sm font-bold border-2 border-[#1a1a1a] shadow-[3px_3px_0_0_#1a1a1a] hover:shadow-[1px_1px_0_0_#1a1a1a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E]"
            >
              {isLast ? "Ver os clãs" : "Próximo"}
              <ChevronRight size={16} />
            </button>
          </div>
        </MangaPanel>
      </div>

      <SpeedLines color="#ffffff" density={24} className="opacity-20" />
    </div>
  );
}
