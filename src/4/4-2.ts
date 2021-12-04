import { readFileSync } from 'fs'
import Matrix from './Matrix.js'

const raw = readFileSync('src/4/input.txt', 'utf8')
const blocks = raw.split(/(?:\r?\n){2,}/)

const numbers = blocks.shift()!
  .split(',')
  .map(Number)

// console.log('Numbers:', numbers.length)
// console.log('Numbers:', numbers)

const boards = blocks
  .map(block => block.split(/\r?\n/)
    .map(row => row.trim().split(/\s+/)
      .map(Number)
    )
  ).map(Matrix.fromArray)

// console.log('Boards:', boards)
// console.log('Boards:', boards.length)

function getScore(numbers: number[], boards: Matrix[]): number {
  const curNumbers = []
  const boardWon = boards.map(board => false)
  let lastWinningScore = NaN
  for (const number of numbers) {
    curNumbers.push(number)
    for (const board of boards) {
      const index = boards.indexOf(board)
      const mask = board.toMask(curNumbers)
      if (!mask.bingo()) continue
      const score = mask.invert().mult(board).sum() * number
      boardWon[index] = true
      if (boardWon.every(Boolean)) return score
    }
  }
  return lastWinningScore
}

const score = getScore(numbers, boards)
console.log('Score', score)
