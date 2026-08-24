import type { EscalaConfig } from '@/content/escalas'
import type { EscalaGeralConfig } from '@/content/escalas-gerais'
import {
  computeGeralScore,
  computeSchemaAvg,
  computeThreshold,
} from '@/lib/scoring'

export type ScaleConfig = EscalaConfig | EscalaGeralConfig

export interface ScaleDraft {
  respostas: (number | null)[]
  atual: number
  etapa: 'form' | 'dados'
}

interface ScaleOption {
  label: string
  valor: number
}

export function createResponseSlots(total: number): (number | null)[] {
  return Array(Math.max(0, Math.floor(total))).fill(null)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parseScaleDraft(
  raw: string | null,
  total: number,
): ScaleDraft | null {
  if (!raw || total <= 0) return null

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed) || !Array.isArray(parsed.respostas)) return null

    const respostas = parsed.respostas
    const validResponses = respostas.length === total
      && respostas.every((answer) => answer === null || typeof answer === 'number')
      && respostas.some((answer) => answer !== null)
    const validIndex = Number.isInteger(parsed.atual)
      && typeof parsed.atual === 'number'
      && parsed.atual >= 0
      && parsed.atual < total
    const validStage = parsed.etapa === 'form' || parsed.etapa === 'dados'

    if (!validResponses || !validIndex || !validStage) return null
    return {
      respostas: respostas as (number | null)[],
      atual: parsed.atual as number,
      etapa: parsed.etapa as 'form' | 'dados',
    }
  } catch {
    return null
  }
}

export function resolveRovingIndex(
  answer: number | null | undefined,
  options: readonly ScaleOption[],
): number {
  if (answer === null || answer === undefined) return 0
  const index = options.findIndex((option) => option.valor === answer)
  return index >= 0 ? index : 0
}

export function nextUncrossedMilestone(
  progress: number,
  crossed: ReadonlySet<number>,
): number | null {
  return [25, 50, 75, 100].find((milestone) => (
    progress >= milestone && !crossed.has(milestone)
  )) ?? null
}

function isGeneralScale(config: ScaleConfig): config is EscalaGeralConfig {
  return 'tipo' in config
}

export function computeSubmissionScore(
  config: ScaleConfig,
  responses: number[],
): number {
  if (isGeneralScale(config)) return computeGeralScore(config, responses).total
  if (config.scoring === 'schema-avg') {
    return computeSchemaAvg(config, responses).pontuacao
  }
  return computeThreshold(responses).pontuacao
}
