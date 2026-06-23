import { Brain, Briefcase, Zap, Leaf, Dumbbell, type LucideIcon } from "lucide-react";

// Catalogo das 5 areas editoriais do blog -> cor, fundo suave e icone.
export interface AreaBlog {
  id: string;
  label: string;
  cor: string;
  corBg: string;
  Icon: LucideIcon;
}

export const areas: Record<string, AreaBlog> = {
  "tcc-esquema":     { id: "tcc-esquema",     label: "TCC & Terapia do Esquema", cor: "#6D4AA0", corBg: "#6D4AA014", Icon: Brain },
  "organizacional":  { id: "organizacional",  label: "Psicologia Organizacional", cor: "#2F6F8F", corBg: "#2F6F8F14", Icon: Briefcase },
  "neurociencia":    { id: "neurociencia",    label: "Neurociencia",              cor: "#B0473A", corBg: "#B0473A14", Icon: Zap },
  "nutricao":        { id: "nutricao",        label: "Nutricao e Psicologia",     cor: "#3E8E5A", corBg: "#3E8E5A14", Icon: Leaf },
  "educacao-fisica": { id: "educacao-fisica", label: "Movimento e Mente",         cor: "#C77A2E", corBg: "#C77A2E14", Icon: Dumbbell },
};

export const areasLista = Object.values(areas);

export function areaDe(id?: string): AreaBlog | undefined {
  return id ? areas[id] : undefined;
}
