import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Hand, Ear, Flower2, Coffee, RotateCcw, ArrowRight } from "lucide-react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";

const PASSOS = [
  { n: 5, Icon: Eye, sentido: "VER", prompt: "Olhe ao redor, sem pressa. Nomeie 5 coisas que você consegue ver agora." },
  { n: 4, Icon: Hand, sentido: "TOCAR", prompt: "Note 4 coisas que você consegue tocar — a textura da roupa, a temperatura do ar." },
  { n: 3, Icon: Ear, sentido: "OUVIR", prompt: "Feche os olhos um instante. Quais 3 sons você consegue ouvir?" },
  { n: 2, Icon: Flower2, sentido: "CHEIRAR", prompt: "Respire fundo. Que 2 cheiros você percebe (ou gostaria de lembrar)?" },
  { n: 1, Icon: Coffee, sentido: "SABOREAR", prompt: "Por fim: 1 sabor presente na boca, ou um que te faça bem lembrar." },
];

export default function Ancoragem() {
  const [passo, setPasso] = useState(0);
  const [itens, setItens] = useState<string[][]>(PASSOS.map(() => []));
  const [texto, setTexto] = useState("");

  const fim = passo >= PASSOS.length;
  const atual = fim ? null : PASSOS[passo];
  const completos = fim ? 0 : itens[passo].length;

  const adicionar = () => {
    if (!texto.trim() || !atual) return;
    const novos = itens.map((l, i) => (i === passo ? [...l, texto.trim()] : l));
    setItens(novos);
    setTexto("");
    if (novos[passo].length >= atual.n) setPasso((p) => p + 1);
  };

  const pular = () => setPasso((p) => p + 1);
  const reiniciar = () => {
    setPasso(0);
    setItens(PASSOS.map(() => []));
    setTexto("");
  };

  return (
    <ExercicioShell
      eyebrow="Ancoragem 5-4-3-2-1"
      titulo="Volte para o presente"
      descricao="Quando a mente dispara, os sentidos são a âncora. Percorra os cinco sentidos, um a um, nomeando o que está aqui, agora. Escrever é opcional — o que importa é notar."
      maxWidth="max-w-2xl"
    >
      {/* trilha de progresso */}
      <div className="flex items-center gap-2 mb-10">
        {PASSOS.map((p, i) => {
          const Icon = p.Icon;
          const feito = i < passo;
          const ativo = i === passo;
          return (
            <div key={p.sentido} className="flex items-center gap-2 flex-1">
              <span
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 transition-colors ${
                  feito
                    ? "bg-[var(--c-moss)] border-[var(--c-moss)] text-white"
                    : ativo
                      ? "border-[var(--c-accent)] text-[var(--c-accent)] bg-[var(--c-accent)]/10"
                      : "border-[var(--c-border)] text-[var(--c-muted)]"
                }`}
              >
                <Icon size={18} />
              </span>
              {i < PASSOS.length - 1 && (
                <span className={`h-0.5 flex-1 rounded ${feito ? "bg-[var(--c-moss)]" : "bg-[var(--c-border)]"}`} />
              )}
            </div>
          );
        })}
      </div>

      {fim ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-10 text-center"
        >
          <p className="text-3xl mb-3">🌿</p>
          <h2 className="text-2xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
            Você chegou ao presente.
          </h2>
          <p className="text-[var(--c-muted)] text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Note como o corpo está agora, comparado a antes. Essa âncora está sempre com você — cinco sentidos, em
            qualquer lugar.
          </p>
          <button
            onClick={reiniciar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] text-sm font-semibold hover:text-[var(--c-text)] transition-colors"
          >
            <RotateCcw size={16} /> Fazer de novo
          </button>
        </motion.div>
      ) : (
        atual && (
          <motion.div
            key={passo}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6 md:p-8"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              {atual.n} coisas para {atual.sentido}
            </p>
            <p className="text-lg text-[var(--c-text)] mb-6 leading-relaxed">{atual.prompt}</p>

            <div className="flex flex-wrap gap-2 mb-5 min-h-[2.5rem]">
              {itens[passo].map((item, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1.5 rounded-full bg-[var(--c-moss)]/15 text-[var(--c-moss)] text-sm font-medium"
                >
                  {item}
                </motion.span>
              ))}
              {Array.from({ length: atual.n - completos }, (_, i) => (
                <span key={`v-${i}`} className="px-3 py-1.5 rounded-full border border-dashed border-[var(--c-border)] text-[var(--c-muted)]/50 text-sm">
                  ...
                </span>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                adicionar();
              }}
              className="flex gap-2"
            >
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder={`Algo que você pode ${atual.sentido.toLowerCase()}...`}
                className="flex-1 rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-[var(--c-muted)]/60 focus:outline-none focus:border-[var(--c-accent)]"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[var(--c-accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Anotar
              </button>
            </form>

            <button
              onClick={pular}
              className="inline-flex items-center gap-1 mt-4 text-xs text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors"
            >
              Só notei mentalmente, próximo sentido <ArrowRight size={13} />
            </button>
          </motion.div>
        )
      )}
    </ExercicioShell>
  );
}
