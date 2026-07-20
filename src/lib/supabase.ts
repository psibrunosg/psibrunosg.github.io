import { createClient, FunctionsHttpError } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL ?? "";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabase = url && key ? createClient(url, key) : null;

// supabase-js lança FunctionsHttpError com mensagem genérica ("Edge Function returned
// a non-2xx status code") — o corpo JSON real do erro fica em `error.context` (a Response),
// só acessível via .json(). Sem isso o usuário nunca vê a causa (secret faltando, etc).
export async function mensagemErroEdgeFunction(e: unknown, fallback: string): Promise<string> {
  if (e instanceof FunctionsHttpError) {
    try {
      const body = await e.context.json();
      if (body?.error) return body.error;
    } catch {
      // corpo não era JSON — cai no fallback abaixo
    }
  }
  return e instanceof Error ? e.message : fallback;
}

export interface QuestionnaireResponse {
  id?: number;
  tipo: string;
  // Decisão clínica (12/07/2026): reversão da anonimização de 09/07/2026 —
  // o paciente volta a se identificar (nome, CPF, nascimento, e-mail,
  // telefone, contato de emergência) para responder qualquer escala,
  // com consentimento explícito (TCLE). Quando menor de idade, os dados
  // do responsável legal também são obrigatórios.
  nome: string;
  cpf: string;
  nascimento: string;
  email: string;
  telefone: string;
  contato_emergencia_nome: string;
  contato_emergencia_telefone: string;
  responsavel_nome?: string;
  responsavel_telefone?: string;
  is_menor?: boolean;
  patient_code?: string;
  situacao_clinica?: string;
  classificacao_profissional?: string;
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
