import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";

export interface FlashcardItem {
  id: string;
  frente: string;
  verso: string;
}

interface FlashcardsProps {
  cartas: FlashcardItem[];
  onFinalizar?: (totalAcertos: number, totalCartas: number) => void;
}

export default function Flashcards({ cartas, onFinalizar }: FlashcardsProps) {
  const reduced = useReducedMotion();
  const [fila, setFila] = useState<FlashcardItem[]>(cartas);
  const [indice, setIndice] = useState(0);
  const [virada, setVirada] = useState(false);
  const [erradas, setErradas] = useState<FlashcardItem[]>([]);
  const [acertosTotais, setAcertosTotais] = useState(0);
  const [rodadaExtra, setRodadaExtra] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const carta = fila[indice];
  const restantes = fila.length - indice;

  // Guarda contra cliques duplicados na mesma carta (ex.: um handler antigo
  // que não desmontou a tempo por algum motivo) — sem isso, um duplo clique
  // poderia avançar o índice duas vezes e estourar os limites do array.
  const ultimaProcessadaRef = useRef<string | null>(null);

  const avancar = (acertou: boolean, cartaAtual: FlashcardItem) => {
    const chave = `${indice}:${cartaAtual.id}`;
    if (ultimaProcessadaRef.current === chave) return;
    ultimaProcessadaRef.current = chave;

    if (acertou) setAcertosTotais((a) => a + 1);
    else setErradas((prev) => [...prev, cartaAtual]);

    if (indice + 1 < fila.length) {
      setIndice((i) => i + 1);
      setVirada(false);
    } else if (!rodadaExtra && erradas.length + (acertou ? 0 : 1) > 0) {
      // repete as erradas ao final do deck
      const proximasErradas = acertou ? erradas : [...erradas, cartaAtual];
      if (proximasErradas.length > 0) {
        setFila(proximasErradas);
        setErradas([]);
        setIndice(0);
        setVirada(false);
        setRodadaExtra(true);
        return;
      }
      setFinalizado(true);
      onFinalizar?.(acertosTotais + (acertou ? 1 : 0), cartas.length);
    } else {
      setFinalizado(true);
      onFinalizar?.(acertosTotais + (acertou ? 1 : 0), cartas.length);
    }
  };

  const reiniciar = () => {
    setFila(cartas);
    setIndice(0);
    setVirada(false);
    setErradas([]);
    setAcertosTotais(0);
    setRodadaExtra(false);
    setFinalizado(false);
  };

  if (finalizado) {
    return (
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 text-center"
      >
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-2">
          Deck concluído
        </p>
        <p className="text-sm text-[var(--c-muted)] max-w-sm mx-auto mb-6">
          Você revisou {cartas.length} cartas. Repetir esses padrões de tempos em tempos ajuda a reconhecê-los mais rápido no dia a dia.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={reiniciar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
        >
          <RotateCcw size={16} />
          Revisar de novo
        </motion.button>
      </motion.div>
    );
  }

  if (!carta) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-[var(--c-muted)]">
          {rodadaExtra ? "Revisando as que errou" : "Carta"} {indice + 1} de {fila.length}
        </span>
        <span className="text-xs text-[var(--c-muted)]">Restam {restantes}</span>
      </div>

      <div className="[perspective:1200px]" style={{ height: 220 }}>
        <motion.div
          className="relative w-full h-full cursor-pointer [transform-style:preserve-3d]"
          onClick={() => setVirada((v) => !v)}
          animate={{ rotateY: virada ? 180 : 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div
            className="absolute inset-0 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] flex items-center justify-center p-6 text-center [backface-visibility:hidden]"
          >
            <p className="text-lg md:text-xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              {carta.frente}
            </p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl border border-[var(--c-accent)]/40 bg-[var(--c-accent)]/5 flex items-center justify-center p-6 text-center [backface-visibility:hidden] whitespace-pre-line"
            style={{ transform: "rotateY(180deg)" }}
          >
            <p className="text-sm text-[var(--c-text)] leading-relaxed">{carta.verso}</p>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-xs text-[var(--c-muted)] mt-3">Toque na carta para virar</p>

      {/* Sem AnimatePresence aqui de propósito (mesmo motivo do QuizEngine):
          os botões precisam sumir/aparecer de forma instantânea e confiável,
          sem depender de uma animação de saída terminar. */}
      {virada && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-3 mt-5"
        >
          <button
            onClick={() => avancar(false, carta)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-red-600/40 text-red-600 font-semibold text-sm hover:bg-red-600/10 transition-colors"
          >
            <X size={16} /> Errei
          </button>
          <button
            onClick={() => avancar(true, carta)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            <Check size={16} /> Acertei
          </button>
        </motion.div>
      )}
    </div>
  );
}
