import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { contato } from "@/content/copy";

const variants = [
  {
    id: "a",
    href: "/a",
    nome: "Cerrado Sereno",
    sub: "Verde-sálvia + terracota · Natureza e travessia",
    cor: "#6BA585",
    bg: "#FAF6EE",
    desc: "Aurora animada, Spotlight, parallax sutil. Energia: calma que avança.",
  },
  {
    id: "b",
    href: "/b",
    nome: "Profundo Sereno",
    sub: "Azul-petróleo + dourado · Clínica e confiança",
    cor: "#4A7FA0",
    bg: "#F5F2EC",
    desc: "StickyScroll, BentoGrid, linha que se desenha. Energia: institucional e sólido.",
  },
  {
    id: "c",
    href: "/c",
    nome: "Aurora Quente",
    sub: "Terracota + creme · Acolhimento e humanidade",
    cor: "#B05D3A",
    bg: "#FBF5EC",
    desc: "HeroParallax, cards empilhados, carrossel de princípios. Energia: quente e acolhedor.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        className="max-w-4xl w-full"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp} className="text-center mb-4">
          <span className="text-xs tracking-widest uppercase text-gray-400">{contato.crp}</span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-6xl font-light text-center text-gray-900 mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Bruno Souza · Psicólogo
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-center text-gray-500 mb-16 text-lg"
        >
          Escolha uma das 3 propostas de design para comparar
        </motion.p>

        <motion.div
          variants={stagger.container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {variants.map((v, i) => (
            <motion.a
              key={v.id}
              href={v.href}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, boxShadow: `0 20px 40px ${v.cor}30` }}
              className="rounded-2xl border border-gray-200 overflow-hidden group cursor-pointer no-underline"
              style={{ background: v.bg }}
            >
              <div
                className="h-3 w-full"
                style={{ background: v.cor }}
                aria-hidden="true"
              />
              <div className="p-6">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: v.cor }}>
                  Proposta {v.id.toUpperCase()}
                </span>
                <h2 className="text-xl font-semibold text-gray-900 mt-1 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {v.nome}
                </h2>
                <p className="text-xs text-gray-400 mb-4">{v.sub}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                <div
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors group-hover:gap-3"
                  style={{ color: v.cor }}
                >
                  Ver proposta
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <a
            href="/compare"
            className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors"
          >
            Ver as 3 lado a lado →
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
