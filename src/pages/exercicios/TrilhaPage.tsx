import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Flame, Lock, Sparkles } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { useTrilha } from "@/hooks/useTrilha";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

export default function TrilhaPage() {
  const { trilhaId } = useParams<{ trilhaId: string }>();
  const { trilha, unidades, totalConcluidos, totalExercicios, pct, xp, streak } = useTrilha(trilhaId ?? "");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = trilha ? `${trilha.titulo} | Bruno de Souza Gonçalves` : "Trilha | Bruno de Souza Gonçalves";
    return () => document.documentElement.removeAttribute("data-theme");
  }, [trilha]);

  if (!trilha) {
    return (
      <main className="min-h-screen bg-[var(--c-bg)] pt-28 px-6 text-center" data-theme="lobo">
        <p className="text-[var(--c-muted)]">Trilha não encontrada.</p>
        <Link to="/exercicios" className="text-[var(--c-accent)] font-semibold">Voltar aos exercícios</Link>
      </main>
    );
  }

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6" data-theme="lobo">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/exercicios"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Voltar aos exercícios
          </Link>

          {/* Cabeçalho da trilha */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <img src="/img/lobo.svg" alt="" aria-hidden className="w-16 h-16 object-contain shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--c-accent)]">Trilha de tratamento</p>
                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>
                  {trilha.emoji} {trilha.titulo}
                </h1>
              </div>
            </div>
            <p className="text-sm text-[var(--c-muted)] mt-3">{trilha.descricao}</p>

            {/* XP · streak · progresso */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm font-semibold text-[var(--c-text)]">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={15} className="text-[var(--c-warm,#C99A5B)]" aria-hidden /> {xp} XP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame size={15} className="text-[var(--c-accent)]" aria-hidden /> {streak} {streak === 1 ? "dia" : "dias"} seguidos
              </span>
              <span className="text-[var(--c-muted)]">{totalConcluidos}/{totalExercicios} exercícios</span>
            </div>
            <div
              className="mt-3 h-2.5 rounded-full bg-[var(--c-border)] overflow-hidden"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso da trilha: ${pct}%`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-[var(--c-accent)]"
              />
            </div>
          </div>

          {/* Unidades */}
          <ol className="space-y-6">
            {unidades.map((u, i) => (
              <li key={u.titulo}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass-card rounded-2xl p-5 ${u.desbloqueada ? "" : "opacity-60"}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl" aria-hidden>{u.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-[var(--c-text)] flex items-center gap-2">
                        Unidade {i + 1} — {u.titulo}
                        {u.completa && <Check size={18} className="text-[var(--c-moss)]" aria-label="Unidade completa" />}
                        {!u.desbloqueada && <Lock size={16} className="text-[var(--c-muted)]" aria-label="Unidade bloqueada" />}
                      </h2>
                      <p className="text-xs text-[var(--c-muted)]">{u.descricao}</p>
                    </div>
                  </div>

                  {u.desbloqueada ? (
                    <ul className="space-y-2">
                      {u.exercicios.map((e) => {
                        const feito = u.concluidos.includes(e.slug);
                        return (
                          <li key={e.slug}>
                            <Link
                              to={e.href}
                              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                                feito
                                  ? "border-[var(--c-moss)]/50 bg-[var(--c-moss)]/10"
                                  : "border-[var(--c-border)] bg-[var(--c-bg)]/60 hover:border-[var(--c-accent)]"
                              }`}
                            >
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white ${
                                  feito ? "bg-[var(--c-moss)]" : "bg-[var(--c-border)]"
                                }`}
                                aria-hidden
                              >
                                {feito ? <Check size={15} /> : <span className="text-[10px] font-bold text-[var(--c-muted)]">▶</span>}
                              </span>
                              <span className="flex-1 text-sm font-semibold text-[var(--c-text)]">{e.titulo}</span>
                              <span className="text-[11px] text-[var(--c-muted)] shrink-0">⏱ {e.tempo}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-xs text-[var(--c-muted)] pl-10">
                      Complete {Math.min(2, unidades[i - 1]?.exercicios.length ?? 2)} exercícios da unidade anterior para desbloquear.
                    </p>
                  )}
                </motion.div>
              </li>
            ))}
          </ol>

          <p className="text-[11px] text-[var(--c-muted)] text-center mt-8">
            Base clínica: {trilha.base}. O progresso fica salvo neste dispositivo.
          </p>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
