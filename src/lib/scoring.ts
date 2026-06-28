// ============================================================
// Scoring central — lógica de pontuação e classificação clínica.
// Extraído de Escala.tsx / Painel.tsx para permitir testes unitários.
// ============================================================
import type { EscalaConfig } from "@/content/escalas";
import type { EscalaGeralConfig } from "@/content/escalas-gerais";
import {
  classificarPorFaixa,
  phq9Faixas, gad7Faixas, baiFaixas, bdiFaixas, bhsFaixas, asrsFaixas, who5Faixas,
  rosenbergFaixas, pss10Faixas, isiFaixas, auditFaixas, scsFaixas,
  mdqFaixas, pcl5Faixas, ocirFaixas, epworthFaixas,
  dass21Faixas, maasFaixas, spinFaixas,
} from "@/content/normative-tables";

// ----- Schema scoring (YSQ / YPI) -----
export interface SchemaResult {
  id: string;
  nome: string;
  media: number;
  dominio: string;
}

export function computeSchemaAvg(config: EscalaConfig, respostas: number[]): { schemas: SchemaResult[]; pontuacao: number } {
  const schemas: SchemaResult[] = [];
  let highest = 0;
  for (const dominio of config.dominios ?? []) {
    for (const esquema of dominio.esquemas) {
      let soma = 0;
      for (const idx of esquema.itens) {
        let val = respostas[idx - 1] ?? 1;
        if (esquema.invertido) val = 7 - val;
        soma += val;
      }
      const media = soma / esquema.itens.length;
      if (media > highest) highest = media;
      schemas.push({ id: esquema.id, nome: esquema.nome, media, dominio: dominio.nome });
    }
  }
  return { schemas, pontuacao: Math.round(highest * 10) / 10 };
}

// ----- Threshold scoring (YCI) -----
export function computeThreshold(respostas: number[]): { flagged: { index: number; valor: number }[]; pontuacao: number } {
  const flagged: { index: number; valor: number }[] = [];
  for (let i = 0; i < respostas.length; i++) {
    if (respostas[i] >= 5) flagged.push({ index: i, valor: respostas[i] });
  }
  return { flagged, pontuacao: flagged.length };
}

// ----- General scale scoring -----
export interface DominioResult {
  id: string;
  nome: string;
  soma: number;
  media: number;
  itensCount: number;
}

export function computeGeralScore(config: EscalaGeralConfig, respostas: number[]): { total: number; dominios: DominioResult[] } {
  let total = 0;
  const dominios: DominioResult[] = [];

  if (config.tipo === "binary" && config.chaveCorrecao) {
    for (let i = 0; i < respostas.length; i++) {
      const chave = config.chaveCorrecao[i + 1];
      const resposta = respostas[i] === 1 ? "C" : "E";
      if (resposta === chave) total++;
    }
  } else if (config.tipo === "likert-statements") {
    total = respostas.reduce((a, b) => a + b, 0);
  } else {
    if (config.dominios && config.dominios.length > 0) {
      for (const dom of config.dominios) {
        let soma = 0;
        const invertidos = dom.invertidos ?? [];
        const globalInvertidos = config.invertidos ?? [];
        for (const idx of dom.itens) {
          let val = respostas[idx - 1] ?? 0;
          const isInverted = invertidos.includes(idx) || globalInvertidos.includes(idx);
          if (isInverted) {
            const maxVal = config.opcoes ? Math.max(...config.opcoes.map((o) => o.valor)) : 4;
            const minVal = config.opcoes ? Math.min(...config.opcoes.map((o) => o.valor)) : 0;
            val = maxVal + minVal - val;
          }
          soma += val;
        }
        const media = Math.round((soma / dom.itens.length) * 100) / 100;
        dominios.push({ id: dom.id, nome: dom.nome, soma, media, itensCount: dom.itens.length });
        total += soma;
      }
    } else {
      total = respostas.reduce((a, b) => a + b, 0);
    }
  }

  return { total, dominios };
}

// ============================================================
// Classificação por faixa normativa
// ============================================================
type Faixa = { readonly min: number; readonly max: number; readonly classificacao: string; readonly descricao: string };

export const faixasPorTipo: Record<string, readonly Faixa[]> = {
  phq9: phq9Faixas, gad7: gad7Faixas, bai: baiFaixas, bdi: bdiFaixas, bhs: bhsFaixas, asrs: asrsFaixas,
  who5: who5Faixas, rosenberg: rosenbergFaixas, pss10: pss10Faixas, isi: isiFaixas, audit: auditFaixas, scs: scsFaixas,
  mdq: mdqFaixas, pcl5: pcl5Faixas, ocir: ocirFaixas, epworth: epworthFaixas,
  dass21: dass21Faixas, maas: maasFaixas, spin: spinFaixas,
};

/** Retorna { classificacao, descricao } para escalas tipo-faixa, ou null se não houver faixa. */
export function classificarResposta(tipo: string, pontuacao: number): { classificacao: string; descricao: string } | null {
  const faixas = faixasPorTipo[tipo];
  if (!faixas) return null;
  return classificarPorFaixa(pontuacao, faixas);
}

/** True quando a faixa indica gravidade (Grave / Moderadamente grave / Altamente provável). */
export function ehFaixaGrave(tipo: string, pontuacao: number): boolean {
  const c = classificarResposta(tipo, pontuacao);
  if (!c) return false;
  return /rave/i.test(c.classificacao) || /altamente/i.test(c.classificacao);
}

// ============================================================
// Detecção de risco clínico (painel + tela do paciente)
// ============================================================
export interface RespostaRegistro {
  id: number;
  tipo: string;
  nome: string;
  telefone?: string;
  nascimento?: string;
  respostas: number[];
  pontuacao: number;
  criado_em: string;
}

export interface RiscoClinico {
  tipo: "phq9_item9" | "bhs_grave";
  mensagem: string;
  nivel: "alto" | "critico";
  respostaId: number;
  nome: string;
}

export function detectarRiscos(respostas: RespostaRegistro[]): RiscoClinico[] {
  const riscos: RiscoClinico[] = [];
  for (const r of respostas) {
    if (r.tipo === "phq9" && r.respostas[8] >= 1) {
      riscos.push({
        tipo: "phq9_item9",
        mensagem: `${r.nome} — PHQ-9 item 9 (ideacao suicida): resposta ${r.respostas[8]} em ${new Date(r.criado_em).toLocaleDateString("pt-BR")}`,
        nivel: r.respostas[8] >= 2 ? "critico" : "alto",
        respostaId: r.id,
        nome: r.nome,
      });
    }
    if (r.tipo === "bhs" && r.pontuacao > 14) {
      riscos.push({
        tipo: "bhs_grave",
        mensagem: `${r.nome} — BHS grave (${r.pontuacao} pts): desesperanca severa em ${new Date(r.criado_em).toLocaleDateString("pt-BR")}`,
        nivel: "critico",
        respostaId: r.id,
        nome: r.nome,
      });
    }
  }
  return riscos;
}

/** Indica se o resultado individual de um paciente justifica exibir linha de crise (CVV). */
export function pacienteEmRisco(tipo: string, pontuacao: number, respostas: number[]): boolean {
  if (tipo === "asrs") return false; // rastreio de TDAH não é indicador de crise
  if (tipo === "phq9" && respostas[8] >= 1) return true;
  if (tipo === "bhs" && pontuacao > 14) return true;
  return ehFaixaGrave(tipo, pontuacao);
}
