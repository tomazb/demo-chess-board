import { GameState, Square } from '../types/chess'

type LineMove = { from: Square, to: Square }
type Line = LineMove[]

const lines: Line[] = [
  [
    { from: 'e2', to: 'e4' },
    { from: 'e7', to: 'e5' },
    { from: 'g1', to: 'f3' },
    { from: 'b8', to: 'c6' },
  ],
  [
    { from: 'd2', to: 'd4' },
    { from: 'd7', to: 'd5' },
    { from: 'c2', to: 'c4' },
    { from: 'e7', to: 'e6' },
  ],
  [
    { from: 'c2', to: 'c4' },
    { from: 'e7', to: 'e5' },
  ],
]

export function getBookMove(state: GameState): { from: Square, to: Square } | null {
  const played: LineMove[] = state.moveHistory.map(m => ({ from: m.from, to: m.to }))
  for (const line of lines) {
    let ok = true
    for (let i = 0; i < played.length && i < line.length; i++) {
      const a = played[i]
      const b = line[i]
      if (a.from !== b.from || a.to !== b.to) { ok = false; break }
    }
    if (!ok) continue
    if (played.length < line.length) {
      const next = line[played.length]
      const aiColor = state.aiSettings?.aiPlays ?? 'black'
      const moveIndexColor = played.length % 2 === 0 ? 'white' : 'black'
      if (moveIndexColor !== aiColor) continue
      return next
    }
  }
  return null
}
