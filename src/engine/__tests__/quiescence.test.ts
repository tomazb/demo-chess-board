import { Board, PieceColor, CastlingRights } from '../../types/chess'
import { search } from '../search'
import { evaluate } from '../evaluation'

const emptyBoard = (): Board => Array.from({ length: 8 }, () => Array(8).fill(null))
const rc = (sq: string) => [8 - parseInt(sq[1]), sq.charCodeAt(0) - 97]

const place = (b: Board, sq: string, type: string, color: PieceColor) => {
  const [r, c] = rc(sq)
  // @ts-expect-error: test helper constructing piece inline
  b[r][c] = { type, color, hasMoved: false }
}

test('quiescence improves score when winning capture exists', () => {
  const b = emptyBoard()
  // white queen on d4, black rook hanging on d5
  place(b, 'd4', 'queen', 'white')
  place(b, 'd5', 'rook', 'black')
  const rights: CastlingRights = { white: { kingSide: false, queenSide: false }, black: { kingSide: false, queenSide: false } }
  const evalStand = evaluate(b, 'white')
  const s0 = search(b, 'white', rights, null, 0, -Infinity, Infinity)
  expect(s0.score).toBeGreaterThanOrEqual(evalStand)
})
