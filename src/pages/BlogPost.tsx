import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Headphones, List, BookOpen } from "lucide-react";
import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element as HastElement } from "hast";
import { RichBlock, LINGUAGENS_RICAS } from "@/components/blog/RichBlock";
import { getPost, loadDynamicPosts, isDynamicLoaded, type BlogPost as BlogPostType } from "@/content/posts-loader";
import { areaDe } from "@/content/areas-blog";
import { MobileMenu } from "@/components/ui/MobileMenu";
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

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// extrai o texto bruto de dentro de um bloco de codigo (nó hast <pre><code>...</code></pre>)
function textoBrutoDoCodigo(node: HastElement): string {
  let out = "";
  function percorrer(n: HastElement["children"][number]) {
    if (n.type === "text") out += n.value;
    else if (n.type === "element") n.children.forEach(percorrer);
  }
  node.children.forEach(percorrer);
  return out;
}

function linguagemDoCodigo(codeNode: HastElement): string | null {
  const className = codeNode.properties?.className;
  const classes = Array.isArray(className) ? className : typeof className === "string" ? [className] : [];
  const langClass = classes.find((c) => typeof c === "string" && c.startsWith("language-"));
  return typeof langClass === "string" ? langClass.replace("language-", "") : null;
}

// texto plano a partir dos children do ReactMarkdown
function textoDe(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textoDe).join("");
  if (typeof node === "object" && "props" in (node as { props?: { children?: ReactNode } })) {
    return textoDe((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

const CALLOUTS: Record<string, { emoji: string }> = {
  "ponto-chave": { emoji: "🔑" },
  "na pratica": { emoji: "🧩" },
  "na prática": { emoji: "🧩" },
  "mito x ciencia": { emoji: "🔬" },
  "mito × ciência": { emoji: "🔬" },
  "mito x ciência": { emoji: "🔬" },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | undefined>(() => slug ? getPost(slug) : undefined);
  const [loading, setLoading] = useState(!post);
  const [progresso, setProgresso] = useState(0);
  const artigoRef = useRef<HTMLDivElement>(null);

  const area = areaDe(post?.area ?? undefined);
  const cor = area?.cor ?? "var(--c-accent)";

  const toc = useMemo(() => {
    if (!post) return [];
    return post.conteudo.split("\n")
      .filter((l) => /^##\s+/.test(l))
      .map((l) => l.replace(/^##\s+/, "").trim())
      .map((titulo) => ({ titulo, id: slugify(titulo) }));
  }, [post]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    if (post) {
      document.title = post.titulo + " | Bruno Souza Psicologo";
      setLoading(false);
    } else if (slug && !isDynamicLoaded()) {
      loadDynamicPosts().then(() => {
        const found = getPost(slug);
        setPost(found);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => document.documentElement.removeAttribute("data-theme");
  }, [slug, post]);

  useEffect(() => {
    function onScroll() {
      const el = artigoRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const lido = window.scrollY - el.offsetTop;
      const pct = total > 0 ? Math.min(100, Math.max(0, (lido / total) * 100)) : 0;
      setProgresso(pct);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[var(--c-bg)]"><p className="text-[var(--c-muted)]">Carregando...</p></div>;
  if (!post) return <Navigate to="/blog" replace />;

  const AreaIcon = area?.Icon;

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      {/* barra de progresso de leitura */}
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-transparent">
        <div className="h-full transition-[width] duration-150" style={{ width: `${progresso}%`, background: cor }} />
      </div>

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
            ref={artigoRef}
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-6">
              {area && (
                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ background: area.corBg, color: cor }}>
                  {AreaIcon && <AreaIcon size={13} />}
                  {area.label}
                </span>
              )}
              <span className="text-xs font-semibold tracking-widest uppercase text-[var(--c-muted)]">
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

            <motion.p variants={fadeUp} className="text-lg text-[var(--c-muted)] mb-6 leading-relaxed">
              {post.subtitulo}
            </motion.p>

            {/* narracao (feature futura) */}
            <motion.div variants={fadeUp} className="mb-8">
              {post.narracaoUrl ? (
                <audio controls src={post.narracaoUrl} className="w-full" />
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium opacity-70"
                  style={{ borderColor: cor + "55", color: cor }}
                  title="Narracao em audio chega em breve"
                >
                  <Headphones size={14} /> Ouvir narracao (em breve)
                </button>
              )}
            </motion.div>

            {/* indice */}
            {toc.length > 1 && (
              <motion.nav variants={fadeUp} className="mb-8 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-5">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: cor }}>
                  <List size={14} /> Neste artigo
                </p>
                <ol className="space-y-1.5">
                  {toc.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-sm text-[var(--c-muted)] transition-colors hover:text-[var(--c-text)]">
                        <span className="mr-2 font-semibold" style={{ color: cor }}>{i + 1}.</span>{t.titulo}
                      </a>
                    </li>
                  ))}
                </ol>
              </motion.nav>
            )}

            <motion.hr variants={fadeUp} className="border-[var(--c-border)] mb-8" />

            <motion.div
              variants={fadeUp}
              className="blog-article prose prose-stone max-w-none
                prose-headings:font-semibold prose-headings:text-[var(--c-text)]
                prose-p:text-[var(--c-muted)] prose-p:leading-relaxed
                prose-li:text-[var(--c-muted)] prose-li:leading-relaxed
                prose-strong:text-[var(--c-text)]
                prose-a:text-[var(--c-accent)]"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ node, children, ...props }) => {
                    const codeNode = node?.children.find(
                      (c): c is HastElement => c.type === "element" && c.tagName === "code",
                    );
                    if (codeNode) {
                      const lang = linguagemDoCodigo(codeNode);
                      if (lang && LINGUAGENS_RICAS.has(lang)) {
                        return <RichBlock lang={lang} raw={textoBrutoDoCodigo(codeNode)} />;
                      }
                    }
                    return <pre {...props}>{children}</pre>;
                  },
                  table: ({ children }) => (
                    <div className="not-prose my-5 overflow-x-auto rounded-xl border border-[var(--c-border)]">
                      <table className="w-full">{children}</table>
                    </div>
                  ),
                  h2: ({ children }) => {
                    const id = slugify(textoDe(children));
                    return <h2 id={id} className="scroll-mt-24">{children}</h2>;
                  },
                  blockquote: ({ children }) => {
                    const texto = textoDe(children).trim().toLowerCase();
                    const chave = Object.keys(CALLOUTS).find((k) => texto.startsWith(k));
                    if (chave) {
                      const { emoji } = CALLOUTS[chave];
                      return (
                        <div className="not-prose my-5 rounded-2xl p-4" style={{ background: cor + "12", borderLeft: `4px solid ${cor}` }}>
                          <div className="flex gap-3">
                            <span className="text-xl leading-none" aria-hidden="true">{emoji}</span>
                            <div className="text-sm leading-relaxed text-[var(--c-text)] [&_p]:m-0 [&_p]:mt-1 first:[&_p]:mt-0 [&_strong]:font-bold [&_strong]:uppercase [&_strong]:tracking-wide">
                              {children}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <blockquote className="border-l-4 pl-5 py-2 rounded-r-xl bg-[var(--c-surface)] not-italic text-sm text-[var(--c-muted)]" style={{ borderColor: cor + "66" }}>
                        {children}
                      </blockquote>
                    );
                  },
                }}
              >
                {post.conteudo}
              </ReactMarkdown>
            </motion.div>

            {/* referencias */}
            {post.referencias && post.referencias.length > 0 && (
              <motion.div variants={fadeUp} className="mt-12 rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] p-6">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: cor }}>
                  <BookOpen size={14} /> Referencias
                </p>
                <ol className="space-y-2">
                  {post.referencias.map((ref, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-[var(--c-muted)]">
                      <span className="font-semibold" style={{ color: cor }}>{i + 1}.</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            <motion.div
              variants={fadeUp}
              className="mt-12 rounded-2xl bg-[var(--c-bg-dark)] text-white p-8 text-center"
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
