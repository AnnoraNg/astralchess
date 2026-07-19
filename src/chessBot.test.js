import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { chooseBotMove, evaluate } from './chessBot.js'
import { courseSections, lessons, ruleCards } from './content.js'

describe('beginner bot', () => {
  it('always returns a legal move', () => {
    const game = new Chess()
    const legal = game.moves({ verbose: true }).map(m => m.lan)
    const move = chooseBotMove(game, 1)
    expect(legal).toContain(move.lan)
  })

  it('recognises a forced mate in one', () => {
    const game = new Chess('7k/5K2/8/8/8/8/6Q1/8 w - - 0 1')
    const move = chooseBotMove(game, 2)
    game.move(move)
    expect(game.isCheckmate()).toBe(true)
  })
})

describe('lesson positions', () => {
  const lessonById = id => lessons.find(lesson => lesson.id === id)

  it('loads every curriculum position as a valid chess state', () => {
    for (const lesson of lessons) expect(() => new Chess(lesson.fen), lesson.id).not.toThrow()
  })

  it('defines exactly one legal move matching every lesson objective', () => {
    for (const lesson of lessons) {
      const game = new Chess(lesson.fen)
      const matches = game.moves({ verbose: true }).filter(move => Object.entries(lesson.expected).every(([key, value]) => move[key] === value))
      expect(matches, lesson.id).toHaveLength(1)
    }
  })

  it('gives every lesson a valid rule checkpoint', () => {
    for (const lesson of lessons) {
      expect(lesson.takeaways, lesson.id).toHaveLength(3)
      expect(lesson.checkpoint.options, lesson.id).toHaveLength(3)
      expect(lesson.checkpoint.answer, lesson.id).toBeGreaterThanOrEqual(0)
      expect(lesson.checkpoint.answer, lesson.id).toBeLessThan(lesson.checkpoint.options.length)
      expect(lesson.checkpoint.explanation, lesson.id).toBeTruthy()
    }
  })

  it('provides a deep, uniquely routed lesson path for every course section', () => {
    expect(new Set(lessons.map(lesson => lesson.id)).size).toBe(lessons.length)
    for (const section of courseSections) {
      const sectionLessons = lessons.filter(lesson => lesson.section === section.id)
      expect(sectionLessons.length, section.id).toBeGreaterThanOrEqual(2)
    }
    for (const lesson of lessons) {
      expect(lesson.guide.length, lesson.id).toBeGreaterThanOrEqual(2)
      expect(courseSections.some(section => section.id === lesson.section), lesson.id).toBe(true)
    }
  })

  it('makes the named fork and pin exercises demonstrate the actual tactic', () => {
    const fork = lessonById('forks')
    const forkGame = new Chess(fork.fen)
    forkGame.move(fork.expected)
    expect(forkGame.isAttacked('e8', 'w')).toBe(true)
    expect(forkGame.isAttacked('d5', 'w')).toBe(true)

    const pin = lessonById('pins-skewers')
    const pinGame = new Chess(pin.fen)
    pinGame.move(pin.expected)
    expect(pinGame.moves({ square: 'c6' })).toHaveLength(0)
  })

  it('follows a beginner-safe prerequisite order', () => {
    const ids = lessons.map(lesson => lesson.id)
    const before = (first, second) => expect(ids.indexOf(first), `${first} before ${second}`).toBeLessThan(ids.indexOf(second))

    before('board', 'pawn')
    before('king', 'capture')
    before('capture', 'notation')
    before('notation', 'check')
    before('check', 'escaping-check')
    before('escaping-check', 'special')
    before('special', 'promotion')
    before('draws', 'opening')
    before('development', 'opening-danger')
    before('opening-danger', 'tactical-scan')
    before('mating-patterns', 'thought-process')
    before('phase-guide', 'king-endgame')
    before('endgame-conversion', 'mastery-path')
  })

  it('uses a distinct practice position for every lesson', () => {
    expect(new Set(lessons.map(lesson => lesson.fen)).size).toBe(lessons.length)
  })

  it('makes the draw exercise end in stalemate rather than checkmate', () => {
    const lesson = lessonById('draws')
    const game = new Chess(lesson.fen)
    game.move(lesson.expected)
    expect(game.isStalemate()).toBe(true)
    expect(game.isCheckmate()).toBe(false)
  })

  it('makes the opening-danger defense answer the stated mate threat', () => {
    const lesson = lessonById('opening-danger')
    const threat = new Chess(lesson.fen.replace(' b ', ' w '))
    threat.move('Qxf7#')
    expect(threat.isCheckmate()).toBe(true)

    const defended = new Chess(lesson.fen)
    defended.move(lesson.expected)
    expect(defended.moves()).not.toContain('Qxf7#')
  })

  it('makes the king exercise create direct opposition', () => {
    const lesson = lessonById('king-endgame')
    const game = new Chess(lesson.fen)
    game.move(lesson.expected)
    expect(game.get('e4')).toMatchObject({ type: 'k', color: 'w' })
    expect(game.get('e6')).toMatchObject({ type: 'k', color: 'b' })
    expect(game.turn()).toBe('b')
  })

  it('makes the final defensive case stop a genuine mate threat', () => {
    const lesson = lessonById('mastery-path')
    const threat = new Chess(lesson.fen.replace(' w ', ' b '))
    threat.move('Qxh2#')
    expect(threat.isCheckmate()).toBe(true)

    const defended = new Chess(lesson.fen)
    defended.move(lesson.expected)
    defended.move('Qxh2+')
    expect(defended.isCheckmate()).toBe(false)
    expect(defended.moves()).toContain('Kxh2')
  })
})

describe('rulebook practice links', () => {
  it('routes every rule card to an existing lesson', () => {
    const ids = new Set(lessons.map(lesson => lesson.id))
    for (const rule of ruleCards) expect(ids.has(rule.practice), rule.title).toBe(true)
  })
})

describe('position evaluation', () => {
  it('rewards pawns for advancing toward promotion', () => {
    const whiteStart = new Chess('7k/8/8/8/8/8/4P3/K7 w - - 0 1')
    const whiteAdvanced = new Chess('7k/8/8/8/4P3/8/8/K7 w - - 0 1')
    const blackStart = new Chess('7k/4p3/8/8/8/8/8/K7 b - - 0 1')
    const blackAdvanced = new Chess('7k/8/8/4p3/8/8/8/K7 b - - 0 1')
    expect(evaluate(whiteAdvanced)).toBeGreaterThan(evaluate(whiteStart))
    expect(evaluate(blackAdvanced)).toBeLessThan(evaluate(blackStart))
  })
})
