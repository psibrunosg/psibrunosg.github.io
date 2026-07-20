// ============================================================
// Redação determinística de nome de paciente — usada pelo chat de
// Conceituação Cognitiva e por anexos (PDF/texto colado) antes de qualquer
// envio a provedor de IA externo e antes de persistir no banco.
// NÃO é um filtro geral de PII: só troca o nome do paciente já cadastrado
// (nome completo ou só o primeiro nome) por iniciais+nascimento. Outros
// dados sensíveis (CPF, endereço, nomes de terceiros) não são cobertos.
// ============================================================

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function iniciaisDe(nomeCompleto: string): string {
  const partes = nomeCompleto.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  return partes.map((p) => p[0]?.toUpperCase() ?? "").join(".") + ".";
}

/**
 * Troca ocorrências do nome do paciente (completo, ou só o primeiro nome)
 * por "iniciais (nasc. DATA)". Case-insensitive, com fronteira de palavra
 * Unicode-aware (cobre acentos). Sem nome cadastrado, retorna o texto igual.
 */
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

  // Mais longo primeiro: substitui o nome completo antes do primeiro nome
  // isolado, evitando sobra de sobrenome quando ambos aparecem juntos.
  let resultado = texto;
  for (const variante of Array.from(variantes).sort((a, b) => b.length - a.length)) {
    const padrao = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(variante)}(?![\\p{L}\\p{N}])`, "giu");
    resultado = resultado.replace(padrao, substituto);
  }
  return resultado;
}
