import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, Send } from "lucide-react";
import { ExercicioShell } from "@/components/exercicios/ExercicioShell";

// Conversa ROTEIRIZADA (script fixo, sem IA, sem rede) que guia um registro de
// pensamentos clássico da TCC. Nada do que é digitado sai do navegador.

const EMOCOES = ["Tristeza", "Ansiedade", "Raiva", "Culpa", "Vergonha", "Medo", "Frustração", "Solidão"];

type Etapa = "situacao" | "emocao" | "intensidade" | "pensamento" | "aFavor" | "contra" | "reformulacao" | "fim";

const PERGUNTAS: Record<Exclude<Etapa, "fim">, string> = {
  situacao: "Vamos organizar um pensamento juntos. Primeiro: o que aconteceu? Descreva a situação em uma ou duas frases.",
  emocao: "Entendi. E o que você sentiu nesse momento? Escolha a emoção mais forte.",
  intensidade: "De 0 a 10, qual a intensidade dessa emoção?",
  pensamento: "Que pensamento passou pela sua cabeça nesse momento? Escreva do jeito que ele apareceu.",
  aFavor: "Agora vamos examinar esse pensamento como um cientista. Que fatos concretos falam A FAVOR dele?",
  contra: "E que fatos falam CONTRA ele? Pense em exceções, outras explicações, o que diria a um amigo.",
  reformulacao: "Olhando as evidências dos dois lados: como você reescreveria esse pensamento de um jeito mais equilibrado e realista?",
};

type Msg = { de: "guia" | "eu"; texto: string };

export default function Registro() {
  const [etapa, setEtapa] = useState<Etapa>("situacao");
  const [msgs, setMsgs] = useState<Msg[]>([{ de: "guia", texto: PERGUNTAS.situacao }]);
  const [r, setR] = useState<Record<string, string>>({});
  const [texto, setTexto] = useState("");
  const [copiado, setCopiado] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs]);

  const ORDEM: Etapa[] = ["situacao", "emocao", "intensidade", "pensamento", "aFavor", "contra", "reformulacao", "fim"];

  const responder = (valor: string) => {
    if (!valor.trim()) return;
    const atual = etapa as Exclude<Etapa, "fim">;
    const prox = ORDEM[ORDEM.indexOf(etapa) + 1];
    const novas: Msg[] = [{ de: "eu", texto: valor }];
    if (prox !== "fim") novas.push({ de: "guia", texto: PERGUNTAS[prox as Exclude<Etapa, "fim">] });
    else novas.push({ de: "guia", texto: "Pronto. Olha só a diferença entre o pensamento que chegou e o que você construiu — o resumo está aí embaixo. Se quiser, copie e leve pra sua próxima sessão." });
    setMsgs((m) => [...m, ...novas]);
    setR((x) => ({ ...x, [atual]: valor }));
    setEtapa(prox);
    setTexto("");
  };

  const resumo = [
    `REGISTRO DE PENSAMENTO — ${new Date().toLocaleDateString("pt-BR")}`,
    `Situação: ${r.situacao ?? ""}`,
    `Emoção: ${r.emocao ?? ""} (${r.intensidade ?? "?"}/10)`,
    `Pensamento automático: ${r.pensamento ?? ""}`,
    `Evidências a favor: ${r.aFavor ?? ""}`,
    `Evidências contra: ${r.contra ?? ""}`,
    `Pensamento alternativo: ${r.reformulacao ?? ""}`,
  ].join("\n");

  const copiar = async () => {
    await navigator.clipboard.writeText(resumo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const reiniciar = () => {
    setEtapa("situacao");
    setMsgs([{ de: "guia", texto: PERGUNTAS.situacao }]);
    setR({});
    setTexto("");
  };

  return (
    <ExercicioShell
      eyebrow="Diário de bordo"
      titulo="Registro de pensamentos"
      descricao="Uma conversa guiada, passo a passo, para examinar um pensamento difícil. O roteiro é fixo (não é inteligência artificial) e nada do que você escreve sai do seu navegador."
      maxWidth="max-w-2xl"
    >
      <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-4 md:p-6 mb-4 max-h-[55vh] overflow-y-auto">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-3 flex ${m.de === "eu" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.de === "eu"
                  ? "bg-[var(--c-accent)] text-white rounded-br-sm"
                  : "bg-[var(--c-warm-lt)] text-[var(--c-text)] rounded-bl-sm"
              }`}
            >
              {m.texto}
            </div>
          </motion.div>
        ))}

        {etapa === "fim" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 rounded-xl border border-[var(--c-accent)]/40 bg-[var(--c-bg)] p-4">
            <pre className="whitespace-pre-wrap text-xs text-[var(--c-text)] font-[inherit] leading-relaxed">{resumo}</pre>
            <div className="flex gap-2 mt-3">
              <button
                onClick={copiar}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--c-accent)] text-white text-xs font-semibold hover:opacity-90"
              >
                {copiado ? <Check size={13} /> : <Copy size={13} />} {copiado ? "Copiado!" : "Copiar"}
              </button>
              <button
                onClick={reiniciar}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--c-border)] text-[var(--c-muted)] text-xs font-semibold hover:text-[var(--c-text)]"
              >
                <RotateCcw size={13} /> Novo registro
              </button>
            </div>
          </motion.div>
        )}
        <div ref={fimRef} />
      </div>

      {etapa === "emocao" && (
        <div className="flex flex-wrap gap-2">
          {EMOCOES.map((e) => (
            <button
              key={e}
              onClick={() => responder(e)}
              className="px-4 py-2 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-sm text-[var(--c-text)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)] transition-colors"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {etapa === "intensidade" && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              onClick={() => responder(String(n))}
              className="w-11 h-11 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] text-sm font-semibold text-[var(--c-text)] hover:border-[var(--c-accent)] hover:text-[var(--c-accent)] transition-colors"
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {etapa !== "emocao" && etapa !== "intensidade" && etapa !== "fim" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            responder(texto);
          }}
          className="flex gap-2"
        >
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                responder(texto);
              }
            }}
            rows={2}
            placeholder="Escreva aqui..."
            className="flex-1 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-3 text-sm text-[var(--c-text)] placeholder:text-[var(--c-muted)]/60 focus:outline-none focus:border-[var(--c-accent)] resize-none"
          />
          <button
            type="submit"
            aria-label="Enviar"
            className="self-end px-4 py-3 rounded-xl bg-[var(--c-accent)] text-white hover:opacity-90 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      )}

      <p className="text-xs text-[var(--c-muted)] mt-6 max-w-lg leading-relaxed">
        Ferramenta de auto-observação baseada na TCC — não é terapia, não é IA e não substitui acompanhamento
        psicológico. Em crise, procure ajuda: CVV 188 (24h, gratuito).
      </p>
    </ExercicioShell>
  );
}
