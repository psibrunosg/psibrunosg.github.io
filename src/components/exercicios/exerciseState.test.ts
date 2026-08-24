import { describe, expect, it } from 'vitest'
import {
  createMatchingGameState,
  daysSinceWatering,
  nextAvailableId,
  parseGardenSnapshot,
  selectPersistedArray,
  shuffleWith,
} from './exerciseState'

describe('shuffleWith', () => {
  it('embaralha com Fisher-Yates sem alterar a coleção de origem', () => {
    const source = ['a', 'b', 'c', 'd']
    const values = [0.75, 0.1, 0.1]
    let index = 0

    const shuffled = shuffleWith(source, () => values[index++])

    expect(source).toEqual(['a', 'b', 'c', 'd'])
    expect(shuffled).toEqual(['b', 'c', 'a', 'd'])
  })
})

describe('createMatchingGameState', () => {
  it('cria 12 cartas únicas e reinicia seleção, acertos e pontuação', () => {
    const pairs = Array.from({ length: 6 }, (_, index) => ({
      left: `left-${index}`,
      right: `right-${index}`,
    }))

    const state = createMatchingGameState(pairs, () => 0.5)

    expect(state.cards).toHaveLength(12)
    expect(new Set(state.cards.map((card) => card.id)).size).toBe(12)
    expect(state.selectedIds).toEqual([])
    expect(state.matchedPairs).toBe(0)
    expect(state.score).toBe(0)
  })
})

describe('parseGardenSnapshot', () => {
  it('agrupa regas válidas e ordena plantas por sessões concluídas', () => {
    const raw = JSON.stringify([
      { slug: 'menos-praticado', data: '2026-08-20T12:00:00.000Z' },
      { slug: 'mais-praticado', data: '2026-08-19T12:00:00.000Z' },
      { slug: 'mais-praticado', data: '2026-08-22T12:00:00.000Z' },
    ])

    const snapshot = parseGardenSnapshot(raw)

    expect(snapshot.totalSessions).toBe(3)
    expect(snapshot.plants.map((plant) => plant.slug)).toEqual([
      'mais-praticado',
      'menos-praticado',
    ])
    expect(snapshot.plants[0]).toMatchObject({
      stage: 1,
      lastWateredAt: '2026-08-22T12:00:00.000Z',
      completedSessions: 2,
    })
  })

  it('retorna um jardim vazio para JSON inválido', () => {
    expect(parseGardenSnapshot('{')).toEqual({ plants: [], totalSessions: 0 })
  })
})

describe('daysSinceWatering', () => {
  it('usa o instante de referência injetado de forma estável', () => {
    const reference = Date.parse('2026-08-24T12:00:00.000Z')

    expect(daysSinceWatering('2026-08-21T12:00:00.000Z', reference)).toBe(3)
    expect(daysSinceWatering('invalid', reference)).toBe(0)
  })
})

describe('selectPersistedArray', () => {
  it('usa o valor persistido até existir uma substituição local', () => {
    const persisted = ['saved']

    expect(selectPersistedArray<string>(null, persisted)).toEqual(['saved'])
    expect(selectPersistedArray([], persisted)).toEqual([])
    expect(selectPersistedArray(['local'], persisted)).toEqual(['local'])
  })
})

describe('nextAvailableId', () => {
  it('gera um identificador determinístico sem colidir com itens existentes', () => {
    expect(nextAvailableId(['prazo:texto', 'prazo:texto-2'], 'prazo:texto'))
      .toBe('prazo:texto-3')
  })
})
