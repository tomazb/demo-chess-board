import { getBookMove } from '../openingBook'
import { initialGameState } from '../../hooks/useChessGame'

test('book suggests e5 after e4', () => {
  const s = { ...initialGameState, mode: 'pvai', aiSettings: { aiPlays: 'black', depth: 3, moveTimeMs: 1200, autoAnalyze: false } }
  s.moveHistory = [
    {
      from: 'e2', to: 'e4', piece: { type: 'pawn', color: 'white', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights,
      prevCapturedHasMoved: undefined, isEnPassant: false, enPassantCaptureSquare: undefined,
    }
  ]
  const m = getBookMove(s)
  expect(m).toBeTruthy()
  expect(m?.from).toBe('e7')
  expect(m?.to).toBe('e5')
})

test('book suggests Nc6 after Nf3 in e4 e5', () => {
  const s = { ...initialGameState, mode: 'pvai', aiSettings: { aiPlays: 'black', depth: 3, moveTimeMs: 1200, autoAnalyze: false } }
  s.moveHistory = [
    { from: 'e2', to: 'e4', piece: { type: 'pawn', color: 'white', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights },
    { from: 'e7', to: 'e5', piece: { type: 'pawn', color: 'black', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights },
    { from: 'g1', to: 'f3', piece: { type: 'knight', color: 'white', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights },
  ]
  const m = getBookMove(s)
  expect(m).toBeTruthy()
  expect(m?.from).toBe('b8')
  expect(m?.to).toBe('c6')
})
