export interface MatchingPair {
  left: string
  right: string
}

export interface MatchingCard {
  id: string
  type: 'left' | 'right'
  text: string
  matched: boolean
  pairIndex: number
}

export interface MatchingGameState {
  cards: MatchingCard[]
  selectedIds: string[]
  matchedPairs: number
  score: number
}

export interface GardenPlant {
  slug: string
  stage: number
  lastWateredAt: string
  completedSessions: number
}

export interface GardenSnapshot {
  plants: GardenPlant[]
  totalSessions: number
}

export function shuffleWith<T>(
  items: readonly T[],
  random: () => number,
): T[] {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ]
  }

  return shuffled
}

export function createMatchingGameState(
  pairs: readonly MatchingPair[],
  random: () => number,
): MatchingGameState {
  const cards = pairs.flatMap((pair, pairIndex): MatchingCard[] => [
    {
      id: `l${pairIndex}`,
      type: 'left',
      text: pair.left,
      matched: false,
      pairIndex,
    },
    {
      id: `r${pairIndex}`,
      type: 'right',
      text: pair.right,
      matched: false,
      pairIndex,
    },
  ])

  return {
    cards: shuffleWith(cards, random),
    selectedIds: [],
    matchedPairs: 0,
    score: 0,
  }
}

interface GardenWatering {
  slug: string
  data: string
}

function isGardenWatering(value: unknown): value is GardenWatering {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return typeof candidate.slug === 'string'
    && candidate.slug.length > 0
    && typeof candidate.data === 'string'
    && !Number.isNaN(Date.parse(candidate.data))
}

export function parseGardenSnapshot(raw: string | null): GardenSnapshot {
  if (!raw) return { plants: [], totalSessions: 0 }

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return { plants: [], totalSessions: 0 }

    const waterings = parsed.filter(isGardenWatering)
    const bySlug = new Map<string, { count: number; last: string }>()

    waterings.forEach((watering) => {
      const current = bySlug.get(watering.slug)
      bySlug.set(watering.slug, {
        count: (current?.count ?? 0) + 1,
        last: !current || watering.data > current.last
          ? watering.data
          : current.last,
      })
    })

    const plants = Array.from(bySlug.entries(), ([slug, info]) => ({
      slug,
      stage: Math.min(5, info.count - 1),
      lastWateredAt: info.last,
      completedSessions: info.count,
    })).sort((first, second) => (
      second.completedSessions - first.completedSessions
    ))

    return { plants, totalSessions: waterings.length }
  } catch {
    return { plants: [], totalSessions: 0 }
  }
}

export function daysSinceWatering(
  wateredAt: string,
  referenceTime: number,
): number {
  const timestamp = Date.parse(wateredAt)
  if (Number.isNaN(timestamp)) return 0
  const elapsed = referenceTime - timestamp
  return Math.max(0, Math.floor(elapsed / (1000 * 60 * 60 * 24)))
}

export function selectPersistedArray<T>(
  localOverride: T[] | null,
  persisted: unknown,
): T[] {
  if (localOverride !== null) return localOverride
  return Array.isArray(persisted) ? persisted as T[] : []
}

export function nextAvailableId(
  existingIds: readonly string[],
  baseId: string,
): string {
  const existing = new Set(existingIds)
  if (!existing.has(baseId)) return baseId

  let suffix = 2
  while (existing.has(`${baseId}-${suffix}`)) suffix += 1
  return `${baseId}-${suffix}`
}
