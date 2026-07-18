import { describe, it, expect } from "vitest";
import type { EscalaConfig } from "@/content/escalas";
import type { EscalaGeralConfig } from "@/content/escalas-gerais";
import {
  computeGeralScore, computeSchemaAvg, computeThreshold,
  classificarResposta, ehFaixaGrave, detectarRiscos, pacienteEmRisco,
  type RespostaRegistro,
} from "@/lib/scoring";

const likert0a4 = [
  { label: "0", valor: 0 }, { label: "1", valor: 1 }, { label: "2", valor: 2 },
  { label: "3", valor: 3 }, { label: "4", valor: 4 },
];

describe("computeGeralScore", () => {
  it("soma simples (likert sem domínios)", () => {
    const cfg = { tipo: "likert", opcoes: likert0a4 } as unknown as EscalaGeralConfig;
    expect(computeGeralScore(cfg, [1, 2, 3]).total).toBe(6);
  });

  it("likert com domínios e item invertido", () => {
    const cfg = {
      tipo: "likert", opcoes: likert0a4,
      dominios: [{ id: "d1", nome: "D1", itens: [1, 2], invertidos: [2] }],
    } as unknown as EscalaGeralConfig;
    // item1=1 (normal); item2=3 invertido -> 4-3=1; soma=2
    const r = computeGeralScore(cfg, [1, 3]);
    expect(r.total).toBe(2);
    expect(r.dominios[0].soma).toBe(2);
    expect(r.dominios[0].media).toBe(1);
  });

  // T1 — guard de inversão sem régua explícita
  it("lança erro em dev quando item invertido sem opcoes nem escalaMin/escalaMax", () => {
    const cfg = {
      tipo: "likert",
      dominios: [{ id: "d1", nome: "D1", itens: [1, 2], invertidos: [2] }],
    } as unknown as EscalaGeralConfig;
    expect(() => computeGeralScore(cfg, [1, 3])).toThrow(/invertido/i);
  });

  it("item invertido com escala 1–5 via escalaMin/escalaMax inverte corretamente", () => {
    const cfg = {
      tipo: "likert",
      escalaMin: 1, escalaMax: 5,
      dominios: [{ id: "d1", nome: "D1", itens: [1, 2], invertidos: [2] }],
    } as unknown as EscalaGeralConfig;
    // item1=1 (normal); item2=3 invertido numa escala 1-5 -> 5+1-3=3; soma=4
    const r = computeGeralScore(cfg, [1, 3]);
    expect(r.total).toBe(4);
    expect(r.dominios[0].soma).toBe(4);
  });

  it("item invertido com escala 0–4 via escalaMin/escalaMax não lança erro", () => {
    const cfg = {
      tipo: "likert",
      escalaMin: 0, escalaMax: 4,
      dominios: [{ id: "d1", nome: "D1", itens: [1, 2], invertidos: [2] }],
    } as unknown as EscalaGeralConfig;
    // item1=1 (normal); item2=3 invertido -> 4+0-3=1; soma=2
    const r = computeGeralScore(cfg, [1, 3]);
    expect(r.total).toBe(2);
  });

  it("binary com chaveCorrecao (BHS-like)", () => {
    const cfg = { tipo: "binary", chaveCorrecao: { 1: "C", 2: "E", 3: "C" } } as unknown as EscalaGeralConfig;
    // resp [1,0,1] -> C,E,C todos acertam -> 3
    expect(computeGeralScore(cfg, [1, 0, 1]).total).toBe(3);
  });

  it("likert-statements (BDI) soma direta", () => {
    const cfg = { tipo: "likert-statements" } as unknown as EscalaGeralConfig;
    expect(computeGeralScore(cfg, [0, 1, 2, 3]).total).toBe(6);
  });
});

describe("computeSchemaAvg", () => {
  const cfg = {
    dominios: [{
      nome: "D1",
      esquemas: [
        { id: "e1", nome: "E1", itens: [1, 2], invertido: false },
        { id: "e2", nome: "E2", itens: [3], invertido: true },
      ],
    }],
  } as unknown as EscalaConfig;

  it("média por esquema, inversão e maior média", () => {
    // e1: (6+6)/2=6 ; e2: item3=1 invertido -> 7-1=6 -> média 6
    const r = computeSchemaAvg(cfg, [6, 6, 1]);
    expect(r.schemas).toHaveLength(2);
    expect(r.schemas[0].media).toBe(6);
    expect(r.schemas[1].media).toBe(6);
    expect(r.pontuacao).toBe(6);
  });
});

describe("computeThreshold", () => {
  it("conta itens >= 5", () => {
    const r = computeThreshold([5, 4, 6, 2, 5]);
    expect(r.pontuacao).toBe(3);
    expect(r.flagged.map((f) => f.index)).toEqual([0, 2, 4]);
  });
});

describe("classificarResposta", () => {
  it("limites de faixa por escala", () => {
    expect(classificarResposta("phq9", 7)!.classificacao).toBe("Leve");
    expect(classificarResposta("phq9", 22)!.classificacao).toBe("Grave");
    expect(classificarResposta("gad7", 16)!.classificacao).toBe("Grave");
    expect(classificarResposta("bai", 35)!.classificacao).toBe("Grave");
    expect(classificarResposta("bdi", 30)!.classificacao).toBe("Grave");
    expect(classificarResposta("bhs", 15)!.classificacao).toBe("Grave");
    expect(classificarResposta("asrs", 25)!.classificacao).toBe("Altamente provável");
    expect(classificarResposta("who5", 6)!.classificacao).toBe("Muito baixo");
    expect(classificarResposta("who5", 7)!.classificacao).toBe("Baixo");
    expect(classificarResposta("who5", 13)!.classificacao).toBe("Adequado");
    expect(classificarResposta("rosenberg", 20)!.classificacao).toBe("Baixa");
    expect(classificarResposta("rosenberg", 30)!.classificacao).toBe("Media");
    expect(classificarResposta("rosenberg", 38)!.classificacao).toBe("Satisfatoria");
    expect(classificarResposta("pss10", 10)!.classificacao).toBe("Baixo");
    expect(classificarResposta("pss10", 20)!.classificacao).toBe("Moderado");
    expect(classificarResposta("pss10", 35)!.classificacao).toBe("Alto");
    expect(classificarResposta("isi", 5)!.classificacao).toBe("Sem insonia clinica");
    expect(classificarResposta("isi", 10)!.classificacao).toBe("Insonia subclinica");
    expect(classificarResposta("isi", 18)!.classificacao).toBe("Insonia moderada");
    expect(classificarResposta("isi", 25)!.classificacao).toBe("Insonia grave");
    expect(classificarResposta("audit", 3)!.classificacao).toBe("Baixo risco");
    expect(classificarResposta("audit", 12)!.classificacao).toBe("Uso de risco");
    expect(classificarResposta("audit", 18)!.classificacao).toBe("Uso nocivo");
    expect(classificarResposta("audit", 25)!.classificacao).toBe("Provavel dependencia");
    expect(classificarResposta("scs", 50)!.classificacao).toBe("Baixa");
    expect(classificarResposta("scs", 75)!.classificacao).toBe("Moderada");
    expect(classificarResposta("scs", 100)!.classificacao).toBe("Alta");
    expect(classificarResposta("mdq", 3)!.classificacao).toBe("Rastreio negativo");
    expect(classificarResposta("mdq", 9)!.classificacao).toBe("Rastreio positivo");
    expect(classificarResposta("pcl5", 10)!.classificacao).toBe("Minimo");
    expect(classificarResposta("pcl5", 25)!.classificacao).toBe("Moderado");
    expect(classificarResposta("pcl5", 45)!.classificacao).toBe("Clinicamente significativo");
    expect(classificarResposta("ocir", 15)!.classificacao).toBe("Sem significancia clinica");
    expect(classificarResposta("ocir", 30)!.classificacao).toBe("Clinicamente significativo");
    expect(classificarResposta("epworth", 5)!.classificacao).toBe("Normal");
    expect(classificarResposta("epworth", 7)!.classificacao).toBe("Media");
    expect(classificarResposta("epworth", 12)!.classificacao).toBe("Elevada");
    expect(classificarResposta("epworth", 18)!.classificacao).toBe("Excessiva");
  });
  it("retorna null para escala sem faixa", () => {
    expect(classificarResposta("neoffir", 50)).toBeNull();
  });
  it("WHO-5 baixo bem-estar NÃO é crise (maior = melhor)", () => {
    expect(pacienteEmRisco("who5", 4, [0, 1, 1, 1, 1])).toBe(false);
  });
});

describe("ehFaixaGrave", () => {
  it("grave / moderadamente grave / altamente provável", () => {
    expect(ehFaixaGrave("phq9", 22)).toBe(true);
    expect(ehFaixaGrave("phq9", 16)).toBe(true); // Moderadamente grave
    expect(ehFaixaGrave("phq9", 3)).toBe(false);
    expect(ehFaixaGrave("asrs", 25)).toBe(true);
    expect(ehFaixaGrave("gad7", 3)).toBe(false);
  });
});

describe("detectarRiscos", () => {
  const base = (over: Partial<RespostaRegistro>): RespostaRegistro => ({
    id: 1, tipo: "phq9", nome: "Teste", respostas: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pontuacao: 0, criado_em: "2026-06-22T00:00:00Z", ...over,
  });

  it("PHQ-9 item 9 = 0 não gera risco", () => {
    expect(detectarRiscos([base({})])).toHaveLength(0);
  });
  it("PHQ-9 item 9 = 1 gera risco alto", () => {
    const r = detectarRiscos([base({ respostas: [0, 0, 0, 0, 0, 0, 0, 0, 1] })]);
    expect(r).toHaveLength(1);
    expect(r[0].nivel).toBe("alto");
  });
  it("PHQ-9 item 9 = 2 gera risco crítico", () => {
    const r = detectarRiscos([base({ respostas: [0, 0, 0, 0, 0, 0, 0, 0, 2] })]);
    expect(r[0].nivel).toBe("critico");
  });
  it("BHS > 14 gera risco crítico, 14 não", () => {
    expect(detectarRiscos([base({ tipo: "bhs", pontuacao: 15, respostas: [] })])[0].nivel).toBe("critico");
    expect(detectarRiscos([base({ tipo: "bhs", pontuacao: 14, respostas: [] })])).toHaveLength(0);
  });
});

describe("pacienteEmRisco", () => {
  it("PHQ-9 item 9 positivo", () => {
    expect(pacienteEmRisco("phq9", 5, [0, 0, 0, 0, 0, 0, 0, 0, 1])).toBe(true);
  });
  it("PHQ-9 sem item 9 e leve", () => {
    expect(pacienteEmRisco("phq9", 3, [0, 0, 0, 0, 0, 0, 0, 0, 0])).toBe(false);
  });
  it("BHS grave e BDI grave via faixa", () => {
    expect(pacienteEmRisco("bhs", 15, [])).toBe(true);
    expect(pacienteEmRisco("bdi", 30, [])).toBe(true);
  });
  it("ASRS altamente provável NÃO é crise", () => {
    expect(pacienteEmRisco("asrs", 25, [])).toBe(false);
  });
});
