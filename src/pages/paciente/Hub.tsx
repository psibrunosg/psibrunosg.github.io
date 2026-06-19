import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Brain, ArrowRight, Shield, Lock, Heart, Leaf, Activity, BookOpen, Gauge, Zap, Eye, Sprout } from "lucide-react";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { AppAurora } from "@/components/ui/AppAurora";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

type Ferramenta = {
  id: string; href: string; icon: typeof Brain; sigla: string; nome: string; descricao: string; cor: string;
};

const ferramentasRastreio: Ferramenta[] = [
  { id: "phq9", href: "/paciente/phq9", icon: Brain, sigla: "PHQ-9", nome: "Rastreio de Depressao", descricao: "9 perguntas sobre humor nas ultimas duas semanas. ~3 min.", cor: "#B05D3A" },
  { id: "gad7", href: "/paciente/gad7", icon: ClipboardList, sigla: "GAD-7", nome: "Rastreio de Ansiedade", descricao: "7 perguntas sobre ansiedade e preocupacao. ~2 min.", cor: "#4A6B47" },
];

const ferramentasGerais: Ferramenta[] = [
  { id: "asrs", href: "/paciente/escala/asrs", icon: Zap, sigla: "ASRS-18", nome: "Rastreio de TDAH", descricao: "18 perguntas sobre atencao e hiperatividade. ~5 min.", cor: "#C06839" },
  { id: "bai", href: "/paciente/escala/bai", icon: Activity, sigla: "BAI", nome: "Inventario de Ansiedade de Beck", descricao: "21 sintomas de ansiedade na ultima semana. ~5 min.", cor: "#4A6B47" },
  { id: "bdi", href: "/paciente/escala/bdi", icon: Heart, sigla: "BDI", nome: "Inventario de Depressao de Beck", descricao: "21 grupos de sentimentos sobre humor atual. ~8 min.", cor: "#8C4A5B" },
  { id: "bhs", href: "/paciente/escala/bhs", icon: Eye, sigla: "BHS", nome: "Escala de Desesperanca", descricao: "20 perguntas sobre visao de futuro. ~5 min.", cor: "#5B6B8C" },
  { id: "ebep", href: "/paciente/escala/ebep", icon: Leaf, sigla: "EBEP", nome: "Escala de Bem-Estar Psicologico", descricao: "84 perguntas sobre bem-estar e proposito. ~20 min.", cor: "#3A8C6B" },
  { id: "less", href: "/paciente/escala/less", icon: BookOpen, sigla: "LESS", nome: "Esquemas Emocionais de Leahy", descricao: "50 perguntas sobre como voce lida com emocoes. ~12 min.", cor: "#8C6B3A" },
  { id: "neoffir", href: "/paciente/escala/neoffir", icon: Gauge, sigla: "NEO-FFI-R", nome: "Personalidade (Versao Curta)", descricao: "60 perguntas sobre tracos de personalidade. ~15 min.", cor: "#6B3A8C" },
  { id: "neopir", href: "/paciente/escala/neopir", icon: Sprout, sigla: "NEO-PI-R", nome: "Personalidade (Versao Completa)", descricao: "240 perguntas sobre personalidade detalhada. ~45 min.", cor: "#3A5B8C" },
];

const ferramentasEsquemas: Ferramenta[] = [
  { id: "ysq", href: "/paciente/escala/ysq", icon: Brain, sigla: "YSQ-S3", nome: "Questionario de Esquemas", descricao: "90 perguntas sobre padroes emocionais profundos. ~20 min.", cor: "#7A4A8C" },
  { id: "ypi", href: "/paciente/escala/ypi", icon: ClipboardList, sigla: "YPI", nome: "Inventario Parental de Young", descricao: "72 perguntas sobre atitudes dos seus pais. ~15 min.", cor: "#3A6B8C" },
  { id: "yci", href: "/paciente/escala/yci", icon: Shield, sigla: "YCI", nome: "Inventario de Compensacao", descricao: "48 perguntas sobre estrategias de enfrentamento. ~10 min.", cor: "#6B5B3A" },
];

function FerramentaCard({ f }: { f: Ferramenta }) {
  const Icon = f.icon;
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
      <Link
        to={f.href}
        className="shine-host glass-card group relative block h-full overflow-hidden rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_18px_44px_-16px_rgba(58,42,31,0.4)]"
      >
        {/* fita de cor lateral */}
        <span className="absolute left-0 top-0 h-full w-1.5" style={{ background: `linear-gradient(to bottom, ${f.cor}, ${f.cor}55)` }} aria-hidden="true" />
        <div className="flex items-start gap-4 pl-1">
          <motion.div
            className="relative flex-shrink-0 rounded-2xl p-3.5"
            style={{ background: f.cor + "1A", boxShadow: `0 8px 22px -8px ${f.cor}88` }}
            whileHover={{ scale: 1.1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 320 }}
          >
            <Icon size={24} style={{ color: f.cor }} aria-hidden="true" />
          </motion.div>
          <div className="flex-1">
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase" style={{ color: f.cor }}>{f.sigla}</span>
            <h3 className="mb-1.5 text-lg font-semibold text-[var(--c-text)] leading-snug" style={{ fontFamily: "var(--font-heading)" }}>{f.nome}</h3>
            <p className="mb-4 text-sm leading-relaxed text-[var(--c-muted)]">{f.descricao}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: f.cor }}>
              Responder <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Secao({ titulo, count, children }: { titulo: string; count: number; children: React.ReactNode }) {
  return (
    <motion.section variants={fadeUp} className="mb-12">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-sm font-bold tracking-[0.18em] uppercase text-[var(--c-muted)]">{titulo}</h2>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--c-accent)]/12 px-1.5 text-[11px] font-bold text-[var(--c-accent)]">{count}</span>
        <div className="h-px flex-1 rounded-full bg-gradient-to-r from-[var(--c-border)] to-transparent" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </motion.section>
  );
}

export default function PacienteHub() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Area do Paciente | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <AppAurora withLandmark />

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-panel">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-[var(--c-text)] transition-colors hover:text-[var(--c-accent)]">Bruno SG</Link>
          <span className="text-xs text-[var(--c-muted)]">{contato.crp}</span>
        </div>
      </header>

      <main id="main" className="relative z-10 min-h-screen px-6 pb-24 pt-28">
        <div className="mx-auto max-w-3xl">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            <motion.div variants={fadeUp} className="mb-14 text-center">
              <motion.div
                className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
                style={{ background: "var(--c-warm-lt)", border: "1px solid var(--c-border)", boxShadow: "0 18px 46px -14px var(--c-accent)" }}
                initial={{ scale: 0, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.15, stiffness: 200 }}
              >
                <img src="/img/simbolo-estendido.png" alt="Simbolo Bruno SG" className="h-16 w-16 object-contain" style={{ mixBlendMode: "multiply" }} draggable={false} />
                <motion.span
                  className="absolute inset-0 rounded-full ring-2 ring-[var(--c-accent)]/40"
                  animate={{ scale: [1, 1.16, 1], opacity: [0.55, 0, 0.55] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
              </motion.div>
              <h1 className="mb-4 text-4xl font-semibold md:text-5xl" style={{ fontFamily: "var(--font-heading)", background: "linear-gradient(120deg, var(--c-text), var(--c-accent))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Area do Paciente
              </h1>
              <p className="mx-auto max-w-lg leading-relaxed text-[var(--c-muted)]">
                Ferramentas de autoavaliacao indicadas pelo seu psicologo. Escolha um questionario para comecar.
              </p>
            </motion.div>

            <Secao titulo="Rastreio Rapido" count={ferramentasRastreio.length}>
              {ferramentasRastreio.map((f) => <FerramentaCard key={f.id} f={f} />)}
            </Secao>

            <Secao titulo="Escalas Gerais" count={ferramentasGerais.length}>
              {ferramentasGerais.map((f) => <FerramentaCard key={f.id} f={f} />)}
            </Secao>

            <Secao titulo="Escalas de Esquemas" count={ferramentasEsquemas.length}>
              {ferramentasEsquemas.map((f) => <FerramentaCard key={f.id} f={f} />)}
            </Secao>

            <motion.div variants={fadeUp} className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--c-accent)]/12">
                  <Lock size={17} className="text-[var(--c-accent)]" />
                </div>
                <div>
                  <strong className="mb-1 block text-sm text-[var(--c-text)]">Privacidade</strong>
                  <p className="text-sm leading-relaxed text-[var(--c-muted)]">
                    Suas respostas sao armazenadas de forma segura e acessiveis exclusivamente por Bruno SG, {contato.crp}. Estas ferramentas sao de rastreio, nao de diagnostico.
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>

      <div className="relative z-10">
        <EthicalFooter />
      </div>
    </>
  );
}