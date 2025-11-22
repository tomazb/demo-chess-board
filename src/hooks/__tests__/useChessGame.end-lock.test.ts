import { renderHook, act } from '@testing-library/react'
import { useChessGame, initialGameState } from '../useChessGame'
import { createEmptyBoard, setPiece } from '../../test/chessTestUtils'

function setupDrawByRepetition() {
  const board = createEmptyBoard()
  setPiece(board, 'e1', { type: 'king', color: 'white', hasMoved: false })
  setPiece(board, 'e8', { type: 'king', color: 'black', hasMoved: false })
  setPiece(board, 'g1', { type: 'knight', color: 'white', hasMoved: false })
  setPiece(board, 'g8', { type: 'knight', color: 'black', hasMoved: false })
  return { ...initialGameState, board }
}

describe('End-of-game lock', () => {
  it('blocks further moves after draw status', () => {
    const init = setupDrawByRepetition()
    const { result } = renderHook(() => useChessGame(init))

    act(() => {
      // Repeat position three times to trigger draw
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

    const historyLen = result.current.gameState.moveHistory.length
    expect(result.current.gameState.gameStatus).toBe('draw')

    // Attempt another move should be ignored
    act(() => {
      result.current.handleSquareClick('g1')
      result.current.handlePieceDrop('g1', 'f3')
    })
    expect(result.current.gameState.moveHistory.length).toBe(historyLen)
    // Still in draw
    expect(result.current.gameState.gameStatus).toBe('draw')
  })
})
