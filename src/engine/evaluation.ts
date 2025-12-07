import { Board, PieceColor } from '../types/chess'

const pieceValues: Record<string, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 0,
}

const pstWhite: Record<string, number[][]> = {
  pawn: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  knight: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  bishop: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 10, 15, 15, 10, 5, -10],
    [-10, 0, 10, 15, 15, 10, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  rook: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  queen: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  king: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
}

const mirror = (arr: number[][]) => arr.slice().reverse()
const pstBlack: Record<string, number[][]> = Object.fromEntries(
  Object.entries(pstWhite).map(([k, v]) => [k, mirror(v as number[][])])
)

// helper removed

function evaluatePawnStructure(board: Board): number {
  let s = 0
  const files = 8
  const pawnFilesWhite = Array(files).fill(0)
  const pawnFilesBlack = Array(files).fill(0)
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p || p.type !== 'pawn') continue
      if (p.color === 'white') pawnFilesWhite[c]++
      else pawnFilesBlack[c]++
    }
  }
  // doubled/isolated penalties
  for (let c = 0; c < files; c++) {
    const w = pawnFilesWhite[c]
    const b = pawnFilesBlack[c]
    if (w > 1) s -= 12 * (w - 1)
    if (b > 1) s += 12 * (b - 1)
    const wIsolated = (c === 0 ? 0 : pawnFilesWhite[c - 1]) + (c === files - 1 ? 0 : pawnFilesWhite[c + 1]) === 0 && w > 0
    const bIsolated = (c === 0 ? 0 : pawnFilesBlack[c - 1]) + (c === files - 1 ? 0 : pawnFilesBlack[c + 1]) === 0 && b > 0
    if (wIsolated) s -= 10
    if (bIsolated) s += 10
  }
  // passed pawns: simple check ahead on same/adjacent files
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p || p.type !== 'pawn') continue
      if (p.color === 'white') {
        let blocked = false
        for (let rr = r - 1; rr >= 0; rr--) {
          for (const cc of [c - 1, c, c + 1]) {
            if (cc < 0 || cc >= 8) continue
            const op = board[rr][cc]
            if (op && op.type === 'pawn' && op.color === 'black') blocked = true
          }
        }
        if (!blocked) s += Math.max(0, 6 * (6 - r))
      } else {
        let blocked = false
        for (let rr = r + 1; rr < 8; rr++) {
          for (const cc of [c - 1, c, c + 1]) {
            if (cc < 0 || cc >= 8) continue
            const op = board[rr][cc]
            if (op && op.type === 'pawn' && op.color === 'white') blocked = true
          }
        }
        if (!blocked) s -= Math.max(0, 6 * (r - 1))
      }
    }
  }
  return s
}

function bishopPairBonus(board: Board): number {
  let w = 0, b = 0
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c]
    if (p && p.type === 'bishop') {
      if (p.color === 'white') w++
      else b++
    }
  }
  let s = 0
  if (w >= 2) s += 15
  if (b >= 2) s -= 15
  return s
}

function rookFileBonuses(board: Board): number {
  let s = 0
  for (let c = 0; c < 8; c++) {
    let hasWhitePawn = false, hasBlackPawn = false
    for (let r = 0; r < 8; r++) {
      const p = board[r][c]
      if (p && p.type === 'pawn') {
        if (p.color === 'white') hasWhitePawn = true
        else hasBlackPawn = true
      }
    }
    const fileSquares: Array<[number, number]> = Array.from({ length: 8 }, (_, r) => [r, c])
    for (const [r, col] of fileSquares) {
      const p = board[r][col]
      if (!p || p.type !== 'rook') continue
      if (p.color === 'white') {
        if (!hasWhitePawn && !hasBlackPawn) s += 12
        else if (!hasWhitePawn) s += 6
      } else {
        if (!hasWhitePawn && !hasBlackPawn) s -= 12
        else if (!hasBlackPawn) s -= 6
      }
    }
  }
  return s
}


function kingSafety(board: Board): number {
  let wk: [number, number] | null = null
  let bk: [number, number] | null = null
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c]
    if (p && p.type === 'king') {
      if (p.color === 'white') wk = [r, c]
      else bk = [r, c]
    }
  }
  let s = 0
  if (wk) {
    const [kr, kc] = wk
    const shieldSquares: Array<[number, number]> = [[kr + 1, kc - 1], [kr + 1, kc], [kr + 1, kc + 1]]
    let shield = 0
    for (const [r, c] of shieldSquares) {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const p = board[r][c]
        if (p && p.type === 'pawn' && p.color === 'white') shield++
      }
    }
    s += shield * 5 - (3 - shield) * 5
  }
  if (bk) {
    const [kr, kc] = bk
    const shieldSquares: Array<[number, number]> = [[kr - 1, kc - 1], [kr - 1, kc], [kr - 1, kc + 1]]
    let shield = 0
    for (const [r, c] of shieldSquares) {
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        const p = board[r][c]
        if (p && p.type === 'pawn' && p.color === 'black') shield++
      }
    }
    s -= shield * 5 - (3 - shield) * 5
  }
  return s
}

export function evaluate(board: Board, turn: PieceColor): number {
  let score = 0
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (!p) continue
      const base = pieceValues[p.type]
      const pst = p.color === 'white' ? pstWhite[p.type][r][c] : pstBlack[p.type][r][c]
      const s = base + pst
      score += p.color === 'white' ? s : -s
    }
  }
  score += evaluatePawnStructure(board)
  score += bishopPairBonus(board)
  score += rookFileBonuses(board)
  score += kingSafety(board)
  return turn === 'white' ? score : -score
}
