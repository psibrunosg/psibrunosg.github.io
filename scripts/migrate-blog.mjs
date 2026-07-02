// One-time migration: upsert all static JSON blog posts into Supabase
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = "https://hpyarwrgcdbulekfyozs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhweWFyd3JnY2RidWxla2Z5b3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDA5NDEsImV4cCI6MjA5NzM3Njk0MX0.OMO4megaOo0bcCrhlB3sJj-0MEeVDkwCEXlbsq_WNzM";
const BLOG_DIR = join(__dirname, "../src/content/blog");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const files = readdirSync(BLOG_DIR).filter(f => f.endsWith(".json"));
console.log(`Migrando ${files.length} posts...`);

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(BLOG_DIR, file), "utf8"));
  const row = {
    slug: raw.slug,
    titulo: raw.titulo,
    subtitulo: raw.subtitulo,
    categoria: raw.categoria,
    tempo_leitura: raw.tempoLeitura,
    resumo: raw.resumo,
    tags: raw.tags,
    conteudo: raw.conteudo,
    publicado: true,
    area: raw.area ?? null,
    referencias: raw.referencias ?? null,
    narracao_url: raw.narracaoUrl ?? null,
  };
  const { error } = await supabase.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (error) console.error(`ERRO ${file}:`, error.message);
  else console.log(`OK: ${raw.slug}`);
}
console.log("Concluído.");
