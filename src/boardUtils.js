export function isLightSquare(square) {
  const fileIndex = square.charCodeAt(0) - 'a'.charCodeAt(0)
  const rank = Number(square[1])
  return (fileIndex + rank) % 2 === 0
}
