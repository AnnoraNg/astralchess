export const RANKS = [
  { name: 'Pawn Pathfinder', minXp: 0, symbol: '♙' },
  { name: 'Knight Navigator', minXp: 180, symbol: '♘' },
  { name: 'Bishop Voyager', minXp: 360, symbol: '♗' },
  { name: 'Rook Guardian', minXp: 600, symbol: '♖' },
  { name: 'Queen Luminary', minXp: 880, symbol: '♕' },
  { name: 'Tactical Stargazer', minXp: 1200, symbol: '✧' },
  { name: 'Endgame Wayfinder', minXp: 1600, symbol: '♔' },
  { name: 'Astral Challenger', minXp: 2100, symbol: '★' },
]

export function calculateXp(completed, curriculum) {
  const completedIds = new Set(completed)
  return curriculum.reduce((total, lesson) => total + (completedIds.has(lesson.id) ? lesson.xp : 0), 0)
}

export function normalizeProgress(value, curriculum) {
  const validIds = new Set(curriculum.map(lesson => lesson.id))
  const completed = [...new Set(Array.isArray(value?.completed) ? value.completed : [])]
    .filter(id => validIds.has(id))
  const activity = [...new Set(Array.isArray(value?.activity) ? value.activity : [])]
    .filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .sort()
  return { version: 2, completed, activity }
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function calculateStreak(activity, todayKey = localDateKey()) {
  const days = [...new Set(activity)].sort()
  if (!days.length) return 0
  const dayNumber = key => Date.parse(`${key}T00:00:00Z`) / 86400000
  const today = dayNumber(todayKey)
  const latest = dayNumber(days.at(-1))
  if (!Number.isFinite(latest) || today - latest > 1) return 0
  const active = new Set(days.map(dayNumber))
  let streak = 0
  for (let cursor = latest; active.has(cursor); cursor -= 1) streak += 1
  return streak
}

export function rankProgress(xp) {
  let index = RANKS.findLastIndex(rank => xp >= rank.minXp)
  if (index < 0) index = 0
  const current = RANKS[index]
  const next = RANKS[index + 1] || null
  const percent = next
    ? Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
    : 100
  return { current, next, index, percent: Math.max(0, Math.min(100, percent)) }
}
