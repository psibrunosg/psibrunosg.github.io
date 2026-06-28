// ============================================================
// Interpretação unificada de respostas — camada de leitura do painel.
// Reaproveita o scoring já existente (computeSchemaAvg / computeThreshold /
// computeGeralScore / classificarResposta) para reconstruir, a partir das
// respostas cruas salvas no banco, a MESMA leitura rica que o paciente vê.
// Nenhuma migração de banco é necessária: tudo deriva de `respostas`.
// ============================================================
import { escalas, type EscalaConfig } from "@/content/escalas";
import { escalasGerais, type EscalaGeralConfig } from "@/content/escalas-gerais";
import {
  computeSchemaAvg, computeThreshold, computeGeralScore,
  classificarResposta, type SchemaResult, type DominioResult,
} from "@/lib/scoring";

/** Limiar de ativação de esquema/modo (média > 3.5), consistente com a tela do paciente. */
export const LIMIAR_ATIVACAO = 3.5;

export type Familia = "schema" | "threshold" | "faixa" | "dominio";

export interface EsquemaInterpretado extends SchemaResult {
  ativo: boolean;
  positivo: boolean; // modo saudável (SMI) — ativo é desejável, não conta como problema
}

export interface RodadaInterpretada {
  label: string;                      // "" | "Pai" | "Mãe"
  esquemas: EsquemaInterpretado[];    // todos, ordenados por média desc
  ativos: EsquemaInterpretado[];      // problemas ativos (>3.5, exclui modo saudável)
  saudavelAtivo?: EsquemaInterpretado; // SMI: modo saudável quando ativo
}

export interface ItemFlag { index: number; valor: number; texto: string; }

export interface RespostaInterpretada {
  tipo: string;
  sigla: string;
  nomeEscala: string;
  familia: Familia;
  respostas: number[];
  resumo: string;       // headline curto p/ lista e cards
  // --- schema ---
  rodadas?: RodadaInterpretada[];
  totalAtivos?: number;
  totalEsquemas?: number;
  unidade?: "esquema" | "modo"; // rótulo (SMI usa "modo")
  // --- threshold ---
  flagged?: ItemFlag[];
  unidadeDefesa?: string; // "defesa" | "estratégia de evitação"
  // --- faixa / dominio ---
  total?: number;
  max?: number;
  pct?: number;
  classificacao?: string;
  descricao?: string;
  dominios?: DominioResult[];
  maiorMelhor?: boolean; // escalas onde escore alto é positivo (WHO-5, autoestima, autocompaixão)
}

// Escalas onde escore mais alto = melhor funcionamento (não patológico).
const MAIOR_MELHOR = new Set(["who5", "rosenberg", "scs", "ebep"]);
// Máximos para escalas de faixa que não estão em escalasGerais (PHQ-9 / GAD-7 vêm de páginas próprias).
const MAX_FALLBACK: Record<string, number> = { phq9: 27, gad7: 21, bai: 63, bdi: 63, bhs: 20, asrs: 72 };

function ehModoSaudavel(dominioNome: string): boolean {
  return /saud[aá]vel/i.test(dominioNome);
}

function plural(n: number, singular: string, pluralForma?: string): string {
  if (n === 1) return `1 ${singular}`;
  return `${n} ${pluralForma ?? singular + "s"}`;
}

function interpretarSchema(config: EscalaConfig, respostas: number[]): RespostaInterpretada {
  const temRodadas = !!config.rodadas && config.rodadas.length > 1;
  const itensBase = config.itens.length;
  const unidade: "esquema" | "modo" = config.id === "smi" ? "modo" : "esquema";

  const fatias = temRodadas
    ? config.rodadas!.map((label, i) => ({ label, slice: respostas.slice(i * itensBase, (i + 1) * itensBase) }))
    : [{ label: "", slice: respostas }];

  const rodadas: RodadaInterpretada[] = fatias.map(({ label, slice }) => {
    const { schemas } = computeSchemaAvg(config, slice);
    const esquemas: EsquemaInterpretado[] = schemas
      .map((s) => {
        const positivo = ehModoSaudavel(s.dominio);
        return { ...s, positivo, ativo: s.media > LIMIAR_ATIVACAO };
      })
      .sort((a, b) => b.media - a.media);
    const ativos = esquemas.filter((e) => e.ativo && !e.positivo);
    const saudavelAtivo = esquemas.find((e) => e.positivo && e.ativo);
    return { label, esquemas, ativos, saudavelAtivo };
  });

  const totalAtivos = rodadas.reduce((acc, r) => acc + r.ativos.length, 0);
  const totalEsquemas = rodadas.reduce((acc, r) => acc + r.esquemas.filter((e) => !e.positivo).length, 0);
  const resumo = totalAtivos === 0
    ? `Nenhum ${unidade} ativo`
    : `${plural(totalAtivos, `${unidade} ativo`, `${unidade}s ativos`)}`;

  return {
    tipo: config.id, sigla: config.sigla, nomeEscala: config.nome, familia: "schema",
    respostas, rodadas, totalAtivos, totalEsquemas, unidade, resumo,
  };
}

function interpretarThreshold(config: EscalaConfig, respostas: number[]): RespostaInterpretada {
  const { flagged } = computeThreshold(respostas);
  const unidadeDefesa = config.id === "yrai" ? "estratégia de evitação" : "defesa";
  const flags: ItemFlag[] = flagged.map((f) => ({
    index: f.index, valor: f.valor, texto: config.itens[f.index] ?? `Item ${f.index + 1}`,
  }));
  const resumo = flags.length === 0
    ? `Nenhuma ${unidadeDefesa} ativa`
    : plural(flags.length, `${unidadeDefesa} ativa`, `${unidadeDefesa}s ativas`);
  return {
    tipo: config.id, sigla: config.sigla, nomeEscala: config.nome, familia: "threshold",
    respostas, flagged: flags, unidadeDefesa, resumo,
  };
}

function maxDeGeral(config: EscalaGeralConfig, total: number): number {
  if (config.pontuacaoMaxima) return config.pontuacaoMaxima;
  if (config.opcoes && config.opcoes.length) {
    return Math.max(...config.opcoes.map((o) => o.valor)) * (Array.isArray(config.itens) ? config.itens.length : 0);
  }
  return MAX_FALLBACK[config.id] ?? total;
}

function interpretarGeral(config: EscalaGeralConfig, respostas: number[]): RespostaInterpretada {
  const { total, dominios } = computeGeralScore(config, respostas);
  const max = maxDeGeral(config, total);
  const classif = classificarResposta(config.id, total);
  const familia: Familia = classif ? "faixa" : "dominio";
  const pct = max > 0 ? Math.min(100, (total / max) * 100) : 0;
  const maiorMelhor = MAIOR_MELHOR.has(config.id);
  const resumo = classif
    ? `${classif.classificacao} · ${total}/${max}`
    : dominios.length
      ? `${total} pts · ${plural(dominios.length, "domínio", "domínios")}`
      : `${total} pts`;
  return {
    tipo: config.id, sigla: config.sigla, nomeEscala: config.nome, familia,
    respostas, total, max, pct, classificacao: classif?.classificacao, descricao: classif?.descricao,
    dominios, maiorMelhor, resumo,
  };
}

// Faixa "solta" (PHQ-9 / GAD-7 e qualquer tipo sem config geral): usa pontuação salva.
function interpretarFaixaSolta(tipo: string, respostas: number[], pontuacao: number): RespostaInterpretada {
  const classif = classificarResposta(tipo, pontuacao);
  const max = MAX_FALLBACK[tipo] ?? pontuacao;
  const pct = max > 0 ? Math.min(100, (pontuacao / max) * 100) : 0;
  return {
    tipo, sigla: tipo.toUpperCase(), nomeEscala: tipo.toUpperCase(), familia: classif ? "faixa" : "dominio",
    respostas, total: pontuacao, max, pct,
    classificacao: classif?.classificacao, descricao: classif?.descricao,
    resumo: classif ? `${classif.classificacao} · ${pontuacao}/${max}` : `Score: ${pontuacao}`,
  };
}

/**
 * Interpreta QUALQUER resposta salva, reconstruindo a leitura rica a partir das
 * respostas cruas + config da escala. `pontuacao` é usada apenas como fallback
 * para escalas de faixa sem config (PHQ-9 / GAD-7).
 */
export function interpretarResposta(tipo: string, respostas: number[], pontuacao: number): RespostaInterpretada {
  const cfgEscala = escalas[tipo] as EscalaConfig | undefined;
  if (cfgEscala) {
    return cfgEscala.scoring === "schema-avg"
      ? interpretarSchema(cfgEscala, respostas)
      : interpretarThreshold(cfgEscala, respostas);
  }
  const cfgGeral = escalasGerais[tipo] as EscalaGeralConfig | undefined;
  if (cfgGeral) return interpretarGeral(cfgGeral, respostas);
  return interpretarFaixaSolta(tipo, respostas, pontuacao);
}

// ============================================================
// Correlações factuais entre escalas de um mesmo paciente.
// Apenas co-ocorrências objetivas — NÃO conclui diagnóstico.
// ============================================================
export interface Correlacao {
  texto: string;
  nivel: "info" | "atencao";
}

const FAIXAS_GRAVES = /grave|moderadamente grave|altamente prov|provável tept|clinicamente signific|dependencia|excessiva/i;

export function correlacoesFactuais(interps: RespostaInterpretada[]): Correlacao[] {
  const out: Correlacao[] = [];
  const porTipo = new Map<string, RespostaInterpretada>();
  for (const i of interps) if (!porTipo.has(i.tipo)) porTipo.set(i.tipo, i); // mais recente (lista já vem ordenada desc)

  const grave = (tipo: string) => {
    const i = porTipo.get(tipo);
    return !!i?.classificacao && FAIXAS_GRAVES.test(i.classificacao);
  };
  const esquemaAtivo = (nomeRegex: RegExp) => {
    for (const i of interps) {
      if (i.familia !== "schema") continue;
      for (const r of i.rodadas ?? []) {
        for (const e of r.ativos) if (nomeRegex.test(e.nome)) return i;
      }
    }
    return undefined;
  };

  // Depressão + desesperança (sinal de risco aumentado)
  if ((grave("phq9") || grave("bdi")) && grave("bhs")) {
    out.push({ nivel: "atencao", texto: "Sintomatologia depressiva elevada (PHQ-9/BDI) coincide com desesperança grave (BHS) — atenção a risco; avaliar ideação." });
  }
  // Depressão + esquemas de Fracasso/Defectividade
  const fracasso = esquemaAtivo(/fracasso|defectividade|inadequa/i);
  if ((grave("phq9") || grave("bdi")) && fracasso) {
    out.push({ nivel: "info", texto: `Depressão elevada acompanha esquema(s) de Fracasso/Defectividade ativo(s) (${fracasso.sigla}) — possível alvo de reestruturação.` });
  }
  // Ansiedade + Vulnerabilidade ao dano
  const vuln = esquemaAtivo(/vulnerabilidade|perigo|dano/i);
  if ((grave("gad7") || grave("bai")) && vuln) {
    out.push({ nivel: "info", texto: `Ansiedade elevada acompanha esquema de Vulnerabilidade ativo (${vuln.sigla}).` });
  }
  // Insônia + depressão/ansiedade
  if (grave("isi") && (grave("phq9") || grave("gad7") || grave("bdi") || grave("bai"))) {
    out.push({ nivel: "info", texto: "Insônia clínica (ISI) coexiste com sintomatologia ansiosa/depressiva elevada." });
  }
  // Uso de álcool de risco + humor
  if (grave("audit") && (grave("phq9") || grave("bdi"))) {
    out.push({ nivel: "atencao", texto: "Uso de álcool de risco (AUDIT) coexiste com depressão elevada — investigar uso como enfrentamento." });
  }
  return out;
}
