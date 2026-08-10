import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight, BookOpen, PawPrint, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllPosts, loadDynamicPosts, isDynamicLoaded, type BlogPost } from "@/content/posts-loader";
import { areaDe, areasLista } from "@/content/areas-blog";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { EthicalFooter } from "@/components/shared/EthicalFooter";
import { SkipLink } from "@/components/shared/SkipLink";
import { WhatsAppFloat } from "@/components/shared/WhatsAppFloat";
import { contato } from "@/content/copy";
import { fadeUp, stagger } from "@/lib/motion";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Blog", href: "/blog" },
];

const categoriaCor: Record<string, string> = {
  "Abordagens": "#B05D3A",
  "Condicoes": "#4A6B47",
  "Publico": "#8A6A3A",
};

export default function Blog() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>(getAllPosts());
  const [areaFiltro, setAreaFiltro] = useState<string>("todos");
  const filtered = areaFiltro === "todos" ? allPosts : allPosts.filter((p) => p.area === areaFiltro);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "lobo");
    document.title = "Blog | Bruno de Souza Gonçalves Psicologo | Saude Mental TCC Pelotas";
    if (!isDynamicLoaded()) {
      loadDynamicPosts().then(() => setAllPosts(getAllPosts()));
    }
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <>
      <SkipLink />
      <MobileMenu items={navItems} crp={contato.crp} whatsappLink={contato.whatsappLink} />
      <WhatsAppFloat />

      <main id="main" className="min-h-screen bg-[var(--c-bg)] pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.section variants={fadeUp} className="mb-10 grid items-center gap-10 rounded-[32px] border border-[var(--c-border)] bg-[var(--c-surface)] p-7 shadow-sm md:grid-cols-[1.15fr_0.85fr] md:p-10">
              <div>
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Conteudo educativo
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-medium text-[var(--c-accent)] mb-4 md:text-[3.4rem] md:leading-[1.1]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Blog
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-7 leading-relaxed">
              Textos sobre saude mental, terapia e o que acontece quando decidimos entender melhor o que sentimos. Baseados em pesquisa recente, escritos para serem lidos sem dor de cabeca.
            </motion.p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[var(--c-text)]"><span className="inline-flex items-center gap-1.5"><BookOpen size={15} className="text-[var(--c-warm)]" />leitura acessível</span><span className="inline-flex items-center gap-1.5"><Sparkles size={15} className="text-[var(--c-warm)]" />baseada em evidências</span></div>
              </div>
              <div className="relative mx-auto flex h-48 w-48 items-center justify-center md:h-60 md:w-60"><PawPrint aria-hidden size={24} className="absolute left-0 top-5 -rotate-12 text-[var(--c-moss-dk)]/50" /><div className="lobo-blob flex h-full w-full items-center justify-center" style={{ background: "color-mix(in oklab, var(--c-moss) 42%, var(--c-bg))", animation: "lobo-float 7s ease-in-out infinite" }}><img src="/img/lobo.svg" alt="" className="h-[82%] w-[82%] object-contain" /></div></div>
            </motion.section>

            {/* filtro por area */}
            <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-2.5">
              <button onClick={() => setAreaFiltro("todos")}
                className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (areaFiltro === "todos" ? "bg-[var(--c-accent)] text-[var(--c-on-accent)]" : "border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)]")}>
                Todas
              </button>
              {areasLista.map((a) => {
                const Icon = a.Icon;
                const ativo = areaFiltro === a.id;
                return (
                  <button key={a.id} onClick={() => setAreaFiltro(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                    style={ativo ? { background: a.cor, color: "#fff" } : { background: a.corBg, color: a.cor }}>
                    <Icon size={13} /> {a.label}
                  </button>
                );
              })}
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((post, i) => {
                const area = areaDe(post.area ?? undefined);
                const cor = area?.cor ?? categoriaCor[post.categoria] ?? "var(--c-accent)";
                const AreaIcon = area?.Icon;
                return (
                  <motion.article
                    key={post.slug}
                    variants={fadeUp}
                    custom={i}
                    className="lobo-card group overflow-hidden rounded-[26px] border border-[var(--c-border)] bg-[var(--c-surface)] transition-shadow hover:shadow-lg"
                    style={{ borderColor: "var(--c-border)" }}
                  >
                    <Link to={"/blog/" + post.slug} className="block p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="lobo-blob inline-flex h-11 w-11 items-center justify-center" style={{ color: cor, background: cor + "20" }}>
                          {AreaIcon && <AreaIcon size={12} />}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[var(--c-muted)]">
                          <Clock size={13} aria-hidden="true" />
                          {post.tempoLeitura}
                        </span>
                      </div>
                      <h2
                        className="text-xl font-semibold text-[var(--c-text)] mb-2 transition-colors"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {post.titulo}
                      </h2>
                      <p className="text-[var(--c-muted)] text-sm leading-relaxed mb-5">{post.resumo}</p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: cor }}>
                        Ler artigo <ArrowRight size={15} />
                      </span>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>

      <EthicalFooter />
    </>
  );
}
