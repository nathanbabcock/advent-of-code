import { assert } from 'node:console'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')

const lines = readFileSync(inputFile, 'utf-8').trim().split(/\r?\n/)

const height = lines.length
const width = lines[0].length

assert(lines.every(line => line.length === width))

const query = "XMAS"

type WordPath = {
  word: string
  direction: [number, number] | undefined
  startRow: number
  startCol: number
}

const paths: WordPath[] = []

// First initialize all possible starting points
for (let r = 0; r < height; r++) {
  for (let c = 0; c < width; c++) {
    if (lines[r][c] === query[0]) {
      paths.push({
        word: query[0],
        direction: undefined,
        startRow: r,
        startCol: c,
      })
    }
  }
}

const finishedPaths: WordPath[] = []

// Traverse all paths to completion
while (paths.length > 0) {
  const { direction, word, startRow, startCol } = paths.pop()!
  if (!direction) {
    assert(word.length === 1)
    visitAllNeighbors(startRow, startCol, (r, c) => {
      if (lines[r][c] === query[word.length]) {
        paths.push({
          word: word + lines[r][c],
          direction: [r - startRow, c - startCol],
          startRow,
          startCol,
        })
      }
    })
  } else {
    assert(word.length > 1)
    const [dr, dc] = direction
    const r = startRow + dr * word.length
    const c = startCol + dc * word.length
    if (r < 0 || r >= height) continue
    if (c < 0 || c >= width) continue
    if (lines[r][c] === query[word.length]) {
      const newPath = {
        word: word + query[word.length],
        direction,
        startRow,
        startCol,
      }
      if (newPath.word === query) {
        finishedPaths.push(newPath)
      } else {
        paths.push(newPath)
      }
    }
  }

}

function visitAllNeighbors(row: number, col: number, callback: (row: number, col: number) => void) {
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue
      if (r < 0 || r >= height) continue
      if (c < 0 || c >= width) continue
      callback(r, c)
    }
  }
}

// print all discovered paths on a grid with "." for empty cells
function printSolutionGrid() {
  const grid = lines.map(line => line.split('').map(_ => '.'))
  finishedPaths.forEach(({ word, startRow, startCol, direction }) => {
    let r = startRow
    let c = startCol
    for (const letter of word) {
      grid[r][c] = letter
      if (direction) {
        const [dr, dc] = direction
        r += dr
        c += dc
      }
    }
  })
  grid.forEach(row => console.log(row.join('')))
}

if (width <= 40 && height <= 40) {
  printSolutionGrid()
}

console.log(finishedPaths.length)
