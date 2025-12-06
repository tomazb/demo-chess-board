import { Board, PieceColor, CastlingRights, Square, ChessPiece } from '../types/chess'
import { getValidMoves } from '../utils/moveValidation'
import { evaluate } from './evaluation'
import { updateCastlingRightsForMove, computeEnPassantTarget, BOARD_SIZE } from '../utils/chessUtils'


function cloneBoard(board: Board): Board {
  return board.map(row => row.slice())
}

function apply(board: Board, from: Square, to: Square): {
  board: Board
  captured: ChessPiece | null
  moved: ChessPiece
} {
  const b = cloneBoard(board)
  const [fr, fc] = [BOARD_SIZE - parseInt(from[1]), from.charCodeAt(0) - 97]
  const [tr, tc] = [BOARD_SIZE - parseInt(to[1]), to.charCodeAt(0) - 97]
  const moved = b[fr][fc]!
  const captured = b[tr][tc]
  b[tr][tc] = { ...moved, hasMoved: true }
  b[fr][fc] = null
  return { board: b, captured: captured ?? null, moved }
}

function genMoves(board: Board, color: PieceColor, rights: CastlingRights, enPassant: Square | null): Array<{ from: Square, to: Square }> {
  const moves: Array<{ from: Square, to: Square }> = []
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p || p.color !== color) continue
      const from = `${String.fromCharCode(97 + c)}${BOARD_SIZE - r}` as Square
      const valids = getValidMoves(board, from, color, rights, enPassant)
      for (const to of valids) moves.push({ from, to })
    }
  }
  return moves
}

export function search(board: Board, turn: PieceColor, rights: CastlingRights, enPassant: Square | null, depth: number, alpha: number, beta: number): { score: number, move?: { from: Square, to: Square } } {
  if (depth === 0) return { score: evaluate(board, turn) }
  const moves = genMoves(board, turn, rights, enPassant)
  let best: { score: number, move?: { from: Square, to: Square } } = { score: -Infinity }
  for (const m of moves) {
    const applied = apply(board, m.from, m.to)
    const nextRights = updateCastlingRightsForMove(rights, applied.moved, m.from, m.to, applied.captured || undefined)
    const nextEP = applied.moved.type === 'pawn' ? computeEnPassantTarget(BOARD_SIZE - parseInt(m.from[1]), BOARD_SIZE - parseInt(m.to[1]), m.from.charCodeAt(0) - 97) : null
    const nextTurn = turn === 'white' ? 'black' : 'white'
    const res = search(applied.board, nextTurn, nextRights, nextEP, depth - 1, -beta, -alpha)
    const score = -res.score
    if (score > best.score) best = { score, move: m }
    if (score > alpha) alpha = score
    if (alpha >= beta) break
  }
  return best
}
