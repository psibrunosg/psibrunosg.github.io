import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect } from "react";
import { posts, type PostSecao } from "@/content/posts";
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

function renderSecao(s: PostSecao, i: number) {
  switch (s.tipo) {
    case "h2":
      return (
        <motion.h2
          key={i}
          variants={fadeUp}
          className="text-2xl font-semibold text-[var(--c-text)] mt-10 mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {s.texto}
        </motion.h2>
      );
    case "h3":
      return (
        <motion.h3
          key={i}
          variants={fadeUp}
          className="text-xl font-semibold text-[var(--c-text)] mt-8 mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {s.texto}
        </motion.h3>
      );
    case "p":
      return (
        <motion.p
          key={i}
          variants={fadeUp}
          className="text-[var(--c-muted)] leading-relaxed mb-4"
        >
          {s.texto}
        </motion.p>
      );
    case "ul":
      return (
        <motion.ul key={i} variants={fadeUp} className="space-y-2 mb-6 pl-4">
          {(s.itens ?? []).map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[var(--c-muted)] text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)] mt-2 flex-shrink-0" />
              {item}
            </li>
          ))}
        </motion.ul>
      );
    case "nota":
      return (
        <motion.aside
          key={i}
          variants={fadeUp}
          className="mt-10 border-l-4 border-[var(--c-accent)]/40 pl-5 py-2 text-sm text-[var(--c-muted)] italic leading-relaxed bg-[var(--c-surface)] rounded-r-xl"
          aria-label="Nota informativa"
        >
          {s.texto}
        </motion.aside>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "c");
    if (post) {
      document.title = post.titulo + " | Bruno SG Psicologo";
    }
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

            <motion.p
              variants={fadeUp}
              className="text-lg text-[var(--c-muted)] mb-8 leading-relaxed"
            >
              {post.subtitulo}
            </motion.p>

            <motion.hr
              variants={fadeUp}
              className="border-[var(--c-border)] mb-8"
            />

            <div>
              {post.secoes.map((s, i) => renderSecao(s, i))}
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-16 rounded-2xl bg-[var(--c-bg-dark)] text-white p-8 text-center"
            >
              <p
                className="text-2xl font-light mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Quer conversar sobre isso?
              </p>
              <p className="text-white/60 text-sm mb-6">
                Primeira conversa sem compromisso, presencial em Pelotas ou online.
              </p>
              <AnimatedCTA href={contato.whatsappLink} label={hero.cta} />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-[var(--c-border)] text-[var(--c-muted)]"
                >
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