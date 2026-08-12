import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Clan } from "@/content/naruto";
import TypewriterText from "./TypewriterText";

interface ClanStoryProps {
  clan: Clan;
}

export default function ClanStory({ clan }: ClanStoryProps) {
  const [phase, setPhase] = useState<1 | 2>(1);
  const currentPhase = phase === 1 ? clan.phase1 : clan.phase2;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${clan.color}15 0%, #0f1a16 60%, #0a1210 100%)`,
      }}
    >
      {/* Header */}
      <header className="relative z-10 px-4 md:px-8 py-6 flex items-center justify-between">
        <Link
          to="/psicoeducacao/naruto"
          className="inline-flex items-center gap-2 text-sm text-[#e8dcc0]/80 hover:text-[#e8dcc0] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E] rounded px-2 py-1"
        >
          <ArrowLeft size={16} />
          Voltar à Vila
        </Link>
        <div className="text-right">
          <p className="text-xs text-[#e8dcc0]/60 uppercase tracking-wider">Clã {clan.name}</p>
          <p className="text-sm font-semibold" style={{ color: clan.color }}>
            {clan.mode}
          </p>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Personagem */}
        <div
          className="flex-shrink-0 w-48 h-64 md:w-64 md:h-80 rounded-3xl border-4 flex flex-col items-center justify-center text-center p-4 shadow-2xl overflow-hidden"
          style={{
            borderColor: clan.color,
            background: `linear-gradient(180deg, ${clan.color}30 0%, #0f1a16 100%)`,
          }}
          aria-hidden="true"
        >
          <img
            src={phase === 1 ? clan.characterYoungImage : clan.characterMatureImage}
            alt=""
            className="w-36 h-44 md:w-48 md:h-56 object-contain mb-3"
            loading="lazy"
          />
          <p className="text-[#e8dcc0] font-semibold text-sm md:text-base">
            {phase === 1 ? clan.characterYoung : clan.characterMature}
          </p>
          <p className="text-[#e8dcc0]/60 text-xs mt-1">
            {phase === 1 ? "Naruto Clássico" : "Naruto Shippuden"}
          </p>
        </div>

        {/* Narração */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `${clan.color}25`,
                color: clan.color,
              }}
            >
              {currentPhase.label}
            </span>
            <span className="text-xs text-[#e8dcc0]/50">
              Fase {phase} de 2
            </span>
          </div>

          <div
            className="relative bg-[#1a1a1a]/80 border border-[#e8dcc0]/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
            style={{ minHeight: "240px" }}
          >
            <TypewriterText
              key={`${clan.id}-${phase}`}
              text={currentPhase.text}
              speed={26}
              className="text-base md:text-lg leading-relaxed text-[#f5f0e6] whitespace-pre-line font-medium"
            />
          </div>

          {/* Controles de fase */}
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => setPhase(1)}
              disabled={phase === 1}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#e8dcc0] border border-[#e8dcc0]/20 hover:border-[#e8dcc0]/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E]"
            >
              Fase 1
            </button>
            <button
              type="button"
              onClick={() => setPhase(2)}
              disabled={phase === 2}
              className="px-4 py-2 rounded-full text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1a16] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: clan.color }}
            >
              {phase === 1 ? "Avançar no tempo" : "Você chegou ao fim"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
