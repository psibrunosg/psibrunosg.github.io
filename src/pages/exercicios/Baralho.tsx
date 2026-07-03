import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Gamepad2, RotateCcw, Check, X } from "lucide-react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";
import { distorcoes, monstroImg, type Distorcao } from "@/content/distorcoes";

// ---------- Carta com flip 3D ----------
function Carta({ d }: { d: Distorcao }) {
  const [virada, setVirada] = useState(false);
  return (
    <button
      onClick={() => setVirada((v) => !v)}
      className="relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)] rounded-2xl"
      style={{ perspective: 1200, aspectRatio: "3/4.4" }}
      aria-label={virada ? `Voltar carta ${d.apelido}` : `Virar carta ${d.apelido}`}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ rotateY: virada ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* frente */}
        <div
          className="absolute inset-0 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] overflow-hidden flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={monstroImg(d.id)} alt={d.apelido} loading="lazy" className="w-full flex-1 object-cover min-h-0" />
          <div className="p-4">
            <p className="font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>
              {d.apelido}
            </p>
            <p className="text-xs text-[var(--c-muted)] mt-0.5">toque para conhecer</p>
          </div>
        </div>
        {/* verso */}
        <div
          className="absolute inset-0 rounded-2xl border border-[var(--c-accent)]/40 bg-[var(--c-bg-dark)] text-[var(--c-warm-lt)] p-5 flex flex-col overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-warm)] font-semibold mb-1">{d.distorcao}</p>
          <p className="text-sm leading-relaxed mb-3">{d.resumo}</p>
          <p className="text-xs text-[var(--c-warm)] font-semibold mb-1">Ele sussurra:</p>
          <p className="text-sm italic mb-3">“{d.exemplo}”</p>
          <p className="text-xs text-[var(--c-warm)] font-semibold mb-1">Antídoto:</p>
          <p className="text-sm leading-relaxed">{d.antidoto}</p>
        </div>
      </motion.div>
    </button>
  );
}

// ---------- Modo jogo ----------
type Rodada = { frase: string; certaId: string; opcoes: Distorcao[] };

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function montarRodadas(): Rodada[] {
  const pool = distorcoes.flatMap((d) => d.frases.map((frase) => ({ frase, certaId: d.id })));
  return embaralhar(pool)
    .slice(0, 10)
    .map(({ frase, certaId }) => {
      const certa = distorcoes.find((d) => d.id === certaId)!;
      const outras = embaralhar(distorcoes.filter((d) => d.id !== certaId)).slice(0, 2);
      return { frase, certaId, opcoes: embaralhar([certa, ...outras]) };
    });
}

function Jogo() {
  const [rodadas, setRodadas] = useState<Rodada[]>(() => montarRodadas());
  const [i, setI] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);

  const fim = i >= rodadas.length;
  const rodada = rodadas[i];
  const certa = fim ? null : distorcoes.find((d) => d.id === rodada.certaId)!;

  const reiniciar = () => {
    setRodadas(montarRodadas());
    setI(0);
    setAcertos(0);
    setEscolha(null);
  };

  if (fim) {
    const msg =
      acertos >= 9
        ? "Caçador de monstros! Nenhuma distorção escapa de você."
        : acertos >= 6
          ? "Muito bom! Você já reconhece a voz da maioria dos monstros."
          : "Bom começo! Volte ao modo Explorar e conheça melhor cada monstro.";
    return (
      <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-10 text-center">
        <p className="text-5xl font-semibold text-[var(--c-accent)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          {acertos}/{rodadas.length}
        </p>
        <p className="text-[var(--c-text)] mb-6">{msg}</p>
        <button
          onClick={reiniciar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--c-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <RotateCcw size={16} /> Jogar de novo
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 text-sm text-[var(--c-muted)]">
        <span>
          Rodada {i + 1} de {rodadas.length}
        </span>
        <span>{acertos} acertos</span>
      </div>

      <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8 mb-6">
        <p className="text-xs tracking-[0.2em] uppercase text-[var(--c-accent)] font-semibold mb-3">
          Qual monstro falou isso?
        </p>
        <p className="text-xl md:text-2xl text-[var(--c-text)] italic" style={{ fontFamily: "var(--font-heading)" }}>
          “{rodada.frase}”
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
        {rodada.opcoes.map((d) => {
          const escolhida = escolha === d.id;
          const acertou = escolha !== null && d.id === rodada.certaId;
          const errou = escolhida && d.id !== rodada.certaId;
          return (
            <button
              key={d.id}
              disabled={escolha !== null}
              onClick={() => {
                setEscolha(d.id);
                if (d.id === rodada.certaId) setAcertos((a) => a + 1);
              }}
              className={`rounded-2xl border-2 overflow-hidden text-left transition-all bg-[var(--c-surface)] disabled:cursor-default ${
                acertou
                  ? "border-[var(--c-moss)] ring-2 ring-[var(--c-moss)]"
                  : errou
                    ? "border-red-400 opacity-70"
                    : escolha !== null
                      ? "border-[var(--c-border)] opacity-50"
                      : "border-[var(--c-border)] hover:border-[var(--c-accent)] hover:-translate-y-1"
              }`}
            >
              <img src={monstroImg(d.id)} alt="" loading="lazy" className="w-full aspect-square object-cover" />
              <div className="p-2.5 flex items-center gap-1.5">
                {acertou && <Check size={14} className="text-[var(--c-moss)] shrink-0" />}
                {errou && <X size={14} className="text-red-400 shrink-0" />}
                <span className="text-xs md:text-sm font-semibold text-[var(--c-text)] leading-tight">{d.apelido}</span>
              </div>
            </button>
          );
        })}
      </div>

      {escolha !== null && certa && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-warm-lt)] p-5 mb-6"
        >
          <p className="text-sm text-[var(--c-text)] mb-1">
            <strong>{certa.apelido}</strong> — {certa.distorcao}.
          </p>
          <p className="text-sm text-[var(--c-muted)]">Antídoto: {certa.antidoto}</p>
        </motion.div>
      )}

      {escolha !== null && (
        <button
          onClick={() => {
            setI((n) => n + 1);
            setEscolha(null);
          }}
          className="px-6 py-3 rounded-full bg-[var(--c-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {i + 1 === rodadas.length ? "Ver resultado" : "Próxima"}
        </button>
      )}
    </div>
  );
}

// ---------- Página ----------
export default function Baralho() {
  const [modo, setModo] = useState<"explorar" | "jogo">("explorar");
  const cartas = useMemo(() => distorcoes, []);

  return (
    <ExercicioShell
      eyebrow="Baralho das distorções"
      titulo="Conheça seus monstros"
      descricao="Cada monstro é uma distorção cognitiva — um atalho que a mente usa e que torce a realidade. Vire as cartas para conhecê-los, depois teste se reconhece a voz de cada um."
      maxWidth="max-w-5xl"
    >
      <div className="inline-flex rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] p-1 mb-8">
        {(
          [
            { m: "explorar", label: "Explorar", Icon: Layers },
            { m: "jogo", label: "Jogo", Icon: Gamepad2 },
          ] as const
        ).map(({ m, label, Icon }) => (
          <button
            key={m}
            onClick={() => setModo(m)}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              modo === m ? "bg-[var(--c-accent)] text-white" : "text-[var(--c-muted)] hover:text-[var(--c-text)]"
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {modo === "explorar" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {cartas.map((d) => (
            <Carta key={d.id} d={d} />
          ))}
        </div>
      ) : (
        <Jogo />
      )}

      <p className="text-xs text-[var(--c-muted)] mt-10 max-w-lg leading-relaxed">
        Material psicoeducativo baseado na Terapia Cognitivo-Comportamental. Não substitui avaliação ou acompanhamento
        psicológico.
      </p>
    </ExercicioShell>
  );
}
