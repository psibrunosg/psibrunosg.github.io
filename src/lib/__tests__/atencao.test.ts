import { describe, it, expect } from "vitest";
import { classificarAtencao, teacoSP, teacoClassificacoes, teadiSP } from "@/content/normative-tables";

// TEACO-FF (Tabela 55, normas SP N=666) — grade de 13 percentis e faixas próprias.
describe("classificarAtencao — TEACO-FF (SP)", () => {
  it("pontuação abaixo do menor bruto cai no percentil 1 (Inferior)", () => {
    expect(classificarAtencao(0, teacoSP, teacoClassificacoes)).toEqual({ percentil: 1, classificacao: "Inferior" });
    expect(classificarAtencao(10, teacoSP, teacoClassificacoes)).toEqual({ percentil: 1, classificacao: "Inferior" });
  });

  it("mapeia bruto exato para o percentil da linha", () => {
    expect(classificarAtencao(11, teacoSP, teacoClassificacoes).percentil).toBe(1);
    expect(classificarAtencao(80, teacoSP, teacoClassificacoes).percentil).toBe(20);
    expect(classificarAtencao(108, teacoSP, teacoClassificacoes).percentil).toBe(50);
    expect(classificarAtencao(175, teacoSP, teacoClassificacoes).percentil).toBe(99);
  });

  it("entre duas linhas mantém o percentil inferior", () => {
    expect(classificarAtencao(107, teacoSP, teacoClassificacoes).percentil).toBe(40); // <108 → linha do 100
    expect(classificarAtencao(174, teacoSP, teacoClassificacoes).percentil).toBe(90); // <175 → linha do 148
  });

  it("bandas específicas do TEACO (Inferior 1-20, Médio só 50, Superior 80-99)", () => {
    expect(classificarAtencao(80, teacoSP, teacoClassificacoes).classificacao).toBe("Inferior");       // pctl 20
    expect(classificarAtencao(86, teacoSP, teacoClassificacoes).classificacao).toBe("Médio Inferior");  // pctl 25
    expect(classificarAtencao(108, teacoSP, teacoClassificacoes).classificacao).toBe("Médio");          // pctl 50
    expect(classificarAtencao(117, teacoSP, teacoClassificacoes).classificacao).toBe("Médio Superior"); // pctl 60
    expect(classificarAtencao(139, teacoSP, teacoClassificacoes).classificacao).toBe("Superior");       // pctl 80
  });

  it("tabela é monotônica não-decrescente (percentil e pontuação)", () => {
    for (let i = 1; i < teacoSP.length; i++) {
      expect(teacoSP[i].percentil).toBeGreaterThan(teacoSP[i - 1].percentil);
      expect(teacoSP[i].pontuacao).toBeGreaterThan(teacoSP[i - 1].pontuacao);
    }
  });
});

// Regressão: TEADI/TEALT seguem usando as bandas padrão (chamada de 2 args).
describe("classificarAtencao — bandas padrão (TEADI)", () => {
  it("sem 3º argumento usa atencaoClassificacoes", () => {
    expect(classificarAtencao(20, teadiSP)).toEqual({ percentil: 1, classificacao: "Inferior" });
    expect(classificarAtencao(174, teadiSP)).toEqual({ percentil: 99, classificacao: "Superior" });
  });
});
