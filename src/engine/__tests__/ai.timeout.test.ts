import { computeBestMove } from '../ai'
import { initialGameState } from '../../hooks/useChessGame'

test('AI returns move within time budget', async () => {
  const s = { ...initialGameState, mode: 'pvai', aiSettings: { aiPlays: 'black', depth: 3, moveTimeMs: 300, autoAnalyze: false } }
  // white plays e4 to trigger AI (black) response
  s.moveHistory = [
    { from: 'e2', to: 'e4', piece: { type: 'pawn', color: 'white', hasMoved: true }, notation: '', timestamp: new Date(), prevHasMoved: false, prevCastlingRights: s.castlingRights },
  ]
  const t0 = Date.now()
  const mv = await computeBestMove(s, 3, 300)
  const dt = Date.now() - t0
  expect(mv).toBeTruthy()
  expect(dt).toBeLessThanOrEqual(1500)
})
