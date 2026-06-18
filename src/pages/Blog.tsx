import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { posts } from "@/content/posts";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
];

const categoriaMap: Record<string, string> = {
  Abordagens: "var(--c-accent)",
  Condicoes: "var(--c-moss)",
  Publico: "var(--c-warm)",
};

export default function Blog() {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    document.title = "Blog | Bruno SG Psicologo | Saude Mental e TCC";
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <FloatingNav items={navItems} crp={contato.crp} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2"
            >
              Conteudo educativo
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Blog
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-[var(--c-muted)] max-w-xl mb-16 leading-relaxed"
            >
              Textos sobre saude mental, terapia e o que acontece quando decidimos entender melhor o que sentimos. Sem jargoes, sem respostas prontas.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  variants={fadeUp}
                  custom={i}
                  className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] hover:border-[var(--c-accent)]/50 transition-colors overflow-hidden"
                >
                  <Link to={"/blog/" + post.slug} className="block p-7">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                        style={{
                          color: categoriaMap[post.categoria] ?? "var(--c-accent)",
                          background: (categoriaMap[post.categoria] ?? "var(--c-accent)") + "18",
                        }}
                      >
                        {post.categoria}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--c-muted)]">
                        <Clock size={13} aria-hidden="true" />
                        {post.tempoLeitura}
                      </span>
                    </div>
                    <h2
                      className="text-xl font-semibold text-[var(--c-text)] mb-2 group-hover:text-[var(--c-accent)] transition-colors"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {post.titulo}
                    </h2>
                    <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-5">
                      {post.resumo}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--c-accent)] font-medium">
                      Ler artigo <ArrowRight size={15} />
                    </span>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}