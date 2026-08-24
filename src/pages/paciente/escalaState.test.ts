import { describe, expect, it } from 'vitest'
import { escalas } from '@/content/escalas'
import { escalasGerais } from '@/content/escalas-gerais'
import {
  computeSubmissionScore,
  createResponseSlots,
  nextUncrossedMilestone,
  parseScaleDraft,
  resolveRovingIndex,
} from './escalaState'

describe('createResponseSlots', () => {
  it('cria exatamente o total solicitado preenchido com null', () => {
    expect(createResponseSlots(3)).toEqual([null, null, null])
    expect(createResponseSlots(0)).toEqual([])
  })
})

describe('parseScaleDraft', () => {
  it('aceita apenas progresso e descarta identificação legada', () => {
    const raw = JSON.stringify({
      respostas: [1, null, 3],
      atual: 1,
      etapa: 'form',
      nome: 'Não reidratar',
      cpf: '00000000000',
      email: 'privado@example.com',
      telefone: '0000000000',
    })

    expect(parseScaleDraft(raw, 3)).toEqual({
      respostas: [1, null, 3],
      atual: 1,
      etapa: 'form',
    })
  })

  it('rejeita JSON inválido e rascunhos malformados ou vazios', () => {
    expect(parseScaleDraft('{', 2)).toBeNull()
    expect(parseScaleDraft(JSON.stringify({ respostas: [null, null], atual: 0, etapa: 'form' }), 2)).toBeNull()
    expect(parseScaleDraft(JSON.stringify({ respostas: [1], atual: 2, etapa: 'outra' }), 1)).toBeNull()
  })
})

describe('resolveRovingIndex', () => {
  const options = [
    { label: 'Nunca', valor: 0 },
    { label: 'Às vezes', valor: 1 },
    { label: 'Sempre', valor: 2 },
  ]

  it('resolve a opção respondida ou volta para zero', () => {
    expect(resolveRovingIndex(2, options)).toBe(2)
    expect(resolveRovingIndex(null, options)).toBe(0)
    expect(resolveRovingIndex(9, options)).toBe(0)
  })
})

describe('nextUncrossedMilestone', () => {
  it('emite 25/50/75/100 apenas enquanto ainda não foram cruzados', () => {
    expect(nextUncrossedMilestone(55, new Set([25]))).toBe(50)
    expect(nextUncrossedMilestone(55, new Set([25, 50]))).toBeNull()
    expect(nextUncrossedMilestone(100, new Set([25, 50, 75]))).toBe(100)
  })
})

describe('computeSubmissionScore', () => {
  it('preserva os ramos geral, média de esquemas e limiar', () => {
    expect(computeSubmissionScore(escalasGerais.phq9, [1, 2, 3])).toBe(6)
    expect(computeSubmissionScore(escalas.ysq, Array(escalas.ysq.itens.length).fill(6))).toBe(6)
    expect(computeSubmissionScore(escalas.yci, [5, 4, 6])).toBe(2)
  })
})
