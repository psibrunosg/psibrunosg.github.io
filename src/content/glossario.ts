export interface TermoGlossario {
  termo: string; // exact text to match in post body, case-insensitive
  definicao: string;
}

export const GLOSSARIO: TermoGlossario[] = [
  { termo: "TCC", definicao: "Terapia Cognitivo-Comportamental — abordagem que trabalha a relação entre pensamentos, emoções e comportamentos." },
  { termo: "esquema", definicao: "Padrão emocional e cognitivo profundo, formado na infância, que molda como a pessoa se vê e vê o mundo." },
  { termo: "distorção cognitiva", definicao: "Padrão de pensamento tendencioso que distorce a percepção da realidade (ex.: catastrofização, pensamento tudo-ou-nada)." },
  { termo: "ruminação", definicao: "Repetição mental excessiva e improdutiva de pensamentos negativos ou preocupações." },
  { termo: "psicoeducação", definicao: "Processo de ensinar o paciente sobre sua condição, sintomas e tratamento, de forma acessível." },
];
