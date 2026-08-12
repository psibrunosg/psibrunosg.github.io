import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimeTransition } from "@/components/naruto/effects";
import type { TransitionType } from "@/components/naruto/effects";

export interface Scene {
  id: string;
  component: React.ComponentType<SceneProps>;
  autoAdvance?: boolean;
  duration?: number;
}

export interface SceneProps {
  onAdvance: () => void;
  isActive: boolean;
}

interface SceneEngineProps {
  scenes: Scene[];
  initialScene?: number;
  onComplete?: () => void;
}

export default function SceneEngine({
  scenes,
  initialScene = 0,
  onComplete,
}: SceneEngineProps) {
  const [index, setIndex] = useState(initialScene);
  const [transition, setTransition] = useState<{
    active: boolean;
    type: TransitionType;
    target: number;
  }>({ active: false, type: "none", target: index });

  const goTo = useCallback(
    (targetIndex: number, type: TransitionType = "wipe") => {
      if (targetIndex < 0 || targetIndex >= scenes.length) {
        onComplete?.();
        return;
      }
      setTransition({ active: true, type, target: targetIndex });
    },
    [scenes.length, onComplete]
  );

  const advance = useCallback(() => {
    goTo(index + 1, "wipe");
  }, [goTo, index]);

  useEffect(() => {
    if (!transition.active) return;
    const timer = setTimeout(() => {
      setIndex(transition.target);
      setTransition((t) => ({ ...t, active: false }));
    }, 550);
    return () => clearTimeout(timer);
  }, [transition.active, transition.target]);

  const CurrentScene = scenes[index]?.component;
  const CurrentSceneKey = scenes[index]?.id ?? "empty";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0f1a16]">
      <AnimeTransition
        type={transition.type}
        isActive={transition.active}
        color="#0f1a16"
      />

      <AnimatePresence mode="wait">
        {CurrentScene && (
          <motion.div
            key={CurrentSceneKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <CurrentScene onAdvance={advance} isActive={!transition.active} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
