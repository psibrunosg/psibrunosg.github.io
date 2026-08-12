import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { SceneProps } from "./SceneEngine";
import { ScreenTone } from "@/components/naruto/effects";

export default function SceneOpening({ onAdvance }: SceneProps) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background parallax */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a2e2a 0%, #0f1a16 60%, #0a1210 100%)",
        }}
      >
        <img
          src="/naruto/generated/background.png"
          alt=""
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1a16]/50 to-[#0f1a16]" />
      </div>

      {/* Folhas caindo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${(i * 11) % 100}%`,
              top: `-10%`,
              width: `${8 + (i % 6)}px`,
              height: `${6 + (i % 5)}px`,
              background: i % 3 === 0 ? "#f6ad55" : i % 3 === 1 ? "#c05621" : "#d69e2e",
            }}
            animate={{
              y: ["0vh", "120vh"],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <ScreenTone color="#ffffff" dotSize={8} opacity={0.06} />

      {/* Título estilo anime */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm tracking-[0.4em] uppercase text-[#e8dcc0]/70 mb-4"
        >
          Psicoeducação
        </motion.p>

        <h1
          className="text-6xl md:text-9xl font-black text-[#C65C2E] mb-2"
          style={{
            fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            textShadow:
              "4px 4px 0 #1a1a1a, 8px 8px 0 rgba(0,0,0,0.3), 0 0 40px rgba(198,92,46,0.5)",
            WebkitTextStroke: "2px #1a1a1a",
          }}
        >
          NARUTO
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-2xl text-[#e8dcc0] font-semibold tracking-wide"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Vila da Folha
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm md:text-base text-[#e8dcc0]/60 mt-4 max-w-md mx-auto"
        >
          Uma jornada pelos modos da mente, contada pelos ninjas que já os conheceram de perto.
        </motion.p>
      </motion.div>

      {/* Botão iniciar */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        type="button"
        onClick={onAdvance}
        className="relative z-10 mt-12 inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#C65C2E] text-white text-base font-bold border-4 border-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a] hover:shadow-[2px_2px_0_0_#1a1a1a] hover:translate-x-[2px] hover:translate-y-[2px] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
      >
        Iniciar jornada
        <ChevronRight size={20} />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 mt-4 text-xs text-[#e8dcc0]/40"
      >
        Clique para começar o episódio
      </motion.p>
    </div>
  );
}
