import { Chess } from 'chess.js'
import { chooseBotMove } from './chessBot.js'

self.onmessage = ({ data }) => {
  const { id, fen, level } = data
  try {
    const move = chooseBotMove(new Chess(fen), level)
    self.postMessage({ id, move: move ? { from: move.from, to: move.to, promotion: move.promotion } : null })
  } catch (error) {
    self.postMessage({ id, error: error instanceof Error ? error.message : 'Bot calculation failed.' })
  }
}
