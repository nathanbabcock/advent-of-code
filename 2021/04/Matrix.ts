export default class Matrix {
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