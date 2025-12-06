import { GameState, Square } from '../types/chess'
import { search } from './search'
import { TTEntry } from './zobrist'

export async function computeBestMove(state: GameState, depth = 3, moveTimeMs = 1000): Promise<{ from: Square, to: Square } | null> {
  const start = Date.now()
  let best: { from: Square, to: Square } | null = null
  let d = 1
  const tt: Map<bigint, TTEntry> = new Map()
  while (d <= depth && Date.now() - start < moveTimeMs) {
    const res = search(state.board, state.currentPlayer, state.castlingRights, state.enPassantTarget, d, -Infinity, Infinity, tt)
    if (res.move) best = res.move
    d++
  }
  return best
}
