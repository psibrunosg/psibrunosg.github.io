import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key);

export interface QuestionnaireResponse {
  id?: number;
  tipo: "phq9" | "gad7";
  nome: string;
  telefone?: string;
  respostas: number[];
  pontuacao: number;
  criado_em?: string;
}

export async function salvarResposta(data: QuestionnaireResponse) {
  return supabase.from("respostas_questionarios").insert(data);
}