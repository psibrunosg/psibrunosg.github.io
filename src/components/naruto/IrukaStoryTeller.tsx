import { useState, useCallback } from "react";
import { ChevronRight, SkipForward } from "lucide-react";
import { irukaStages } from "@/content/naruto";
import TypewriterText from "./TypewriterText";

interface IrukaStoryTellerProps {
  onComplete?: () => void;
}

export default function IrukaStoryTeller({ onComplete }: IrukaStoryTellerProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const currentStage = irukaStages[stageIndex];
  const isLast = stageIndex === irukaStages.length - 1;

  const nextStage = useCallback(() => {
    if (stageIndex < irukaStages.length - 1) {
      setStageIndex((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  }, [stageIndex, onComplete]);

  const skip = useCallback(() => {
    setStageIndex(irukaStages.length - 1);
    onComplete?.();
  }, [onComplete]);

  return (
    <div className="relative z-10 flex flex-col md:flex-row items-end md:items-center gap-4 md:gap-8 max-w-4xl mx-auto px-4">
      {/* Iruka */}
      <div
        className="naruto-iruka flex-shrink-0 w-32 h-40 md:w-40 md:h-52 rounded-2xl border-4 border-[#5c4033] bg-gradient-to-b from-[#d4a574] to-[#a67c52] flex items-center justify-center shadow-2xl overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={currentStage.image}
          alt=""
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Balão de fala */}
      <div className="flex-1 relative">
        <div
          className="relative bg-white text-[#1a1a1a] rounded-2xl rounded-bl-none md:rounded-bl-2xl md:rounded-tl-none p-5 md:p-6 shadow-xl border-2 border-[#1a1a1a]"
          style={{ minHeight: "160px" }}
        >
          <TypewriterText
            key={currentStage.id}
            text={currentStage.text}
            speed={28}
            className="text-sm md:text-base leading-relaxed whitespace-pre-line font-medium"
          />
        </div>

        {/* Seta do balão */}
        <div
          className="absolute -bottom-2 left-4 md:left-auto md:-left-2 w-4 h-4 bg-white border-l-2 border-b-2 border-[#1a1a1a] rotate-45 md:rotate-0 md:border-l-0 md:border-b-0 md:border-t-2 md:border-r-2"
          style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
        />

        {/* Controles */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={skip}
            className="inline-flex items-center gap-1.5 text-xs text-[#e8dcc0]/80 hover:text-[#e8dcc0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E] rounded px-2 py-1"
          >
            <SkipForward size={14} />
            Pular introdução
          </button>
          <button
            type="button"
            onClick={nextStage}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C65C2E] text-white text-sm font-semibold hover:bg-[#a64a22] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2e2a]"
          >
            {isLast ? "Ver os clãs" : "Próximo"}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
