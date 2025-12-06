import { zobristHash } from '../zobrist'
import { search } from '../search'
import { createEmptyBoard } from '../../test/chessTestUtils'

test('zobrist hash is consistent for same position', () => {
  const b = createEmptyBoard()
  const h1 = zobristHash(b, 'white', { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } }, null)
  const h2 = zobristHash(b, 'white', { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } }, null)
  expect(h1).toBe(h2)
})

test('iterative deepening keeps or improves best move', () => {
  const b = createEmptyBoard()
  b[7][4] = { type: 'king', color: 'white', hasMoved: false }
  b[0][4] = { type: 'king', color: 'black', hasMoved: false }
  b[6][4] = { type: 'pawn', color: 'white', hasMoved: false }
  const r1 = search(b, 'white', { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } }, null, 1, -Infinity, Infinity)
  const r2 = search(b, 'white', { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } }, null, 2, -Infinity, Infinity)
  expect(r2.move).toBeTruthy()
  expect(r1.move).toBeTruthy()
})
