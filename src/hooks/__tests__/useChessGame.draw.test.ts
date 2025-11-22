import { renderHook, act } from '@testing-library/react'
import { useChessGame, initialGameState } from '../useChessGame'
import { createEmptyBoard, setPiece } from '../../test/chessTestUtils'

function setupSimplePosition() {
  const board = createEmptyBoard()
  setPiece(board, 'e1', { type: 'king', color: 'white', hasMoved: false })
  setPiece(board, 'e8', { type: 'king', color: 'black', hasMoved: false })
  setPiece(board, 'g1', { type: 'knight', color: 'white', hasMoved: false })
  setPiece(board, 'g8', { type: 'knight', color: 'black', hasMoved: false })
  return { ...initialGameState, board }
}

describe('Draw rules', () => {
  it('declares draw on threefold repetition', () => {
    const init = setupSimplePosition()
    const { result } = renderHook(() => useChessGame(init))

    act(() => {
      result.current.handleSquareClick('g1')
      result.current.handlePieceDrop('g1', 'f3')
      result.current.handleSquareClick('g8')
      result.current.handlePieceDrop('g8', 'f6')
      result.current.handleSquareClick('f3')
      result.current.handlePieceDrop('f3', 'g1')
      result.current.handleSquareClick('f6')
      result.current.handlePieceDrop('f6', 'g8')
      result.current.handleSquareClick('g1')
      result.current.handlePieceDrop('g1', 'f3')
      result.current.handleSquareClick('g8')
      result.current.handlePieceDrop('g8', 'f6')
      result.current.handleSquareClick('f3')
      result.current.handlePieceDrop('f3', 'g1')
      result.current.handleSquareClick('f6')
      result.current.handlePieceDrop('f6', 'g8')
    })

    expect(result.current.gameState.gameStatus).toBe('draw')
  })

  it('declares draw on 50-move rule (no pawn move or capture)', () => {
    const init = setupSimplePosition()
    const { result } = renderHook(() => useChessGame(init))
    for (let i = 0; i < 25; i++) {
      act(() => {
        result.current.handleSquareClick('g1')
        result.current.handlePieceDrop('g1', 'f3')
        result.current.handleSquareClick('g8')
        result.current.handlePieceDrop('g8', 'f6')
        result.current.handleSquareClick('f3')
        result.current.handlePieceDrop('f3', 'g1')
        result.current.handleSquareClick('f6')
        result.current.handlePieceDrop('f6', 'g8')
      })
    }
    act(() => {
      result.current.handleSquareClick('g1')
      result.current.handlePieceDrop('g1', 'f3')
      result.current.handleSquareClick('g8')
      result.current.handlePieceDrop('g8', 'f6')
    })
    expect(result.current.gameState.halfMoveClock).toBeGreaterThanOrEqual(100)
    expect(result.current.gameState.gameStatus).toBe('draw')
  })
})
