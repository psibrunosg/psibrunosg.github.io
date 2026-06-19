import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Brain, ArrowRight, Shield, Lock, Heart, Leaf, Activity, BookOpen, Gauge, Zap, Eye, Sprout } from "lucide-react";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const ferramentasEsquemas = [
  { id: "ysq", href: "/paciente/escala/ysq", icon: Brain, sigla: "YSQ-S3", nome: "Questionario de Esquemas", descricao: "90 perguntas sobre padroes emocionais profundos. ~20 min.", cor: "#7A4A8C" },
  { id: "ypi", href: "/paciente/escala/ypi", icon: ClipboardList, sigla: "YPI", nome: "Inventario Parental de Young", descricao: "72 perguntas sobre atitudes dos seus pais. ~15 min.", cor: "#3A6B8C" },
  { id: "yci", href: "/paciente/escala/yci", icon: Shield, sigla: "YCI", nome: "Inventario de Compensacao", descricao: "48 perguntas sobre estrategias de enfrentamento. ~10 min.", cor: "#6B5B3A" },
];

const ferramentasGerais = [
  { id: "asrs", href: "/paciente/escala/asrs", icon: Zap, sigla: "ASRS-18", nome: "Rastreio de TDAH", descricao: "18 perguntas sobre atencao e hiperatividade. ~5 min.", cor: "#C06839" },
  { id: "bai", href: "/paciente/escala/bai", icon: Activity, sigla: "BAI", nome: "Inventario de Ansiedade de Beck", descricao: "21 sintomas de ansiedade na ultima semana. ~5 min.", cor: "#4A6B47" },
  { id: "bdi", href: "/paciente/escala/bdi", icon: Heart, sigla: "BDI", nome: "Inventario de Depressao de Beck", descricao: "21 grupos de sentimentos sobre humor atual. ~8 min.", cor: "#8C4A5B" },
  { id: "bhs", href: "/paciente/escala/bhs", icon: Eye, sigla: "BHS", nome: "Escala de Desesperanca", descricao: "20 perguntas sobre visao de futuro. ~5 min.", cor: "#5B6B8C" },
  { id: "ebep", href: "/paciente/escala/ebep", icon: Leaf, sigla: "EBEP", nome: "Escala de Bem-Estar Psicologico", descricao: "84 perguntas sobre bem-estar e proposito. ~20 min.", cor: "#3A8C6B" },
  { id: "less", href: "/paciente/escala/less", icon: BookOpen, sigla: "LESS", nome: "Esquemas Emocionais de Leahy", descricao: "50 perguntas sobre como voce lida com emocoes. ~12 min.", cor: "#8C6B3A" },
  { id: "neoffir", href: "/paciente/escala/neoffir", icon: Gauge, sigla: "NEO-FFI-R", nome: "Personalidade (Versao Curta)", descricao: "60 perguntas sobre tracos de personalidade. ~15 min.", cor: "#6B3A8C" },
  { id: "neopir", href: "/paciente/escala/neopir", icon: Sprout, sigla: "NEO-PI-R", nome: "Personalidade (Versao Completa)", descricao: "240 perguntas sobre personalidade detalhada. ~45 min.", cor: "#3A5B8C" },
];

const ferramentasRastreio = [
  { id: "phq9", href: "/paciente/phq9", icon: Brain, sigla: "PHQ-9", nome: "Rastreio de Depressao", descricao: "9 perguntas sobre humor nas ultimas duas semanas. ~3 min.", cor: "#B05D3A" },
  { id: "gad7", href: "/paciente/gad7", icon: ClipboardList, sigla: "GAD-7", nome: "Rastreio de Ansiedade", descricao: "7 perguntas sobre ansiedade e preocupacao. ~2 min.", cor: "#4A6B47" },
];

function HubBlobs() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  const blobs = [
    { size: 280, x: "10%", y: "15%", color: "var(--c-accent)", delay: 0 },
    { size: 200, x: "75%", y: "60%", color: "var(--c-moss)", delay: 2 },
    { size: 160, x: "50%", y: "80%", color: "var(--c-warm)", delay: 4 },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div key={i} className="absolute rounded-full opacity-[0.06] blur-3xl"
          style={{ width: b.size, height: b.size, left: b.x, top: b.y, background: b.color }}
          animate={{ x: [0, 30, -20, 0], y: [0, -25, 15, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
        />
      ))}
    </div>
  );
}

function FerramentaCard({ f }: { f: typeof ferramentasGerais[0] }) {
  const Icon = f.icon;
  return (
    <Link to={f.href}
      className="block w-full text-left rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-7 hover:border-[var(--c-accent)]/50 hover:shadow-lg transition-all group">
      <div className="flex items-start gap-4">
        <motion.div className="rounded-xl p-3 flex-shrink-0" style={{ background: f.cor + "18" }}
          whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
          <Icon size={22} style={{ color: f.cor }} aria-hidden="true" />
        </motion.div>
        <div className="flex-1">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: f.cor }}>{f.sigla}</span>
          <h3 className="text-lg font-semibold text-[var(--c-text)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{f.nome}</h3>
          <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-4">{f.descricao}</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all" style={{ color: f.cor }}>
            Responder <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
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
      <HubBlobs />

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-[var(--c-bg)]/95 backdrop-blur border-b border-[var(--c-border)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-[var(--c-text)] hover:text-[var(--c-accent)] transition-colors">Bruno SG</Link>
          <span className="text-xs text-[var(--c-muted)]">{contato.crp}</span>
        </div>
      </header>

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            <motion.div variants={fadeUp} className="text-center mb-12">
              <motion.div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--c-accent)" + "15" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                <Shield size={28} style={{ color: "var(--c-accent)" }} />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Area do Paciente
              </h1>
              <p className="text-[var(--c-muted)] max-w-lg mx-auto leading-relaxed">
                Ferramentas de autoavaliacao indicadas pelo seu psicologo.
              </p>
            </motion.div>

            {/* Rastreio Rapido */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--c-muted)] mb-4">Rastreio Rapido</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {ferramentasRastreio.map((f, i) => (
                  <motion.div key={f.sigla} variants={fadeUp} custom={i}>
                    <FerramentaCard f={f} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Escalas Gerais */}
            <motion.div variants={fadeUp} className="mb-8">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--c-muted)] mb-4">Escalas Gerais</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {ferramentasGerais.map((f, i) => (
                  <motion.div key={f.sigla} variants={fadeUp} custom={i}>
                    <FerramentaCard f={f} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Escalas de Esquemas */}
            <motion.div variants={fadeUp} className="mb-16">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-[var(--c-muted)] mb-4">Escalas de Esquemas</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {ferramentasEsquemas.map((f, i) => (
                  <motion.div key={f.sigla} variants={fadeUp} custom={i}>
                    <FerramentaCard f={f} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <div className="rounded-2xl bg-[var(--c-surface)] border border-[var(--c-border)] p-6">
                <div className="flex items-start gap-3">
                  <Lock size={18} className="text-[var(--c-accent)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--c-text)] text-sm block mb-1">Privacidade</strong>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed">
                      Suas respostas sao armazenadas de forma segura e acessiveis exclusivamente por Bruno SG, {contato.crp}. Estas ferramentas sao de rastreio, nao de diagnostico.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}