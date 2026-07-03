import { useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "mapeamento" | "resultado";

interface Ponto {
  disparador: string;
  emocao: string;
  acao: string;
  custo: string;
  alternativa: string;
  [key: string]: any;
}

export default function PontosTensao() {
  const { save, complete } = useExerciseSession("pontos-tensao");
  const [fase, setFase] = useState<Fase>("entrada");
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [pontosIdx, setPontosIdx] = useState(0);
  const [ponto, setPonto] = useState<Ponto>({ disparador: "", emocao: "", acao: "", custo: "", alternativa: "" });

  const handleIniciar = () => {
    setPontos([{ disparador: "", emocao: "", acao: "", custo: "", alternativa: "" }]);
    setFase("mapeamento");
  };

  const handleAtualizarPonto = (campo: keyof Ponto, valor: string) => {
    setPonto({ ...ponto, [campo]: valor });
  };

  const handleProximo = () => {
    const novosPontos = [...pontos];
    novosPontos[pontosIdx] = ponto;
    setPontos(novosPontos);

    if (pontosIdx < 2) {
      setPontosIdx(pontosIdx + 1);
      setPonto({ disparador: "", emocao: "", acao: "", custo: "", alternativa: "" });
    } else {
      save({ pontos: novosPontos });
      complete(100);
      setFase("resultado");
    }
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Mapeie seus pontos de tensão
          </label>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Vamos identificar 3 situações em que você age por impulso. Para cada uma: o que dispara? Que emoção surge? Como você reage? Qual o custo? E alternativas?
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            Começar mapeamento →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "mapeamento") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-1 bg-[var(--c-border)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--c-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${((pontosIdx + 1) / 3) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-[var(--c-muted)]">{pontosIdx + 1}/3</span>
        </div>

        <div className="space-y-3">
          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Disparador</label>
            <input
              type="text"
              value={ponto.disparador}
              onChange={(e) => handleAtualizarPonto("disparador", e.target.value)}
              placeholder="Ex: Crítica do chefe"
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Emoção que surge</label>
            <input
              type="text"
              value={ponto.emocao}
              onChange={(e) => handleAtualizarPonto("emocao", e.target.value)}
              placeholder="Ex: Raiva, vergonha, ansiedade"
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Ação impulsiva</label>
            <input
              type="text"
              value={ponto.acao}
              onChange={(e) => handleAtualizarPonto("acao", e.target.value)}
              placeholder="Ex: Respondo de forma agressiva"
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-[var(--c-accent)] block mb-2">Custo da ação</label>
            <input
              type="text"
              value={ponto.custo}
              onChange={(e) => handleAtualizarPonto("custo", e.target.value)}
              placeholder="Ex: Piora relacionamento, me arrependo depois"
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-lg p-3">
            <label className="text-xs font-semibold text-green-600 block mb-2">Alternativa possível</label>
            <input
              type="text"
              value={ponto.alternativa}
              onChange={(e) => handleAtualizarPonto("alternativa", e.target.value)}
              placeholder="Ex: Respirar, pedir tempo antes de responder"
              className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-green-600 focus:outline-none"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProximo}
          disabled={!ponto.disparador || !ponto.emocao || !ponto.acao}
          className="w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm disabled:opacity-50"
        >
          {pontosIdx < 2 ? "Próximo ponto" : "Ver mapa"}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">✓ Mapa de tensão criado</p>
        <p className="text-sm text-[var(--c-muted)] mb-4">{pontos.length} pontos mapeados</p>
      </div>

      <div className="space-y-3">
        {pontos.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-lg p-4"
          >
            <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">Ponto {i + 1}</p>
            <div className="space-y-1 text-sm">
              <p><span className="font-semibold text-[var(--c-text)]">Disparador:</span> <span className="text-[var(--c-muted)]">{p.disparador}</span></p>
              <p><span className="font-semibold text-[var(--c-text)]">Emoção:</span> <span className="text-[var(--c-muted)]">{p.emocao}</span></p>
              <p><span className="font-semibold text-[var(--c-text)]">Ação:</span> <span className="text-[var(--c-muted)]">{p.acao}</span></p>
              <p><span className="font-semibold text-[var(--c-text)]">Custo:</span> <span className="text-[var(--c-muted)]">{p.custo}</span></p>
              <p><span className="font-semibold text-green-600">Alternativa:</span> <span className="text-[var(--c-muted)]">{p.alternativa}</span></p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
