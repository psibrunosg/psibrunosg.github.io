import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase = url && key ? createClient(url, key) : null;

export interface QuestionnaireResponse {
  id?: number;
  tipo: string;
  nome: string;
  telefone?: string;
  nascimento?: string;
  respostas: number[];
  pontuacao: number;
  criado_em?: string;
  consentimento_lgpd?: boolean;
}

export async function salvarResposta(data: QuestionnaireResponse) {
  if (!supabase) {
    console.warn("Supabase nao configurado — resposta nao salva.");
    return { error: null };
  }
  return supabase.from("respostas_questionarios").insert(data);
}

export interface BlogPostDB {
  id?: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  categoria: string;
  tempo_leitura: string;
  resumo: string;
  tags: string[];
  conteudo: string;
  publicado: boolean;
  area?: string | null;
  referencias?: string[] | null;
  narracao_url?: string | null;
  criado_em?: string;
  atualizado_em?: string;
}

export async function listarPostsBlog() {
  if (!supabase) return [];
  const { data } = await supabase.from("blog_posts").select("*").order("criado_em", { ascending: false });
  return (data as BlogPostDB[]) ?? [];
}

export async function listarPostsPublicados() {
  if (!supabase) return [];
  const { data } = await supabase.from("blog_posts").select("*").eq("publicado", true).order("criado_em", { ascending: false });
  return (data as BlogPostDB[]) ?? [];
}

export async function salvarPostBlog(post: Omit<BlogPostDB, "id" | "criado_em" | "atualizado_em">) {
  if (!supabase) return { error: { message: "Supabase nao configurado" } };
  return supabase.from("blog_posts").insert({ ...post, atualizado_em: new Date().toISOString() });
}

export async function atualizarPostBlog(id: number, post: Partial<BlogPostDB>) {
  if (!supabase) return { error: { message: "Supabase nao configurado" } };
  return supabase.from("blog_posts").update({ ...post, atualizado_em: new Date().toISOString() }).eq("id", id);
}

export async function deletarPostBlog(id: number) {
  if (!supabase) return { error: { message: "Supabase nao configurado" } };
  return supabase.from("blog_posts").delete().eq("id", id);
}