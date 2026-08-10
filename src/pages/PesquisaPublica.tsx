import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getFormularioAnonimo, enviarRespostaFormularioAnonimo, type FormularioAnonimoDB } from "@/lib/supabase";
import { CheckCircle2, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { AppAurora } from "@/components/ui/AppAurora";

export default function PesquisaPublica() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormularioAnonimoDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [respostas, setRespostas] = useState<Record<string, string | number>>({});
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data, error: err } = await getFormularioAnonimo(id);
        if (err || !data) {
          setError("Formulário não encontrado ou inativo.");
        } else if (!data.ativo) {
          setError("Este formulário foi desativado e não aceita mais respostas.");
        } else {
          setForm(data);
          // Inicializa respostas
          const ini: Record<string, string | number> = {};
          data.campos.forEach(c => {
            if (c.tipo === "escala_1_5") ini[c.id] = 0;
            else ini[c.id] = "";
          });
          setRespostas(ini);
        }
      } catch (e) {
        setError("Erro ao carregar o formulário.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !form) return;
    
    // Validação básica (todos os campos obrigatórios)
    for (const c of form.campos) {
      if (c.tipo === "escala_1_5" && (respostas[c.id] === 0 || respostas[c.id] === "")) {
        alert("Por favor, responda todas as perguntas de escala.");
        return;
      }
      if ((c.tipo === "texto_curto" || c.tipo === "texto_longo") && (respostas[c.id] as string).trim() === "") {
        alert("Por favor, preencha todos os campos de texto.");
        return;
      }
    }

    setEnviando(true);
    const { error: err } = await enviarRespostaFormularioAnonimo({
      formulario_id: id,
      respostas
    });

    if (err) {
      alert("Houve um erro ao enviar sua resposta. Tente novamente.");
      setEnviando(false);
    } else {
      setSucesso(true);
      setEnviando(false);
    }
  };

  if (loading) {
    return (
      <AppAurora className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--c-accent)]" />
      </AppAurora>
    );
  }

  if (error || !form) {
    return (
      <AppAurora className="flex min-h-screen items-center justify-center p-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass-card max-w-md rounded-3xl p-8 text-center">
          <p className="mb-6 text-[var(--c-danger)]">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-[var(--c-border)] px-6 py-3 text-sm font-semibold text-[var(--c-text)] hover:bg-[var(--c-surface)]">
            <ArrowLeft size={16} /> Voltar para o início
          </Link>
        </motion.div>
      </AppAurora>
    );
  }

  if (sucesso) {
    return (
      <AppAurora className="flex min-h-screen items-center justify-center p-6">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass-card max-w-md rounded-3xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#38a169]/20 text-[#38a169]">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-[var(--c-text)]">Resposta Enviada!</h2>
          <p className="text-[var(--c-muted)]">Obrigado por sua participação. Suas respostas são completamente anônimas.</p>
        </motion.div>
      </AppAurora>
    );
  }

  return (
    <AppAurora className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--c-text)] md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              {form.titulo}
            </h1>
            {form.descricao && (
              <p className="mt-4 text-sm leading-relaxed text-[var(--c-muted)] md:text-base">
                {form.descricao}
              </p>
            )}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-2 text-xs font-semibold text-[var(--c-accent)] shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-[#38a169]"></span>
              Preenchimento 100% Anônimo
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {form.campos.map((campo, index) => (
              <div key={campo.id} className="glass-card rounded-2xl p-6">
                <label className="mb-4 block text-sm font-semibold text-[var(--c-text)] md:text-base">
                  <span className="mr-2 text-[var(--c-accent)]">{index + 1}.</span>
                  {campo.pergunta}
                </label>

                {campo.tipo === "texto_curto" && (
                  <input
                    type="text"
                    required
                    value={respostas[campo.id] as string}
                    onChange={(e) => setRespostas({ ...respostas, [campo.id]: e.target.value })}
                    className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none"
                    placeholder="Sua resposta..."
                  />
                )}

                {campo.tipo === "texto_longo" && (
                  <textarea
                    required
                    rows={4}
                    value={respostas[campo.id] as string}
                    onChange={(e) => setRespostas({ ...respostas, [campo.id]: e.target.value })}
                    className="w-full resize-none rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 text-[var(--c-text)] transition-colors focus:border-[var(--c-accent)] focus:outline-none"
                    placeholder="Sua resposta detalhada..."
                  />
                )}

                {campo.tipo === "escala_1_5" && (
                  <div className="flex justify-between gap-2 sm:justify-start sm:gap-4">
                    {[1, 2, 3, 4, 5].map((nota) => (
                      <button
                        type="button"
                        key={nota}
                        onClick={() => setRespostas({ ...respostas, [campo.id]: nota })}
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border-2 text-lg font-bold transition-all ${
                          respostas[campo.id] === nota
                            ? "scale-110 border-[var(--c-accent)] bg-[var(--c-accent)] text-white shadow-lg shadow-[var(--c-accent)]/30"
                            : "border-[var(--c-border)] bg-[var(--c-surface)] text-[var(--c-muted)] hover:border-[var(--c-accent)]/50 hover:text-[var(--c-accent)]"
                        }`}
                      >
                        {nota}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={enviando}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--c-accent)] px-8 py-4 font-bold text-white shadow-xl shadow-[var(--c-accent)]/20 transition-all hover:scale-[1.02] hover:shadow-[var(--c-accent)]/40 disabled:opacity-70 disabled:hover:scale-100"
            >
              {enviando ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando de forma anônima...
                </>
              ) : (
                <>
                  Enviar Resposta
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AppAurora>
  );
}
