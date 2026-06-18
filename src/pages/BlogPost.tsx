import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost } from "@/content/posts-loader";
import { FloatingNav } from "@/components/ui/FloatingNav";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { AnimatedCTA } from "@/components/ui/AnimatedCTA";
import { contato, hero } from "@/content/copy";
import { fadeUp } from "@/lib/motion";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    if (post) document.title = post.titulo + " | Bruno SG Psicologo";
    return () => document.documentElement.removeAttribute("data-theme");
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <>
      <SkipLink />
      <FloatingNav items={navItems} crp={contato.crp} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Todos os artigos
          </Link>

          <motion.article
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--c-accent)]">
                {post.categoria}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--c-muted)]">
                <Clock size={13} aria-hidden="true" />
                {post.tempoLeitura}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl md:text-4xl font-semibold text-[var(--c-text)] mb-3 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {post.titulo}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-[var(--c-muted)] mb-8 leading-relaxed">
              {post.subtitulo}
            </motion.p>

            <motion.hr variants={fadeUp} className="border-[var(--c-border)] mb-8" />

            <motion.div
              variants={fadeUp}
              className="prose prose-stone max-w-none
                prose-headings:font-semibold prose-headings:text-[var(--c-text)]
                prose-p:text-[var(--c-muted)] prose-p:leading-relaxed
                prose-li:text-[var(--c-muted)] prose-li:leading-relaxed
                prose-blockquote:border-l-4 prose-blockquote:border-[var(--c-accent)]/40
                prose-blockquote:bg-[var(--c-surface)] prose-blockquote:rounded-r-xl
                prose-blockquote:pl-5 prose-blockquote:py-2 prose-blockquote:not-italic
                prose-blockquote:text-[var(--c-muted)] prose-blockquote:text-sm"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.conteudo}
              </ReactMarkdown>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-16 rounded-2xl bg-[var(--c-bg-dark)] text-white p-8 text-center"
            >
              <p className="text-2xl font-light mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Quer conversar sobre isso?
              </p>
              <p className="text-white/60 text-sm mb-6">
                Primeira conversa sem compromisso, presencial em Pelotas ou online.
              </p>
              <AnimatedCTA href={contato.whatsappLink} label={hero.cta} />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full border border-[var(--c-border)] text-[var(--c-muted)]">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.article>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}