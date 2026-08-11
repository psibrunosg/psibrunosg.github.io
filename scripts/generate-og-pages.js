// Gera uma pagina estatica por post do blog, so com as meta tags corretas, para
// que WhatsApp/Twitter/Facebook mostrem titulo e resumo certos ao compartilhar
// o link. O SPA assume dali em diante.
//
// A FONTE E O SUPABASE, nao os JSON de src/content/blog/. Ate 2026-08 este
// script lia os arquivos, e eles deixaram de ser servidos quando os posts
// migraram para o banco: o resultado era 10 paginas OG para slugs que o app nao
// conhece (o link abre, o SPA nao acha o post) e ZERO paginas para os 6 posts
// que existem de verdade (compartilhar mostrava a previa generica da home).
// Os conjuntos de slugs eram inteiramente disjuntos.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const SITE = "https://psibrunosg.github.io";
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Sem credenciais (build local sem .env) nao da para saber quais posts existem.
// Avisa e sai limpo — quebrar o build local por causa de meta tag seria pior.
// Com credenciais, qualquer falha de fetch derruba o build: no CI isso e
// problema de verdade e passar batido significa publicar sem OG.
if (!supabaseUrl || !supabaseKey) {
  console.warn("  OG: VITE_SUPABASE_URL/ANON_KEY ausentes — nenhuma pagina OG gerada.");
  process.exit(0);
}

const indexHtml = readFileSync(join(dist, "index.html"), "utf-8");

const resp = await fetch(
  `${supabaseUrl}/rest/v1/blog_posts?select=slug,titulo,subtitulo,resumo&publicado=eq.true`,
  { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
);

if (!resp.ok) {
  console.error(`  OG: falha ao ler blog_posts (HTTP ${resp.status}): ${await resp.text()}`);
  process.exit(1);
}

const posts = await resp.json();

for (const post of posts) {
  const slug = post.slug;
  const title = `${post.titulo} | Bruno de Souza Gonçalves Psicólogo`;
  const description = post.resumo || post.subtitulo || "";
  const url = `${SITE}/blog/${slug}`;
  const image = `${SITE}/img/foto.jpg`;

  const ogTags = `
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(post.titulo)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:locale" content="pt_BR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(post.titulo)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />`;

  const pageHtml = indexHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    // Sem isto o canonical de toda pagina de post apontava para a home, e o
    // Google tratava os posts como duplicatas dela.
    .replace(/<link rel="canonical"[^>]*\/?>/, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta property="og:type"[^>]*\/>/, "")
    .replace(/<meta property="og:url"[^>]*\/>/, "")
    .replace(/<meta property="og:title"[^>]*\/>/, "")
    .replace(/<meta property="og:description"[^>]*\/>/, "")
    .replace(/<meta property="og:image"[^>]*\/>/, "")
    .replace(/<meta name="twitter:card"[^>]*\/>/, "")
    .replace(/<meta name="twitter:title"[^>]*\/>/, "")
    .replace(/<meta name="twitter:description"[^>]*\/>/, "")
    .replace(/<meta name="twitter:image"[^>]*\/>/, "")
    .replace("</head>", `${ogTags}\n  </head>`);

  const outDir = join(dist, "blog", slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), pageHtml);
  console.log(`  OG page: /blog/${slug}/`);
}

console.log(`Generated ${posts.length} OG pages.`);

function escapeHtml(str) {
  return String(str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
