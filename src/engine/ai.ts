import { GameState, Square } from '../types/chess'
import { search } from './search'
import { TTEntry } from './zobrist'
import { getBookMove } from './openingBook'
// analysis helpers removed

const GLOBAL_TT: Map<bigint, TTEntry> = new Map()

export async function computeBestMove(state: GameState, depth = 3, moveTimeMs = 1000): Promise<{ from: Square, to: Square } | null> {
  const baseStart = Date.now()
  const book = await getBookMove(state)
  if (book) return book
  const earlyGame = state.moveHistory.length < 8
  const inCheck = state.gameStatus === 'check'
  const style = state.aiSettings?.style ?? 'balanced'
  let budget = moveTimeMs
  if (inCheck) budget = Math.floor(moveTimeMs * 1.8)
  else if (earlyGame) budget = Math.floor(moveTimeMs * 0.7)
  if (style === 'aggressive') budget = Math.floor(budget * 1.15)
  if (style === 'positional') budget = Math.floor(budget * 1.0)
  let best: { from: Square, to: Square } | null = null
  let d = 1
  const tt = GLOBAL_TT
  let lastScore = 0
  while (d <= depth && Date.now() - baseStart < budget) {
    const window = style === 'aggressive' ? 150 : style === 'positional' ? 80 : 100
    const alpha = lastScore - window
    const beta = lastScore + window
    let res = search(state.board, state.currentPlayer, state.castlingRights, state.enPassantTarget, d, alpha, beta, tt)
    if (!res.move || res.score <= alpha || res.score >= beta) {
      res = search(state.board, state.currentPlayer, state.castlingRights, state.enPassantTarget, d, -Infinity, Infinity, tt)
    }
    if (res.move) best = res.move
    lastScore = res.score
    d++
  }
  return best
}
