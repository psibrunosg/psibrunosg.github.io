import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Castle,
  Clock3,
  CloudRain,
  Compass,
  Copy,
  Dices,
  FlaskConical,
  Gamepad2,
  Gauge,
  Gem,
  Heart,
  Hourglass,
  Layers,
  Link2,
  Lock,
  LogOut,
  MessagesSquare,
  Navigation,
  PawPrint,
  PenLine,
  PieChart,
  Scale,
  Scroll,
  Search,
  SmilePlus,
  Sparkles,
  Sprout,
  Target,
  Wind,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { TRILHAS } from "@/content/trilhas";
import { useTrilha } from "@/hooks/useTrilha";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

type TrilhaId = "jogos" | "detetive" | "escrita" | "emocoes";

const trilhas: Record<TrilhaId, { label: string; Icon: LucideIcon; cor: string }> = {
  jogos:    { label: "Jogos rápidos",           Icon: Gamepad2, cor: "var(--c-warm)" },
  detetive: { label: "Detetive de pensamentos", Icon: Search,   cor: "var(--c-accent)" },
  escrita:  { label: "Escrita & hábitos",       Icon: PenLine,  cor: "var(--c-deep)" },
  emocoes:  { label: "Emoções & valores",       Icon: Heart,    cor: "var(--c-moss-dk)" },
};

interface Exercicio {
  Icon: LucideIcon;
  titulo: string;
  resumo: string;
  tempo: string;
  href: string;
  trilha: TrilhaId;
}

const exercicios: Exercicio[] = [
  {
    Icon: Target,
    titulo: "Acerte a Distorção",
    resumo: "Arcade de pensamentos: acerte os distorcidos e deixe os equilibrados passarem.",
    tempo: "3 min",
    href: "/exercicios/acerte-distorcao",
    trilha: "jogos",
  },
  {
    Icon: CloudRain,
    titulo: "Chuva de Preocupações",
    resumo: "Preocupações caem do céu. Separe o que é ação de hoje do que vai pro estacionamento.",
    tempo: "3 min",
    href: "/exercicios/chuva",
    trilha: "jogos",
  },
  {
    Icon: Copy,
    titulo: "Pares da Mente",
    resumo: "Jogo da memória: encontre o par de cada distorção com seu exemplo da vida real.",
    tempo: "4 min",
    href: "/exercicios/pares",
    trilha: "jogos",
  },
  {
    Icon: Layers,
    titulo: "Baralho Adulto",
    resumo: "12 distorções como arquétipos. Vire as cartas e reconheça os seus padrões.",
    tempo: "5 min",
    href: "/exercicios/baralho-adulto",
    trilha: "jogos",
  },
  {
    Icon: Wind,
    titulo: "Balão de Pensamentos",
    resumo: "Escreva, segure, solte. Observe o pensamento passar sem lutar com ele.",
    tempo: "3 min",
    href: "/exercicios/balao",
    trilha: "jogos",
  },
  {
    Icon: Dices,
    titulo: "Roleta do E Se?",
    resumo: "Gire, encare um 'E se...?' e veja a catástrofe encolher diante dos finais possíveis.",
    tempo: "5 min",
    href: "/exercicios/roleta",
    trilha: "jogos",
  },
  {
    Icon: Copy,
    titulo: "Separando Tudo",
    resumo: "O que aconteceu, o que pensei e o que senti são coisas diferentes. Classifique as cartas certinho.",
    tempo: "4 min",
    href: "/exercicios/separando-tudo",
    trilha: "jogos",
  },
  {
    Icon: CloudRain,
    titulo: "Balões do Clima",
    resumo: "Adivinhe se o pensamento traz sol ou chuva antes de estourar o balão.",
    tempo: "3 min",
    href: "/exercicios/baloes-clima",
    trilha: "jogos",
  },
  {
    Icon: Castle,
    titulo: "Muralha de Evidências",
    resumo: "Coloque um pensamento em julgamento: tijolo por tijolo, o que os fatos dizem?",
    tempo: "10 min",
    href: "/exercicios/muralha-evidencias",
    trilha: "detetive",
  },
  {
    Icon: MessagesSquare,
    titulo: "Registro de Pensamentos",
    resumo: "Conversa guiada para examinar e reformular pensamentos automáticos.",
    tempo: "8 min",
    href: "/exercicios/registro",
    trilha: "detetive",
  },
  {
    Icon: Search,
    titulo: "Caça aos Fatos",
    resumo: "Todo pensamento negativo ignora fatos. Encontre os que ficaram de fora.",
    tempo: "4 min",
    href: "/exercicios/fatos",
    trilha: "detetive",
  },
  {
    Icon: Scale,
    titulo: "Balança de Evidências",
    resumo: "Só fatos pesam. Separe evidência de sentimento e veja o veredito do pensamento.",
    tempo: "4 min",
    href: "/exercicios/balanca",
    trilha: "detetive",
  },
  {
    Icon: Navigation,
    titulo: "GPS de Decisões",
    resumo: "Mapeie uma decisão difícil: custos, prazos, humor e arrependimento.",
    tempo: "6 min",
    href: "/exercicios/gps",
    trilha: "detetive",
  },
  {
    Icon: Hourglass,
    titulo: "Máquina do Tempo",
    resumo: "Visite essa preocupação daqui a 1 semana, 1 mês, 1 ano. Ela encolhe?",
    tempo: "5 min",
    href: "/exercicios/maquina-tempo",
    trilha: "detetive",
  },
  {
    Icon: PieChart,
    titulo: "Torta da Responsabilidade",
    resumo: "Divida a culpa em fatias realistas: contexto, outras pessoas, acaso — e você.",
    tempo: "4 min",
    href: "/exercicios/torta",
    trilha: "detetive",
  },
  {
    Icon: FlaskConical,
    titulo: "Laboratório de Previsões",
    resumo: "Registre previsões catastróficas com prazo e confira depois sua taxa de acerto.",
    tempo: "5 min",
    href: "/exercicios/previsoes",
    trilha: "detetive",
  },
  {
    Icon: Link2,
    titulo: "Conecte A-B-C",
    resumo: "Evento → pensamento → emoção → ação. Mude o meio e o fim muda junto.",
    tempo: "5 min",
    href: "/exercicios/conecte",
    trilha: "detetive",
  },
  {
    Icon: Gauge,
    titulo: "Perfeccionômetro",
    resumo: "Radar de rigidez em 6 áreas: onde a busca por perfeição está custando caro?",
    tempo: "4 min",
    href: "/exercicios/perfeccionometro",
    trilha: "detetive",
  },
  {
    Icon: Sprout,
    titulo: "Jardim da Mente",
    resumo: "Cada exercício completo rega uma planta. Veja seu cuidado crescer com o tempo.",
    tempo: "1 min",
    href: "/exercicios/jardim",
    trilha: "escrita",
  },
  {
    Icon: BookOpen,
    titulo: "Diário de Lapsos",
    resumo: "Reconstrua a cadeia do lapso: gatilho, reação, consequência e lição.",
    tempo: "8 min",
    href: "/exercicios/lapsos",
    trilha: "escrita",
  },
  {
    Icon: Scroll,
    titulo: "Construtor de Direitos",
    resumo: "Monte sua declaração de direitos peça por peça: direito, ação, sentimento.",
    tempo: "6 min",
    href: "/exercicios/direitos",
    trilha: "escrita",
  },
  {
    Icon: SmilePlus,
    titulo: "Roda das Emoções",
    resumo: "Nomear uma emoção já reduz o poder dela. Gire a roda e pratique.",
    tempo: "4 min",
    href: "/exercicios/emocoes",
    trilha: "emocoes",
  },
  {
    Icon: Compass,
    titulo: "Bússola de Valores",
    resumo: "Ordene o que importa pra você e descubra seus 3 nortes.",
    tempo: "5 min",
    href: "/exercicios/bussola",
    trilha: "emocoes",
  },
  {
    Icon: Gem,
    titulo: "Cofre de Forças",
    resumo: "Cada adversidade vencida vira um recurso guardado no seu cofre.",
    tempo: "7 min",
    href: "/exercicios/forcas",
    trilha: "emocoes",
  },
];

function TrilhaDePegadas({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-6 ${className}`}>
      {Array.from({ length: 7 }).map((_, i) => (
        <PawPrint
          key={i}
          size={i % 2 ? 14 : 19}
          style={{
            color: "var(--c-moss-dk)",
            opacity: i % 2 ? 0.3 : 0.5,
            transform: `rotate(${i % 2 ? 22 : -16}deg) translateY(${i % 2 ? -7 : 5}px)`,
          }}
        />
      ))}
    </div>
  );
}

function TrilhaCard({ trilhaId }: { trilhaId: string }) {
  const { trilha, pct, xp, streak, totalConcluidos, totalExercicios } = useTrilha(trilhaId);
  if (!trilha) return null;
  return (
    <Link
      to={`/exercicios/trilha/${trilha.id}`}
      className="block rounded-2xl border p-5 mb-10 transition-transform hover:-translate-y-0.5"
      style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
    >
      <div className="flex items-center gap-4">
        <img src="/img/lobo.svg" alt="" aria-hidden className="w-12 h-12 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--c-accent)]">Trilha de tratamento</p>
          <h2 className="text-lg font-semibold text-[var(--c-text)]">{trilha.emoji} {trilha.titulo}</h2>
          <p className="text-xs text-[var(--c-muted)]">{totalConcluidos}/{totalExercicios} exercícios · {xp} XP{streak > 0 ? ` · 🔥 ${streak}` : ""}</p>
        </div>
        <ArrowRight size={18} className="text-[var(--c-muted)] shrink-0" />
      </div>
      <div className="mt-3 h-2 rounded-full bg-[var(--c-border)] overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[var(--c-accent)]" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}

function Folha({ className = "", dur = 9, delay = 0 }: { className?: string; dur?: number; delay?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`absolute ${className}`}
      style={{ animation: `lobo-leaf-drift ${dur}s ease-in-out ${delay}s infinite` }}
      fill="var(--c-moss)"
    >
      <path d="M12 2C6.5 7.5 6.5 16 12 22C17.5 16 17.5 7.5 12 2Z" />
      <path d="M12 5v15" stroke="var(--c-bg)" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function GrifoTerracota({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="absolute left-0 -bottom-1 w-full h-[0.32em]"
      >
        <path
          d="M4 10 Q 50 2 100 8 T 196 6"
          fill="none"
          stroke="var(--c-warm)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  );
}

export default function Exercicios() {
  const [trilhaAtiva, setTrilhaAtiva] = useState<TrilhaId | "todas">("todas");
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeSaving, setCodeSaving] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [hasCode, setHasCode] = useState(() => !!localStorage.getItem("exercise_patient_code"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Exercícios | Clínica Bruno Souza — Saúde & Bem-estar";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  const visiveis = useMemo(
    () => (trilhaAtiva === "todas" ? exercicios : exercicios.filter((e) => e.trilha === trilhaAtiva)),
    [trilhaAtiva]
  );

  const handleValidateCode = async () => {
    if (!/^\d{5}$/.test(codeInput)) {
      setCodeError("Código deve ter 5 dígitos");
      return;
    }
    setCodeSaving(true);
    setCodeError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: codeInput }),
        }
      );
      if (!response.ok) {
        setCodeError("Código inválido ou inativo");
        setCodeSaving(false);
        return;
      }
      const data = await response.json();
      localStorage.setItem("exercise_patient_code", data.code);
      localStorage.setItem("exercise_restricted_unlocked", JSON.stringify(data.restricted_unlocked || []));
      setHasCode(true);
      setShowCodeModal(false);
      setCodeInput("");
    } catch (e) {
      setCodeError("Erro ao validar código");
      console.error(e);
    }
    setCodeSaving(false);
  };

  const handleClearCode = () => {
    localStorage.removeItem("exercise_patient_code");
    localStorage.removeItem("exercise_restricted_unlocked");
    setHasCode(false);
  };

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main
        id="main"
        className="min-h-screen bg-[var(--c-bg)] pt-24 pb-24 px-6 overflow-x-clip"
        style={{ fontFamily: "var(--font-body)", color: "var(--c-text)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          {/* ===== Hero ===== */}
          <motion.section
            variants={stagger.container}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-[1.15fr_0.85fr] gap-10 items-center mb-6"
          >
            <div>
              <motion.p
                variants={fadeUp}
                className="text-[11px] tracking-[0.32em] uppercase font-bold text-[var(--c-accent)] mb-4"
              >
                Clínica Bruno Souza · Saúde <span className="text-[var(--c-warm)]">&</span> Bem-estar
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-4xl md:text-[3.4rem] md:leading-[1.1] font-medium text-[var(--c-accent)] mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Treinar a mente pode ser leve — <GrifoTerracota>um passo</GrifoTerracota> de cada vez.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-lg leading-relaxed mb-7">
                Exercícios interativos de TCC, Terapia do Esquema e DBT para praticar entre as sessões
                — cada um explicado em linguagem simples. Escolha uma trilha e comece pequeno:
                3 minutos já contam.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[var(--c-text)]">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles size={15} style={{ color: "var(--c-warm)" }} /> 20 exercícios
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={15} style={{ color: "var(--c-warm)" }} /> 1 a 10 min
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={15} style={{ color: "var(--c-warm)" }} /> grátis, sem cadastro
                </span>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="relative flex flex-col items-center">
              <Folha className="w-6 h-6 -top-2 left-6" dur={10} />
              <Folha className="w-4 h-4 top-10 right-2" dur={8} delay={1.5} />
              <Folha className="w-5 h-5 bottom-16 -left-1" dur={11} delay={3} />
              <div
                className="lobo-blob w-56 h-56 md:w-72 md:h-72 flex items-center justify-center"
                style={{
                  background: "color-mix(in oklab, var(--c-moss) 42%, var(--c-bg))",
                  animation: "lobo-float 7s ease-in-out infinite",
                }}
              >
                <img
                  src="/img/lobo.svg"
                  alt="Símbolo da Clínica Bruno Souza: lobo sereno entre folhas e montanhas"
                  className="w-[82%] h-[82%] object-contain"
                />
              </div>
              <div
                className="relative -mt-6 max-w-[270px] rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-3 shadow-sm"
              >
                <p className="text-xs leading-relaxed text-[var(--c-muted)]">
                  <PawPrint size={13} className="inline -mt-0.5 mr-1" style={{ color: "var(--c-warm)" }} />
                  O “lobo solitário” é um mito: lobos vivem — e se curam — em vínculo. Aqui você
                  também não caminha sozinho.
                </p>
              </div>
            </motion.div>
          </motion.section>

          <TrilhaDePegadas className="my-10" />

          {TRILHAS.map((t) => (
            <TrilhaCard key={t.id} trilhaId={t.id} />
          ))}

          {/* ===== Filtros por trilha ===== */}
          <section aria-label="Trilhas de exercícios">
            <div className="flex flex-wrap gap-2.5 mb-10" role="group" aria-label="Filtrar por trilha">
              <button
                onClick={() => setTrilhaAtiva("todas")}
                aria-pressed={trilhaAtiva === "todas"}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border transition-all"
                style={
                  trilhaAtiva === "todas"
                    ? { background: "var(--c-accent)", borderColor: "var(--c-accent)", color: "#fff" }
                    : { background: "var(--c-surface)", borderColor: "var(--c-border)", color: "var(--c-text)" }
                }
              >
                <PawPrint size={15} />
                Todas as trilhas
                <span className="opacity-70 font-semibold">{exercicios.length}</span>
              </button>
              {(Object.entries(trilhas) as [TrilhaId, (typeof trilhas)[TrilhaId]][]).map(([id, t]) => {
                const ativa = trilhaAtiva === id;
                const count = exercicios.filter((e) => e.trilha === id).length;
                return (
                  <button
                    key={id}
                    onClick={() => setTrilhaAtiva(ativa ? "todas" : id)}
                    aria-pressed={ativa}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border transition-all"
                    style={
                      ativa
                        ? { background: t.cor, borderColor: t.cor, color: "#fff" }
                        : { background: "var(--c-surface)", borderColor: "var(--c-border)", color: "var(--c-text)" }
                    }
                  >
                    <t.Icon size={15} style={ativa ? undefined : { color: t.cor }} />
                    {t.label}
                    <span className="opacity-70 font-semibold">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* ===== Cards ===== */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {visiveis.map((e, i) => {
                  const t = trilhas[e.trilha];
                  return (
                    <motion.div
                      layout
                      key={e.href}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.35 } }}
                      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                    >
                      <Link to={e.href} className="block h-full group focus-visible:outline-none">
                        <motion.article
                          whileHover={{ y: -6, rotate: -0.8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          className="lobo-card h-full rounded-[26px] border bg-[var(--c-surface)] p-6 cursor-pointer transition-shadow hover:shadow-lg group-focus-visible:ring-2"
                          style={{ borderColor: "var(--c-border)" }}
                          onMouseEnter={(ev) => {
                            (ev.currentTarget as HTMLElement).style.borderColor = t.cor;
                          }}
                          onMouseLeave={(ev) => {
                            (ev.currentTarget as HTMLElement).style.borderColor = "var(--c-border)";
                          }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <span
                              className="lobo-blob inline-flex items-center justify-center w-12 h-12"
                              style={{
                                background: `color-mix(in oklab, ${t.cor} 16%, var(--c-bg))`,
                                color: t.cor,
                              }}
                            >
                              <e.Icon size={21} />
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[var(--c-bg)] text-[var(--c-muted)] border border-[var(--c-border)]">
                              <Clock3 size={11} />
                              {e.tempo}
                            </span>
                          </div>
                          <h2
                            className="text-xl font-medium text-[var(--c-text)] mb-1.5"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {e.titulo}
                          </h2>
                          <p className="text-sm leading-relaxed text-[var(--c-muted)] mb-4">{e.resumo}</p>
                          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: t.cor }}>
                            <t.Icon size={12} />
                            {t.label}
                          </p>
                        </motion.article>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          <TrilhaDePegadas className="my-12" />

          {/* ===== Trilha guiada (restritos) ===== */}
          <section
            aria-label="Trilha guiada"
            className="relative overflow-hidden rounded-[32px] px-7 py-10 md:px-12 md:py-12"
            style={{ background: "var(--c-accent)" }}
          >
            <PawPrint aria-hidden="true" size={130} className="absolute -right-6 -bottom-8 rotate-[-18deg] text-white/10" />
            <PawPrint aria-hidden="true" size={70} className="absolute right-28 bottom-16 rotate-[14deg] text-white/10 hidden md:block" />
            <div className="relative max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-bold text-[var(--c-moss)] mb-3">
                <Lock size={13} />
                Trilha guiada
              </p>
              <h2
                className="text-2xl md:text-3xl font-medium text-[var(--c-bg)] mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Exercícios do seu plano terapêutico
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-[var(--c-moss)] mb-7">
                Dez exercícios de aprofundamento — Escavação, Escrita Expressiva, Óculos dos Esquemas
                e outros — que o seu terapeuta libera conforme o momento do processo. Como na matilha:
                ninguém explora território novo sem apoio.
              </p>
              {!hasCode ? (
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setShowCodeModal(true)}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-[1.03]"
                    style={{ background: "var(--c-warm)" }}
                  >
                    <Lock size={16} />
                    Tenho um código
                  </button>
                  <span className="text-xs text-[var(--c-moss)]">
                    Seu terapeuta te entrega um código de 5 dígitos no consultório.
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/exercicios/restritos"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-white shadow-md transition-transform hover:scale-[1.03]"
                    style={{ background: "var(--c-warm)" }}
                  >
                    Entrar na trilha guiada
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={handleClearCode}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-[var(--c-bg)] border border-white/30 transition-colors hover:bg-white/10"
                  >
                    <LogOut size={14} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* ===== Modal código ===== */}
      <AnimatePresence>
        {showCodeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCodeModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[28px] border border-[var(--c-border)] bg-[var(--c-surface)] p-7 text-center shadow-xl"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span
                className="lobo-blob mx-auto mb-4 flex h-14 w-14 items-center justify-center"
                style={{ background: "color-mix(in oklab, var(--c-moss) 40%, var(--c-bg))", color: "var(--c-accent)" }}
              >
                <PawPrint size={24} />
              </span>
              <h3 className="text-xl font-medium text-[var(--c-text)] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                Insira seu código
              </h3>
              <p className="text-xs text-[var(--c-muted)] mb-5">Código de 5 dígitos fornecido pelo terapeuta</p>
              <input
                type="text"
                inputMode="numeric"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 5));
                  setCodeError("");
                }}
                maxLength={5}
                placeholder="00000"
                aria-label="Código de 5 dígitos"
                className="w-full text-center text-2xl tracking-[0.4em] font-bold rounded-2xl border border-[var(--c-border)] bg-[var(--c-bg)] px-4 py-3 text-[var(--c-text)] focus:border-[var(--c-accent)] focus:outline-none mb-3"
              />
              {codeError && (
                <p className="text-xs font-bold mb-3" style={{ color: "var(--c-warm)" }} role="alert">
                  {codeError}
                </p>
              )}
              <button
                onClick={handleValidateCode}
                disabled={codeInput.length !== 5 || codeSaving}
                className="w-full rounded-full px-4 py-3 font-bold text-white disabled:opacity-50 transition-opacity"
                style={{ background: "var(--c-accent)" }}
              >
                {codeSaving ? "Validando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setShowCodeModal(false)}
                className="mt-3 w-full rounded-full px-4 py-3 font-bold text-[var(--c-text)] border border-[var(--c-border)] transition-colors hover:bg-[var(--c-bg)]"
              >
                <X size={14} className="inline -mt-0.5 mr-1" />
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EthicalFooter />
    </>
  );
}
