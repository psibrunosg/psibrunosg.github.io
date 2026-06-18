export interface BlogPost {
  slug: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  tempoLeitura: string;
  resumo: string;
  tags: string[];
  conteudo: string;
}

const modules = import.meta.glob<{ default: BlogPost }>("./blog/*.json", { eager: true });

export const posts: BlogPost[] = Object.values(modules).map((m) => m.default);

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}