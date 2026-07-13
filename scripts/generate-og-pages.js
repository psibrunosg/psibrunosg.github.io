import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const blogDir = join(root, "src", "content", "blog");

const indexHtml = readFileSync(join(dist, "index.html"), "utf-8");

const files = readdirSync(blogDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const post = JSON.parse(readFileSync(join(blogDir, file), "utf-8").replace(/^﻿/, ""));
  const slug = post.slug;
  const title = post.titulo + " | Bruno de Souza Gonçalves Psicólogo";
  const description = post.resumo || post.subtitulo || "";
  const url = "https://psibrunosg.github.io/blog/" + slug;
  const image = "https://psibrunosg.github.io/img/foto.jpg";

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
    .replace(/<meta property="og:type"[^>]*\/>/, "")
    .replace(/<meta property="og:url"[^>]*\/>/, "")
    .replace(/<meta property="og:title"[^>]*\/>/, "")
    .replace(/<meta property="og:description"[^>]*\/>/, "")
    .replace(/<meta property="og:image"[^>]*\/>/, "")
    .replace(/<meta name="twitter:card"[^>]*\/>/, "")
    .replace(/<meta name="twitter:title"[^>]*\/>/, "")
    .replace(/<meta name="twitter:description"[^>]*\/>/, "")
    .replace(/<meta name="twitter:image"[^>]*\/>/, "")
    .replace("</head>", ogTags + "\n  </head>");

  const outDir = join(dist, "blog", slug);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), pageHtml);
  console.log("  OG page: /blog/" + slug + "/");
}

console.log(`Generated ${files.length} OG pages.`);

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
