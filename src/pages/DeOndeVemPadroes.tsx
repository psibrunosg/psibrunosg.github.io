import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sprout, ChevronDown, Loader2, KeyRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { supabase } from "@/lib/supabase";
import { narrativas, necessidades, type NarrativaEsquema } from "@/content/psicoed/narrativas-esquemas";
import { NarrativaEsquemaView } from "@/components/psicoed/NarrativaEsquemaView";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

interface EsquemaAtivo { id: string; media?: number; }
interface Personalizacao { liberado: boolean; revelarEscore?: boolean; esquemas: EsquemaAtivo[]; semYsq?: boolean; }

// Narrativas agrupadas por domínio (necessidade), preservando a ordem do arquivo.
const porNecessidade = Object.values(necessidades).map((nec) => ({
  necessidade: nec,
  itens: narrativas.filter((n) => n.dominioId === nec.dominioId),
}));

function narrativaPorId(id: string): NarrativaEsquema | undefined {
  return narrativas.find((n) => n.id === id);
}

export default function DeOndeVemPadroes() {
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [perso, setPerso] = useState<Personalizacao | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "De onde vêm seus padrões | Psicoeducação | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  // Se já houver um código salvo (fluxo do paciente), tenta personalizar sozinho.
  useEffect(() => {
    const salvo = localStorage.getItem("exercise_patient_code");
    if (salvo) { setCodigo(salvo); void personalizar(salvo); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function personalizar(cod: string) {
    const c = cod.trim();
    if (!c || !supabase) return;
    setBuscando(true);
    setErro(null);
    try {
      const { data, error } = await supabase.functions.invoke("psicoed-personalizada", { body: { codigo: c } });
      if (error) throw error;
      if (data?.error) { setErro(data.error); return; }
      setPerso(data as Personalizacao);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível personalizar agora.");
    } finally {
      setBuscando(false);
    }
  }

  // Esquemas ativos do paciente (quando liberado), na ordem retornada pela função.
  const ativos = useMemo(() => {
    if (!perso?.liberado || !perso.esquemas?.length) return [];
    return perso.esquemas
      .map((e) => ({ n: narrativaPorId(e.id), media: e.media }))
      .filter((x): x is { n: NarrativaEsquema; media: number | undefined } => !!x.n);
  }, [perso]);

  const personalizado = perso?.liberado && ativos.length > 0;

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] px-6 pb-24 pt-28">
        <div className="mx-auto max-w-2xl">
          <Link to="/psicoeducacao" className="mb-10 inline-flex items-center gap-2 text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]">
            <ArrowLeft size={16} /> Voltar ao mapa
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible" className="mb-8">
            <motion.div variants={fadeUp} className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                <Sprout size={20} />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--c-accent)]">Território · De onde vêm seus padrões</p>
            </motion.div>
            <motion.h1 variants={fadeUp} className="mb-4 text-3xl font-semibold text-[var(--c-text)] md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              De onde vêm seus padrões
            </motion.h1>
            <motion.p variants={fadeUp} className="leading-relaxed text-[var(--c-muted)]">
              Muita coisa que sentimos hoje começou como uma necessidade de criança que nem sempre foi atendida — e que, sem
              a gente perceber, virou um jeito de se proteger. Aqui a gente puxa esses fios com calma: de onde nasceram,
              como te alcançam hoje, e como cuidar da necessidade que ficou.
            </motion.p>
          </motion.div>

          {/* Código do paciente — personalização opcional e mediada pelo psicólogo */}
          {supabase && (
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="glass-card mb-8 rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <KeyRound size={15} className="text-[var(--c-accent)]" />
                <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--c-accent)]">Tem um código do seu psicólogo?</p>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-[var(--c-muted)]">
                Se o seu psicólogo liberou, a jornada se ajusta às necessidades que mais aparecem em você. Sem código, você
                pode explorar todas as necessidades livremente abaixo.
              </p>
              <div className="flex gap-2">
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void personalizar(codigo); }}
                  placeholder="Seu código"
                  inputMode="numeric"
                  className="w-full rounded-xl border border-[var(--c-border)] bg-[var(--c-bg)]/60 px-3 py-2 text-sm text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none"
                />
                <button
                  onClick={() => void personalizar(codigo)}
                  disabled={buscando || !codigo.trim()}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}
                >
                  {buscando ? <Loader2 size={14} className="animate-spin" /> : "Ajustar"}
                </button>
              </div>
              {erro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{erro}</p>}
              {perso && !perso.liberado && (
                <p className="mt-2 text-xs text-[var(--c-muted)]">
                  Ainda não há uma jornada personalizada liberada para este código — mas você pode explorar tudo abaixo.
                </p>
              )}
              {perso?.liberado && perso.semYsq && (
                <p className="mt-2 text-xs text-[var(--c-muted)]">
                  Assim que você responder o Questionário de Esquemas, esta jornada passa a destacar o que mais fala com você.
                </p>
              )}
            </motion.div>
          )}

          {/* Nível personalizado: esquemas ativos do paciente em destaque */}
          {personalizado && (
            <motion.section variants={fadeUp} initial="hidden" animate="visible" className="mb-12">
              <p className="mb-4 text-sm font-semibold text-[var(--c-text)]">
                As necessidades que mais falam com você
              </p>
              <div className="space-y-4">
                {ativos.map(({ n, media }) => (
                  <NarrativaEsquemaView key={n.id} n={n} escore={perso?.revelarEscore ? media : undefined} />
                ))}
              </div>
              <p className="mt-6 text-center text-xs text-[var(--c-muted)]">
                Quer conhecer as outras necessidades também? Elas estão logo abaixo.
              </p>
            </motion.section>
          )}

          {/* Nível genérico: as 5 necessidades, cada uma abrindo seus esquemas */}
          <div className="space-y-3">
            {!personalizado && (
              <p className="mb-2 text-sm font-semibold text-[var(--c-text)]">As cinco necessidades</p>
            )}
            {porNecessidade.map(({ necessidade, itens }) => (
              <div key={necessidade.dominioId} className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]/50 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: necessidade.cor }}>Necessidade</p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{necessidade.nome}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--c-muted)]">{necessidade.descricao}</p>
                <div className="mt-4 space-y-2">
                  {itens.map((n) => {
                    const aberto = abertoId === n.id;
                    return (
                      <div key={n.id}>
                        <button
                          onClick={() => setAbertoId(aberto ? null : n.id)}
                          className="flex w-full items-center justify-between rounded-xl border border-[var(--c-border)] px-4 py-3 text-left transition-colors hover:border-[var(--c-accent)]/50"
                        >
                          <span className="text-sm font-medium text-[var(--c-text)]">{n.esquema}</span>
                          <ChevronDown size={16} className={`flex-shrink-0 text-[var(--c-muted)] transition-transform ${aberto ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {aberto && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden pt-3"
                            >
                              <NarrativaEsquemaView n={n} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
