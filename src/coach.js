const PIECES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' }

export function explainPlayerMove(move) {
  if (move.san?.endsWith('#')) return `${move.san} is checkmate. You ended the game immediately—beautiful finish.`
  if (move.flags?.includes('k') || move.flags?.includes('q')) return `${move.san} castles your king and activates a rook in one move.`
  if (move.promotion) return `${move.san} promotes your pawn to a ${PIECES[move.promotion]}.`
  if (move.captured) return `${move.san} captures a ${PIECES[move.captured]}${move.san.includes('+') ? ' and gives check' : ''}. Now check what can recapture.`
  if (move.san?.includes('+')) return `${move.san} gives check, so Astra must answer the threat.`
  if (move.piece === 'p' && ['d4', 'e4'].includes(move.to)) return `${move.san} claims space in the centre and opens lines for your pieces.`
  if (['n', 'b'].includes(move.piece) && move.from?.[1] === '1') return `${move.san} develops your ${PIECES[move.piece]} from its starting rank.`
  if (move.piece === 'q') return `${move.san} is legal. Keep an eye on your queen—early attacks can make it move again.`
  return `${move.san} is legal. Before your next turn, check Astra’s threats, captures, and checks.`
}

export function explainAstraMove(move) {
  if (!move) return 'Astra could not find a legal reply.'
  if (move.san?.endsWith('#')) return `Astra played ${move.san}, delivering checkmate.`
  if (move.flags?.includes('k') || move.flags?.includes('q')) return `Astra played ${move.san} to protect the king and activate a rook.`
  if (move.captured) return `Astra replied ${move.san}, capturing your ${PIECES[move.captured]}. Look for a safe recapture.`
  if (move.san?.includes('+')) return `Astra replied ${move.san} with check. Your next move must answer it.`
  if (move.piece === 'p' && ['d5', 'e5'].includes(move.to)) return `Astra replied ${move.san}, contesting the centre.`
  if (['n', 'b'].includes(move.piece) && move.from?.[1] === '8') return `Astra replied ${move.san}, developing a ${PIECES[move.piece]}.`
  return `Astra replied ${move.san}. Ask what changed: checks, captures, and new attacks.`
}

export function explainHint(move) {
  if (!move) return 'No legal hint is available in this position.'
  if (move.san?.endsWith('#')) return `Consider ${move.san}: it ends the game with checkmate.`
  if (move.captured) return `Consider ${move.san}: it wins material, but verify the destination is safe.`
  if (move.san?.includes('+')) return `Consider ${move.san}: checking moves force an immediate response.`
  if (['n', 'b'].includes(move.piece) && move.from?.[1] === '1') return `Consider ${move.san}: it develops a piece from the back rank.`
  return `Consider ${move.san}. Compare it with your checks, captures, and threats before choosing.`
}
