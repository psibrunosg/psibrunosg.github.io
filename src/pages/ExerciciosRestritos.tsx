import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, AlertCircle, Wind, Footprints, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

const exerciciosRestritos = [
  {
    Icon: Wind,
    titulo: "A Escavação",
    resumo: "Cave camadas: e se fosse verdade? Descubra as crenças-núcleo profundas.",
    tempo: "8 min",
    href: "/exercicios/escavacao",
    slug: "escavacao",
  },
  {
    Icon: Footprints,
    titulo: "Técnica do Tédio",
    resumo: "Observe a sensação sem evitar. O tédio é uma onda que sobe, fica e desce.",
    tempo: "5 min",
    href: "/exercicios/tedio",
    slug: "tedio",
  },
  {
    Icon: Wind,
    titulo: "Inundação com Incertezas",
    resumo: "Explore cenários; ajuste quanto de incerteza você aguenta. Gradualmente aumente tolerância.",
    tempo: "7 min",
    href: "/exercicios/inundacao",
    slug: "inundacao",
  },
  {
    Icon: NotebookPen,
    titulo: "Fantasia Temida",
    resumo: "Redija o pior caso, o melhor, e o realista. Compare: seu medo vs. realidade.",
    tempo: "10 min",
    href: "/exercicios/fantasia",
    slug: "fantasia",
  },
  {
    Icon: Footprints,
    titulo: "LESS-II: Mapa de Esquemas",
    resumo: "Questionário de 10 itens mapeando seus esquemas núcleo mais ativados. Acompanhe evolução.",
    tempo: "6 min",
    href: "/exercicios/less",
    slug: "less",
  },
  {
    Icon: NotebookPen,
    titulo: "Escrita Expressiva",
    resumo: "10 minutos escrevendo sem filtro: tudo o que você sente, sem censura, sem julgamento.",
    tempo: "10 min",
    href: "/exercicios/escrita",
    slug: "escrita",
  },
  {
    Icon: Wind,
    titulo: "Pontos de Tensão",
    resumo: "Mapeie 3 situações: disparador → emoção → ação impulsiva → custo → alternativa.",
    tempo: "8 min",
    href: "/exercicios/pontos",
    slug: "pontos",
  },
  {
    Icon: Footprints,
    titulo: "Reformulação de História",
    resumo: "Sua narrativa que define você. Mantenha os fatos, mude a interpretação e o ending.",
    tempo: "10 min",
    href: "/exercicios/reformulacao",
    slug: "reformulacao",
  },
  {
    Icon: NotebookPen,
    titulo: "Carta à Fonte do Esquema",
    resumo: "Diálogo imaginário com figura significativa que ensinou este padrão de comportamento.",
    tempo: "10 min",
    href: "/exercicios/carta",
    slug: "carta",
  },
  {
    Icon: Wind,
    titulo: "Óculos dos Esquemas",
    resumo: "Mini-game: reconheça padrão de esquema em 3 cenários. Quiz de 3-4 minutos.",
    tempo: "4 min",
    href: "/exercicios/oculos",
    slug: "oculos",
  },
];

export default function ExerciciosRestritos() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string | null>(null);
  const [restricted, setRestricted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Exercícios Restritos | Bruno Souza Psicologo | Pelotas";

    const stored = localStorage.getItem("exercise_patient_code");
    const unlocked = localStorage.getItem("exercise_restricted_unlocked");

    if (!stored) {
      // Sem código: tela de bloqueio
      setLoading(false);
      return;
    }

    setCode(stored);
    try {
      setRestricted(JSON.parse(unlocked || "[]"));
    } catch {
      setRestricted([]);
    }
    setLoading(false);

    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-[var(--c-muted)]">Carregando...</div>;
  }

  if (!code) {
    return (
      <>
        <SkipLink />
        <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
        <WhatsAppFloat />
        <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6" data-theme="lobo">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/exercicios"
              className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
            >
              <ArrowLeft size={16} />
              Voltar aos exercícios
            </Link>

            <motion.div variants={stagger.container} initial="hidden" animate="visible">
              <div className="rounded-3xl border-2 border-[var(--c-accent)]/30 bg-[var(--c-accent)]/5 p-12 text-center">
                <motion.div variants={fadeUp} className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--c-accent)]/20">
                  <Lock size={32} className="text-[var(--c-accent)]" />
                </motion.div>
                <motion.h1
                  variants={fadeUp}
                  className="text-2xl font-semibold text-[var(--c-text)] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Acesso restrito
                </motion.h1>
                <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-md mx-auto mb-6">
                  Esses exercícios requerem um código de paciente. Peça ao seu terapeuta para gerar um código e insira-o aqui.
                </motion.p>
                <motion.button
                  variants={fadeUp}
                  onClick={() => navigate("/exercicios")}
                  className="rounded-full px-6 py-3 font-semibold text-white"
                  style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}
                >
                  Voltar aos exercícios públicos
                </motion.button>
              </div>
            </motion.div>
          </div>
        </main>
        <EthicalFooter />
      </>
    );
  }

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />
      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6" data-theme="lobo">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/exercicios"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar aos exercícios
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Sob supervisão
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Exercícios Restritos
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-12 leading-relaxed">
              Técnicas para praticar entre sessões com o terapeuta. Liberação individual conforme recomendação clínica.
            </motion.p>

            {restricted.length === 0 ? (
              <motion.div variants={fadeUp} className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-8 text-center">
                <AlertCircle size={32} className="mx-auto mb-3 text-[var(--c-accent)]" />
                <h3 className="text-lg font-semibold text-[var(--c-text)] mb-2">Nenhum exercício liberado ainda</h3>
                <p className="text-sm text-[var(--c-muted)]">Peça ao seu terapeuta para liberar exercícios restritos conforme necessário.</p>
              </motion.div>
            ) : (
              <div>
                <motion.p variants={fadeUp} className="text-sm text-[var(--c-muted)] mb-6">
                  {restricted.length} exercício{restricted.length !== 1 ? "s" : ""} liberado{restricted.length !== 1 ? "s" : ""}
                </motion.p>
                <div className="grid md:grid-cols-2 gap-6">
                  {exerciciosRestritos.map((e, i) => {
                    const Icon = e.Icon;
                    const isUnlocked = restricted.includes(e.slug);
                    return (
                      <motion.div
                        key={e.titulo}
                        variants={fadeUp}
                        custom={i}
                        className={isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
                      >
                        {isUnlocked ? (
                          <Link to={e.href as string}>
                            <div className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 transition-all hover:border-[var(--c-accent)] hover:shadow-lg"
                              style={{ borderLeftWidth: 4, borderLeftColor: "var(--c-accent)" }}>
                              <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                                  <Icon size={20} />
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--c-accent)]/10 text-[var(--c-accent)]">
                                  {e.tempo}
                                </span>
                              </div>
                              <h2 className="text-xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                {e.titulo}
                              </h2>
                              <p className="text-[var(--c-muted)] text-sm leading-relaxed">{e.resumo}</p>
                            </div>
                          </Link>
                        ) : (
                          <div className="rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7"
                            style={{ borderLeftWidth: 4, borderLeftColor: "var(--c-border)" }}>
                            <div className="flex items-center justify-between mb-4">
                              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--c-border)] text-[var(--c-muted)]">
                                <Lock size={20} />
                              </span>
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--c-border)] text-[var(--c-muted)]">
                                Bloqueado
                              </span>
                            </div>
                            <h2 className="text-xl font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                              {e.titulo}
                            </h2>
                            <p className="text-[var(--c-muted)] text-sm leading-relaxed">{e.resumo}</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <EthicalFooter />
    </>
  );
}
