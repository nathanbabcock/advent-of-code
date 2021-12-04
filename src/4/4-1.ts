import { readFileSync } from 'fs'

class Matrix {
  constructor(public data: number[][]) { }

  invert(): Matrix {
    return new Matrix(this.data.map(row => row.map(col => col === 1 ? 0 : 1)))
  }

  transpose(): Matrix {
    return new Matrix(this.data[0].map((_, colIndex) => this.data.map(row => row[colIndex])))
  }

  sum(): number {
    return this.data.reduce((sum, row) => sum + row.reduce((sum, col) => sum + col, 0), 0)
  }

  toMask(numbers: number[]): Matrix {
    return new Matrix(
      this.data.map(row => row.map(col => numbers.includes(col) ? 1 : 0))
    )
  }

  bingo(): boolean {
    return !!this.data.find(row => row.every(col => col === 1))
      || !!this.transpose().data.find(col => col.every(row => row === 1))
  }

  mult(other: Matrix): Matrix {
    return new Matrix(this.data.map((row, rowIndex) => row.map((col, colIndex) => other.data[rowIndex][colIndex] * col)))
  }

  toString(): string {
    return this.data.toString()
  }

  static fromArray(array: number[][]): Matrix {
    return new Matrix(array)
  }
}

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
  for (const number of numbers) {
    curNumbers.push(number)
    for (const board of boards) {
      const mask = board.toMask(curNumbers)
      if (!mask.bingo()) continue
      return mask.invert().mult(board).sum() * number
    }
  }
  return NaN
}

const score = getScore(numbers, boards)
console.log('Score', score)
