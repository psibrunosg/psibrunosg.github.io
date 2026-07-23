import { describe, it, expect } from "vitest";
import { processarTeste, type ResultadoTeste } from "@/lib/parecer-generator";

function texto(dados: ResultadoTeste["dados"], testeId = "neo-pi"): string {
  return processarTeste({ testeId, dados } as ResultadoTeste).texto ?? "";
}

// Feminino: N1=24 e N6=20 caem em Alto, N5=8 em Baixo, N2/N3/N4 na média.
const N_DISSOCIADO = { sexo: "feminino", N: 110, N1: 24, N2: 13, N3: 14, N4: 16, N5: 8, N6: 20 };

describe("texto interpretativo do NEO PI-R", () => {
  it("ancora o domínio no percentil e no T", () => {
    expect(texto(N_DISSOCIADO)).toContain("NEUROTICISMO — médio (percentil 70, T 55).");
  });

  it("nomeia as facetas que fogem da média e só conta as que não fogem", () => {
    const t = texto(N_DISSOCIADO);
    expect(t).toContain("Sobressaem Ansiedade (P85) e Vulnerabilidade (P85)");
    expect(t).toContain("No sentido oposto, Impulsividade (P5)");
    expect(t).toContain("As outras 3 facetas situam-se na faixa média.");
    // As médias não podem ser nomeadas — é o que tirava força do texto antigo.
    expect(t).not.toContain("Hostilidade");
  });

  it("costura o fragmento da faceta em minúscula, no meio da frase", () => {
    expect(texto(N_DISSOCIADO)).toContain("(P85): tendência elevada à ansiedade");
  });

  it("sem faceta preenchida, entrega só o parágrafo do domínio", () => {
    const t = texto({ sexo: "feminino", E: 130 });
    expect(t).toContain("EXTROVERSÃO — alto (percentil 80, T 58).");
    expect(t).not.toContain("Sobressai");
    expect(t).not.toContain("faixa média");
  });

  it("com todas as facetas na média, declara ausência de dissociação", () => {
    const t = texto({ sexo: "feminino", C: 118, C1: 21, C2: 18, C3: 22, C4: 20, C5: 18, C6: 18 });
    expect(t).toContain("As 6 facetas avaliadas situam-se na faixa média, sem dissociação interna relevante.");
    expect(t).not.toContain("Sobressai");
  });

  it("separa os domínios em blocos", () => {
    expect(texto({ sexo: "feminino", N: 110, E: 130 }).split("\n\n")).toHaveLength(2);
  });

  it("sem nenhum escore, orienta o preenchimento", () => {
    expect(texto({ sexo: "feminino" })).toBe("Preencha os escores brutos para gerar o texto interpretativo.");
  });
});

describe("texto interpretativo do NEO FFI-R", () => {
  it("ancora só no T, porque não há tabela de percentil transcrita", () => {
    const t = texto({ sexo: "combinado", N: 30 }, "neo-ffi");
    expect(t).toContain("NEUROTICISMO — alto (T 56).");
    expect(t).not.toContain("percentil");
  });
});
