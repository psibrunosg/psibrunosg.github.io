import { describe, it, expect } from "vitest";
import { escalas } from "@/content/escalas";
import { interpretarResposta, correlacoesFactuais, type RespostaInterpretada } from "@/lib/interpret";

// Helpers: monta vetor de respostas e ativa itens (1-indexados) com um valor.
function vetor(len: number, fill = 1): number[] {
  return Array(len).fill(fill);
}
function ativar(arr: number[], itens1based: number[], valor: number): number[] {
  const out = [...arr];
  for (const i of itens1based) out[i - 1] = valor;
  return out;
}

describe("interpretarResposta — esquema (YSQ)", () => {
  const n = escalas.ysq.itens.length; // 90

  it("nomeia o esquema ativo, seu domínio e conta corretamente", () => {
    // "Privacao Emocional" = itens [1,19,37,55,73]; ativa só ele com 6.
    const respostas = ativar(vetor(n, 1), [1, 19, 37, 55, 73], 6);
    const r = interpretarResposta("ysq", respostas, 6);

    expect(r.familia).toBe("schema");
    expect(r.totalAtivos).toBe(1);
    expect(r.resumo).toBe("1 esquema ativo");
    const ativos = r.rodadas![0].ativos;
    expect(ativos).toHaveLength(1);
    expect(ativos[0].nome).toBe("Privacao Emocional");
    expect(ativos[0].dominio).toBe("Desconexao e Rejeicao");
    expect(ativos[0].media).toBe(6);
  });

  it("sem ativação quando todas as médias ≤ 3.5", () => {
    const r = interpretarResposta("ysq", vetor(n, 1), 1);
    expect(r.totalAtivos).toBe(0);
    expect(r.resumo).toBe("Nenhum esquema ativo");
  });
});

describe("interpretarResposta — SMI (modo saudável não conta como problema)", () => {
  const n = escalas.smi.itens.length; // 118

  it("modo saudável ativo é separado e não entra na contagem de ativos", () => {
    // Adulto Saudavel = [13,27,41,54,68,81,84,95,98,118]; Crianca Vulneravel ativa = 1 problema.
    let respostas = vetor(n, 1);
    respostas = ativar(respostas, [13, 27, 41, 54, 68, 81, 84, 95, 98, 118], 6); // saudável
    respostas = ativar(respostas, [1, 15, 29, 42, 43, 56, 57, 69, 71, 82, 85, 99, 109, 113], 6); // problema
    const r = interpretarResposta("smi", respostas, 6);

    expect(r.unidade).toBe("modo");
    expect(r.totalAtivos).toBe(1); // só o problema, não o saudável
    expect(r.rodadas![0].saudavelAtivo?.nome).toBe("Adulto Saudavel");
    expect(r.rodadas![0].ativos.some((e) => e.positivo)).toBe(false);
  });
});

describe("interpretarResposta — threshold (YCI)", () => {
  const n = escalas.yci.itens.length;

  it("conta defesas com nota ≥ 5 e traz o texto do item", () => {
    const respostas = ativar(vetor(n, 1), [5, 10, 20], 5);
    const r = interpretarResposta("yci", respostas, 3);
    expect(r.familia).toBe("threshold");
    expect(r.flagged).toHaveLength(3);
    expect(r.unidadeDefesa).toBe("defesa");
    expect(r.resumo).toBe("3 defesas ativas");
    expect(r.flagged![0].texto).toBe(escalas.yci.itens[4]);
  });
});

describe("interpretarResposta — YPI (duas rodadas Pai/Mãe)", () => {
  it("separa as rodadas", () => {
    const n = escalas.ypi.itens.length * 2;
    const r = interpretarResposta("ypi", vetor(n, 1), 1);
    expect(r.rodadas).toHaveLength(2);
    expect(r.rodadas!.map((x) => x.label)).toEqual(["Pai", "Mae"]);
  });
});

describe("interpretarResposta — PHQ-9 / GAD-7 (config em escalasGerais)", () => {
  it("classifica PHQ-9 a partir das respostas completas", () => {
    // 9 itens somando 12 (dentro da faixa "Moderada": 10-14).
    const respostas = [3, 3, 3, 3, 0, 0, 0, 0, 0];
    const r = interpretarResposta("phq9", respostas, 12);
    expect(r.familia).toBe("faixa");
    expect(r.classificacao).toBe("Moderada");
    expect(r.resumo).toBe("Moderada · 12/27");
  });

  it("cai no fallback de faixa solta quando não há config nem respostas completas", () => {
    const r = interpretarResposta("tipo-inexistente", [], 12);
    expect(r.familia).toBe("dominio");
    expect(r.resumo).toBe("Score: 12");
  });
});

describe("correlacoesFactuais", () => {
  // Constrói uma interpretação mínima por classificação (testa a regra, não o recálculo).
  const mk = (tipo: string, classificacao: string): RespostaInterpretada =>
    ({ tipo, sigla: tipo.toUpperCase(), nomeEscala: tipo, familia: "faixa", respostas: [], classificacao, resumo: "" });

  it("aponta depressão grave + desesperança grave como atenção", () => {
    const correls = correlacoesFactuais([mk("phq9", "Grave"), mk("bhs", "Grave")]);
    expect(correls.some((c) => c.nivel === "atencao" && /desesperan/i.test(c.texto))).toBe(true);
  });

  it("não inventa correlação quando os escores são baixos", () => {
    const correls = correlacoesFactuais([mk("phq9", "Mínima"), mk("bhs", "Mínimo")]);
    expect(correls).toHaveLength(0);
  });
});
