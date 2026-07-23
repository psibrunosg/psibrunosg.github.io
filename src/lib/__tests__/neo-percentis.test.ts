import { describe, it, expect } from "vitest";
import {
  percentilNeoPIDominio, percentilNeoPIFaceta,
  neoPercentilPPsPorDominio, neoPercentilFacetas,
} from "@/content/neo-percentis";
import { neoPIRNormas, neoFacetasPorDominio, type NeoPISexo, type NeoFFIDominio } from "@/content/normative-tables";

const SEXOS: NeoPISexo[] = ["geral", "masculino", "feminino"];
const DOMINIOS: NeoFFIDominio[] = ["N", "E", "O", "A", "C"];

describe("percentilNeoPIFaceta", () => {
  it("arredonda para baixo: bruto entre dois níveis cai no PP inferior", () => {
    // Masculino N1: P5 = 10, P10 = 11.
    expect(percentilNeoPIFaceta("N1", 10, "masculino")).toBe(5);
    expect(percentilNeoPIFaceta("N1", 11, "masculino")).toBe(10);
  });

  it("satura nas pontas", () => {
    expect(percentilNeoPIFaceta("N1", 0, "masculino")).toBe(1);
    expect(percentilNeoPIFaceta("N1", 99, "masculino")).toBe(99);
  });

  it("devolve null para faceta sem tabela", () => {
    expect(percentilNeoPIFaceta("X9", 20, "geral")).toBeNull();
  });

  it("com mínimos duplicados devolve o MAIOR PP alcançável", () => {
    // Masculino N1 tem P30 = P40 = 16: nenhum bruto próprio cai em P30.
    expect(percentilNeoPIFaceta("N1", 16, "masculino")).toBe(40);
  });
});

describe("integridade das tabelas de faceta", () => {
  it("todo array tem o comprimento do eixo do seu domínio e é não-decrescente", () => {
    for (const sexo of SEXOS) {
      for (const [faceta, mins] of Object.entries(neoPercentilFacetas[sexo] ?? {})) {
        const pps = neoPercentilPPsPorDominio[faceta[0] as NeoFFIDominio];
        expect(pps, `${sexo}.${faceta}: eixo ausente`).toBeDefined();
        expect(mins.length, `${sexo}.${faceta}`).toBe(pps!.length);
        for (let i = 1; i < mins.length; i++) {
          expect(mins[i], `${sexo}.${faceta} pos ${i}`).toBeGreaterThanOrEqual(mins[i - 1]);
        }
      }
    }
  });

  it("as 30 facetas estão gravadas nos 3 sexos", () => {
    const todas = DOMINIOS.flatMap((d) => neoFacetasPorDominio[d]);
    for (const sexo of SEXOS) {
      for (const fac of todas) {
        expect(neoPercentilFacetas[sexo]?.[fac], `${sexo}.${fac}`).toBeDefined();
      }
    }
  });

  it("o bruto na média cai perto do percentil 50", () => {
    // Percentil é empírico, então isso é sanidade de transcrição, não identidade:
    // uma linha lida errada desloca a coluna inteira e estoura a tolerância.
    for (const sexo of SEXOS) {
      for (const [faceta, norma] of Object.entries(neoPIRNormas[sexo])) {
        if (!neoPercentilFacetas[sexo]?.[faceta]) continue;
        const p = percentilNeoPIFaceta(faceta, Math.round(norma.m), sexo)!;
        expect(Math.abs(p - 50), `${sexo}.${faceta} → P${p}`).toBeLessThanOrEqual(15);
      }
    }
  });
});

describe("percentilNeoPIDominio", () => {
  it("cobre os 5 domínios nos 3 sexos e é monotônico no bruto", () => {
    for (const sexo of SEXOS) {
      for (const dom of DOMINIOS) {
        let anterior = 0;
        for (let bruto = 0; bruto <= 192; bruto += 8) {
          const p = percentilNeoPIDominio(dom, bruto, sexo);
          expect(p, `${sexo}.${dom} bruto ${bruto}`).toBeGreaterThanOrEqual(anterior);
          anterior = p;
        }
      }
    }
  });
});
