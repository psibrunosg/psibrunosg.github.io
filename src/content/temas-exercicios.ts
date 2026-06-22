// Catalogo de objetivos terapeuticos -> cor/tema.
// Cada objetivo tem uma familia de cor. Esquemas sao coloridos pelo dominio de Young.

export interface TemaExercicio {
  id: string;
  label: string;
  cor: string;     // cor principal (texto/fita)
  corBg: string;   // fundo suave (hex + alpha)
}

export const temas: Record<string, TemaExercicio> = {
  autoestima:    { id: "autoestima",    label: "Autoestima",          cor: "#C2658A", corBg: "#C2658A14" },
  autoconhecimento: { id: "autoconhecimento", label: "Autoconhecimento", cor: "#7A4A8C", corBg: "#7A4A8C14" },
  cognicao:      { id: "cognicao",      label: "Cognicao",            cor: "#3A6B8C", corBg: "#3A6B8C14" },
  emocao:        { id: "emocao",        label: "Regulacao Emocional", cor: "#2F8C7A", corBg: "#2F8C7A14" },
  comportamento: { id: "comportamento", label: "Comportamento",       cor: "#C0773A", corBg: "#C0773A14" },
  enfrentamento: { id: "enfrentamento", label: "Enfrentamento",       cor: "#5B6B8C", corBg: "#5B6B8C14" },
  esquema:       { id: "esquema",       label: "Terapia do Esquema",  cor: "#8C5A3A", corBg: "#8C5A3A14" },
};

// 5 dominios de Young -> cor (cada esquema herda a cor do seu dominio)
const dominioCores: Record<string, string> = {
  desconexao:    "#C24A4A", // Desconexao e Rejeicao
  autonomia:     "#C08A2F", // Autonomia e Desempenho Prejudicados
  limites:       "#8C6B3A", // Limites Prejudicados
  orientacao:    "#3A8C6B", // Orientacao para o Outro
  supervigilancia:"#5B5B9C",// Supervigilancia e Inibicao
};

// nome do esquema (lowercase, sem acento) -> dominio
const esquemaDominio: Record<string, keyof typeof dominioCores> = {
  "abandono": "desconexao",
  "desconfianca/abuso": "desconexao",
  "desconfianca": "desconexao",
  "abuso": "desconexao",
  "privacao emocional": "desconexao",
  "defectividade": "desconexao",
  "defectividade/vergonha": "desconexao",
  "isolamento social": "desconexao",
  "isolamento social/alienacao": "desconexao",
  "dependencia": "autonomia",
  "dependencia/incompetencia": "autonomia",
  "vulnerabilidade ao dano": "autonomia",
  "vulnerabilidade": "autonomia",
  "emaranhamento": "autonomia",
  "fracasso": "autonomia",
  "arrogo/grandiosidade": "limites",
  "grandiosidade": "limites",
  "autocontrole insuficiente": "limites",
  "subjugacao": "orientacao",
  "autossacrificio": "orientacao",
  "auto-sacrificio": "orientacao",
  "busca de aprovacao": "orientacao",
  "negativismo": "supervigilancia",
  "negativismo/pessimismo": "supervigilancia",
  "inibicao emocional": "supervigilancia",
  "padroes inflexiveis": "supervigilancia",
  "postura punitiva": "supervigilancia",
};

function normalizar(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// cor especifica de um esquema pelo nome (cai na cor do dominio; fallback = cor do tema esquema)
export function corEsquema(esquema?: string): string {
  if (!esquema) return temas.esquema.cor;
  const dom = esquemaDominio[normalizar(esquema)];
  return dom ? dominioCores[dom] : temas.esquema.cor;
}

// mapeia categoria/esquema -> tema (objetivo)
export function temaDe(categoria: string, esquema?: string): TemaExercicio {
  const c = normalizar(categoria);
  if (c.startsWith("esquema") || esquema) return temas.esquema;
  if (c.includes("autoestima") || c.includes("autoconfianca") || c.includes("autocompaixao") || c.includes("autopercepcao")) return temas.autoestima;
  if (c.includes("autoconhecimento")) return temas.autoconhecimento;
  if (c.includes("cognit") || c.includes("pensament") || c.includes("reestrutur") || c.includes("pressupost") || c.includes("crenca") || c.includes("reatribuicao") || c.includes("processamento de informacao") || c.includes("decisao") || c.includes("modos")) return temas.cognicao;
  if (c.includes("emocao") || c.includes("emocional") || c.includes("regulacao") || c.includes("mindfulness") || c.includes("fisiologica") || c.includes("ruminacao") || c.includes("preocupacao")) return temas.emocao;
  if (c.includes("ativacao") || c.includes("exposicao") || c.includes("comportament")) return temas.comportamento;
  if (c.includes("enfrentamento") || c.includes("habilidades")) return temas.enfrentamento;
  return temas.autoconhecimento;
}

// cor efetiva de um exercicio: esquema usa cor do dominio, resto usa cor do tema
export function corExercicio(categoria: string, esquema?: string): { cor: string; corBg: string; tema: TemaExercicio } {
  const tema = temaDe(categoria, esquema);
  if (tema.id === "esquema") {
    const cor = corEsquema(esquema || categoria.replace(/^esquema:\s*/i, ""));
    return { cor, corBg: cor + "14", tema };
  }
  return { cor: tema.cor, corBg: tema.corBg, tema };
}
