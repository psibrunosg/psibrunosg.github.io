import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
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
    document.title = "Blog | Bruno Souza Psicologo | Saude Mental TCC Pelotas";
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
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-muted)] hover:text-[var(--c-accent)] transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          <motion.div variants={stagger.container} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-xs tracking-[0.3em] uppercase text-[var(--c-accent)] font-semibold mb-2">
              Conteudo educativo
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-semibold text-[var(--c-text)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Blog
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[var(--c-muted)] max-w-xl mb-8 leading-relaxed">
              Textos sobre saude mental, terapia e o que acontece quando decidimos entender melhor o que sentimos. Baseados em pesquisa recente, escritos para serem lidos sem dor de cabeca.
            </motion.p>

            {/* filtro por area */}
            <motion.div variants={fadeUp} className="mb-12 flex flex-wrap gap-2">
              <button onClick={() => setAreaFiltro("todos")}
                className={"rounded-full px-3 py-1.5 text-xs font-semibold transition-all " + (areaFiltro === "todos" ? "bg-[var(--c-accent)] text-white" : "border border-[var(--c-border)] text-[var(--c-muted)] hover:text-[var(--c-text)]")}>
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
                    className="group rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] transition-colors overflow-hidden"
                    style={{ borderLeftWidth: 4, borderLeftColor: cor }}
                  >
                    <Link to={"/blog/" + post.slug} className="block p-7">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full"
                          style={{ color: cor, background: cor + "20" }}
                        >
                          {AreaIcon && <AreaIcon size={12} />}
                          {area?.label ?? post.categoria}
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
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: cor }}>
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