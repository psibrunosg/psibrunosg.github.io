import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { ChatScript, ChatHistorico } from "@/lib/chatEngine";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const SCRIPT_GPS: ChatScript = {
  inicio: {
    id: "inicio",
    tipo: "pergunta",
    texto: "Qual decisão você está enfrentando?",
    campo: { tipo: "area", placeholder: "Descreva a situação..." },
  },
  curto_vs_longo: {
    id: "curto_vs_longo",
    tipo: "pergunta",
    texto: "Essa decisão impacta mais no curto ou longo prazo?",
    opcoes: [
      { id: "curto", texto: "Curto prazo (dias/semanas)", proxNodo: "custos" },
      { id: "longo", texto: "Longo prazo (meses/anos)", proxNodo: "custos" },
      { id: "ambos", texto: "Ambos igualmente", proxNodo: "custos" },
    ],
  },
  custos: {
    id: "custos",
    tipo: "pergunta",
    texto: "Há custos irrecuperáveis? (Dinheiro/tempo já gasto que não volta)",
    opcoes: [
      { id: "sim_custos", texto: "Sim, muito", proxNodo: "humor" },
      { id: "nao_custos", texto: "Não", proxNodo: "humor" },
      { id: "talvez", texto: "Não tenho certeza", proxNodo: "humor" },
    ],
  },
  humor: {
    id: "humor",
    tipo: "pergunta",
    texto: "Como está seu humor/energia AGORA?",
    opcoes: [
      { id: "otimo", texto: "Ótimo, claro", proxNodo: "perdas" },
      { id: "neutro", texto: "Neutro", proxNodo: "perdas" },
      { id: "pessimo", texto: "Péssimo, cansado", proxNodo: "perdas" },
    ],
  },
  perdas: {
    id: "perdas",
    tipo: "pergunta",
    texto: "Se escolher A: quais as perdas? Se escolher B: quais as perdas?",
    campo: { tipo: "area", placeholder: "Perdas em A: ...\nPerdas em B: ..." },
  },
  arrependimento: {
    id: "arrependimento",
    tipo: "pergunta",
    texto: "Em 1 ano, qual escolha você menos vai lamentar?",
    opcoes: [
      { id: "a_futuro", texto: "Escolher A", proxNodo: "fim" },
      { id: "b_futuro", texto: "Escolher B", proxNodo: "fim" },
      { id: "ambas_futuro", texto: "Nenhuma das duas", proxNodo: "fim" },
    ],
  },
  fim: {
    id: "fim",
    tipo: "fim",
    texto: "Decisão mapeada. Converse com seu terapeuta sobre próximos passos.",
  },
};

export default function GPSDecisoes() {
  const { save, complete } = useExerciseSession("gps-decisoes");
  const [nodoAtual, setNodoAtual] = useState("inicio");
  const [historico, setHistorico] = useState<ChatHistorico[]>([]);
  const [respostaAtual, setRespostaAtual] = useState("");
  const [xp, setXp] = useState(0);
  const [progresso, setProgresso] = useState(0);

  const nodo = SCRIPT_GPS[nodoAtual];
  const totalNodos = Object.keys(SCRIPT_GPS).length - 1; // sem "fim"

  const handleResposta = (proxNodo?: string) => {
    if (!proxNodo) return;

    setHistorico([...historico, { nodo: nodoAtual, resposta: respostaAtual, xp: 10 }]);
    setXp((x) => x + 10);
    setProgresso(Math.floor(((historico.length + 1) / totalNodos) * 100));

    save({
      nodos_completos: historico.length + 1,
      xp: xp + 10,
      respostas: { [nodoAtual]: respostaAtual },
    });

    setNodoAtual(proxNodo);
    setRespostaAtual("");

    if (proxNodo === "fim") {
      setTimeout(() => complete(xp + 10), 1500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progresso */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--c-accent)]">{progresso}% completo</span>
        <span className="text-xs font-semibold text-[var(--c-text)]">+{xp} XP</span>
      </div>

      <div className="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden">
        <motion.div animate={{ width: `${progresso}%` }} className="h-full bg-[var(--c-accent)]" transition={{ duration: 0.5 }} />
      </div>

      {/* Chat */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 min-h-48">
        {/* Histórico */}
        <div className="space-y-2 mb-4 max-h-20 overflow-y-auto">
          {historico.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px]">
              <p className="font-semibold text-[var(--c-accent)]">P: {SCRIPT_GPS[h.nodo]?.texto?.slice(0, 40)}</p>
              <p className="text-[var(--c-muted)]">R: {h.resposta.slice(0, 50)}</p>
            </motion.div>
          ))}
        </div>

        {/* Pergunta atual */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2 border-t border-[var(--c-border)]">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-3">{nodo.texto}</p>

          {nodo.tipo === "fim" ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-4">
              <p className="text-xs text-green-600 font-semibold mb-2">✅ Mapeamento completo!</p>
            </motion.div>
          ) : nodo.opcoes ? (
            <div className="space-y-2">
              {nodo.opcoes.map((op, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResposta(op.proxNodo)}
                  className="w-full p-2 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] text-[var(--c-text)] text-xs font-semibold hover:border-[var(--c-accent)] transition-all"
                >
                  {op.texto}
                </motion.button>
              ))}
            </div>
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
                onClick={() => handleResposta("fim")}
                disabled={!respostaAtual.trim()}
                className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-xs disabled:opacity-50 flex items-center justify-center gap-1"
              >
                Próximo <ChevronRight size={14} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
