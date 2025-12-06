import { evaluate } from '../evaluation'
import { search } from '../search'
import { createEmptyBoard } from '../../test/chessTestUtils'

test('evaluate prefers material advantage', () => {
  const b = createEmptyBoard()
  // white queen vs none
  b[7][3] = { type: 'queen', color: 'white', hasMoved: false }
  expect(evaluate(b, 'white', { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } })).toBeGreaterThan(0)
})

test('search returns a move when legal moves exist', () => {
  const b = createEmptyBoard()
  b[7][4] = { type: 'king', color: 'white', hasMoved: false }
  b[0][4] = { type: 'king', color: 'black', hasMoved: false }
  b[6][4] = { type: 'pawn', color: 'white', hasMoved: false }
  const res = search(b, 'white', { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } }, null, 1, -Infinity, Infinity)
  expect(res.move).toBeTruthy()
})
