import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

interface NodoChat {
  id: string;
  tipo: "pergunta" | "resposta" | "validacao";
  texto: string;
  opcoes?: Array<{ id: string; texto: string; proximo: string; xp: number }>;
  campo?: { tipo: "texto" | "area"; placeholder: string };
}

const SCRIPT: Record<string, NodoChat> = {
  inicio: {
    id: "inicio",
    tipo: "pergunta",
    texto: "Qual pensamento automático você quer examinar hoje?",
    campo: { tipo: "area", placeholder: "Ex: Vou arruinar tudo" },
  },
  situacao: {
    id: "situacao",
    tipo: "pergunta",
    texto: "Em que situação esse pensamento apareceu?",
    campo: { tipo: "area", placeholder: "Descreva o contexto" },
  },
  evidencias: {
    id: "evidencias",
    tipo: "pergunta",
    texto: "Quais evidências apoiam esse pensamento?",
    campo: { tipo: "area", placeholder: "Liste os fatos que parecem confirmar" },
  },
  contra_evidencias: {
    id: "contra_evidencias",
    tipo: "pergunta",
    texto: "Quais evidências contradizem esse pensamento?",
    campo: { tipo: "area", placeholder: "Fatos que desafiam essa crença" },
  },
  reformulacao: {
    id: "reformulacao",
    tipo: "validacao",
    texto: "Pensamento reformulado: Uma versão mais equilibrada, baseada nas evidências.",
  },
};

export default function RegistroV2() {
  const { save, complete } = useExerciseSession("registro-v2");
  const [nodoAtual, setNodoAtual] = useState("inicio");
  const [historico, setHistorico] = useState<Array<{ nodo: string; resposta: string; xp: number }>>([]);
  const [respostaAtual, setRespostaAtual] = useState("");
  const [xp, setXp] = useState(0);
  const [progresso, setProgresso] = useState(0);

  const nodo = SCRIPT[nodoAtual];
  const totalNodos = Object.keys(SCRIPT).length;

  const handleResposta = (proxNodo?: string, xpGanho?: number) => {
    if (!proxNodo) return;

    setHistorico([...historico, { nodo: nodoAtual, resposta: respostaAtual, xp: xpGanho || 10 }]);
    setXp((x) => x + (xpGanho || 10));
    setProgresso(Math.floor(((historico.length + 1) / totalNodos) * 100));

    save({
      nodos_completos: historico.length + 1,
      xp: xp + (xpGanho || 10),
      respostas: { [nodoAtual]: respostaAtual },
    });

    setNodoAtual(proxNodo);
    setRespostaAtual("");

    if (proxNodo === "reformulacao") {
      setTimeout(() => complete(xp + (xpGanho || 10)), 1500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progresso */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--c-accent)]">{progresso}% completo</span>
        <span className="text-xs font-semibold text-[var(--c-text)]">+{xp} XP</span>
      </div>

      {/* Barra de progresso */}
      <div className="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden">
        <motion.div
          animate={{ width: `${progresso}%` }}
          className="h-full bg-[var(--c-accent)]"
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Chat */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 min-h-40">
        {/* Histórico */}
        <div className="space-y-3 mb-4 max-h-24 overflow-y-auto">
          {historico.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
              <p className="text-xs font-semibold text-[var(--c-accent)]">P: {SCRIPT[h.nodo]?.texto}</p>
              <p className="text-xs text-[var(--c-muted)] bg-[var(--c-surface)] p-2 rounded line-clamp-2">
                R: {h.resposta}
              </p>
              <span className="text-[9px] font-semibold text-green-600">+{h.xp} XP</span>
            </motion.div>
          ))}
        </div>

        {/* Pergunta atual */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 border-t border-[var(--c-border)]">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-3">{nodo.texto}</p>

          {nodo.tipo === "validacao" ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--c-accent)]/10 mb-2">
                <ChevronRight size={20} className="text-[var(--c-accent)]" />
              </div>
              <p className="text-xs text-[var(--c-muted)]">Você completou o registro!</p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={respostaAtual}
                onChange={(e) => setRespostaAtual(e.target.value)}
                placeholder={nodo.campo?.placeholder}
                className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-xs text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
                rows={3}
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const proximo = nodoAtual === "inicio" ? "situacao" :
                                  nodoAtual === "situacao" ? "evidencias" :
                                  nodoAtual === "evidencias" ? "contra_evidencias" :
                                  "reformulacao";
                  handleResposta(proximo, 10);
                }}
                disabled={!respostaAtual.trim()}
                className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-xs disabled:opacity-50"
              >
                Próximo →
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
