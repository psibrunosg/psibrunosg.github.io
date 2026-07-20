// Espelho de src/lib/redacao.ts — Deno (edge functions) roda em runtime
// separado do Vite/browser, sem bundler compartilhado nem path alias `@/`,
// então esta lógica é duplicada de propósito (mesmo algoritmo, mantido em
// sincronia manual). Ver src/lib/redacao.ts para os testes unitários.

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function iniciaisDe(nomeCompleto: string): string {
  const partes = nomeCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  return partes.map((p) => p[0]?.toUpperCase() ?? "").join(".") + ".";
}

export function redigirNome(
  texto: string,
  nomePaciente: string | null | undefined,
  nascimento: string | null | undefined
): string {
  const nome = nomePaciente?.trim();
  if (!texto || !nome) return texto;

  const iniciais = iniciaisDe(nome);
  if (!iniciais) return texto;
  const substituto = nascimento?.trim() ? `${iniciais} (nasc. ${nascimento.trim()})` : iniciais;

  const partes = nome.split(/\s+/).filter(Boolean);
  const variantes = new Set<string>([nome]);
  if (partes.length > 1) variantes.add(partes[0]);

  let resultado = texto;
  for (const variante of Array.from(variantes).sort((a, b) => b.length - a.length)) {
    const padrao = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(variante)}(?![\\p{L}\\p{N}])`, "giu");
    resultado = resultado.replace(padrao, substituto);
  }
  return resultado;
}
