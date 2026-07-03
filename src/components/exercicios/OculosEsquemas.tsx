import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "inicio" | "jogo" | "resultado";

interface Cenario {
  contexto: string;
  opcoes: { esquema: string; texto: string }[];
  resposta: string;
}

const CENARIOS: Cenario[] = [
  {
    contexto: "Você não é convidado para uma reunião social. Pensa...",
    opcoes: [
      { esquema: "Abandono", texto: "Ninguém me quer. Vou ficar sozinho para sempre." },
      { esquema: "Inadequação", texto: "Não sou interessante o suficiente para incluir." },
      { esquema: "Desconfiança", texto: "Eles planejam isso propositalmente para me machucarem." },
    ],
    resposta: "Abandono",
  },
  {
    contexto: "Sua apresentação no trabalho teve um erro pequeno. Você pensa...",
    opcoes: [
      { esquema: "Rigidez", texto: "Cometi um erro. Sou completamente incompetente." },
      { esquema: "Dependência", texto: "Deveria ter pedido ajuda. Não consigo fazer nada sozinho." },
      { esquema: "Inadequação", texto: "Isso prova que não mereço este trabalho." },
    ],
    resposta: "Rigidez",
  },
  {
    contexto: "Um amigo demora para responder suas mensagens. Você pensa...",
    opcoes: [
      { esquema: "Desconfiança", texto: "Ele me odeia e está me dando o silêncio." },
      { esquema: "Abandono", texto: "Vou perder este amigo também." },
      { esquema: "Inadequação", texto: "Sou chato demais para ter amigos reais." },
    ],
    resposta: "Desconfiança",
  },
];

export default function OculosEsquemas() {
  const { save, complete } = useExerciseSession("oculos-esquemas");
  const [fase, setFase] = useState<Fase>("inicio");
  const [cenarioIdx, setCenarioIdx] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);

  const handleIniciar = () => {
    setFase("jogo");
  };

  const handleResposta = (esquema: string) => {
    const cenario = CENARIOS[cenarioIdx];
    const acertou = esquema === cenario.resposta;

    if (acertou) {
      setAcertos(acertos + 1);
    }

    setRespostas([...respostas, cenario.resposta]);

    if (cenarioIdx < CENARIOS.length - 1) {
      setCenarioIdx(cenarioIdx + 1);
    } else {
      save({ cenarios: CENARIOS.length, acertos });
      complete((acertos / CENARIOS.length) * 100);
      setFase("resultado");
    }
  };

  if (fase === "inicio") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            🕶️ Óculos dos Esquemas
          </label>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Você vai ler cenários. Para cada um, identifique qual esquema está ativo no pensamento automático.
          </p>
          <div className="bg-[var(--c-surface)] rounded-lg p-4 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
            <p className="text-[10px] font-semibold text-[var(--c-accent)] mb-2">Esquemas:</p>
            <ul className="text-[10px] text-[var(--c-muted)] space-y-1">
              <li>🔴 <span className="font-semibold">Abandono</span>: medo de ser deixado</li>
              <li>🟠 <span className="font-semibold">Desconfiança</span>: pessoas têm segundas intenções</li>
              <li>🟡 <span className="font-semibold">Inadequação</span>: não sou bom o suficiente</li>
              <li>🔵 <span className="font-semibold">Dependência</span>: não consigo sozinho</li>
              <li>🟣 <span className="font-semibold">Rigidez</span>: devo ser perfeito</li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            className="mt-6 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            Começar →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "jogo") {
    const cenario = CENARIOS[cenarioIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1 bg-[var(--c-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--c-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((cenarioIdx + 1) / CENARIOS.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--c-muted)]">
            {cenarioIdx + 1}/{CENARIOS.length}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-6">{cenario.contexto}</p>

          <div className="space-y-2">
            {cenario.opcoes.map((opcao, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResposta(opcao.esquema)}
                className="w-full p-4 rounded-lg bg-[var(--c-surface)] border border-[var(--c-border)] text-left hover:border-[var(--c-accent)] transition-all"
              >
                <p className="text-xs font-semibold text-[var(--c-accent)] mb-1">{opcao.esquema}</p>
                <p className="text-sm text-[var(--c-text)]">"{opcao.texto}"</p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">🕶️ Quiz completo</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-[var(--c-muted)] mb-1">Acertos</p>
            <p className="text-2xl font-bold text-[var(--c-accent)]">{acertos}/{CENARIOS.length}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--c-muted)] mb-1">Taxa</p>
            <p className="text-2xl font-bold text-green-600">{Math.round((acertos / CENARIOS.length) * 100)}%</p>
          </div>
        </div>
      </div>

      {respostas.map((resposta, i) => {
        const cenario = CENARIOS[i];
        const acertou = resposta === cenario.resposta;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-lg p-4 border-l-4 ${acertou ? "border-l-green-600" : "border-l-red-600"}`}
          >
            <p className="text-xs font-semibold mb-1">
              {acertou ? "✓" : "✗"} Cenário {i + 1}: {cenario.resposta}
            </p>
            <p className="text-[10px] text-[var(--c-muted)]">{cenario.contexto}</p>
          </motion.div>
        );
      })}

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Quanto melhor você reconhece esquemas, mais rápido consegue questionar pensamentos automáticos.
      </p>
    </motion.div>
  );
}
