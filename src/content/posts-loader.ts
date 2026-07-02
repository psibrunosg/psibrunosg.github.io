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
  area?: string | null;
  referencias?: string[] | null;
  narracaoUrl?: string | null;
  fonte?: "supabase";
}

let cachedPosts: BlogPost[] = [];
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
    area: row.area,
    referencias: row.referencias,
    narracaoUrl: row.narracao_url,
    fonte: "supabase",
  };
}

export async function loadDynamicPosts(): Promise<void> {
  const rows = await listarPostsPublicados();
  cachedPosts = rows.map(mapDBToPost);
  loaded = true;
}

export function getAllPosts(): BlogPost[] {
  return cachedPosts;
}

// ponytail: kept for Painel.tsx import; empty since posts now live only in Supabase
export const posts: BlogPost[] = [];

export function getPost(slug: string): BlogPost | undefined {
  return cachedPosts.find((p) => p.slug === slug);
}

export function isDynamicLoaded(): boolean {
  return loaded;
}
