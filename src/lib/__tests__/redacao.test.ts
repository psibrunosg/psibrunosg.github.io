import { describe, it, expect } from "vitest";
import { redigirNome } from "@/lib/redacao";

describe("redigirNome", () => {
  it("troca nome completo por iniciais+nascimento", () => {
    const r = redigirNome("João Silva chegou triste na sessão.", "João Silva", "12/05/1990");
    expect(r).toBe("J.S. (nasc. 12/05/1990) chegou triste na sessão.");
  });

  it("troca também o primeiro nome isolado, além do nome completo", () => {
    const texto = "João Silva relatou ansiedade. João disse que piorou.";
    const r = redigirNome(texto, "João Silva", "12/05/1990");
    expect(r).toBe("J.S. (nasc. 12/05/1990) relatou ansiedade. J.S. (nasc. 12/05/1990) disse que piorou.");
  });

  it("case-insensitive", () => {
    const r = redigirNome("JOÃO SILVA e joão silva", "João Silva", "12/05/1990");
    expect(r).toBe("J.S. (nasc. 12/05/1990) e J.S. (nasc. 12/05/1990)");
  });

  it("respeita fronteira de palavra — não corta substring de outra palavra", () => {
    const r = redigirNome("Joana trabalha com anatomia.", "Ana", "01/01/2000");
    expect(r).toBe("Joana trabalha com anatomia.");
  });

  it("sem nascimento, usa só iniciais", () => {
    const r = redigirNome("Maria comentou sobre o pai.", "Maria", null);
    expect(r).toBe("M. comentou sobre o pai.");
  });

  it("sem nome cadastrado, retorna texto igual (nada a redigir)", () => {
    const r = redigirNome("Texto qualquer sem paciente vinculado.", null, null);
    expect(r).toBe("Texto qualquer sem paciente vinculado.");
  });

  it("nome com acento é tratado com fronteira Unicode correta", () => {
    const r = redigirNome("Bárbara relatou melhora. Bárbara Nunes confirmou.", "Bárbara Nunes", "03/03/1985");
    expect(r).toBe("B.N. (nasc. 03/03/1985) relatou melhora. B.N. (nasc. 03/03/1985) confirmou.");
  });

  it("nome de uma palavra só (sem sobrenome) gera iniciais de uma letra", () => {
    const r = redigirNome("Pedro está mais estável.", "Pedro", "20/02/1995");
    expect(r).toBe("P. (nasc. 20/02/1995) está mais estável.");
  });
});
