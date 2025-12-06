import { renderHook, act } from '@testing-library/react'
import { useChessGame, initialGameState } from '../useChessGame'
import { createEmptyBoard, setPiece } from '../../test/chessTestUtils'

function setupPvAi() {
  const board = createEmptyBoard()
  setPiece(board, 'e1', { type: 'king', color: 'white', hasMoved: false })
  setPiece(board, 'e8', { type: 'king', color: 'black', hasMoved: false })
  setPiece(board, 'e2', { type: 'pawn', color: 'white', hasMoved: false })
  return { ...initialGameState, board, mode: 'pvai', aiSettings: { aiPlays: 'black', depth: 2, moveTimeMs: 100 } }
}

describe('AI integration', () => {
  it('AI plays after human move in pvai mode', async () => {
    const init = setupPvAi()
    const { result } = renderHook(() => useChessGame(init))
    act(() => {
      result.current.handleSquareClick('e2')
      result.current.handlePieceDrop('e2', 'e4')
    })
    await act(async () => { await new Promise(r => setTimeout(r, 200)) })
    expect(result.current.gameState.moveHistory.length).toBeGreaterThanOrEqual(2)
    expect(result.current.gameState.currentPlayer).toBe('white')
  })

  it('no AI move in pvp mode', async () => {
    const board = createEmptyBoard()
    setPiece(board, 'e1', { type: 'king', color: 'white', hasMoved: false })
    setPiece(board, 'e8', { type: 'king', color: 'black', hasMoved: false })
    setPiece(board, 'e2', { type: 'pawn', color: 'white', hasMoved: false })
    const init = { ...initialGameState, board, mode: 'pvp' }
    const { result } = renderHook(() => useChessGame(init))
    act(() => {
      result.current.handleSquareClick('e2')
      result.current.handlePieceDrop('e2', 'e4')
    })
    await act(async () => { await new Promise(r => setTimeout(r, 200)) })
    expect(result.current.gameState.moveHistory.length).toBe(1)
    expect(result.current.gameState.currentPlayer).toBe('black')
  })
})
