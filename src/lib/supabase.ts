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
}

export async function salvarResposta(data: QuestionnaireResponse) {
  if (!supabase) {
    console.warn("Supabase nao configurado — resposta nao salva.");
    return { error: null };
  }
  return supabase.from("respostas_questionarios").insert(data);
}