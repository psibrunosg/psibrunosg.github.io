// ============================================================
// TABELAS NORMATIVAS — extraídas dos manuais oficiais
// ============================================================

// ------ PHQ-9 ------
export const phq9Faixas = [
  { min: 0, max: 4, classificacao: "Mínima", descricao: "Sintomatologia depressiva mínima." },
  { min: 5, max: 9, classificacao: "Leve", descricao: "Sintomatologia depressiva leve." },
  { min: 10, max: 14, classificacao: "Moderada", descricao: "Sintomatologia depressiva moderada." },
  { min: 15, max: 19, classificacao: "Moderadamente grave", descricao: "Sintomatologia depressiva moderadamente grave." },
  { min: 20, max: 27, classificacao: "Grave", descricao: "Sintomatologia depressiva grave." },
] as const;

// ------ GAD-7 ------
export const gad7Faixas = [
  { min: 0, max: 4, classificacao: "Mínima", descricao: "Sintomatologia ansiosa mínima." },
  { min: 5, max: 9, classificacao: "Leve", descricao: "Sintomatologia ansiosa leve." },
  { min: 10, max: 14, classificacao: "Moderada", descricao: "Sintomatologia ansiosa moderada." },
  { min: 15, max: 21, classificacao: "Grave", descricao: "Sintomatologia ansiosa grave." },
] as const;

// ------ BAI ------
export const baiFaixas = [
  { min: 0, max: 10, classificacao: "Mínimo", descricao: "Nível mínimo de ansiedade." },
  { min: 11, max: 19, classificacao: "Leve", descricao: "Ansiedade leve." },
  { min: 20, max: 30, classificacao: "Moderado", descricao: "Ansiedade moderada." },
  { min: 31, max: 63, classificacao: "Grave", descricao: "Ansiedade grave." },
] as const;

// ------ BDI-II ------
export const bdiFaixas = [
  { min: 0, max: 13, classificacao: "Mínimo", descricao: "Nível mínimo de depressão." },
  { min: 14, max: 19, classificacao: "Leve", descricao: "Depressão leve." },
  { min: 20, max: 28, classificacao: "Moderado", descricao: "Depressão moderada." },
  { min: 29, max: 63, classificacao: "Grave", descricao: "Depressão grave." },
] as const;

// ------ BHS (Escala de Desesperança de Beck) ------
export const bhsFaixas = [
  { min: 0, max: 4, classificacao: "Mínimo", descricao: "Nível mínimo de desesperança." },
  { min: 5, max: 8, classificacao: "Leve", descricao: "Desesperança leve." },
  { min: 9, max: 13, classificacao: "Moderado", descricao: "Desesperança moderada." },
  { min: 14, max: 20, classificacao: "Grave", descricao: "Desesperança grave." },
] as const;

// ------ ASRS-18 (Rastreio TDAH) ------
export const asrsFaixas = [
  { min: 0, max: 16, classificacao: "Sem indicativo", descricao: "Sem indicativo de TDAH." },
  { min: 17, max: 23, classificacao: "Provável", descricao: "Indicativo provável de TDAH — recomenda-se avaliação aprofundada." },
  { min: 24, max: 72, classificacao: "Altamente provável", descricao: "Altamente provável de TDAH — avaliação neuropsicológica indicada." },
] as const;

// ------ Rosenberg / EAR (Autoestima) — escore 10-40, maior = melhor ------
export const rosenbergFaixas = [
  { min: 10, max: 24, classificacao: "Baixa", descricao: "Autoestima reduzida. Recomenda-se acompanhamento." },
  { min: 25, max: 34, classificacao: "Media", descricao: "Autoestima na faixa media." },
  { min: 35, max: 40, classificacao: "Satisfatoria", descricao: "Autoestima satisfatoria." },
] as const;

// ------ PSS-10 (Estresse Percebido) — escore 0-40 ------
export const pss10Faixas = [
  { min: 0, max: 13, classificacao: "Baixo", descricao: "Nivel baixo de estresse percebido." },
  { min: 14, max: 26, classificacao: "Moderado", descricao: "Estresse percebido moderado." },
  { min: 27, max: 40, classificacao: "Alto", descricao: "Estresse percebido alto." },
] as const;

// ------ ISI (Índice de Gravidade de Insônia) — escore 0-28 ------
export const isiFaixas = [
  { min: 0, max: 7, classificacao: "Sem insonia clinica", descricao: "Sem indicativo de insonia clinicamente significativa." },
  { min: 8, max: 14, classificacao: "Insonia subclinica", descricao: "Insonia subclinica — sintomas leves." },
  { min: 15, max: 21, classificacao: "Insonia moderada", descricao: "Insonia clinica moderada." },
  { min: 22, max: 28, classificacao: "Insonia grave", descricao: "Insonia clinica grave." },
] as const;

// ------ AUDIT (Uso de Álcool — OMS) — escore 0-40 ------
export const auditFaixas = [
  { min: 0, max: 7, classificacao: "Baixo risco", descricao: "Uso de baixo risco ou abstinencia." },
  { min: 8, max: 15, classificacao: "Uso de risco", descricao: "Uso de risco — orientacao sobre reducao recomendada." },
  { min: 16, max: 19, classificacao: "Uso nocivo", descricao: "Uso nocivo — intervencao breve indicada." },
  { min: 20, max: 40, classificacao: "Provavel dependencia", descricao: "Provavel dependencia — encaminhamento para avaliacao especializada." },
] as const;

// ------ SCS (Autocompaixão — Neff) — escore 26-130 (após inversão), maior = melhor ------
// Neff (2003): mean ≤2.49 = baixa, 2.50-3.49 = moderada, ≥3.50 = alta. ×26 itens para soma.
export const scsFaixas = [
  { min: 26, max: 64, classificacao: "Baixa", descricao: "Autocompaixão reduzida. Recomenda-se trabalho terapêutico focado em autocuidado." },
  { min: 65, max: 90, classificacao: "Moderada", descricao: "Autocompaixão na faixa moderada." },
  { min: 91, max: 130, classificacao: "Alta", descricao: "Autocompaixão satisfatória." },
] as const;

// ------ MDQ (Rastreio Bipolar) — escore 0-13 ------
export const mdqFaixas = [
  { min: 0, max: 6, classificacao: "Rastreio negativo", descricao: "Sem indicativo de transtorno bipolar neste rastreio." },
  { min: 7, max: 13, classificacao: "Rastreio positivo", descricao: "Rastreio positivo para transtorno bipolar — avaliação clínica aprofundada recomendada." },
] as const;

// ------ PCL-5 (TEPT) — escore 0-80 ------
export const pcl5Faixas = [
  { min: 0, max: 18, classificacao: "Minimo", descricao: "Sintomatologia de TEPT mínima." },
  { min: 19, max: 32, classificacao: "Moderado", descricao: "Sintomatologia de TEPT moderada — monitorar." },
  { min: 33, max: 80, classificacao: "Clinicamente significativo", descricao: "Provável TEPT — avaliação clínica indicada." },
] as const;

// ------ OCI-R (TOC) — escore 0-72 ------
export const ocirFaixas = [
  { min: 0, max: 20, classificacao: "Sem significancia clinica", descricao: "Sintomas obsessivo-compulsivos dentro da faixa normal." },
  { min: 21, max: 72, classificacao: "Clinicamente significativo", descricao: "Sintomas obsessivo-compulsivos clinicamente significativos — avaliação recomendada." },
] as const;

// ------ Epworth / ESS (Sonolência Diurna) — escore 0-24 ------
export const epworthFaixas = [
  { min: 0, max: 6, classificacao: "Normal", descricao: "Sonolência diurna dentro da faixa normal." },
  { min: 7, max: 8, classificacao: "Media", descricao: "Sonolência diurna média." },
  { min: 9, max: 14, classificacao: "Elevada", descricao: "Sonolência diurna elevada — investigar qualidade do sono." },
  { min: 15, max: 24, classificacao: "Excessiva", descricao: "Sonolência diurna excessiva — encaminhamento para avaliação do sono." },
] as const;

// ------ DASS-21 (Depressão, Ansiedade e Estresse) — escore 0-63 ------
export const dass21Faixas = [
  { min: 0, max: 9, classificacao: "Normal", descricao: "Niveis normais de depressao, ansiedade e estresse." },
  { min: 10, max: 13, classificacao: "Leve", descricao: "Sintomatologia leve." },
  { min: 14, max: 20, classificacao: "Moderada", descricao: "Sintomatologia moderada." },
  { min: 21, max: 27, classificacao: "Grave", descricao: "Sintomatologia grave." },
  { min: 28, max: 63, classificacao: "Muito grave", descricao: "Sintomatologia muito grave — avaliacao clinica recomendada." },
] as const;

// ------ MAAS (Atenção e Consciência Plena) — escore 15-90 ------
export const maasFaixas = [
  { min: 15, max: 35, classificacao: "Baixa", descricao: "Atencao plena reduzida — mindfulness pode ser util." },
  { min: 36, max: 59, classificacao: "Moderada", descricao: "Nivel moderado de atencao plena." },
  { min: 60, max: 90, classificacao: "Alta", descricao: "Nivel elevado de atencao plena." },
] as const;

// ------ SPIN (Fobia Social) — escore 0-68 ------
export const spinFaixas = [
  { min: 0, max: 20, classificacao: "Sem fobia social", descricao: "Sem indicativo de fobia social." },
  { min: 21, max: 30, classificacao: "Leve", descricao: "Fobia social leve." },
  { min: 31, max: 40, classificacao: "Moderada", descricao: "Fobia social moderada." },
  { min: 41, max: 50, classificacao: "Grave", descricao: "Fobia social grave." },
  { min: 51, max: 68, classificacao: "Muito grave", descricao: "Fobia social muito grave — avaliacao clinica recomendada." },
] as const;

// ------ WHO-5 (Índice de Bem-Estar da OMS) — escore bruto 0-25 ------
// Maior = melhor. ×4 = percentual. ≤50% (bruto ≤12) rastreio positivo; <28% (bruto ≤6) provável depressão.
export const who5Faixas = [
  { min: 0, max: 6, classificacao: "Muito baixo", descricao: "Bem-estar muito reduzido (≤24%). Recomenda-se investigar sintomatologia depressiva." },
  { min: 7, max: 12, classificacao: "Baixo", descricao: "Bem-estar reduzido (28-48%). Rastreio positivo — recomenda-se avaliação." },
  { min: 13, max: 25, classificacao: "Adequado", descricao: "Bem-estar satisfatório (≥52%)." },
] as const;

// ============================================================
// G-36 — Tabela 20: Padronização 2001, São Paulo
// Percentil → Pontos por escolaridade
// ============================================================
export interface G36Norma { percentil: number; ensMedio: number; superior: number; geral: number; }

export const g36Tabela2001SP: G36Norma[] = [
  { percentil: 1,  ensMedio: 7,  superior: 8,  geral: 7  },
  { percentil: 5,  ensMedio: 11, superior: 17, geral: 13 },
  { percentil: 10, ensMedio: 13, superior: 18, geral: 15 },
  { percentil: 20, ensMedio: 16, superior: 20, geral: 17 },
  { percentil: 25, ensMedio: 17, superior: 21, geral: 18 },
  { percentil: 30, ensMedio: 18, superior: 21, geral: 20 },
  { percentil: 40, ensMedio: 19, superior: 23, geral: 23 },
  { percentil: 50, ensMedio: 21, superior: 24, geral: 23 },
  { percentil: 60, ensMedio: 23, superior: 26, geral: 25 },
  { percentil: 70, ensMedio: 25, superior: 28, geral: 26 },
  { percentil: 75, ensMedio: 26, superior: 28, geral: 27 },
  { percentil: 80, ensMedio: 27, superior: 29, geral: 28 },
  { percentil: 90, ensMedio: 29, superior: 31, geral: 30 },
  { percentil: 95, ensMedio: 30, superior: 33, geral: 32 },
  { percentil: 99, ensMedio: 34, superior: 34, geral: 34 },
];

export const g36Classificacoes = [
  { minPercentil: 0,  maxPercentil: 5,  classificacao: "Inferior" },
  { minPercentil: 10, maxPercentil: 25, classificacao: "Médio Inferior" },
  { minPercentil: 30, maxPercentil: 70, classificacao: "Médio" },
  { minPercentil: 75, maxPercentil: 90, classificacao: "Médio Superior" },
  { minPercentil: 95, maxPercentil: 95, classificacao: "Superior" },
  { minPercentil: 99, maxPercentil: 99, classificacao: "Muito Superior" },
] as const;

export type G36Escolaridade = "ensMedio" | "superior" | "geral";

export function classificarG36(acertos: number, escolaridade: G36Escolaridade): { percentil: number; classificacao: string } {
  const tabela = g36Tabela2001SP;
  let percentil = 1;
  for (const row of tabela) {
    if (acertos >= row[escolaridade]) percentil = row.percentil;
  }
  const classif = g36Classificacoes.find((c) => percentil >= c.minPercentil && percentil <= c.maxPercentil);
  return { percentil, classificacao: classif?.classificacao ?? "Médio" };
}

// ============================================================
// NEO FFI-R — Conversão Escore Bruto → T
// Médias e DP da amostra brasileira (N=1331)
// ============================================================
export const neoFFIRNormas = {
  combinado: { N: { m: 25.00, dp: 6.92 }, E: { m: 30.00, dp: 5.61 }, O: { m: 32.41, dp: 5.71 }, A: { m: 32.39, dp: 5.20 }, C: { m: 32.26, dp: 6.54 } },
  masculino: { N: { m: 23.09, dp: 6.72 }, E: { m: 29.34, dp: 5.67 }, O: { m: 32.29, dp: 5.91 }, A: { m: 31.80, dp: 5.32 }, C: { m: 31.51, dp: 6.88 } },
  feminino:  { N: { m: 26.55, dp: 6.73 }, E: { m: 30.33, dp: 5.56 }, O: { m: 32.47, dp: 5.65 }, A: { m: 32.68, dp: 5.12 }, C: { m: 32.63, dp: 6.33 } },
} as const;

export type NeoFFIDominio = "N" | "E" | "O" | "A" | "C";
export type NeoSexo = "combinado" | "masculino" | "feminino";

export function calcularTScoreNeoFFI(dominio: NeoFFIDominio, bruto: number, sexo: NeoSexo = "combinado"): number {
  const { m, dp } = neoFFIRNormas[sexo][dominio];
  return Math.round(50 + 10 * ((bruto - m) / dp));
}

// ============================================================
// NEO PI-R / NEO FFI-R — Classificação por T-Score
// ============================================================
export const neoClassificacoes = [
  { minT: 0,  maxT: 34, classificacao: "Muito Baixo" },
  { minT: 35, maxT: 44, classificacao: "Baixo" },
  { minT: 45, maxT: 55, classificacao: "Médio" },
  { minT: 56, maxT: 65, classificacao: "Alto" },
  { minT: 66, maxT: 100, classificacao: "Muito Alto" },
] as const;

export function classificarNeoT(tScore: number): string {
  const c = neoClassificacoes.find((f) => tScore >= f.minT && tScore <= f.maxT);
  return c?.classificacao ?? "Médio";
}

export const neoDominioNomes: Record<NeoFFIDominio, string> = {
  N: "Neuroticismo",
  E: "Extroversão",
  O: "Abertura à Experiência",
  A: "Amabilidade",
  C: "Conscienciosidade",
};

export const neoFacetasNomes: Record<string, string> = {
  N1: "Ansiedade", N2: "Hostilidade", N3: "Depressão", N4: "Embaraço/Constrangimento", N5: "Impulsividade", N6: "Vulnerabilidade",
  E1: "Acolhimento", E2: "Gregarismo", E3: "Assertividade", E4: "Atividade", E5: "Busca de sensações", E6: "Emoções positivas",
  O1: "Fantasia", O2: "Estética", O3: "Sentimentos", O4: "Ações variadas", O5: "Ideias", O6: "Valores",
  A1: "Confiança", A2: "Franqueza", A3: "Altruísmo", A4: "Complacência", A5: "Modéstia", A6: "Sensibilidade",
  C1: "Competência", C2: "Ordem", C3: "Senso do dever", C4: "Esforço por realizações", C5: "Autodisciplina", C6: "Ponderação",
};

export const neoFacetasPorDominio: Record<NeoFFIDominio, string[]> = {
  N: ["N1", "N2", "N3", "N4", "N5", "N6"],
  E: ["E1", "E2", "E3", "E4", "E5", "E6"],
  O: ["O1", "O2", "O3", "O4", "O5", "O6"],
  A: ["A1", "A2", "A3", "A4", "A5", "A6"],
  C: ["C1", "C2", "C3", "C4", "C5", "C6"],
};

// ============================================================
// TEADI (Atenção Dividida) — Normas SP (N=715)
// Tabela 60: população geral de São Paulo
// ============================================================
export interface AtencaoNorma { percentil: number; pontuacao: number; }

export const teadiSP: AtencaoNorma[] = [
  { percentil: 1,  pontuacao: 20  },
  { percentil: 5,  pontuacao: 37  },
  { percentil: 10, pontuacao: 51  },
  { percentil: 15, pontuacao: 63  },
  { percentil: 20, pontuacao: 73  },
  { percentil: 25, pontuacao: 79  },
  { percentil: 30, pontuacao: 86  },
  { percentil: 35, pontuacao: 92  },
  { percentil: 40, pontuacao: 96  },
  { percentil: 45, pontuacao: 99  },
  { percentil: 50, pontuacao: 101 },
  { percentil: 55, pontuacao: 108 },
  { percentil: 60, pontuacao: 115 },
  { percentil: 65, pontuacao: 120 },
  { percentil: 70, pontuacao: 126 },
  { percentil: 75, pontuacao: 132 },
  { percentil: 80, pontuacao: 139 },
  { percentil: 85, pontuacao: 148 },
  { percentil: 90, pontuacao: 152 },
  { percentil: 95, pontuacao: 161 },
  { percentil: 99, pontuacao: 174 },
];

// ============================================================
// TEALT (Atenção Alternada) — Normas SP (N=780)
// Tabela 80: população geral de São Paulo
// ============================================================
export const tealtSP: AtencaoNorma[] = [
  { percentil: 1,  pontuacao: 5   },
  { percentil: 5,  pontuacao: 40  },
  { percentil: 10, pontuacao: 51  },
  { percentil: 15, pontuacao: 58  },
  { percentil: 20, pontuacao: 64  },
  { percentil: 25, pontuacao: 70  },
  { percentil: 30, pontuacao: 74  },
  { percentil: 35, pontuacao: 78  },
  { percentil: 40, pontuacao: 84  },
  { percentil: 45, pontuacao: 88  },
  { percentil: 50, pontuacao: 91  },
  { percentil: 55, pontuacao: 94  },
  { percentil: 60, pontuacao: 97  },
  { percentil: 65, pontuacao: 100 },
  { percentil: 70, pontuacao: 103 },
  { percentil: 75, pontuacao: 107 },
  { percentil: 80, pontuacao: 112 },
  { percentil: 85, pontuacao: 119 },
  { percentil: 90, pontuacao: 122 },
  { percentil: 95, pontuacao: 126 },
  { percentil: 99, pontuacao: 128 },
];

// Classificação atenção (TEADI / TEALT / TEACO-FF)
export const atencaoClassificacoes = [
  { minPercentil: 0,  maxPercentil: 10, classificacao: "Inferior" },
  { minPercentil: 15, maxPercentil: 40, classificacao: "Médio Inferior" },
  { minPercentil: 45, maxPercentil: 65, classificacao: "Médio" },
  { minPercentil: 70, maxPercentil: 85, classificacao: "Médio Superior" },
  { minPercentil: 90, maxPercentil: 99, classificacao: "Superior" },
] as const;

export function classificarAtencao(pontuacao: number, tabela: AtencaoNorma[]): { percentil: number; classificacao: string } {
  let percentil = 1;
  for (const row of tabela) {
    if (pontuacao >= row.pontuacao) percentil = row.percentil;
  }
  const classif = atencaoClassificacoes.find((c) => percentil >= c.minPercentil && percentil <= c.maxPercentil);
  return { percentil, classificacao: classif?.classificacao ?? "Médio" };
}

// ------ WHOQOL-bref (Qualidade de Vida — OMS) — escore por domínio 0-100 ------
// Fórmula: escore do domínio = (média dos itens do domínio − 1) × 25
// (equivale a: média × 4 → escore 4-20; convertido linearmente para 0-100).
// Bandas de classificação informais (nao ha ponto de corte oficial unico do
// WHOQOL — cada dominio deve idealmente ser comparado a normas populacionais).
// REVISAO CLINICA recomendada antes de uso normativo formal.
export function escoreDominioWhoqol(mediaItens: number): number {
  return Math.round((mediaItens - 1) * 25);
}

export const whoqolFaixas = [
  { min: 0, max: 40, classificacao: "Baixa", descricao: "Qualidade de vida reduzida neste domínio." },
  { min: 41, max: 60, classificacao: "Media", descricao: "Qualidade de vida na faixa média neste domínio." },
  { min: 61, max: 100, classificacao: "Satisfatoria", descricao: "Qualidade de vida satisfatória neste domínio." },
] as const;

// ------ PANAS (Afetos Positivos e Negativos) — cada subescala 10-50 ------
// Não há ponto de corte clínico oficial amplamente validado no Brasil;
// bandas abaixo são descritivas (terços da amplitude), não diagnósticas.
// REVISAO CLINICA recomendada.
export const panasPositivoFaixas = [
  { min: 10, max: 23, classificacao: "Baixo", descricao: "Afeto positivo reduzido no período avaliado." },
  { min: 24, max: 36, classificacao: "Medio", descricao: "Afeto positivo em nível médio." },
  { min: 37, max: 50, classificacao: "Alto", descricao: "Afeto positivo elevado no período avaliado." },
] as const;

export const panasNegativoFaixas = [
  { min: 10, max: 23, classificacao: "Baixo", descricao: "Afeto negativo reduzido — indicador favorável." },
  { min: 24, max: 36, classificacao: "Medio", descricao: "Afeto negativo em nível médio." },
  { min: 37, max: 50, classificacao: "Alto", descricao: "Afeto negativo elevado — investigar sintomatologia associada." },
] as const;

// ------ CBI (Copenhagen Burnout Inventory) — cada subescala 0-100 (média) ------
// Ponto de corte comumente citado na literatura (Kristensen et al., 2005;
// adaptações internacionais): escore ≥ 50 sugere nível relevante de burnout;
// ≥ 75 sugere burnout grave. REVISAO CLINICA: confirmar pontos de corte da
// adaptação brasileira utilizada antes de uso normativo.
export const cbiFaixas = [
  { min: 0, max: 24, classificacao: "Baixo", descricao: "Nível baixo de burnout nesta subescala." },
  { min: 25, max: 49, classificacao: "Leve a moderado", descricao: "Sinais leves a moderados de burnout nesta subescala." },
  { min: 50, max: 74, classificacao: "Alto", descricao: "Nível alto de burnout nesta subescala — atenção recomendada." },
  { min: 75, max: 100, classificacao: "Grave", descricao: "Nível grave de burnout nesta subescala — intervenção recomendada." },
] as const;

// ============================================================
// Helpers genéricos
// ============================================================
export function classificarPorFaixa(escore: number, faixas: readonly { min: number; max: number; classificacao: string; descricao: string }[]): { classificacao: string; descricao: string } {
  const f = faixas.find((f) => escore >= f.min && escore <= f.max);
  return f ?? { classificacao: "Indeterminado", descricao: "" };
}

export type TesteId = "phq9" | "gad7" | "bai" | "bdi" | "bhs" | "asrs" | "neo-ffi" | "neo-pi" | "g36" | "teadi" | "tealt" | "ysq" | "ypi" | "yci" | "yrai" | "smi";

export const testesDisponiveis: { id: TesteId; sigla: string; nome: string; tipo: "faixa" | "t-score" | "percentil" | "schema" | "threshold" }[] = [
  { id: "phq9",    sigla: "PHQ-9",      nome: "Rastreio de Depressão",                tipo: "faixa" },
  { id: "gad7",    sigla: "GAD-7",      nome: "Rastreio de Ansiedade",                tipo: "faixa" },
  { id: "bai",     sigla: "BAI",        nome: "Inventário de Ansiedade de Beck",      tipo: "faixa" },
  { id: "bdi",     sigla: "BDI-II",     nome: "Inventário de Depressão de Beck",      tipo: "faixa" },
  { id: "bhs",     sigla: "BHS",        nome: "Escala de Desesperança de Beck",       tipo: "faixa" },
  { id: "asrs",    sigla: "ASRS-18",    nome: "Rastreio de TDAH",                     tipo: "faixa" },
  { id: "neo-ffi", sigla: "NEO FFI-R",  nome: "Inventário de Cinco Fatores NEO",      tipo: "t-score" },
  { id: "neo-pi",  sigla: "NEO PI-R",   nome: "Inventário de Personalidade NEO",      tipo: "t-score" },
  { id: "g36",     sigla: "G-36",       nome: "Teste Não Verbal de Inteligência",     tipo: "percentil" },
  { id: "teadi",   sigla: "TEADI",      nome: "Teste de Atenção Dividida",            tipo: "percentil" },
  { id: "tealt",   sigla: "TEALT",      nome: "Teste de Atenção Alternada",           tipo: "percentil" },
  { id: "ysq",     sigla: "YSQ-S3",     nome: "Questionário de Esquemas de Young",    tipo: "schema" },
  { id: "ypi",     sigla: "YPI",        nome: "Inventário Parental de Young",         tipo: "schema" },
  { id: "smi",     sigla: "SMI",        nome: "Inventário de Modos Esquemáticos",     tipo: "schema" },
  { id: "yci",     sigla: "YCI",        nome: "Inventário de Compensação de Young",   tipo: "threshold" },
  { id: "yrai",    sigla: "YRAI",       nome: "Inventário de Evitação de Young-Rygh", tipo: "threshold" },
];
