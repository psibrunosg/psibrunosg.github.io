// Tipos compartilhados dos blocos ricos de blog (fenced code blocks customizados)

export type MindMapNo = {
  titulo: string;
  cor?: string;
  filhos?: string[];
};

export type MindMapData = {
  centro: string;
  nos: MindMapNo[];
};

export type GraficoPonto = {
  label: string;
  valor: number;
};

export type GraficoData = {
  tipo: "barras" | "linha";
  titulo?: string;
  dados: GraficoPonto[];
  unidade?: string;
  fonte?: string;
};

export type DestaqueTipo = "dica" | "alerta" | "info" | "mito";

export type DestaqueData = {
  tipo: DestaqueTipo;
  titulo?: string;
  texto: string;
};

export type RevelarData = {
  titulo: string;
  conteudo: string;
};

export type PassosData = {
  titulo?: string;
  passos: string[];
};
