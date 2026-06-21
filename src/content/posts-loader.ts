import { listarPostsPublicados, type BlogPostDB } from "@/lib/supabase";

export interface BlogPost {
  slug: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  tempoLeitura: string;
  resumo: string;
  tags: string[];
  conteudo: string;
  fonte?: "static" | "supabase";
}

const staticModules = import.meta.glob<{ default: BlogPost }>("./blog/*.json", { eager: true });
const staticPosts: BlogPost[] = Object.values(staticModules).map((m) => ({ ...m.default, fonte: "static" as const }));

let dynamicPosts: BlogPost[] = [];
let loaded = false;

function mapDBToPost(row: BlogPostDB): BlogPost {
  return {
    slug: row.slug,
    titulo: row.titulo,
    subtitulo: row.subtitulo,
    categoria: row.categoria,
    tempoLeitura: row.tempo_leitura,
    resumo: row.resumo,
    tags: row.tags,
    conteudo: row.conteudo,
    fonte: "supabase",
  };
}

export async function loadDynamicPosts(): Promise<void> {
  const rows = await listarPostsPublicados();
  dynamicPosts = rows.map(mapDBToPost);
  loaded = true;
}

export function getAllPosts(): BlogPost[] {
  const slugs = new Set<string>();
  const merged: BlogPost[] = [];
  for (const p of dynamicPosts) {
    if (!slugs.has(p.slug)) { slugs.add(p.slug); merged.push(p); }
  }
  for (const p of staticPosts) {
    if (!slugs.has(p.slug)) { slugs.add(p.slug); merged.push(p); }
  }
  return merged;
}

export const posts: BlogPost[] = staticPosts;

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function isDynamicLoaded(): boolean {
  return loaded;
}
