// ============================================================
// NEO PI-R / FFI-R — TABELAS DE T NORMALIZADO (lookup bruto→T)
// ============================================================
// Método OFICIAL do manual (Costa & McCrae), amostra brasileira.
// Mais fiel que a fórmula linear paramétrica (ver neoPIRNormas /
// calcularTScoreNeoPI em ./normative-tables).
//
// FORMATO: cada escala = array de 61 valores = MENOR escore bruto
// que atinge cada T, de T=80 (índice 0) até T=20 (índice 60).
// As faixas de bruto do manual são contíguas, então guardar apenas
// o mínimo de cada T é uma representação SEM PERDA.
//   lookup(bruto): t = 80 - (primeiro índice i onde bruto >= mins[i]).
//
// ⚠️ RASCUNHO — transcrito de fotos do manual. CONFERIR contra o
// livro físico antes de uso clínico. Checagens internas aplicadas:
//   (1) contagem de linhas por faixa = 15 Muito Alto / 10 Alto /
//       11 Médio / 10 Baixo / 15 Muito Baixo = 61 = T80..T20;
//   (2) faixas de bruto contíguas (sem buracos entre T consecutivos);
//   (3) o bruto em T50 ≈ média da amostra (Anexo 1) — confere em
//       todas as 15 colunas de domínio (Geral + Masc + Fem).
// ============================================================
import type { NeoFFIDominio } from "./normative-tables";
import { classificarNeoT, calcularTScoreNeoFFI } from "./normative-tables";

export type NeoTabelaSexo = "geral" | "masculino" | "feminino";

// ------------------------------------------------------------
// ANEXO 8 (p.114) — Cinco Dimensões NEO PI-R — GERAL
// Verificado por Bruno: N=108→T56, C=130→T55, O=144→T66. ✓
// ------------------------------------------------------------
export const neoPITDominios_geral: Record<NeoFFIDominio, number[]> = {
  //   T80  79   78   77   76   75   74   73   72   71  | 70   69   68   67   66 (Muito Alto)
  //  65   64   63   62   61 | 60   59   58   57   56 (Alto) | 55.. (Médio) ...
  N: [162, 160, 158, 155, 153, 151, 149, 146, 144, 142,  140, 137, 135, 133, 131,
      128, 126, 124, 122, 119,  117, 115, 113, 110, 108,  106, 104, 101, 99, 97,
      95, 92, 90, 88, 86,  83, 81, 79, 77, 74,  72, 70, 68, 65, 63,
      61, 59, 56, 54, 52,  50, 47, 45, 43, 41,  38, 36, 34, 32, 29,  0],
  E: [171, 169, 167, 165, 163, 161, 159, 157, 155, 153,  151, 150, 148, 146, 144,
      142, 140, 138, 136, 134,  132, 130, 128, 126, 124,  122, 120, 118, 116, 114,
      112, 110, 109, 107, 105,  103, 101, 99, 97, 95,  93, 91, 89, 87, 85,
      83, 81, 79, 77, 75,  73, 71, 69, 68, 66,  64, 62, 60, 58, 56,  0],
  O: [169, 167, 166, 164, 162, 160, 159, 157, 155, 153,  151, 150, 148, 146, 144,
      143, 141, 139, 137, 135,  134, 132, 130, 128, 127,  125, 123, 121, 119, 118,
      116, 114, 112, 111, 109,  107, 105, 104, 102, 100,  98, 96, 95, 93, 91,
      89, 88, 86, 84, 82,  80, 79, 77, 75, 73,  72, 70, 68, 66, 64,  0],
  A: [167, 165, 164, 162, 160, 159, 157, 155, 154, 152,  151, 149, 147, 146, 144,
      142, 141, 139, 137, 136,  134, 133, 131, 129, 128,  126, 124, 123, 121, 120,
      118, 116, 115, 113, 111,  110, 108, 107, 105, 103,  102, 100, 98, 97, 95,
      94, 92, 90, 89, 87,  85, 84, 82, 81, 79,  77, 76, 74, 72, 71,  0],
  C: [180, 178, 176, 174, 172, 170, 168, 166, 164, 161,  159, 157, 155, 153, 151,
      149, 147, 145, 143, 141,  139, 137, 135, 133, 131,  129, 127, 125, 122, 120,
      118, 116, 114, 112, 110,  108, 106, 104, 102, 100,  98, 96, 94, 92, 90,
      88, 86, 83, 81, 79,  77, 75, 73, 71, 69,  67, 65, 63, 61, 59,  0],
};

// ------------------------------------------------------------
// ANEXO 9 (p.115) — Cinco Dimensões NEO PI-R — POR SEXO — COMPLETO
// Transcrição confirmada por contiguidade + teste bruto(T50)≈média.
// ------------------------------------------------------------
export const neoPITDominios_masculino: Record<NeoFFIDominio, number[]> = {
  N: [152, 150, 148, 146, 144, 141, 139, 137, 135, 133,  131, 129, 126, 124, 122,
      120, 118, 116, 113, 111,  109, 107, 105, 103, 101,  98, 96, 94, 92, 90,
      88, 86, 83, 81, 79,  77, 75, 73, 71, 68,  66, 64, 62, 60, 58,
      55, 53, 51, 49, 47,  45, 43, 40, 38, 36,  34, 32, 30, 28, 25,  0],
  E: [165, 163, 161, 159, 157, 156, 154, 152, 150, 148,  147, 145, 143, 141, 139,
      137, 136, 134, 132, 130,  128, 127, 125, 123, 121,  119, 118, 116, 114, 112,
      110, 109, 107, 105, 103,  101, 99, 98, 96, 94,  92, 90, 89, 87, 85,
      83, 81, 80, 78, 76,  74, 72, 70, 69, 67,  65, 63, 61, 60, 58,  0],
  O: [170, 168, 166, 164, 163, 161, 159, 157, 155, 153,  152, 150, 148, 146, 144,
      142, 141, 139, 137, 135,  133, 132, 130, 128, 126,  124, 122, 121, 119, 117,
      115, 113, 111, 110, 108,  106, 104, 102, 100, 99,  97, 95, 93, 91, 90,
      88, 86, 84, 82, 80,  79, 77, 75, 73, 71,  69, 68, 66, 64, 62,  0],
  A: [168, 166, 164, 162, 161, 159, 157, 155, 154, 152,  150, 148, 147, 145, 143,
      141, 140, 138, 136, 134,  133, 131, 129, 127, 126,  124, 122, 120, 118, 117,
      115, 113, 111, 110, 108,  106, 104, 103, 101, 99,  97, 96, 94, 92, 90,
      89, 87, 85, 83, 82,  80, 78, 76, 75, 73,  71, 69, 68, 66, 64,  0],
  C: [180, 177, 175, 173, 171, 169, 167, 165, 163, 161,  159, 157, 155, 153, 151,
      148, 146, 144, 142, 140,  138, 136, 134, 132, 130,  128, 126, 124, 122, 120,
      118, 116, 114, 112, 110,  108, 106, 104, 102, 100,  98, 96, 93, 91, 89,
      86, 84, 82, 80, 78,  76, 74, 72, 70, 68,  66, 64, 62, 60, 57,  0],
};

export const neoPITDominios_feminino: Record<NeoFFIDominio, number[]> = {
  N: [165, 163, 160, 158, 156, 154, 151, 149, 147, 145,  143, 140, 138, 136, 134,
      131, 129, 127, 125, 123,  120, 118, 116, 114, 111,  109, 107, 105, 103, 100,
      98, 96, 94, 91, 89,  87, 85, 83, 80, 78,  76, 74, 71, 69, 67,
      65, 63, 60, 58, 56,  54, 51, 49, 47, 45,  42, 40, 38, 36, 34,  0],
  E: [174, 172, 170, 168, 166, 164, 162, 160, 158, 156,  154, 152, 150, 148, 146,
      144, 142, 140, 138, 136,  134, 132, 130, 128, 126,  124, 122, 119, 117, 115,
      113, 111, 109, 107, 105,  103, 101, 99, 97, 95,  93, 91, 89, 87, 85,
      83, 81, 79, 77, 75,  73, 71, 69, 67, 65,  63, 61, 59, 57, 55,  0],
  O: [169, 167, 165, 164, 162, 160, 158, 157, 155, 153,  151, 150, 148, 146, 144,
      143, 141, 139, 137, 136,  134, 132, 130, 128, 127,  125, 123, 122, 120, 118,
      116, 115, 113, 111, 109,  108, 106, 104, 102, 101,  99, 97, 95, 94, 92,
      90, 88, 87, 85, 83,  81, 80, 78, 76, 74,  73, 71, 69, 67, 66,  0],
  A: [165, 164, 163, 161, 160, 158, 157, 155, 153, 152,  150, 149, 147, 146, 144,
      143, 141, 140, 138, 137,  135, 134, 132, 130, 129,  127, 126, 124, 123, 121,
      119, 117, 116, 114, 113,  111, 110, 108, 107, 105,  104, 102, 101, 99, 98,
      96, 95, 93, 92, 90,  89, 87, 85, 84, 82,  81, 79, 78, 76, 75,  0],
  C: [180, 178, 176, 174, 172, 170, 168, 166, 164, 162,  160, 158, 156, 154, 152,
      149, 147, 145, 143, 141,  139, 137, 135, 133, 131,  129, 127, 125, 123, 121,
      119, 117, 115, 113, 111,  109, 107, 105, 103, 101,  99, 97, 95, 93, 91,
      89, 87, 85, 83, 81,  79, 77, 75, 73, 71,  69, 67, 65, 63, 61,  0],
};

// ============================================================
// Lookup e classificação
// ============================================================

/** Retorna o T normalizado para um bruto, dado o array de mínimos (índice 0 = T80). */
export function tScorePorTabela(bruto: number, mins: number[]): number {
  for (let i = 0; i < mins.length; i++) {
    if (bruto >= mins[i]) return 80 - i;
  }
  return 20; // abaixo de todos os mínimos (não ocorre: último mínimo = 0)
}

const TABELAS_DOMINIOS: Record<NeoTabelaSexo, Record<NeoFFIDominio, number[]>> = {
  geral: neoPITDominios_geral,
  masculino: neoPITDominios_masculino,
  feminino: neoPITDominios_feminino,
};

/** Classifica um domínio NEO PI-R por T normalizado (Anexo 8/9). */
export function classificarNeoPITDominio(
  dominio: NeoFFIDominio,
  bruto: number,
  sexo: NeoTabelaSexo = "geral",
): { t: number; classificacao: string } {
  const t = tScorePorTabela(bruto, TABELAS_DOMINIOS[sexo][dominio]);
  return { t, classificacao: classificarNeoT(t) };
}

// ------------------------------------------------------------
// Checagem de integridade (apenas em DEV): 61 valores por escala,
// sequência não-crescente. Falha aqui = erro de transcrição.
// ------------------------------------------------------------
// ponytail: guard só roda em dev; custo zero em produção.
if (typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  const validar = (nome: string, tabela: Record<NeoFFIDominio, number[]>) => {
    for (const [k, arr] of Object.entries(tabela)) {
      if (arr.length !== 61) console.error(`[NEO-T ${nome}] ${k}: ${arr.length} valores (esperado 61)`);
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[i - 1]) console.error(`[NEO-T ${nome}] ${k}: quebra em T${80 - i} (${arr[i]} > ${arr[i - 1]})`);
      }
    }
  };
  validar("Anexo8/Domínios/Geral", neoPITDominios_geral);
  validar("Anexo9/Domínios/Masculino", neoPITDominios_masculino);
  validar("Anexo9/Domínios/Feminino", neoPITDominios_feminino);
}

// ============================================================
// NEO FFI-R — TABELAS DE T NORMALIZADO (Anexo 21 / 22)
// ============================================================
// FFI-R: bruto 0..48 por domínio (12 itens × 0-4). Tabela ESPARSA
// (49 brutos sobre 61 slots de T), então o formato aqui é DIFERENTE
// dos domínios PI-R: array DIRETO bruto→T. Índice = escore bruto
// (0..48), valor = T normalizado.  lookup(bruto) = tabela[bruto].
// Denso, sem perda, 49 valores.
//
// ⚠️ RASCUNHO — Anexo 21 (Geral) transcrito e validado por 3 checagens:
//   (1) 49 valores, T monotônico não-decrescente com o bruto;
//   (2) bruto[T50] ≈ média Anexo 20 (N25.40 E30.00 O32.41 A32.39 C32.26);
//   (3) |T − T_paramétrico(média/DP)| ≤ 3 em toda a faixa clínica.
// CONFERIR contra o livro físico antes de uso clínico (spot-checks dados).
//
// Anexo 22 (Masc/Fem) PENDENTE: foto de 10 colunas densa demais pra
// leitura célula-a-célula confiável — não fabrico dado clínico.
// Enquanto isso, T por sexo sai pela fórmula paramétrica (média/DP
// oficiais do Anexo 20, via calcularTScoreNeoFFI em ./normative-tables),
// que bate ±2 com o normalizado na faixa clínica.
// ------------------------------------------------------------
export const neoFFIRTDominios_geral: Record<NeoFFIDominio, number[]> = {
  //    bruto: 0   1   2   3   4   5   6   7   8   9  10  11  12  ...
  N: [22, 22, 22, 22, 22, 22, 22, 23, 25, 26, 28, 29, 31, 32, 33, 35, 36, 38, 39, 41, 42, 43, 45, 46, 48, 49, 51, 52, 53, 55, 56, 58, 59, 61, 62, 63, 65, 66, 68, 69, 71, 72, 73, 75, 76, 78, 79, 79, 79],
  E: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 22, 23, 25, 27, 28, 30, 32, 33, 35, 37, 39, 40, 42, 44, 45, 47, 49, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 68, 69, 71, 72, 74, 76, 77, 79, 80],
  O: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 22, 23, 25, 27, 29, 30, 32, 34, 35, 37, 39, 41, 42, 44, 46, 48, 49, 51, 53, 54, 56, 58, 60, 61, 63, 65, 66, 68, 70, 72, 73, 75, 77],
  A: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 23, 25, 26, 28, 30, 32, 33, 35, 37, 39, 41, 42, 44, 46, 48, 50, 52, 53, 55, 57, 59, 61, 62, 64, 66, 68, 70, 71, 72, 75, 77, 78],
  C: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 22, 23, 25, 27, 28, 29, 31, 32, 34, 35, 37, 38, 40, 41, 43, 44, 46, 47, 48, 50, 51, 53, 54, 56, 57, 59, 60, 62, 63, 65, 66, 68, 69, 70, 72, 73],
};

/** T normalizado FFI-R para um bruto (0..48). Anexo 21 (Geral). */
export function tScoreFFIPorTabela(bruto: number, tabela: number[]): number {
  const i = Math.max(0, Math.min(Math.round(bruto), tabela.length - 1));
  return tabela[i];
}

/**
 * Classifica domínio FFI-R por T.
 * - GERAL: T normalizado (Anexo 21, lookup).
 * - MASC/FEM: T paramétrico oficial (Anexo 20 média/DP, via calcularTScoreNeoFFI).
 *   O normalizado por sexo (Anexo 22) bate ±2 com o paramétrico e classifica
 *   igual; transcrever a foto adicionaria erro de leitura (>precisão do
 *   paramétrico), então usamos a fórmula oficial. Trocar por lookup só se o
 *   Anexo 22 for transcrito célula-a-célula a partir do manual físico.
 */
export function classificarNeoFFITDominio(
  dominio: NeoFFIDominio,
  bruto: number,
  sexo: NeoTabelaSexo = "geral",
): { t: number; classificacao: string } {
  const t = sexo === "geral"
    ? tScoreFFIPorTabela(bruto, neoFFIRTDominios_geral[dominio])
    : calcularTScoreNeoFFI(dominio, bruto, sexo);
  return { t, classificacao: classificarNeoT(t) };
}

// Checagem DEV: 49 valores, T não-decrescente, e |T − T_paramétrico| ≤ 4.
if (typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  const ffiNorm: Record<NeoFFIDominio, { m: number; dp: number }> = {
    N: { m: 25.4, dp: 6.92 }, E: { m: 30.0, dp: 5.61 }, O: { m: 32.41, dp: 5.74 },
    A: { m: 32.39, dp: 5.2 }, C: { m: 32.26, dp: 6.54 },
  };
  for (const [k, arr] of Object.entries(neoFFIRTDominios_geral) as [NeoFFIDominio, number[]][]) {
    if (arr.length !== 49) console.error(`[FFI-T Geral] ${k}: ${arr.length} valores (esperado 49)`);
    for (let b = 1; b < arr.length; b++) {
      if (arr[b] < arr[b - 1]) console.error(`[FFI-T Geral] ${k}: T cai em bruto ${b} (${arr[b]} < ${arr[b - 1]})`);
    }
    const { m, dp } = ffiNorm[k];
    for (let b = 0; b < arr.length; b++) {
      const tp = Math.max(20, Math.min(80, Math.round(50 + (10 * (b - m)) / dp)));
      if (Math.abs(arr[b] - tp) > 4) {
        console.error(`[FFI-T Geral] ${k}: bruto ${b} → T${arr[b]} diverge do paramétrico T${tp} (>4)`);
      }
    }
  }
}
