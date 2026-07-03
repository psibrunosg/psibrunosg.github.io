import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "scenario" | "resultado";

interface Incerteza {
  texto: string;
  intensidade: number;
}

const SCENARIOS = [
  {
    titulo: "Problema de Saúde",
    situacao: "Você tem uma dor que não passa. Médicos dizem que é normal, mas você não tem certeza.",
    incertezas: [
      "E se fosse algo grave?",
      "E se os médicos estivessem errados?",
      "E se piorar?",
      "E se ninguém acreditar em mim?",
    ],
  },
  {
    titulo: "Relacionamento",
    situacao: "Seu parceiro foi distante nos últimos dias. Não sabe o porquê.",
    incertezas: ["E se ele estivesse perdendo interesse?", "E se houvesse alguém?", "E se terminasse?", "E se fosse minha culpa?"],
  },
  {
    titulo: "Trabalho",
    situacao: "Seu chefe pediu uma reunião com você. Não disse o motivo.",
    incertezas: ["E se estivesse insatisfeito?", "E se fosse demissão?", "E se reclamassem de mim?", "E se arrependesse de contratar?"],
  },
];

export default function InundacaoIncertezas() {
  const { save, complete } = useExerciseSession("inundacao");
  const [fase, setFase] = useState<Fase>("entrada");
  const [scenario, setScenario] = useState<(typeof SCENARIOS)[0] | null>(null);
  const [incertezas, setIncertezas] = useState<Incerteza[]>([]);
  const [incertezaIdx, setIncertezaIdx] = useState(0);

  const handleEscolherScenario = (s: (typeof SCENARIOS)[0]) => {
    setScenario(s);
    setIncertezas(s.incertezas.map((texto) => ({ texto, intensidade: 80 })));
    setFase("scenario");
  };

  const handleAjustarIntensidade = (idx: number, valor: number) => {
    const novas = [...incertezas];
    novas[idx].intensidade = valor;
    setIncertezas(novas);
    save({ scenario: scenario?.titulo, incertezas: novas });
  };

  const handleProxima = () => {
    if (incertezaIdx < incertezas.length - 1) {
      setIncertezaIdx(incertezaIdx + 1);
    } else {
      complete(Math.round((incertezas.reduce((a, i) => a + i.intensidade, 0) / (incertezas.length * 100)) * 50));
      setFase("resultado");
    }
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="mb-4">
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-3">Escolha um cenário para explorar:</p>
        </div>
        <div className="grid gap-3">
          {SCENARIOS.map((s) => (
            <motion.button
              key={s.titulo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEscolherScenario(s)}
              className="glass-card rounded-2xl p-4 text-left border border-[var(--c-border)] hover:border-[var(--c-accent)] transition-all"
            >
              <p className="font-semibold text-[var(--c-text)] mb-2">{s.titulo}</p>
              <p className="text-xs text-[var(--c-muted)]">{s.situacao}</p>
            </motion.button>
          ))}
        </div>
        <p className="text-[10px] text-[var(--c-muted)] italic">
          Inundação gradual: você ajusta quanto de incerteza consegue tolerar. Começamos forte, depois diminuímos.
        </p>
      </motion.div>
    );
  }

  if (fase === "scenario" && scenario) {
    const inc = incertezas[incertezaIdx];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-4 bg-[var(--c-accent)]/10 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
          <p className="text-xs font-semibold text-[var(--c-accent)] mb-1">Cenário: {scenario.titulo}</p>
          <p className="text-sm text-[var(--c-text)] italic">"{scenario.situacao}"</p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1 bg-[var(--c-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--c-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((incertezaIdx + 1) / incertezas.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--c-muted)]">
            {incertezaIdx + 1}/{incertezas.length}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm font-semibold text-[var(--c-text)] mb-4">Quanto essa incerteza te afeta?</p>
          <p className="text-base text-[var(--c-accent)] font-bold mb-4 italic">"{inc.texto}"</p>

          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="100"
              value={inc.intensidade}
              onChange={(e) => handleAjustarIntensidade(incertezaIdx, Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-[var(--c-muted)]">
              <span>Tolero bem (0)</span>
              <span className="text-lg font-bold text-[var(--c-accent)]">{inc.intensidade}</span>
              <span>Impossível tolerar (100)</span>
            </div>
          </div>

          <p className="text-[10px] text-[var(--c-muted)] mt-4 italic">
            Ajuste conforme a incerteza ativa sua ansiedade. Não há respostas certas.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProxima}
            className="mt-4 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            {incertezaIdx < incertezas.length - 1 ? "Próxima incerteza" : "Ver padrão"}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">📊 Padrão de tolerância mapeado</p>
        <p className="text-sm text-[var(--c-text)] mb-4">Cenário: {scenario?.titulo}</p>
      </div>

      <div className="space-y-2">
        {incertezas.map((inc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-lg p-3"
          >
            <p className="text-xs font-semibold text-[var(--c-text)] mb-2">"{inc.texto}"</p>
            <div className="h-1.5 bg-[var(--c-border)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[var(--c-accent)]"
                initial={{ width: 0 }}
                animate={{ width: `${inc.intensidade}%` }}
              />
            </div>
            <p className="text-[10px] text-[var(--c-muted)] mt-1">Intensidade: {inc.intensidade}/100</p>
          </motion.div>
        ))}
      </div>

      <p className="text-[10px] text-[var(--c-muted)] italic text-center mt-4">
        Padrão visível: quanto menor a intensidade média, mais você está tolerando incerteza.
      </p>
    </motion.div>
  );
}
