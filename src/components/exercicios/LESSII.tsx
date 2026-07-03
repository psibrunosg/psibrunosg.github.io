import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "questionario" | "resultado";

const ESCAMAS = [
  { nome: "Abandono", cor: "#dc2626" },
  { nome: "Desconfiança", cor: "#f59e0b" },
  { nome: "Inadequação", cor: "#eab308" },
  { nome: "Dependência", cor: "#3b82f6" },
  { nome: "Rigidez", cor: "#8b5cf6" },
];

const ITENS = [
  { id: 1, texto: "Tenho medo de ser deixado sozinho", escala: "Abandono" },
  { id: 2, texto: "As pessoas não são confiáveis", escala: "Desconfiança" },
  { id: 3, texto: "Não sou bom o suficiente", escala: "Inadequação" },
  { id: 4, texto: "Preciso de alguém para me guiar", escala: "Dependência" },
  { id: 5, texto: "Devo ser perfeito", escala: "Rigidez" },
  { id: 6, texto: "Se contar meus problemas, vão me rejeitar", escala: "Abandono" },
  { id: 7, texto: "As pessoas têm segundas intenções", escala: "Desconfiança" },
  { id: 8, texto: "Nunca vou ter sucesso", escala: "Inadequação" },
  { id: 9, texto: "Sozinho, vou fracassar", escala: "Dependência" },
  { id: 10, texto: "Erros são inaceitáveis", escala: "Rigidez" },
];

export default function LESSII() {
  const { save, complete } = useExerciseSession("less-ii");
  const [fase, setFase] = useState<Fase>("questionario");
  const [respostas, setRespostas] = useState<{ [key: number]: number }>({});
  const [itemIdx, setItemIdx] = useState(0);

  const handleResposta = (valor: number) => {
    const novasRespostas = { ...respostas, [ITENS[itemIdx].id]: valor };
    setRespostas(novasRespostas);

    if (itemIdx < ITENS.length - 1) {
      setItemIdx(itemIdx + 1);
    } else {
      save(novasRespostas);
      calcularEscores(novasRespostas);
      complete(100);
      setFase("resultado");
    }
  };

  const calcularEscores = (resp: { [key: number]: number }) => {
    const scores: { [key: string]: number } = {};
    ESCAMAS.forEach((e) => {
      scores[e.nome] = 0;
    });
    ITENS.forEach((item) => {
      if (resp[item.id]) {
        scores[item.escala] += resp[item.id];
      }
    });
  };

  const getEscoresAtuais = () => {
    const scores: { [key: string]: number } = {};
    ESCAMAS.forEach((e) => {
      scores[e.nome] = 0;
    });
    ITENS.forEach((item) => {
      if (respostas[item.id]) {
        scores[item.escala] += respostas[item.id];
      }
    });
    return scores;
  };

  if (fase === "questionario") {
    const item = ITENS[itemIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1 bg-[var(--c-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--c-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((itemIdx + 1) / ITENS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--c-muted)]">
            {itemIdx + 1}/{ITENS.length}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-6 leading-relaxed">{item.texto}</p>

          <div className="space-y-2 mb-6">
            {[1, 2, 3, 4, 5, 6].map((score) => (
              <motion.button
                key={score}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResposta(score)}
                className={`w-full p-3 rounded-lg text-sm font-semibold transition-all ${
                  respostas[item.id] === score
                    ? "bg-[var(--c-accent)] text-white"
                    : "bg-[var(--c-surface)] text-[var(--c-text)] border border-[var(--c-border)]"
                }`}
              >
                {score === 1 ? "Discordo totalmente" : score === 6 ? "Concordo totalmente" : `${score}`}
              </motion.button>
            ))}
          </div>

          <p className="text-[10px] text-[var(--c-muted)] italic">
            Escala de 1 (discordo) a 6 (concordo totalmente). Sem respostas certas.
          </p>
        </div>
      </motion.div>
    );
  }

  const escores = getEscoresAtuais();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">📊 Mapa de esquemas ativados</p>
        <p className="text-[10px] text-[var(--c-muted)]">Seus esquemas núcleo mais ativos neste momento:</p>
      </div>

      <div className="space-y-3">
        {ESCAMAS.map((escama, i) => (
          <motion.div key={escama.nome} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-semibold text-[var(--c-text)]">{escama.nome}</p>
              <p className="text-xs font-bold text-[var(--c-muted)]">
                {escores[escama.nome]}/{Math.ceil(ITENS.filter((it) => it.escala === escama.nome).length * 6)}
              </p>
            </div>
            <div className="h-2 bg-[var(--c-border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: escama.cor }}
                initial={{ width: 0 }}
                animate={{ width: `${(escores[escama.nome] / (Math.ceil(ITENS.filter((it) => it.escala === escama.nome).length * 6))) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Esquemas mais ativados = áreas para trabalhar com seu terapeuta. Acompanhe ao longo do tempo.
      </p>
    </motion.div>
  );
}
