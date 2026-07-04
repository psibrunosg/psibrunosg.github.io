import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useExerciseSession } from "@/hooks/useExerciseSession";

type Fase = "entrada" | "escrita" | "resultado";

export default function EscritaExpressiva() {
  const { save, complete } = useExerciseSession("escrita-expressiva");
  const [fase, setFase] = useState<Fase>("entrada");
  const [palavras, setPalavras] = useState(0);
  const [conteudo, setConteudo] = useState("");
  const [tempoDecorrido, setTempoDecorrido] = useState(0);

  // Timer de verdade (o anterior só atualizava quando o usuário digitava)
  useEffect(() => {
    if (fase !== "escrita") return;
    const timer = setInterval(() => setTempoDecorrido((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [fase]);

  const handleIniciar = () => {
    setFase("escrita");
    setTempoDecorrido(0);
  };

  const handleFinalizar = () => {
    // PRIVACIDADE: o texto NUNCA sai do dispositivo — só metadados (nº de palavras, duração).
    // A UI promete "ninguém lê isso sem sua autorização"; enviar o conteúdo ao banco quebraria isso.
    localStorage.setItem("escrita_expressiva_local", conteudo);
    save({ palavras, duracao_segundos: tempoDecorrido });
    complete(100);
    setFase("resultado");
  };

  const atualizarPalavras = (texto: string) => {
    setConteudo(texto);
    setPalavras(texto.split(/\s+/).filter(w => w.length > 0).length);
  };

  if (fase === "entrada") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="glass-card rounded-2xl p-6">
          <label className="block text-xs font-semibold text-[var(--c-accent)] mb-3">
            Escreva sem filtro
          </label>
          <p className="text-sm text-[var(--c-muted)] mb-4">
            Próximos 10 minutos: escreva tudo o que você sente. Sem censura, sem preocupação com erros, gramática ou sentido.
            Deixe fluir.
          </p>
          <div className="bg-[var(--c-surface)] rounded-lg p-4 border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
            <p className="text-[10px] text-[var(--c-muted)] mb-2">💡 Dicas:</p>
            <ul className="text-[10px] text-[var(--c-muted)] space-y-1 list-disc list-inside">
              <li>Escreva sobre o que te incomoda, frustra, assusta</li>
              <li>Não se preocupe com lógica ou estrutura</li>
              <li>Emoções são bem-vindas: raiva, medo, frustração</li>
              <li>Privado: ninguém lê isso sem sua autorização</li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleIniciar}
            className="mt-6 w-full py-2 rounded-lg bg-[var(--c-accent)] text-white font-semibold text-sm"
          >
            Começar a escrever →
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (fase === "escrita") {
    const minutos = Math.floor(tempoDecorrido / 60);
    const segundos = tempoDecorrido % 60;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-[var(--c-muted)]">
            {String(minutos).padStart(2, "0")}:{String(segundos).padStart(2, "0")} / 10:00
          </div>
          <div className="text-xs font-semibold text-[var(--c-accent)]">
            {palavras} palavras
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <textarea
            value={conteudo}
            onChange={(e) => atualizarPalavras(e.target.value)}
            placeholder="Escreva aqui. Sem filtro, sem censura..."
            className="w-full rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-4 py-4 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none resize-none"
            rows={10}
            autoFocus
          />
          <p className="text-[10px] text-[var(--c-muted)] mt-3 italic">
            Deixe sair. Ninguém está julgando. Isso é só para você.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinalizar}
            className="mt-4 w-full py-2 rounded-lg bg-green-600/20 text-green-600 font-semibold text-sm border border-green-600/30"
          >
            Finalizar escrita
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
      <div className="glass-card rounded-2xl p-6 text-center border-l-4" style={{ borderLeftColor: "var(--c-accent)" }}>
        <p className="text-lg font-bold text-[var(--c-accent)] mb-3">✓ Escrita completa</p>
        <p className="text-sm text-[var(--c-text)] mb-4">{palavras} palavras escritas</p>
        <p className="text-[10px] text-[var(--c-muted)] italic mb-4">
          Próximo passo com seu terapeuta: explorar temas emergentes e padrões emocionais desta escrita.
        </p>
        <div className="bg-[var(--c-surface)] rounded-lg p-4 border-l-2 border-[var(--c-accent)]">
          <p className="text-[10px] text-[var(--c-muted)]">
            Sua escrita é privada. Compartilhe com seu terapeuta se quiser explorar junto.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
