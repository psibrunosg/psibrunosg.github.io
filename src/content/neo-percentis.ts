// ============================================================
// NEO PI-R (FORMA S) — TABELAS DE PERCENTIL (lookup bruto→PP)
// ============================================================
// Fonte: manual NEO PI-R (Costa & McCrae), amostra brasileira,
// FORMA S (autorrelato) — Adultos. Anexo 2 = domínios;
// Anexo 3-7 = facetas (N, E, O, A, C).
//
// Percentil é EMPÍRICO (distribuição real da amostra) — não sai da
// média/DP. Não existe substituto paramétrico, diferente do T
// normalizado (ver ./neo-tabelas-t). Por isso só entra aqui o que
// foi lido de foto legível; o resto fica pendente, nunca estimado.
//
// FORMATO: cada escala = array de mínimos alinhado a neoPercentilPPs.
// mins[i] = MENOR escore bruto que atinge o percentil neoPercentilPPs[i].
// As faixas do manual são contíguas, então guardar só o mínimo é
// representação SEM PERDA.
//   lookup(bruto) = PP do maior mins[i] <= bruto.
// Mínimos IGUAIS em PPs vizinhos = faixa vazia no manual (percentil
// inalcançável); o lookup varre de trás pra frente e devolve o maior PP.
//
// ⚠️ RASCUNHO — transcrito de foto do manual. CONFERIR contra o livro
// físico antes de uso clínico. Checagens aplicadas:
//   (1) 27 valores por escala, mínimos não-decrescentes;
//   (2) CONTIGUIDADE: máximo de cada faixa + 1 == mínimo da próxima.
//       Geral: N e C batem nos 27 níveis. Feminino: N e O batem nos 27.
//       As demais colunas têm 1-3 folgas/sobreposições de 1 ponto,
//       corrigidas pelo lookup por mínimo (que ignora o máximo impresso);
//   (3) faixa do P50 (mediana) ≈ média do Anexo 1 (neoPIRNormas).
//       C fica acima da média por assimetria à esquerda (efeito de teto).
//
// COMPLETO: Anexo 2 (domínios) — Geral, Masculino e Feminino.
// PENDENTE: Anexo 3-7 (facetas). Exigem foto com zoom de UM bloco de
// sexo por vez — foto com H/M/G juntos é densa demais pra leitura
// confiável, e não se fabrica dado clínico.
// ============================================================
import type { NeoFFIDominio, NeoPISexo } from "./normative-tables";
import { neoPIRNormas } from "./normative-tables";

/** Eixo de percentis do Anexo 2 (domínios). 27 níveis. */
export const neoPercentilPPs = [
  1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 96, 97, 98, 99,
] as const;

// ------------------------------------------------------------
// ANEXO 2 — Percentis dos Cinco Domínios (Forma S)
// mins alinhados a neoPercentilPPs (índice 0 = PP1 ... índice 26 = PP99)
// ------------------------------------------------------------
export const neoPercentilDominios_geral: Record<NeoFFIDominio, number[]> = {
  //  PP:  1   2   3   4   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  96  97  98  99
  N: [0, 50, 55, 58, 60, 68, 72, 76, 79, 82, 85, 88, 92, 94, 97, 100, 103, 106, 111, 114, 118, 125, 134, 136, 139, 143, 151],
  E: [0, 70, 75, 77, 80, 88, 92, 97, 101, 104, 106, 108, 111, 113, 116, 118, 120, 123, 126, 128, 132, 138, 144, 146, 151, 154, 160],
  O: [0, 82, 84, 86, 88, 94, 98, 101, 104, 107, 109, 111, 114, 116, 118, 121, 123, 126, 128, 130, 135, 139, 147, 149, 152, 156, 159],
  A: [0, 80, 84, 88, 90, 98, 102, 106, 108, 111, 113, 115, 117, 119, 121, 123, 125, 127, 129, 132, 134, 138, 143, 145, 147, 149, 154],
  C: [0, 70, 76, 81, 83, 92, 98, 102, 106, 109, 113, 116, 118, 121, 123, 125, 128, 130, 133, 136, 139, 144, 149, 152, 156, 159, 163],
};

// Feminino. OBS: A não tem faixa P98 no manual (P97 termina em 152,
// P99 começa em 153) — daí mins[P98] == mins[P99] == 153.
export const neoPercentilDominios_feminino: Record<NeoFFIDominio, number[]> = {
  //  PP:  1   2   3   4   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  96  97  98  99
  N: [0, 54, 58, 61, 65, 71, 76, 79, 82, 85, 89, 93, 95, 98, 100, 103, 107, 110, 113, 118, 123, 129, 136, 139, 142, 146, 152],
  E: [0, 70, 73, 75, 77, 87, 93, 98, 102, 105, 107, 110, 112, 114, 117, 120, 122, 124, 127, 130, 134, 139, 146, 150, 153, 156, 161],
  O: [0, 82, 84, 86, 87, 94, 99, 102, 104, 107, 109, 111, 114, 116, 119, 121, 124, 126, 128, 131, 135, 139, 146, 148, 150, 156, 159],
  A: [0, 83, 89, 92, 93, 101, 105, 107, 110, 112, 114, 116, 118, 120, 121, 124, 126, 128, 131, 134, 136, 140, 144, 145, 149, 153, 153],
  C: [0, 69, 75, 81, 83, 92, 99, 103, 106, 110, 113, 117, 119, 121, 124, 126, 128, 131, 133, 136, 139, 143, 149, 151, 155, 158, 162],
};

export const neoPercentilDominios_masculino: Record<NeoFFIDominio, number[]> = {
  //  PP:  1   2   3   4   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  96  97  98  99
  N: [0, 45, 47, 51, 55, 62, 66, 70, 73, 76, 79, 82, 84, 87, 91, 94, 96, 99, 102, 105, 111, 116, 125, 127, 130, 133, 146],
  E: [0, 66, 79, 80, 82, 88, 91, 96, 99, 102, 104, 106, 108, 110, 113, 115, 118, 120, 122, 124, 130, 135, 141, 143, 145, 148, 153],
  O: [0, 83, 84, 87, 88, 92, 96, 98, 101, 105, 108, 109, 112, 115, 117, 119, 123, 126, 128, 132, 135, 139, 149, 150, 153, 156, 160],
  A: [0, 63, 80, 82, 85, 94, 98, 101, 105, 108, 111, 113, 115, 117, 119, 121, 123, 125, 127, 130, 132, 135, 141, 144, 146, 148, 155],
  C: [0, 72, 78, 81, 84, 91, 96, 100, 103, 106, 110, 114, 116, 119, 121, 123, 126, 129, 132, 136, 140, 144, 153, 154, 158, 161, 165],
};

/** Anexo 2 completo: Geral, Masculino e Feminino. */
export const neoPercentilDominios: Record<NeoPISexo, Record<NeoFFIDominio, number[]>> = {
  geral: neoPercentilDominios_geral,
  masculino: neoPercentilDominios_masculino,
  feminino: neoPercentilDominios_feminino,
};

// ============================================================
// Lookup
// ============================================================

/** Percentil para um bruto, dado o array de mínimos e o eixo de PPs. */
export function percentilPorTabela(
  bruto: number,
  mins: number[],
  pps: readonly number[] = neoPercentilPPs,
): number {
  for (let i = mins.length - 1; i >= 0; i--) {
    if (bruto >= mins[i]) return pps[i];
  }
  return pps[0];
}

/** Percentil de um domínio NEO PI-R (Anexo 2, Forma S). Geral/Masc/Fem completos. */
export function percentilNeoPIDominio(
  dominio: NeoFFIDominio,
  bruto: number,
  sexo: NeoPISexo = "geral",
): number {
  return percentilPorTabela(bruto, neoPercentilDominios[sexo][dominio]);
}

// ------------------------------------------------------------
// Checagem de integridade (apenas em DEV).
// ponytail: guard só roda em dev; custo zero em produção.
// ------------------------------------------------------------
if (typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  const i50 = neoPercentilPPs.indexOf(50);
  for (const [sexo, tabela] of Object.entries(neoPercentilDominios) as [NeoPISexo, Record<NeoFFIDominio, number[]>][]) {
    for (const [k, mins] of Object.entries(tabela) as [NeoFFIDominio, number[]][]) {
      const tag = `[Percentil Anexo2/${sexo}] ${k}`;
      if (mins.length !== neoPercentilPPs.length) {
        console.error(`${tag}: ${mins.length} valores (esperado ${neoPercentilPPs.length})`);
      }
      for (let i = 1; i < mins.length; i++) {
        if (mins[i] < mins[i - 1]) {
          console.error(`${tag}: mínimo cai em PP${neoPercentilPPs[i]} (${mins[i]} < ${mins[i - 1]})`);
        }
      }
      // P50 (mediana) deve ficar perto da média; folga de 8 tolera assimetria (ex: C).
      const media = neoPIRNormas[sexo]?.[k]?.m;
      if (media != null && Math.abs(mins[i50] - media) > 8) {
        console.error(`${tag}: P50 começa em ${mins[i50]}, média é ${media} (desvio > 8)`);
      }
    }
  }
}

// ============================================================
// ANEXO 3-7 — Percentis das FACETAS (Forma S)
// ============================================================
// ⚠️ O eixo de PP VARIA POR ANEXO — NÃO assumir eixo compartilhado.
// Confirmado por Bruno no manual: Neuroticismo (Anexo 3) NÃO tem o
// nível 35; Extroversão (Anexo 4) TEM. Por isso cada domínio guarda o
// seu próprio eixo, e um domínio sem eixo confirmado devolve null em
// vez de reusar o de outro.
//
// SEMÂNTICA: nas facetas a tabela lista o bruto QUE CAI em cada PP; nem
// todo bruto aparece (faixa 0-32 sobre 20 níveis). Bruto intermediário
// arredonda PRA BAIXO, para o nível listado imediatamente inferior —
// leitura conservadora ("pelo menos o percentil X").
// Mínimos IGUAIS em PPs vizinhos = nível sem bruto próprio no manual
// (percentil inalcançável); o lookup varre de trás e devolve o maior PP.
// ------------------------------------------------------------
/** Anexo 3 (facetas de Neuroticismo): 20 níveis, SEM o 35, e 95 → 99. */
export const neoPercentilPPsFacetasN = [
  1, 5, 10, 15, 20, 25, 30, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 99,
] as const;

/**
 * Eixo de PP por domínio de faceta. Só entra o que foi conferido no
 * manual — Extroversão tem o nível 35 (Bruno confirmou), então o eixo
 * do Anexo 4 é diferente e entra quando o crop chegar.
 */
/** Anexo 4 (facetas de Extroversão): 21 níveis, COM o 35, e 95 → 99. */
export const neoPercentilPPsFacetasE = [
  1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 99,
] as const;

/** Anexo 5 (facetas de Abertura): 20 níveis. Tem o 35, mas NÃO tem o 55. */
export const neoPercentilPPsFacetasO = [
  1, 5, 10, 15, 20, 25, 30, 35, 40, 45,
  50, 60, 65, 70, 75, 80, 85, 90, 95, 99,
] as const;

/** Anexo 6 (facetas de Amabilidade): 21 níveis, mesmo eixo do Anexo 4. */
export const neoPercentilPPsFacetasA = [
  1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  55, 60, 65, 70, 75, 80, 85, 90, 95, 99,
] as const;

export const neoPercentilPPsPorDominio: Partial<Record<NeoFFIDominio, readonly number[]>> = {
  N: neoPercentilPPsFacetasN,
  E: neoPercentilPPsFacetasE,
  O: neoPercentilPPsFacetasO,
  A: neoPercentilPPsFacetasA,
  // C: a confirmar (Anexo 7) — a coluna de PP das fotos saiu com "61" e
  // "81" entre os múltiplos de 5, leitura implausível e não resolvida.
};

/**
 * Percentis das facetas. PARCIAL — só entra bloco lido e validado.
 * Feito: Anexo 3 (facetas de Neuroticismo) — Masculino, Feminino e Geral,
 * validados nos 6 pelo teste de contiguidade + P50 ≈ média do Anexo 1.
 * Pendente: Anexos 4-7 (facetas de E, O, A, C).
 */
export const neoPercentilFacetas: Partial<Record<NeoPISexo, Record<string, number[]>>> = {
  masculino: {
    // PP:  1   5  10  15  20  25  30  40  45  50  55  60  65  70  75  80  85  90  95  99
    N1: [0, 10, 11, 12, 13, 14, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 22, 24, 27],
    N2: [0, 7, 8, 9, 10, 11, 11, 12, 13, 13, 14, 14, 15, 16, 17, 17, 18, 20, 22, 25],
    N3: [0, 6, 8, 9, 10, 11, 13, 13, 14, 14, 15, 16, 16, 17, 18, 19, 20, 21, 23, 28],
    N4: [0, 9, 11, 12, 13, 13, 14, 15, 16, 17, 17, 18, 19, 19, 20, 21, 23, 23, 24, 27],
    N5: [0, 8, 9, 10, 11, 12, 14, 14, 15, 16, 17, 17, 17, 18, 19, 20, 21, 22, 24, 28],
    N6: [0, 4, 6, 7, 8, 9, 10, 10, 11, 12, 13, 13, 14, 15, 15, 17, 18, 19, 20, 24],
    // Anexo 4 (eixo E, 21 níveis). Contiguidade fecha em E1, E3, E5 e E6.
    // ⚠️ E2: P20 = 12 e P30 = 14 (P25 vazio) — o bruto 13 fica fora de
    //    qualquer faixa. ⚠️ E4: P95 = 24-25 e P99 = ≥27 — o bruto 26 fica
    //    fora. Ambos mantidos como impressos; CONFERIR no livro físico.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  99
    E1: [0, 14, 16, 17, 18, 19, 20, 21, 21, 22, 22, 23, 24, 24, 24, 25, 25, 26, 27, 28, 31],
    E2: [0, 8, 10, 11, 12, 12, 14, 15, 15, 16, 17, 17, 18, 19, 19, 20, 21, 22, 23, 25, 27],
    E3: [0, 9, 10, 11, 12, 13, 13, 14, 14, 15, 16, 16, 16, 17, 17, 18, 19, 20, 21, 23, 28],
    E4: [0, 10, 12, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 19, 19, 20, 21, 21, 22, 24, 27],
    E5: [0, 12, 14, 15, 16, 17, 17, 18, 18, 19, 19, 20, 21, 21, 22, 22, 23, 24, 25, 26, 29],
    E6: [0, 12, 14, 16, 17, 17, 18, 19, 20, 20, 21, 21, 22, 23, 23, 24, 25, 26, 27, 28, 31],
  },
  // Feminino: contiguidade fecha nas 6 facetas, sem gap nem sobreposição.
  feminino: {
    // PP:  1   5  10  15  20  25  30  40  45  50  55  60  65  70  75  80  85  90  95  99
    N1: [0, 11, 13, 14, 15, 16, 16, 17, 18, 19, 20, 20, 21, 21, 22, 23, 24, 25, 26, 29],
    N2: [0, 8, 9, 10, 11, 12, 13, 14, 14, 15, 16, 16, 17, 18, 19, 19, 20, 21, 24, 26],
    N3: [0, 8, 9, 10, 11, 12, 13, 14, 15, 15, 16, 17, 17, 18, 19, 21, 22, 23, 25, 30],
    N4: [0, 11, 12, 13, 14, 15, 16, 17, 17, 18, 18, 19, 20, 20, 21, 22, 23, 24, 26, 28],
    N5: [0, 8, 10, 11, 12, 13, 13, 15, 16, 16, 17, 18, 19, 19, 20, 21, 22, 23, 25, 29],
    N6: [0, 7, 9, 10, 10, 11, 12, 13, 14, 14, 15, 16, 16, 17, 18, 19, 20, 21, 23, 27],
    // Anexo 4 (eixo E, 21 níveis). Contiguidade fecha nas 6 facetas.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  99
    E1: [0, 15, 17, 18, 19, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 27, 27, 28, 30, 31],
    E2: [0, 9, 11, 13, 14, 15, 16, 16, 17, 18, 18, 19, 20, 21, 21, 22, 23, 24, 25, 27, 30],
    E3: [0, 8, 9, 10, 11, 11, 12, 13, 14, 14, 15, 15, 16, 17, 17, 18, 19, 20, 22, 23, 26],
    E4: [0, 10, 12, 13, 13, 14, 15, 15, 16, 17, 17, 18, 19, 19, 20, 20, 21, 22, 23, 25, 28],
    E5: [0, 11, 13, 14, 15, 16, 17, 17, 18, 19, 19, 20, 21, 22, 22, 23, 23, 24, 25, 27, 30],
    E6: [0, 12, 14, 16, 17, 18, 19, 20, 20, 21, 22, 22, 23, 23, 24, 25, 25, 26, 27, 28, 31],
    // Anexo 5 (eixo O, 20 níveis). Contiguidade fecha nas 6 facetas.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  60  65  70  75  80  85  90  95  99
    O1: [0, 11, 12, 14, 15, 16, 17, 17, 18, 19, 20, 21, 21, 22, 23, 24, 25, 26, 27, 31],
    O2: [0, 13, 15, 16, 17, 18, 18, 19, 20, 20, 21, 22, 22, 23, 24, 24, 26, 27, 29, 32],
    O3: [0, 14, 15, 16, 17, 18, 19, 19, 20, 20, 21, 22, 22, 23, 24, 24, 25, 26, 27, 30],
    O4: [0, 9, 10, 11, 12, 13, 13, 14, 14, 15, 16, 16, 17, 18, 18, 19, 20, 21, 22, 25],
    O5: [0, 10, 13, 14, 15, 16, 17, 18, 18, 19, 19, 21, 22, 22, 23, 24, 25, 26, 27, 30],
    O6: [0, 15, 16, 17, 18, 18, 19, 19, 20, 21, 21, 22, 23, 23, 24, 24, 25, 26, 27, 29],
    // Anexo 6 (eixo A, 21 níveis). Contiguidade fecha nas 6 facetas.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  99
    A1: [0, 10, 12, 13, 14, 15, 16, 17, 17, 18, 19, 19, 20, 21, 21, 22, 23, 23, 24, 25, 28],
    A2: [0, 12, 14, 15, 16, 16, 17, 18, 19, 19, 20, 20, 21, 21, 22, 23, 23, 24, 25, 27, 29],
    A3: [0, 17, 19, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 25, 26, 26, 27, 28, 29, 31],
    A4: [0, 10, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 21, 21, 22, 22, 23, 25, 28],
    A5: [0, 12, 14, 15, 16, 16, 17, 17, 18, 19, 19, 19, 20, 20, 21, 21, 22, 23, 24, 25, 27],
    A6: [0, 16, 18, 18, 19, 19, 20, 21, 21, 22, 22, 23, 23, 23, 24, 24, 25, 25, 26, 27, 30],
  },
  // Geral: contiguidade fecha em N1, N2, N3, N5 e N6.
  // ⚠️ N4: o manual imprime P1 = 0-8 e P5 = 10-11 — o bruto 9 não aparece
  // em faixa nenhuma. Mantido como impresso (P5 começa em 10, então 9 cai
  // no P1); CONFERIR no livro físico se P1 é 0-9 ou se P5 é 9-11.
  geral: {
    // PP:  1   5  10  15  20  25  30  40  45  50  55  60  65  70  75  80  85  90  95  99
    N1: [0, 10, 12, 13, 14, 15, 16, 17, 17, 18, 19, 19, 20, 20, 21, 22, 23, 24, 25, 29],
    N2: [0, 7, 9, 10, 11, 11, 12, 13, 14, 14, 15, 16, 16, 17, 18, 19, 20, 21, 23, 26],
    N3: [0, 7, 9, 10, 10, 11, 12, 14, 14, 15, 16, 16, 17, 18, 19, 20, 21, 23, 25, 29],
    N4: [0, 10, 12, 13, 13, 14, 15, 16, 17, 17, 18, 19, 19, 20, 21, 21, 22, 24, 25, 28],
    N5: [0, 8, 9, 11, 12, 12, 13, 15, 15, 16, 16, 17, 18, 19, 20, 21, 22, 23, 25, 28],
    N6: [0, 6, 8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 15, 16, 17, 18, 19, 20, 22, 26],
    // Anexo 4 (eixo E, 21 níveis). Contiguidade fecha nas 6 facetas.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  99
    E1: [0, 15, 17, 18, 19, 20, 21, 21, 22, 22, 23, 24, 24, 24, 25, 26, 26, 27, 28, 29, 31],
    E2: [0, 9, 10, 12, 13, 14, 15, 16, 16, 17, 18, 18, 19, 20, 21, 21, 22, 23, 25, 26, 29],
    E3: [0, 8, 10, 10, 11, 12, 13, 13, 14, 15, 15, 16, 16, 17, 17, 18, 19, 20, 21, 23, 26],
    E4: [0, 10, 12, 13, 13, 14, 15, 15, 16, 16, 17, 17, 18, 19, 20, 20, 21, 22, 23, 24, 28],
    E5: [0, 11, 13, 15, 16, 16, 17, 18, 18, 19, 19, 20, 21, 21, 22, 23, 23, 24, 25, 26, 29],
    E6: [0, 12, 14, 16, 17, 18, 19, 20, 20, 21, 21, 22, 23, 23, 24, 25, 25, 26, 27, 28, 30],
    // Anexo 5 (eixo O, 20 níveis). Contiguidade fecha em O1, O2, O3 e O6.
    // ⚠️ O4: P80 = 19 e P90 = 21 (P85 vazio) — o bruto 20 fica fora de
    //    qualquer faixa. ⚠️ O5: P35 = 18 e P50 = 20 (P40 e P45 vazios) —
    //    o bruto 19 fica fora. Mantidos como impressos; CONFERIR.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  60  65  70  75  80  85  90  95  99
    O1: [0, 11, 12, 14, 15, 16, 17, 18, 18, 19, 20, 21, 21, 22, 23, 24, 25, 26, 28, 30],
    O2: [0, 12, 14, 15, 16, 17, 18, 18, 19, 20, 21, 21, 22, 22, 23, 24, 25, 26, 29, 32],
    O3: [0, 13, 15, 16, 17, 18, 18, 19, 20, 20, 21, 22, 22, 23, 23, 24, 25, 26, 27, 30],
    O4: [0, 9, 11, 11, 12, 13, 13, 14, 14, 15, 15, 16, 17, 17, 18, 19, 19, 21, 22, 24],
    O5: [0, 11, 13, 14, 15, 16, 17, 18, 18, 18, 20, 21, 22, 23, 24, 24, 25, 27, 29, 31],
    O6: [0, 15, 16, 17, 18, 18, 19, 19, 20, 21, 21, 22, 23, 23, 24, 24, 25, 26, 27, 30],
    // Anexo 6 (eixo A, 21 níveis). A1, A2, A3 e A6 fecham contíguas.
    // A4 e A5 NÃO entram: a foto deu P50 e P55 com o mesmo valor impresso
    // em A4 (19), P55 e P60 idem em A5 (20), e A5 ainda perde o bruto 14
    // entre P10 e P15. Faixa duplicada é impossível — é erro de leitura,
    // não do manual. Ficam pendentes de recrop em vez de entrar torto.
    // PP:  1   5  10  15  20  25  30  35  40  45  50  55  60  65  70  75  80  85  90  95  99
    A1: [0, 10, 12, 13, 14, 15, 16, 17, 17, 18, 18, 19, 20, 20, 21, 22, 22, 23, 24, 25, 28],
    A2: [0, 11, 13, 15, 16, 16, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 23, 23, 24, 26, 28],
    A3: [0, 16, 18, 19, 20, 21, 21, 22, 22, 23, 23, 24, 24, 24, 25, 26, 26, 27, 28, 29, 30],
    A6: [0, 16, 18, 18, 19, 19, 20, 21, 21, 22, 22, 23, 23, 23, 24, 24, 25, 25, 26, 27, 30],
  },
};

/**
 * Percentil de uma faceta NEO PI-R (Anexo 3-7, Forma S).
 * Devolve null se o bloco (sexo/faceta) ainda não foi transcrito —
 * percentil é empírico, não há como estimar sem a tabela.
 */
export function percentilNeoPIFaceta(
  faceta: string,
  bruto: number,
  sexo: NeoPISexo = "geral",
): number | null {
  const mins = neoPercentilFacetas[sexo]?.[faceta];
  const pps = neoPercentilPPsPorDominio[faceta[0] as NeoFFIDominio];
  if (!mins || !pps) return null;
  return percentilPorTabela(bruto, mins, pps);
}

if (typeof import.meta !== "undefined" && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
  for (const [sexo, escalas] of Object.entries(neoPercentilFacetas) as [NeoPISexo, Record<string, number[]>][]) {
    for (const [k, mins] of Object.entries(escalas)) {
      const tag = `[Percentil Facetas/${sexo}] ${k}`;
      const pps = neoPercentilPPsPorDominio[k[0] as NeoFFIDominio];
      if (!pps) {
        console.error(`${tag}: eixo de PP do domínio ${k[0]} não confirmado`);
        continue;
      }
      const j50 = pps.indexOf(50);
      if (mins.length !== pps.length) {
        console.error(`${tag}: ${mins.length} valores (esperado ${pps.length})`);
      }
      for (let i = 1; i < mins.length; i++) {
        if (mins[i] < mins[i - 1]) {
          console.error(`${tag}: mínimo cai em PP${pps[i]} (${mins[i]} < ${mins[i - 1]})`);
        }
      }
      const media = neoPIRNormas[sexo]?.[k]?.m;
      if (media != null && Math.abs(mins[j50] - media) > 3) {
        console.error(`${tag}: P50 em ${mins[j50]}, média é ${media} (desvio > 3)`);
      }
    }
  }
}
