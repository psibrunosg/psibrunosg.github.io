import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ClipboardList, Brain, ArrowLeft, ArrowRight, Shield, Lock, Heart, Leaf, Activity, BookOpen, Gauge, Zap, Eye, Sprout, Smile, Star, Wine, Flame, Moon, HeartHandshake, ShieldOff, Layers, Sun, AlertTriangle, Repeat, Coffee, BarChart3, Users, Focus, Sparkles, Scale, Wind, BatteryWarning, LifeBuoy, Dumbbell, GraduationCap, Clock3, PawPrint } from "lucide-react";
import { SkipLink } from "@/components/shared/SkipLink";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";
import { ESCALAS_RESTRITAS_IDS } from "@/content/escalas-restritas";

type Ferramenta = {
  id: string; href: string; icon: typeof Brain; sigla: string; nome: string; descricao: string; cor: string;
};

const ferramentasRastreio: Ferramenta[] = [
  { id: "phq9", href: "/paciente/escala/phq9", icon: Brain, sigla: "PHQ-9", nome: "Rastreio de Depressao", descricao: "9 perguntas sobre humor nas ultimas duas semanas. ~3 min.", cor: "#B05D3A" },
  { id: "gad7", href: "/paciente/escala/gad7", icon: ClipboardList, sigla: "GAD-7", nome: "Rastreio de Ansiedade", descricao: "7 perguntas sobre ansiedade e preocupacao. ~2 min.", cor: "#4A6B47" },
];

const ferramentasGerais: Ferramenta[] = [
  { id: "who5", href: "/paciente/escala/who5", icon: Smile, sigla: "WHO-5", nome: "Indice de Bem-Estar", descricao: "5 perguntas rapidas sobre seu bem-estar nas ultimas 2 semanas. ~1 min.", cor: "#2F8C7A" },
  { id: "rosenberg", href: "/paciente/escala/rosenberg", icon: Star, sigla: "EAR", nome: "Escala de Autoestima", descricao: "10 perguntas sobre como voce se ve e se valoriza. ~3 min.", cor: "#C2658A" },
  { id: "pss10", href: "/paciente/escala/pss10", icon: Flame, sigla: "PSS-10", nome: "Estresse Percebido", descricao: "10 perguntas sobre estresse no ultimo mes. ~3 min.", cor: "#B05D3A" },
  { id: "isi", href: "/paciente/escala/isi", icon: Moon, sigla: "ISI", nome: "Gravidade de Insonia", descricao: "7 perguntas sobre qualidade do sono. ~2 min.", cor: "#5B6B8C" },
  { id: "audit", href: "/paciente/escala/audit", icon: Wine, sigla: "AUDIT", nome: "Rastreio de Uso de Alcool", descricao: "10 perguntas sobre consumo de alcool (OMS). ~3 min.", cor: "#8C5A3A" },
  { id: "asrs", href: "/paciente/escala/asrs", icon: Zap, sigla: "ASRS-18", nome: "Rastreio de TDAH", descricao: "18 perguntas sobre atencao e hiperatividade. ~5 min.", cor: "#C06839" },
  { id: "bai", href: "/paciente/escala/bai", icon: Activity, sigla: "BAI", nome: "Inventario de Ansiedade de Beck", descricao: "21 sintomas de ansiedade na ultima semana. ~5 min.", cor: "#4A6B47" },
  { id: "bdi", href: "/paciente/escala/bdi", icon: Heart, sigla: "BDI", nome: "Inventario de Depressao de Beck", descricao: "21 grupos de sentimentos sobre humor atual. ~8 min.", cor: "#8C4A5B" },
  { id: "bhs", href: "/paciente/escala/bhs", icon: Eye, sigla: "BHS", nome: "Escala de Desesperanca", descricao: "20 perguntas sobre visao de futuro. ~5 min.", cor: "#5B6B8C" },
  { id: "ebep", href: "/paciente/escala/ebep", icon: Leaf, sigla: "EBEP", nome: "Escala de Bem-Estar Psicologico", descricao: "84 perguntas sobre bem-estar e proposito. ~20 min.", cor: "#3A8C6B" },
  { id: "less", href: "/paciente/escala/less", icon: BookOpen, sigla: "LESS", nome: "Esquemas Emocionais de Leahy", descricao: "50 perguntas sobre como voce lida com emocoes. ~12 min.", cor: "#8C6B3A" },
  { id: "neoffir", href: "/paciente/escala/neoffir", icon: Gauge, sigla: "NEO-FFI-R", nome: "Personalidade (Versao Curta)", descricao: "60 perguntas sobre tracos de personalidade. ~15 min.", cor: "#6B3A8C" },
  { id: "neopir", href: "/paciente/escala/neopir", icon: Sprout, sigla: "NEO-PI-R", nome: "Personalidade (Versao Completa)", descricao: "240 perguntas sobre personalidade detalhada. ~45 min.", cor: "#3A5B8C" },
  { id: "scs", href: "/paciente/escala/scs", icon: HeartHandshake, sigla: "SCS", nome: "Escala de Autocompaixao", descricao: "26 perguntas sobre como voce trata a si mesmo em momentos dificeis. ~5 min.", cor: "#8C6B8C" },
  { id: "mdq", href: "/paciente/escala/mdq", icon: Sun, sigla: "MDQ", nome: "Rastreio de Transtorno Bipolar", descricao: "13 perguntas sobre episodios de humor elevado. ~2 min.", cor: "#C0873A" },
  { id: "pcl5", href: "/paciente/escala/pcl5", icon: AlertTriangle, sigla: "PCL-5", nome: "Checklist de TEPT", descricao: "20 perguntas sobre reacoes a experiencias estressantes. ~5 min.", cor: "#8C4A4A" },
  { id: "ocir", href: "/paciente/escala/ocir", icon: Repeat, sigla: "OCI-R", nome: "Inventario Obsessivo-Compulsivo", descricao: "18 perguntas sobre pensamentos e comportamentos repetitivos. ~4 min.", cor: "#4A6B8C" },
  { id: "epworth", href: "/paciente/escala/epworth", icon: Coffee, sigla: "ESS", nome: "Sonolencia de Epworth", descricao: "8 perguntas sobre chance de cochilar em situacoes do dia a dia. ~2 min.", cor: "#6B5B4A" },
  { id: "dass21", href: "/paciente/escala/dass21", icon: BarChart3, sigla: "DASS-21", nome: "Depressao, Ansiedade e Estresse", descricao: "21 perguntas sobre depressao, ansiedade e estresse. ~5 min.", cor: "#6B4A6B" },
  { id: "erq", href: "/paciente/escala/erq", icon: Sparkles, sigla: "ERQ", nome: "Regulacao Emocional", descricao: "10 perguntas sobre como voce regula suas emocoes. ~3 min.", cor: "#4A8C6B" },
  { id: "maas", href: "/paciente/escala/maas", icon: Focus, sigla: "MAAS", nome: "Atencao Plena (Mindfulness)", descricao: "15 perguntas sobre atencao e consciencia no dia a dia. ~4 min.", cor: "#3A6B8C" },
  { id: "spin", href: "/paciente/escala/spin", icon: Users, sigla: "SPIN", nome: "Inventario de Fobia Social", descricao: "17 perguntas sobre desconforto em situacoes sociais. ~4 min.", cor: "#8C5B6B" },
  { id: "whoqolbref", href: "/paciente/escala/whoqolbref", icon: Scale, sigla: "WHOQOL-bref", nome: "Qualidade de Vida (OMS)", descricao: "26 perguntas sobre saude, bem-estar e qualidade de vida. ~8 min.", cor: "#3A8C8C" },
  { id: "panas", href: "/paciente/escala/panas", icon: Wind, sigla: "PANAS", nome: "Afetos Positivos e Negativos", descricao: "20 palavras sobre sentimentos e emocoes recentes. ~4 min.", cor: "#4A7A9C" },
  { id: "cbi", href: "/paciente/escala/cbi", icon: BatteryWarning, sigla: "CBI", nome: "Inventario de Burnout de Copenhague", descricao: "19 perguntas sobre esgotamento pessoal, no trabalho e com clientes. ~5 min.", cor: "#B0703A" },
  { id: "cssrs", href: "/paciente/escala/cssrs", icon: LifeBuoy, sigla: "C-SSRS", nome: "Rastreio de Risco de Suicidio", descricao: "6 perguntas de rastreio (Columbia). Acesso restrito por codigo.", cor: "#8C3A3A" },
];

const ferramentasEsquemas: Ferramenta[] = [
  { id: "ysq", href: "/paciente/escala/ysq", icon: Brain, sigla: "YSQ-S3", nome: "Questionario de Esquemas", descricao: "90 perguntas sobre padroes emocionais profundos. ~20 min.", cor: "#7A4A8C" },
  { id: "ypi", href: "/paciente/escala/ypi", icon: ClipboardList, sigla: "YPI", nome: "Inventario Parental de Young", descricao: "72 perguntas sobre atitudes dos seus pais. ~15 min.", cor: "#3A6B8C" },
  { id: "yci", href: "/paciente/escala/yci", icon: Shield, sigla: "YCI", nome: "Inventario de Compensacao", descricao: "48 perguntas sobre estrategias de enfrentamento. ~10 min.", cor: "#6B5B3A" },
  { id: "yrai", href: "/paciente/escala/yrai", icon: ShieldOff, sigla: "YRAI", nome: "Inventario de Evitacao", descricao: "40 perguntas sobre padroes de evitacao esquematica. ~8 min.", cor: "#5B8C6B" },
  { id: "smi", href: "/paciente/escala/smi", icon: Layers, sigla: "SMI", nome: "Inventario de Modos Esquematicos", descricao: "118 perguntas sobre modos de funcionamento emocional. ~25 min.", cor: "#6B4A8C" },
];

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Psicoeducacao", href: "/psicoeducacao" },
  { label: "Exercicios", href: "/exercicios" },
  { label: "Blog", href: "/blog" },
];

function FerramentaCard({ f }: { f: Ferramenta }) {
  const Icon = f.icon;
  const tempo = f.descricao.match(/~[^.]+/)?.[0]?.replace("~", "") ?? "Questionario";
  return (
    <Link to={f.href} className="group block h-full focus-visible:outline-none">
      <motion.article whileHover={{ y: -6, rotate: -0.8 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="lobo-card h-full rounded-[26px] border bg-[var(--c-surface)] p-6 transition-shadow hover:shadow-lg group-focus-visible:ring-2" style={{ borderColor: "var(--c-border)" }} onMouseEnter={(event) => { event.currentTarget.style.borderColor = f.cor; }} onMouseLeave={(event) => { event.currentTarget.style.borderColor = "var(--c-border)"; }}>
        <div className="mb-4 flex items-start justify-between">
          <span className="lobo-blob inline-flex h-12 w-12 items-center justify-center" style={{ background: `color-mix(in oklab, ${f.cor} 16%, var(--c-bg))`, color: f.cor }}><Icon size={21} /></span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--c-border)] bg-[var(--c-bg)] px-2.5 py-1 text-[11px] font-bold text-[var(--c-muted)]"><Clock3 size={11} />{tempo}</span>
        </div>
        <h3 className="mb-1.5 text-xl font-medium text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{f.nome}</h3>
        <p className="mb-4 text-sm leading-relaxed text-[var(--c-muted)]">{f.descricao}</p>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: f.cor }}><Icon size={12} />{f.sigla}</p>
      </motion.article>
    </Link>
  );
}

const acessosRapidos = [
  { id: "exercicios", href: "/exercicios", icon: Dumbbell, titulo: "Exercicios Praticos", descricao: "Tecnicas e praticas guiadas para aplicar entre as sessoes.", cor: "#2F8C7A" },
  { id: "psicoeducacao", href: "/psicoeducacao", icon: GraduationCap, titulo: "Psicoeducacao", descricao: "Conteudo para entender melhor o que voce esta vivendo.", cor: "#5B6B8C" },
];

function AcessoRapidoCard({ item }: { item: (typeof acessosRapidos)[number] }) {
  const Icon = item.icon;
  return (
    <Link to={item.href} className="group block h-full focus-visible:outline-none">
      <motion.article whileHover={{ y: -6, rotate: -0.8 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="lobo-card h-full rounded-[26px] border bg-[var(--c-surface)] p-6 transition-shadow hover:shadow-lg group-focus-visible:ring-2" style={{ borderColor: "var(--c-border)" }}>
        <div className="mb-4 flex items-start justify-between"><span className="lobo-blob inline-flex h-12 w-12 items-center justify-center" style={{ background: `color-mix(in oklab, ${item.cor} 16%, var(--c-bg))`, color: item.cor }}><Icon size={21} /></span><ArrowRight size={18} className="text-[var(--c-muted)] transition-transform group-hover:translate-x-1" /></div>
        <h3 className="mb-1.5 text-xl font-medium text-[var(--c-text)]" style={{ fontFamily: "var(--font-heading)" }}>{item.titulo}</h3>
        <p className="text-sm leading-relaxed text-[var(--c-muted)]">{item.descricao}</p>
      </motion.article>
    </Link>
  );
}

// Escalas restritas exigem código gerado pelo psicólogo (ver Escala.tsx) e
// não devem aparecer na listagem pública; continuam acessíveis por link direto.
const ferramentasGeraisPublicas = ferramentasGerais.filter((f) => !ESCALAS_RESTRITAS_IDS.has(f.id));

export default function PacienteHub() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Area do Paciente | Bruno de Souza Gonçalves Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />
      <main id="main" className="min-h-screen overflow-x-clip bg-[var(--c-bg)] px-6 pb-24 pt-24" style={{ fontFamily: "var(--font-body)", color: "var(--c-text)" }}>
        <div className="mx-auto max-w-5xl">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)]"><ArrowLeft size={16} />Voltar ao site</Link>
          <motion.div variants={stagger.container} initial="hidden" animate="visible">

            <motion.section variants={fadeUp} className="mb-6 grid items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.32em] text-[var(--c-accent)]">Clínica Bruno de Souza Gonçalves · Saúde <span className="text-[var(--c-warm)]">&</span> Bem-estar</p>
                <h1 className="mb-6 text-4xl font-medium text-[var(--c-accent)] md:text-[3.4rem] md:leading-[1.1]" style={{ fontFamily: "var(--font-heading)" }}>Cuidar de si pode ser leve — um passo de cada vez.</h1>
                <p className="mb-7 max-w-lg leading-relaxed text-[var(--c-muted)]">Ferramentas de autoavaliação indicadas pelo seu psicólogo para organizar o que você vem sentindo. Responda no seu ritmo e leve suas percepções para a sessão.</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[var(--c-text)]"><span className="inline-flex items-center gap-1.5"><Sparkles size={15} className="text-[var(--c-warm)]" />{ferramentasRastreio.length} rastreios rápidos</span><span className="inline-flex items-center gap-1.5"><Clock3 size={15} className="text-[var(--c-warm)]" />1 a 45 min</span><span className="inline-flex items-center gap-1.5"><Heart size={15} className="text-[var(--c-warm)]" />com acompanhamento</span></div>
              </div>
              <div className="relative flex flex-col items-center">
                <PawPrint aria-hidden size={24} className="absolute -left-1 top-5 -rotate-12 text-[var(--c-moss-dk)]/50" />
                <div className="lobo-blob flex h-56 w-56 items-center justify-center md:h-72 md:w-72" style={{ background: "color-mix(in oklab, var(--c-moss) 42%, var(--c-bg))", animation: "lobo-float 7s ease-in-out infinite" }}><img src="/img/lobo.svg" alt="Símbolo da Clínica Bruno de Souza Gonçalves" className="h-[82%] w-[82%] object-contain" /></div>
                <div className="relative -mt-6 max-w-[270px] rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] px-4 py-3 shadow-sm"><p className="text-xs leading-relaxed text-[var(--c-muted)]"><PawPrint size={13} className="mr-1 inline -mt-0.5 text-[var(--c-warm)]" />Você não precisa fazer isso sozinho. O que aparecer aqui pode virar conversa e cuidado na sessão.</p></div>
              </div>
            </motion.section>
            <div aria-hidden="true" className="my-10 flex items-center justify-center gap-6">{Array.from({ length: 7 }).map((_, index) => <PawPrint key={index} size={index % 2 ? 14 : 19} className={index % 2 ? "-translate-y-1.5 rotate-[22deg] text-[var(--c-moss-dk)]/30" : "translate-y-1 rotate-[-16deg] text-[var(--c-moss-dk)]/50"} />)}</div>

            <motion.section variants={fadeUp} className="mb-12">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--c-accent)]">Para começar</p>
              <h2 className="mb-6 text-2xl font-medium text-[var(--c-text)] md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Rastreios rápidos</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {ferramentasRastreio.map((f) => <FerramentaCard key={f.id} f={f} />)}
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="mb-12">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--c-accent)]">Entre sessões</p>
              <h2 className="mb-6 text-2xl font-medium text-[var(--c-text)] md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Continue o cuidado</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {acessosRapidos.map((item) => <AcessoRapidoCard key={item.id} item={item} />)}
              </div>
            </motion.section>

            <motion.section variants={fadeUp} className="mb-12">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--c-accent)]">Quando indicado</p>
              <h2 className="mb-2 text-2xl font-medium text-[var(--c-text)] md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Escalas gerais</h2>
              <p className="mb-6 text-sm leading-relaxed text-[var(--c-muted)]">Escolha somente o questionário combinado com seu psicólogo.</p>
              <div className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{ferramentasGeraisPublicas.map((f) => <FerramentaCard key={f.id} f={f} />)}</div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--c-accent)]">Aprofundamento</p>
              <h2 className="mb-6 text-2xl font-medium text-[var(--c-text)] md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Escalas de esquemas</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{ferramentasEsquemas.map((f) => <FerramentaCard key={f.id} f={f} />)}</div>
            </motion.section>

            <motion.section variants={fadeUp} className="relative mb-5 overflow-hidden rounded-[32px] bg-[var(--c-accent)] px-7 py-10 md:px-12 md:py-12">
              <PawPrint aria-hidden size={130} className="absolute -bottom-8 -right-6 -rotate-[18deg] text-white/10" />
              <div className="relative max-w-2xl">
                <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--c-moss)]"><Lock size={13} />Privacidade e cuidado</p>
                <h2 className="mb-3 text-2xl font-medium text-[var(--c-bg)] md:text-3xl" style={{ fontFamily: "var(--font-heading)" }}>Suas respostas fazem parte do seu processo.</h2>
                <p className="mb-6 text-sm leading-relaxed text-[var(--c-moss)]">Elas são armazenadas de forma segura e acessíveis exclusivamente por Bruno de Souza Gonçalves, {contato.crp}. Estas ferramentas são de rastreio, não de diagnóstico.</p>
                <Link to="/privacidade" className="inline-flex rounded-full bg-[var(--c-warm)] px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-[1.03]">Ler política de privacidade</Link>
              </div>
            </motion.section>

            <motion.div variants={fadeUp} className="mt-4 text-center">
              <Link
                to="/crise"
                className="text-xs text-[var(--c-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--c-accent)]"
              >
                Precisa de ajuda agora? Veja contatos de apoio imediato
              </Link>
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
