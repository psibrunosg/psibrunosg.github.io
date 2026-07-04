import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useExerciseSession } from "@/hooks/useExerciseSession";

const DISTORCOES_ADULTO = [
  { id: 1, nome: "O Promotor", descricao: "Acusa você por qualquer falha, sem direito a defesa", arquetipo: "Crítico interno implacável", exemplo: "Fracassou de novo. Isso prova que você é incompetente." },
  { id: 2, nome: "A Vidente", descricao: "Prevê o futuro — sempre negativo — com certeza absoluta", arquetipo: "Futuróloga alarmista", exemplo: "Não vai dar certo. Eu já sei como isso termina." },
  { id: 3, nome: "O Leitor de Mentes", descricao: "Sabe o que os outros pensam de você — sem perguntar", arquetipo: "Telepata pessimista", exemplo: "Ela achou minha pergunta idiota, com certeza." },
  { id: 4, nome: "O Catastrofista", descricao: "Amplifica qualquer erro até virar desastre", arquetipo: "Pessimista apocalíptico", exemplo: "Um erro nessa reunião e minha carreira acabou." },
  { id: 5, nome: "O Personalista", descricao: "Assume culpa por tudo que dá errado ao redor", arquetipo: "Centro de todas as culpas", exemplo: "O clima ficou ruim no jantar. Deve ter sido algo que eu disse." },
  { id: 6, nome: "O Juiz Binário", descricao: "Só existem duas sentenças: perfeito ou fracasso", arquetipo: "Magistrado do tudo-ou-nada", exemplo: "Se não for a melhor apresentação da empresa, foi um fiasco." },
  { id: 7, nome: "O Legislador", descricao: "Governa por decretos: 'deveria', 'tem que', 'é obrigado'", arquetipo: "Ditador dos deverias", exemplo: "Eu deveria dar conta de tudo sem reclamar." },
  { id: 8, nome: "O Rotulador", descricao: "Cola uma etiqueta definitiva em você a partir de um evento", arquetipo: "Fabricante de etiquetas", exemplo: "Errei no relatório. Sou um inútil." },
  { id: 9, nome: "O Descontador", descricao: "Anula qualquer conquista: 'não conta', 'foi sorte'", arquetipo: "Auditor de méritos alheios", exemplo: "Fui promovido, mas foi só porque não tinha outro candidato." },
  { id: 10, nome: "O Generalizador", descricao: "Transforma um caso isolado em lei universal", arquetipo: "Estatístico de amostra única", exemplo: "Esse relacionamento acabou. Sempre vou ser abandonado." },
  { id: 11, nome: "O Filtro Escuro", descricao: "Só deixa passar o negativo; o resto ele bloqueia", arquetipo: "Curador do pior", exemplo: "Recebi dez elogios e uma crítica. Só consigo pensar na crítica." },
  { id: 12, nome: "O Sentimentalista", descricao: "Se eu sinto, então é verdade", arquetipo: "Oráculo das emoções", exemplo: "Sinto que sou uma fraude — então devo ser mesmo." },
];

type Modo = "explorar" | "jogo";

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default function BaralhoAdulto() {
  const { save, complete } = useExerciseSession("baralho-adulto");
  const [modo, setModo] = useState<Modo>("explorar");
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [score, setScore] = useState(0);
  const [rodadaJogo, setRodadaJogo] = useState(0);
  const [ordemJogo, setOrdemJogo] = useState<typeof DISTORCOES_ADULTO>([]);
  const [feedback, setFeedback] = useState<{ acertou: boolean; certa: string } | null>(null);
  const [fimDeJogo, setFimDeJogo] = useState(false);

  const distorcao = DISTORCOES_ADULTO[indiceAtual];
  const cartaJogo = ordemJogo[rodadaJogo];

  // 3 alternativas erradas + a certa, embaralhadas
  const opcoesJogo = useMemo(() => {
    if (!cartaJogo) return [];
    const erradas = embaralhar(DISTORCOES_ADULTO.filter((d) => d.id !== cartaJogo.id)).slice(0, 3);
    return embaralhar([cartaJogo, ...erradas]);
  }, [cartaJogo]);

  const iniciarJogo = () => {
    setModo("jogo");
    setOrdemJogo(embaralhar(DISTORCOES_ADULTO).slice(0, 6));
    setRodadaJogo(0);
    setScore(0);
    setFeedback(null);
    setFimDeJogo(false);
  };

  const handlePalpite = (id: number) => {
    if (feedback || !cartaJogo) return;
    const acertou = id === cartaJogo.id;
    const novoScore = acertou ? score + 10 : Math.max(0, score - 5);
    setScore(novoScore);
    setFeedback({ acertou, certa: cartaJogo.nome });

    setTimeout(() => {
      setFeedback(null);
      if (rodadaJogo < ordemJogo.length - 1) {
        setRodadaJogo(rodadaJogo + 1);
      } else {
        save({ ultima_partida: { score: novoScore, rodadas: ordemJogo.length } });
        complete(novoScore);
        setFimDeJogo(true);
      }
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Botões de modo */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setModo("explorar")}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            modo === "explorar"
              ? "bg-[var(--c-accent)] text-white"
              : "bg-[var(--c-border)] text-[var(--c-text)] hover:bg-[var(--c-accent)]/20"
          }`}
        >
          Explorar
        </button>
        <button
          onClick={iniciarJogo}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
            modo === "jogo"
              ? "bg-[var(--c-accent)] text-white"
              : "bg-[var(--c-border)] text-[var(--c-text)] hover:bg-[var(--c-accent)]/20"
          }`}
        >
          Jogo
        </button>
      </div>

      {modo === "explorar" && (
        <>
          <motion.div
            key={indiceAtual}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl p-8 min-h-80 flex flex-col justify-between"
          >
            <div>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-[var(--c-text)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  {distorcao.nome}
                </h2>
                <p className="text-xs text-[var(--c-accent)] font-semibold">{distorcao.arquetipo}</p>
              </div>

              <p className="text-[var(--c-muted)] mb-4">{distorcao.descricao}</p>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[var(--c-bg)]/60 rounded-lg p-4 mt-4">
                <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">Na prática:</p>
                <p className="text-sm text-[var(--c-text)] italic">"{distorcao.exemplo}"</p>
              </motion.div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setIndiceAtual(Math.max(0, indiceAtual - 1))}
              disabled={indiceAtual === 0}
              aria-label="Carta anterior"
              className="p-2.5 rounded-lg border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)] disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            <p className="text-xs text-[var(--c-muted)]">
              {indiceAtual + 1}/{DISTORCOES_ADULTO.length}
            </p>

            <button
              onClick={() => setIndiceAtual(Math.min(DISTORCOES_ADULTO.length - 1, indiceAtual + 1))}
              disabled={indiceAtual === DISTORCOES_ADULTO.length - 1}
              aria-label="Próxima carta"
              className="p-2.5 rounded-lg border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)] disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {modo === "jogo" && !fimDeJogo && cartaJogo && (
        <motion.div key={rodadaJogo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[var(--c-muted)]">Rodada {rodadaJogo + 1}/{ordemJogo.length}</span>
            <span className="text-[var(--c-accent)]">{score} pts</span>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <p className="text-xs font-semibold text-[var(--c-accent)] mb-2">Quem está falando?</p>
            <p className="text-base font-semibold text-[var(--c-text)] italic mb-6">"{cartaJogo.exemplo}"</p>

            <div className="grid grid-cols-2 gap-2">
              {opcoesJogo.map((op) => {
                const destaque =
                  feedback && op.id === cartaJogo.id
                    ? "border-green-500 bg-green-500/15"
                    : "border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent)]";
                return (
                  <motion.button
                    key={op.id}
                    whileHover={feedback ? {} : { scale: 1.02 }}
                    whileTap={feedback ? {} : { scale: 0.98 }}
                    onClick={() => handlePalpite(op.id)}
                    disabled={!!feedback}
                    className={`p-3 rounded-lg border text-sm font-semibold text-[var(--c-text)] transition-all ${destaque}`}
                  >
                    {op.nome}
                  </motion.button>
                );
              })}
            </div>

            {feedback && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 text-center text-sm font-semibold ${feedback.acertou ? "text-green-600" : "text-red-600"}`}
              >
                {feedback.acertou ? "✓ Isso mesmo!" : `✗ Era ${feedback.certa}`}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}

      {modo === "jogo" && fimDeJogo && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-2xl p-6 text-center">
          <p className="text-lg font-bold text-[var(--c-accent)] mb-2">Partida completa</p>
          <p className="text-3xl font-bold text-[var(--c-text)] mb-4">{score} pontos</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={iniciarJogo}
            className="px-4 py-2.5 rounded-full bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            Jogar de novo
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
