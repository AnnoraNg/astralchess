import { describe, expect, it } from 'vitest'
import { Chess } from 'chess.js'
import { explainAstraMove, explainHint, explainPlayerMove } from './coach.js'

describe('Astra coaching', () => {
  it('explains a central first move in beginner language', () => {
    const game = new Chess()
    expect(explainPlayerMove(game.move('e4'))).toContain('centre')
  })

  it('calls out checks and captures', () => {
    const game = new Chess('4k3/8/5p2/8/4N3/8/8/4K3 w - - 0 1')
    const move = game.move('Nxf6+')
    expect(explainPlayerMove(move)).toContain('captures')
    expect(explainAstraMove(move)).toContain('capturing')
  })

  it('presents hints as considerations rather than commands', () => {
    const game = new Chess()
    expect(explainHint(game.move('Nf3'))).toMatch(/^Consider /)
  })
})
