import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";

const variants = [
  { id: "a", href: "/a", nome: "A — Cerrado Sereno", cor: "#6BA585", sub: "Verde-sálvia + terracota" },
  { id: "b", href: "/b", nome: "B — Profundo Sereno", cor: "#4A7FA0", sub: "Azul-petróleo + dourado" },
  { id: "c", href: "/c", nome: "C — Aurora Quente", cor: "#B05D3A", sub: "Terracota + creme" },
];

export default function Compare() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-light text-center text-gray-900 mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Comparar propostas
        </motion.h1>
        <motion.p variants={fadeUp} className="text-center text-gray-400 mb-10 text-sm">
          Clique em qualquer proposta para ver em tela cheia
        </motion.p>

        <motion.div variants={stagger.container} className="grid grid-cols-3 gap-3 mb-6">
          {variants.map((v) => (
            <motion.a
              key={v.id}
              href={v.href}
              variants={fadeUp}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors no-underline"
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: v.cor }} aria-hidden="true" />
              <div>
                <span className="text-sm font-medium text-gray-900 block">{v.nome}</span>
                <span className="text-xs text-gray-400">{v.sub}</span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <div className="grid grid-cols-3 gap-3 h-[75vh]">
          {variants.map((v, i) => (
            <motion.div
              key={v.id}
              variants={fadeUp}
              custom={i}
              className="rounded-2xl overflow-hidden border border-gray-200 relative group"
            >
              <iframe
                src={v.href}
                title={`Proposta ${v.id.toUpperCase()}`}
                className="w-full h-full border-0"
                style={{ transform: "scale(0.5)", transformOrigin: "top left", width: "200%", height: "200%" }}
                loading="lazy"
              />
              <a
                href={v.href}
                className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                aria-label={`Abrir ${v.nome} em tela cheia`}
              >
                <span className="bg-white text-gray-900 text-xs font-medium px-4 py-2 rounded-full shadow">
                  Abrir em tela cheia →
                </span>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-10 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-4 transition-colors">
            ← Voltar ao hub
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
