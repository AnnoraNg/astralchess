import { describe, expect, it } from 'vitest'
import { isLightSquare } from './boardUtils.js'

describe('chessboard colours', () => {
  it('keeps the official dark a1 and light h1 orientation', () => {
    expect(isLightSquare('a1')).toBe(false)
    expect(isLightSquare('h1')).toBe(true)
    expect(isLightSquare('a8')).toBe(true)
    expect(isLightSquare('h8')).toBe(false)
  })

  it('creates exactly 32 light and 32 dark squares', () => {
    const squares = 'abcdefgh'.split('').flatMap(file =>
      Array.from({ length: 8 }, (_, index) => `${file}${index + 1}`),
    )
    expect(squares.filter(isLightSquare)).toHaveLength(32)
  })
})
