import { describe, expect, it } from 'vitest'
import { calculateStreak, calculateXp, normalizeProgress, rankProgress } from './progress.js'
import { lessons } from './content.js'

const curriculum = [
  { id: 'board', xp: 40 },
  { id: 'pieces', xp: 70 },
  { id: 'special', xp: 90 },
]

describe('saved progress', () => {
  it('deduplicates known lessons and ignores a stale saved XP value', () => {
    const progress = normalizeProgress({ completed: ['board', 'board', 'special', 'removed'], xp: 999 }, curriculum)
    expect(progress.completed).toEqual(['board', 'special'])
    expect(calculateXp(progress.completed, curriculum)).toBe(130)
  })

  it('calculates consecutive activity and allows a streak from yesterday', () => {
    expect(calculateStreak(['2026-07-15', '2026-07-16', '2026-07-17'], '2026-07-18')).toBe(3)
    expect(calculateStreak(['2026-07-15'], '2026-07-18')).toBe(0)
  })

  it('advances through the full rank ladder', () => {
    expect(rankProgress(0).current.name).toBe('Pawn Pathfinder')
    expect(rankProgress(600).current.name).toBe('Rook Guardian')
    expect(rankProgress(2100)).toMatchObject({ next: null, percent: 100 })
    expect(calculateXp(lessons.map(lesson => lesson.id), lessons)).toBe(lessons.reduce((sum, lesson) => sum + lesson.xp, 0))
  })
})
