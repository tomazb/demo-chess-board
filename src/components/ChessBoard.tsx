import React from 'react'
import ChessSquare from './ChessSquare'
import ErrorBoundary from './ErrorBoundary'
import { ChessBoardProps } from '../types/chess'
import { getSquareColor, getCoordinatesFromSquare } from '../utils/chessUtils'

const ChessBoard: React.FC<ChessBoardProps> = ({
  gameState,
  onSquareClick,
  onPieceDrop
}) => {
  const isWhiteBottom = gameState.orientation === 'whiteBottom'
  const files = isWhiteBottom ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
  const ranks = isWhiteBottom ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className="inline-block bg-gray-800 p-4 rounded-lg shadow-2xl">
      {/* Rank labels (left side) */}
      <div className="flex">
        <div className="flex flex-col justify-center mr-2">
          {ranks.map(rank => (
            <div key={rank} className="h-16 flex items-center justify-center text-gray-300 font-semibold">
              {rank}
            </div>
          ))}
        </div>
        
        {/* Chess board */}
        <div>
          <ErrorBoundary>
            <div
              className="grid grid-cols-8 border-2 border-gray-700"
              role="group"
              aria-label="Chess board"
            >
              {ranks.map(rank =>
                files.map(file => {
                  const square = `${file}${rank}`
                  const [row, col] = getCoordinatesFromSquare(square)
                  const piece = gameState.board[row][col]
                  const isSelected = gameState.selectedSquare === square
                  const isValidMove = gameState.validMoves.includes(square)
                  const squareColor = getSquareColor(file, rank)

                  return (
                    <ChessSquare
                      key={square}
                      square={square}
                      piece={piece}
                      isSelected={isSelected}
                      isValidMove={isValidMove}
                      squareColor={squareColor}
                      onSquareClick={onSquareClick}
                      onPieceDrop={onPieceDrop}
                      currentSelected={gameState.selectedSquare}
                    />
                  )
                })
              )}
            </div>
            
            {/* File labels (bottom) */}
            <div className="flex mt-2">
              {files.map(file => (
                <div key={file} className="w-16 text-center text-gray-300 font-semibold">
                  {file}
                </div>
              ))}
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default ChessBoard
