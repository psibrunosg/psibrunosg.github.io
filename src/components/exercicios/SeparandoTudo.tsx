import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";
import { cenasSeparando, type CaixaTipo } from "@/content/trilhaInfantil";

// Leahy 2.1 — Distinção entre eventos, pensamentos e sentimentos.
// Mecânica: classificar 3 cartas de cada cena em Fato / Pensamento / Sentimento
// (mesma mecânica de classificação da Balança de Evidências, já validada com pacientes).

const CAIXAS: Array<{ id: CaixaTipo; rotulo: string; emoji: string; cor: string }> = [
  { id: "fato", rotulo: "Aconteceu de verdade", emoji: "📷", cor: "var(--c-accent)" },
  { id: "pensamento", rotulo: "Minha cabeça pensou", emoji: "💭", cor: "var(--c-warm)" },
  { id: "sentimento", rotulo: "Meu corpo sentiu", emoji: "❤️", cor: "var(--c-moss-dk)" },
];

export default function SeparandoTudo() {
  const { complete } = useExerciseSession("separando-tudo");
  const [cenaIdx, setCenaIdx] = useState(0);
  const [cartaIdx, setCartaIdx] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [fim, setFim] = useState(false);

  const cena = cenasSeparando[cenaIdx];
  const carta = cena?.cartas[cartaIdx];

  const escolher = (tipo: CaixaTipo) => {
    if (!carta || feedback !== null) return;
    const correto = tipo === carta.tipo;
    if (correto) setAcertos((a) => a + 1);
    setFeedback(correto);
  };

  const proxima = () => {
    setFeedback(null);
    if (cartaIdx + 1 < cena.cartas.length) {
      setCartaIdx((i) => i + 1);
      return;
    }
    if (cenaIdx + 1 < cenasSeparando.length) {
      setCenaIdx((i) => i + 1);
      setCartaIdx(0);
      return;
    }
    setFim(true);
    const total = cenasSeparando.reduce((n, c) => n + c.cartas.length, 0);
    complete(Math.round((acertos / total) * 100));
  };

  const reiniciar = () => {
    setCenaIdx(0);
    setCartaIdx(0);
    setAcertos(0);
    setFeedback(null);
    setFim(false);
  };

  if (fim) {
    const total = cenasSeparando.reduce((n, c) => n + c.cartas.length, 0);
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-8 text-center space-y-4">
        <Sparkles size={40} className="mx-auto text-[var(--c-accent)]" aria-hidden />
        <h2 className="text-xl font-semibold text-[var(--c-text)]">Você separou tudo!</h2>
        <p className="text-sm text-[var(--c-muted)]">
          Acertou <strong>{acertos}/{total}</strong> cartas.
        </p>
        <p className="text-sm text-[var(--c-text)] italic">
          O fato é o que uma câmera filmaria. O pensamento é a explicação que a cabeça inventa. E o sentimento vem do pensamento — não do fato em si!
        </p>
        <button onClick={reiniciar} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
          <RotateCcw size={16} aria-hidden /> Jogar de novo
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4 text-center">
        <p className="text-[10px] font-semibold text-[var(--c-accent)] uppercase tracking-wider mb-1">
          Cena {cenaIdx + 1} de {cenasSeparando.length}
        </p>
        <span className="text-3xl" aria-hidden>{cena.emoji}</span>
        <p className="text-sm font-semibold text-[var(--c-text)] mt-2">{cena.situacao}</p>
      </div>

      <AnimatePresence mode="wait">
        {carta && (
          <motion.div key={`${cenaIdx}-${cartaIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="glass-card rounded-2xl p-6">
            <p className="text-[10px] font-semibold text-[var(--c-accent)] uppercase tracking-wider mb-2">
              Carta {cartaIdx + 1} de {cena.cartas.length} — isso é fato, pensamento ou sentimento?
            </p>
            <p className="text-base font-semibold text-[var(--c-text)] mb-4">"{carta.texto}"</p>

            {feedback === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CAIXAS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => escolher(c.id)}
                    aria-label={`Classificar como: ${c.rotulo}`}
                    className="flex flex-col items-center gap-1 px-3 py-4 rounded-xl border border-[var(--c-border)] text-xs font-semibold text-[var(--c-text)] hover:border-current transition-colors"
                    style={{ color: c.cor }}
                  >
                    <span className="text-xl" aria-hidden>{c.emoji}</span>
                    {c.rotulo}
                  </button>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <p className={`text-sm font-semibold ${feedback ? "text-[var(--c-moss-dk)]" : "text-[var(--c-accent)]"}`}>
                  {feedback ? "✓ Isso mesmo!" : "✗ Quase — era outra caixa."}
                </p>
                <button onClick={proxima} className="w-full py-3 rounded-lg bg-[var(--c-accent)] text-white font-semibold">
                  {cartaIdx + 1 >= cena.cartas.length && cenaIdx + 1 >= cenasSeparando.length ? "Ver resultado" : "Próxima carta"}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
