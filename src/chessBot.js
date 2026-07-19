const VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }

function evaluate(game, remainingDepth = 0) {
  if (game.isCheckmate()) return game.turn() === 'w' ? -100000 - remainingDepth : 100000 + remainingDepth
  if (game.isDraw()) return 0
  let score = 0
  for (const row of game.board()) {
    for (const piece of row) {
      if (!piece) continue
      let value = VALUES[piece.type]
      if (piece.type === 'p') {
        const rank = Number(piece.square[1])
        value += piece.color === 'w' ? (rank - 2) * 5 : (7 - rank) * 5
      }
      if (['n', 'b'].includes(piece.type) && ['c', 'd', 'e', 'f'].includes(piece.square[0])) value += 12
      score += piece.color === 'w' ? value : -value
    }
  }
  return score
}

function search(game, depth, alpha, beta) {
  if (depth === 0 || game.isGameOver()) return evaluate(game, depth)
  const maximizing = game.turn() === 'w'
  let best = maximizing ? -Infinity : Infinity
  const moves = game.moves({ verbose: true }).sort((a, b) => Number(Boolean(b.captured)) - Number(Boolean(a.captured)))
  for (const move of moves) {
    game.move(move)
    const value = search(game, depth - 1, alpha, beta)
    game.undo()
    if (maximizing) {
      best = Math.max(best, value); alpha = Math.max(alpha, value)
    } else {
      best = Math.min(best, value); beta = Math.min(beta, value)
    }
    if (beta <= alpha) break
  }
  return best
}

export function chooseBotMove(game, level = 1) {
  const moves = game.moves({ verbose: true })
  if (!moves.length) return null
  if (level === 0) return moves[Math.floor(Math.random() * moves.length)]
  const depth = level === 1 ? 1 : 2
  let bestScore = game.turn() === 'w' ? -Infinity : Infinity
  let candidates = []
  for (const move of moves) {
    game.move(move)
    const score = search(game, depth, -Infinity, Infinity)
    game.undo()
    const better = game.turn() === 'w' ? score > bestScore : score < bestScore
    if (better) { bestScore = score; candidates = [move] }
    else if (score === bestScore) candidates.push(move)
  }
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export { evaluate }
