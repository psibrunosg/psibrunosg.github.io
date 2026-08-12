import { useState } from "react";
import { motion } from "framer-motion";
import { clans, clanIds } from "@/content/naruto";
import { MangaPanel, ChakraAura, ScreenTone } from "@/components/naruto/effects";
import { useNavigate } from "react-router-dom";

export default function SceneClanSelect() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f1a16] via-[#1a1510] to-[#0a1210]" />
      <ScreenTone color="#C65C2E" dotSize={8} opacity={0.04} />

      <div className="relative z-10 min-h-full flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-[#C65C2E] font-bold mb-3">
            Escolha seu caminho ninja
          </p>
          <h2
            className="text-3xl md:text-6xl font-black text-[#e8dcc0] mb-3"
            style={{
              fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
              textShadow: "3px 3px 0 #1a1a1a",
            }}
          >
            SELECIONE UM CLÃ
          </h2>
          <p className="text-[#e8dcc0]/60 max-w-xl mx-auto text-sm md:text-base">
            Cada símbolo guarda um modo da mente. Clique para ouvir a história de quem o viveu.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5 max-w-7xl w-full">
          {clanIds.map((id, i) => {
            const clan = clans[id];
            const isHovered = hovered === id;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/psicoeducacao/naruto/${id}`)}
                  className="group w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C65C2E] rounded-xl"
                >
                  <MangaPanel
                    variant="default"
                    className={`aspect-[2/3] flex flex-col items-center justify-center p-4 transition-all duration-300 ${
                      isHovered ? "bg-[#1a1a1a]" : "bg-white"
                    }`}
                    delay={0}
                  >
                    <ChakraAura
                      color={clan.color}
                      intensity={isHovered ? "high" : "low"}
                      className="mb-4"
                    >
                      <img
                        src={clan.symbol}
                        alt=""
                        className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                        style={{ mixBlendMode: isHovered ? "screen" : "multiply" }}
                      />
                    </ChakraAura>

                    <p
                      className={`text-center font-black text-sm md:text-base uppercase transition-colors duration-300 ${
                        isHovered ? "text-[#e8dcc0]" : "text-[#1a1a1a]"
                      }`}
                      style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
                    >
                      {clan.name}
                    </p>
                    <p
                      className={`text-center text-[10px] md:text-xs mt-1 transition-colors duration-300 ${
                        isHovered ? "text-[#e8dcc0]/70" : "text-[#1a1a1a]/60"
                      }`}
                    >
                      {clan.mode}
                    </p>

                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-0 left-0 right-0 p-3 bg-[#C65C2E] text-white text-[10px] leading-tight text-center"
                      >
                        {clan.metaphor}
                      </motion.div>
                    )}
                  </MangaPanel>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
