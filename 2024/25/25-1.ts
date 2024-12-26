import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const schematics: Schematic[] = content.split('\r\n\r\n').map(schematic => {
    const lines = schematic.split('\r\n')
    let type: Schematic['type']
    if (lines[0] === '#####') {
      type = 'lock'
    } else if (lines.at(-1) === '#####') {
      type = 'key'
    } else {
      console.error(schematic)
      throw new Error('unexpected schematic type')
    }
    const heights = []
    for (const col of [0, 1, 2, 3, 4]) {
      const height = [1, 2, 3, 4, 5]
        .map(row => lines[row][col])
        .filter(char => char === '#')
        .length
      heights.push(height)
    }
    return { type, heights }
  })

  return schematics
}

type Schematic = {
  type: 'lock',
  heights: number[],
} | {
  type: 'key',
  heights: number[],
}

function fitsWithoutOverlap(a: Schematic, b: Schematic): boolean {
  for (let i = 0; i < a.heights.length; i++) {
    if (a.heights[i] + b.heights[i] > 5) return false
  }
  return true
}

const schematics = loadFile('input.txt')
const locks = schematics.filter(s => s.type === 'lock')
const keys = schematics.filter(s => s.type === 'key')
let numPairs = 0
for (const lock of locks) {
  for (const key of keys) {
    if (fitsWithoutOverlap(lock, key)) numPairs++
  }
}
console.log(numPairs)
