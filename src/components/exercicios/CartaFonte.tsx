import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "carta" | "resultado";

interface Carta {
  figura: string;
  conteudo: string;
  aprendizado: string;
  [key: string]: any;
}

export default function CartaFonte() {
  const { save, complete } = useExerciseSession("carta-fonte");
  const [fase, setFase] = useState<Fase>("entrada");
  const [carta, setCarta] = useState<Carta>({ figura: "", conteudo: "", aprendizado: "" });

  const handleIniciar = () => {
    if (!carta.figura.trim()) return;
    setFase("carta");
  };

  const handleFinalizar = () => {
    if (!carta.conteudo.trim() || !carta.aprendizado.trim()) return;
    save(carta);
    complete(100);
    setFase("resultado");
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Para quem você vai escrever?
          </label>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Figura significativa que ensinou você padrões de comportamento. Pode ser pai, mãe, professor, avó, amigo, ou até uma imagem interna de si mesmo.
          </p>
          <input
            type="text"
            value={carta.figura}
            onChange={(e) => setCarta({ ...carta, figura: e.target.value })}
            placeholder="Ex: Meu pai, minha mãe, minha crítica interna"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none mb-3"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!carta.figura.trim()}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Escrever carta →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "carta") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="space-y-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-4">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Carta para {carta.figura}</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">
              Escreva diretamente. Diga o que você precisa dizer. Como você foi afetado? O que você entende agora que não entendia então?
            </p>
            <textarea
              value={carta.conteudo}
              onChange={(e) => setCarta({ ...carta, conteudo: e.target.value })}
              placeholder="Caro/a [figura]..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
              rows={6}
              autoFocus
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-4"
          >
            <label className="text-xs font-semibold text-green-600 block mb-2">O que você aprende disso?</label>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">
              Qual insight emerge dessa conversa imaginária? Como isso muda sua perspectiva?
            </p>
            <textarea
              value={carta.aprendizado}
              onChange={(e) => setCarta({ ...carta, aprendizado: e.target.value })}
              placeholder="Agora entendo que..."
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-green-600 focus:outline-none resize-none"
              rows={3}
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleFinalizar}
          disabled={!carta.conteudo.trim() || !carta.aprendizado.trim()}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
        >
          Finalizar carta
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">✉️ Carta escrita</p>
        <p className="text-sm text-[var(--c-text)] mb-4">Você disse o que precisava dizer.</p>
        <p className="text-[10px] text-[var(--c-muted)] italic">
          Próximo: discuta esta carta com seu terapeuta. Ela pode ser lida, queimada, ou guardada — você escolhe.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-lg p-4 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">CARTA PARA {carta.figura.toUpperCase()}</p>
        <p className="text-sm text-[var(--c-text)] whitespace-pre-wrap">{carta.conteudo}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-lg p-4 border-l-4"
        style={{ borderLeftColor: "#22c55e" }}
      >
        <p className="text-xs font-semibold text-green-600 mb-2">APRENDIZADO</p>
        <p className="text-sm text-[var(--c-text)]">{carta.aprendizado}</p>
      </motion.div>
    </motion.div>
  );
}
