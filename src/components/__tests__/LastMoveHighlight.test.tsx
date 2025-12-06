import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ChessGame from '../ChessGame'

test('highlights last move squares', () => {
  const { container } = render(<ChessGame />)
  const squareE2 = Array.from(container.querySelectorAll('.chess-square')).find(el => el.getAttribute('aria-label')?.startsWith('e2')) as HTMLElement
  const squareE4 = Array.from(container.querySelectorAll('.chess-square')).find(el => el.getAttribute('aria-label')?.startsWith('e4')) as HTMLElement
  expect(squareE2).toBeTruthy()
  fireEvent.click(squareE2)
  expect(squareE4).toBeTruthy()
  fireEvent.click(squareE4)
  const refreshedE2 = Array.from(container.querySelectorAll('.chess-square')).find(el => el.getAttribute('aria-label')?.startsWith('e2')) as HTMLElement
  const refreshedE4 = Array.from(container.querySelectorAll('.chess-square')).find(el => el.getAttribute('aria-label')?.startsWith('e4')) as HTMLElement
  expect(refreshedE2.className).toContain('ring-2')
  expect(refreshedE4.className).toContain('ring-2')
})
