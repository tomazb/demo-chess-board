import { getBookMove } from '../openingBook'
import { initialGameState } from '../../hooks/useChessGame'

test('aggressive style suggests c5 after e4 (black to move)', async () => {
  const s = { ...initialGameState, mode: 'pvai', aiSettings: { aiPlays: 'black', style: 'aggressive', depth: 3, moveTimeMs: 300, autoAnalyze: false } }
  s.moveHistory = [
    { from: 'e2', to: 'e4', piece: { type: 'pawn', color: 'white', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights },
  ]
  const m = await getBookMove(s)
  expect(m).toBeTruthy()
  expect(m?.from).toBe('c7')
  expect(m?.to).toBe('c5')
})

test('positional style suggests e6 or c6 after e4 (black to move)', async () => {
  const s = { ...initialGameState, mode: 'pvai', aiSettings: { aiPlays: 'black', style: 'positional', depth: 3, moveTimeMs: 300, autoAnalyze: false } }
  s.moveHistory = [
    { from: 'e2', to: 'e4', piece: { type: 'pawn', color: 'white', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights },
  ]
  const m = await getBookMove(s)
  expect(m).toBeTruthy()
  const code = (m?.from || '') + (m?.to || '')
  expect(['e7e6', 'c7c6']).toContain(code)
})
