import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "escavacao" | "resultado";

interface Camada {
  profundidade: number;
  pergunta: string;
  resposta: string;
}

const SCRIPT_ESCAVACAO = {
  inicio: "Qual pensamento negativo você quer explorar? Quanto mais fundo cavamos, mais a verdade emerge.",
  perguntas: [
    "Se isso fosse verdade, o que significaria sobre você?",
    "Qual seria a pior consequência dessa verdade?",
    "Como isso afetaria sua vida?",
    "Que crença sobre você seria confirmada?",
    "Qual medo profundo emergiria?",
  ],
};

export default function AEscavacao() {
  const { save, complete } = useExerciseSession("escavacao");
  const [fase, setFase] = useState<Fase>("entrada");
  const [pensamento, setPensamento] = useState("");
  const [camadas, setCamadas] = useState<Camada[]>([]);
  const [cavaIdx, setCavaIdx] = useState(0);
  const [respostaAtual, setRespostaAtual] = useState("");

  const handleIniciar = () => {
    if (!pensamento.trim()) return;
    setFase("escavacao");
  };

  const handleResponder = (resposta: string) => {
    const novaCamada: Camada = {
      profundidade: cavaIdx,
      pergunta: SCRIPT_ESCAVACAO.perguntas[cavaIdx],
      resposta,
    };
    setCamadas([...camadas, novaCamada]);
    save({ pensamento, camadas: [...camadas, novaCamada] });
    setRespostaAtual("");

    if (cavaIdx < SCRIPT_ESCAVACAO.perguntas.length - 1) {
      setCavaIdx(cavaIdx + 1);
    } else {
      setFase("resultado");
      complete(100);
    }
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Qual pensamento você quer explorar?
          </label>
          <textarea
            value={pensamento}
            onChange={(e) => setPensamento(e.target.value)}
            placeholder="Ex: Nunca vou ser bom o suficiente"
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
            rows={3}
          />
          <p className="text-[10px] text-[var(--c-muted)] mt-2">{SCRIPT_ESCAVACAO.inicio}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            disabled={!pensamento.trim()}
            className="mt-3 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
          >
            Cavar fundo →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "escavacao") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1 bg-[var(--c-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--c-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((cavaIdx + 1) / SCRIPT_ESCAVACAO.perguntas.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--c-muted)]">
            {cavaIdx + 1}/{SCRIPT_ESCAVACAO.perguntas.length}
          </span>
        </div>

        <div className="space-y-3">
          {camadas.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-xl p-3 border-l-4"
              style={{ borderLeftColor: "var(--c-accent)" }}
            >
              <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-1">Camada {i + 1}</p>
              <p className="text-xs text-[var(--c-muted)] mb-2">{c.pergunta}</p>
              <p className="text-sm text-[var(--c-text)] font-semibold italic">"{c.resposta}"</p>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 mt-6">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-4">
            {SCRIPT_ESCAVACAO.perguntas[cavaIdx]}
          </p>
          <textarea
            value={respostaAtual}
            onChange={(e) => setRespostaAtual(e.target.value)}
            placeholder="Sua resposta..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey && respostaAtual.trim()) {
                handleResponder(respostaAtual.trim());
              }
            }}
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-3 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none mb-3"
            rows={2}
            aria-label="Resposta da camada atual"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (respostaAtual.trim()) handleResponder(respostaAtual.trim());
            }}
            disabled={!respostaAtual.trim()}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cavaIdx < SCRIPT_ESCAVACAO.perguntas.length - 1 ? "Próxima camada" : "Ver resultado"} <ChevronDown size={14} />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">⛏️ Escavação completa</p>
        <p className="text-xs text-[var(--c-muted)] mb-4">Camadas exploradas: {camadas.length}</p>
        <p className="text-sm text-[var(--c-text)] font-semibold mb-4">
          "Pensamento original: <span className="italic">{pensamento}</span>"
        </p>
        <p className="text-[10px] text-[var(--c-muted)] italic">
          Discussão desta escavação com seu terapeuta pode revelar crenças-núcleo e oportunidades de reformulação.
        </p>
      </div>

      <div className="space-y-2">
        {camadas.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-lg p-3"
          >
            <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-1">Camada {i + 1}</p>
            <p className="text-xs text-[var(--c-muted)] mb-1">{c.pergunta}</p>
            <p className="text-sm text-[var(--c-text)]">"{c.resposta}"</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
