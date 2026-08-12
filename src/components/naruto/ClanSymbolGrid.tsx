import { Link } from "react-router-dom";
import { clans, clanIds } from "@/content/naruto";

export default function ClanSymbolGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
      {clanIds.map((id) => {
        const clan = clans[id];
        return (
          <Link
            key={id}
            to={`/psicoeducacao/naruto/${id}`}
            className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl border border-[#e8dcc0]/20 bg-[#0f1a16]/60 backdrop-blur-sm hover:border-[#e8dcc0]/50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C65C2E]"
          >
            <div
              className="naruto-symbol w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ color: clan.color }}
            >
              <img
                src={clan.symbol}
                alt=""
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <p className="text-[#e8dcc0] font-semibold text-sm md:text-base" style={{ fontFamily: "var(--font-heading)" }}>
                {clan.name}
              </p>
              <p className="text-[#e8dcc0]/70 text-xs mt-0.5">{clan.mode}</p>
            </div>

            {/* Tooltip da metáfora */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#1a1a1a]/95 text-[#e8dcc0] text-xs leading-relaxed opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-20 hidden md:block">
              {clan.metaphor}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]/95" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
