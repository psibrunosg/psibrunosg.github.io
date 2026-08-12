import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { Clan } from "@/content/naruto";
import TypewriterText from "./TypewriterText";
import {
  MangaPanel,
  SpeedLines,
  ScreenTone,
  ChakraAura,
  Onomatopoeia,
} from "@/components/naruto/effects";

interface ClanStoryProps {
  clan: Clan;
}

export default function ClanStory({ clan }: ClanStoryProps) {
  const [phase, setPhase] = useState<1 | 2>(1);
  const currentPhase = phase === 1 ? clan.phase1 : clan.phase2;
  const isPhase1 = phase === 1;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background atmosférico */}
      <div
        className="fixed inset-0 transition-colors duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 20%, ${clan.color}20 0%, #0f1a16 60%, #0a1210 100%)`,
        }}
      />
      <ScreenTone color={clan.color} dotSize={8} opacity={0.05} />

      {/* Header */}
      <header className="relative z-20 px-4 md:px-8 py-5 flex items-center justify-between">
        <Link
          to="/psicoeducacao/naruto"
          className="inline-flex items-center gap-2 text-sm text-[#e8dcc0]/80 hover:text-[#e8dcc0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E] rounded px-2 py-1"
        >
          <ArrowLeft size={16} />
          Voltar à Vila
        </Link>
        <div className="text-right">
          <p className="text-xs text-[#e8dcc0]/60 uppercase tracking-wider">Clã {clan.name}</p>
          <p className="text-sm font-black" style={{ color: clan.color }}>
            {clan.mode}
          </p>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pb-20">
        {/* Introdução dramática */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <ChakraAura color={clan.color} intensity="medium">
            <img
              src={clan.symbol}
              alt=""
              className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-4"
              style={{ mixBlendMode: "screen" }}
            />
          </ChakraAura>
          <h1
            className="text-5xl md:text-8xl font-black text-[#e8dcc0] mb-2"
            style={{
              fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
              textShadow: `0 0 30px ${clan.color}60, 4px 4px 0 #1a1a1a`,
            }}
          >
            {clan.name}
          </h1>
          <p className="text-[#e8dcc0]/70 text-sm md:text-lg max-w-xl mx-auto">
            {clan.metaphor}
          </p>
        </motion.div>

        {/* Layout de episódio em painéis */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-stretch">
          {/* Painel do personagem */}
          <MangaPanel
            variant="tilted"
            className="md:col-span-5 min-h-[360px] md:min-h-[520px] flex flex-col p-1"
            delay={0.2}
          >
            <div
              className="relative flex-1 rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                background: `linear-gradient(180deg, ${clan.color}30 0%, #0f1a16 100%)`,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <ChakraAura color={clan.color} intensity={isPhase1 ? "low" : "high"}>
                    <img
                      src={isPhase1 ? clan.characterYoungImage : clan.characterMatureImage}
                      alt=""
                      className="w-48 h-56 md:w-64 md:h-72 object-contain drop-shadow-2xl"
                    />
                  </ChakraAura>

                  <div className="mt-4 text-center">
                    <p className="text-[#e8dcc0] font-bold text-base md:text-lg">
                      {isPhase1 ? clan.characterYoung : clan.characterMature}
                    </p>
                    <p className="text-[#e8dcc0]/50 text-xs mt-1">
                      {isPhase1 ? "Naruto Clássico" : "Naruto Shippuden"}
                    </p>
                  </div>

                  {!isPhase1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 right-4"
                    >
                      <Onomatopoeia text="DON!" color={clan.color} />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              <ScreenTone color="#000000" dotSize={5} opacity={0.08} />
            </div>
          </MangaPanel>

          {/* Painel de narração */}
          <MangaPanel
            variant="burst"
            className="md:col-span-7 min-h-[360px] md:min-h-[520px] flex flex-col p-6 md:p-8"
            delay={0.35}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                style={{
                  background: `${clan.color}25`,
                  color: clan.color,
                }}
              >
                {currentPhase.label}
              </span>
              <span className="text-xs text-[#1a1a1a]/40 font-bold">
                ATO {phase} DE 2
              </span>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${clan.id}-${phase}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.35 }}
                >
                  <TypewriterText
                    text={currentPhase.text}
                    speed={24}
                    className="text-base md:text-lg leading-relaxed text-[#1a1a1a] whitespace-pre-line font-medium"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t-2 border-dashed border-[#1a1a1a]/20">
              <button
                type="button"
                onClick={() => setPhase(1)}
                disabled={isPhase1}
                className="px-4 py-2 rounded-full text-sm font-bold text-[#1a1a1a] border-2 border-[#1a1a1a] hover:bg-[#1a1a1a]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E]"
              >
                Ato 1 — Flashback
              </button>
              <button
                type="button"
                onClick={() => setPhase(2)}
                disabled={!isPhase1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white border-2 border-[#1a1a1a] shadow-[3px_3px_0_0_#1a1a1a] hover:shadow-[1px_1px_0_0_#1a1a1a] hover:translate-x-[1px] hover:translate-y-[1px] transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                style={{ background: clan.color }}
              >
                {isPhase1 ? "Avançar no tempo" : "Transformação completa"}
                <ChevronRight size={16} />
              </button>
            </div>
          </MangaPanel>
        </div>
      </main>

      <SpeedLines color={clan.color} density={20} className="opacity-10" />
    </div>
  );
}
