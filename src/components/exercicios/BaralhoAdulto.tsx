import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DISTORCOES_ADULTO = [
  { id: 1, nome: "O Promotor", descricao: "Crítico interno", arquetipo: "Voz acusatória", exemplo: "Fracassou novamente, é incompetente" },
  { id: 2, nome: "A Vidente", descricao: "Lê mentes, prevê desastres", arquetipo: "Futurologa alarmista", exemplo: "Todos vão descobrir que sou fraudador" },
  { id: 3, nome: "O Juiz", descricao: "Avalia tudo como certo/errado", arquetipo: "Magistrado severo", exemplo: "Uma apresentação menor que perfeita = fracasso total" },
  { id: 4, nome: "O Catastrofista", descricao: "Amplifica piores resultados", arquetipo: "Pessimista apocalíptico", exemplo: "Um erro na reunião vai arruinar minha carreira" },
  { id: 5, nome: "O Personalista", descricao: "Tudo é sobre mim", arquetipo: "Centro do universo", exemplo: "Eles não riram da piada = culpa minha" },
  { id: 6, nome: "O Absolutista", descricao: "Preto ou branco", arquetipo: "Perfeccionista", exemplo: "Ou sou melhor que todos ou sou um fracasso" },
];

type Modo = "explorar" | "jogo";

export default function BaralhoAdulto() {
  const [modo, setModo] = useState<Modo>("explorar");
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [score, setScore] = useState(0);

  const distorcao = DISTORCOES_ADULTO[indiceAtual];

  const proximo = () => {
    if (indiceAtual < DISTORCOES_ADULTO.length - 1) {
      setIndiceAtual(indiceAtual + 1);
    }
  };

  const anterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual(indiceAtual - 1);
    }
  };

  const handleAcertou = () => {
    setScore((s) => s + 10);
    proximo();
  };

  return (
    <div className="space-y-4">
      {/* Botões de modo */}
      <div className="flex gap-2 mb-4">
        {(["explorar", "jogo"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setModo(m);
              setIndiceAtual(0);
              setScore(0);
            }}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              modo === m
                ? "bg-[var(--c-accent)] text-white"
                : "bg-[var(--c-border)] text-[var(--c-text)] hover:bg-[var(--c-accent)]/20"
            }`}
          >
            {m === "explorar" ? "📖 Explorar" : "🎮 Jogo"}
          </button>
        ))}
      </div>

      {/* Carta */}
      <motion.div
        key={indiceAtual}
        initial={{ opacity: 0, rotateY: 90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl p-8 min-h-80 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-[var(--c-text)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                {distorcao.nome}
              </h2>
              <p className="text-xs text-[var(--c-accent)] font-semibold">{distorcao.arquetipo}</p>
            </div>
            <span className="text-3xl">👤</span>
          </div>

          <p className="text-[var(--c-muted)] mb-4">{distorcao.descricao}</p>

          {modo === "explorar" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--c-bg)]/60 rounded-lg p-4 mt-4">
              <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">Exemplo corporativo:</p>
              <p className="text-sm text-[var(--c-text)]">"{distorcao.exemplo}"</p>
            </motion.div>
          )}
        </div>

        {modo === "jogo" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-xs text-[var(--c-muted)]">Essa distorção é: <strong>{distorcao.nome}</strong> ?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setScore((s) => Math.max(0, s - 5));
                  proximo();
                }}
                className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-600 font-semibold text-xs hover:bg-red-500/30"
              >
                Não
              </button>
              <button onClick={handleAcertou} className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-600 font-semibold text-xs hover:bg-green-500/30">
                Sim ✓
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={anterior}
          disabled={indiceAtual === 0}
          className="p-2 rounded-lg border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)] disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <p className="text-xs text-[var(--c-muted)]">
            {indiceAtual + 1}/{DISTORCOES_ADULTO.length}
          </p>
          {modo === "jogo" && <p className="text-sm font-bold text-[var(--c-accent)]">+{score} XP</p>}
        </div>

        <button
          onClick={proximo}
          disabled={indiceAtual === DISTORCOES_ADULTO.length - 1}
          className="p-2 rounded-lg border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)] disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
