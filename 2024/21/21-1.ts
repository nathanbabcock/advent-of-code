import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const lines = content.split('\r\n')
  return lines
}

const UP = '^'
const DOWN = 'v'
const LEFT = '<'
const RIGHT = '>'
const A = 'A'

const NUMERIC_KEYPAD = [
  '789',
  '456',
  '123',
  ' 0A',
]

const DIRECTIONAL_KEYPAD = [
  ' ^A',
  '<v>',
]

const cache = new Map<string, string>()
const getCacheKey = (from: string, to: string) => `${from},${to}`

function getNumericKeypadDirections(from: string, to: string): string {
  const key = getCacheKey(from, to)
  if (cache.has(key)) return cache.get(key)!

  const fromRow = NUMERIC_KEYPAD.findIndex(row => row.includes(from))
  if (fromRow === -1) throw new Error(`Could not find keypad button ${from}`)
  const fromCol = NUMERIC_KEYPAD[fromRow].indexOf(from)
  if (fromCol === -1) throw new Error(`Could not find keypad button ${from}`)

  const toRow = NUMERIC_KEYPAD.findIndex(row => row.includes(to))
  if (toRow === -1) throw new Error(`Could not find keypad button ${to}`)
  const toCol = NUMERIC_KEYPAD[toRow].indexOf(to)
  if (toCol === -1) throw new Error(`Could not find keypad button ${from}`)

  const deltaRow = toRow - fromRow
  const deltaCol = toCol - fromCol

  // For numeric keypad, always move in the order: RIGHT, DOWN, UP, LEFT
  const right = RIGHT.repeat(deltaCol > 0 ? deltaCol : 0)
  const down = DOWN.repeat(deltaRow > 0 ? deltaRow : 0)
  const up = UP.repeat(deltaRow < 0 ? -deltaRow : 0)
  const left = LEFT.repeat(deltaCol < 0 ? -deltaCol : 0)

  if (fromCol === 0 && toRow === 3) return [left, right, up, down, A].join('')
  else if (fromRow === 3 && toCol === 0) return [up, down, left, right, A].join('')
  else if (deltaCol < 0) return [left, right, up, down, A].join('')
  else return [up, down, left, right, A].join('')
}

function getDirectionalKeypadDirections(from: string, to: string): string {
  const key = getCacheKey(from, to)
  if (cache.has(key)) return cache.get(key)!

  const fromRow = DIRECTIONAL_KEYPAD.findIndex(row => row.includes(from))
  const fromCol = DIRECTIONAL_KEYPAD[fromRow].indexOf(from)
  if (fromRow === -1 || fromCol === -1) throw new Error(`Could not find keypad button ${from}`)

  const toRow = DIRECTIONAL_KEYPAD.findIndex(row => row.includes(to))
  const toCol = DIRECTIONAL_KEYPAD[toRow].indexOf(to)
  if (toRow === -1 || toCol === -1) throw new Error(`Could not find keypad button ${from}`)

  const deltaRow = toRow - fromRow
  const deltaCol = toCol - fromCol

  // For directional keypad, always move in the order: RIGHT, UP, DOWN, LEFT
  const right = RIGHT.repeat(deltaCol > 0 ? deltaCol : 0)
  const down = DOWN.repeat(deltaRow > 0 ? deltaRow : 0)
  const up = UP.repeat(deltaRow < 0 ? -deltaRow : 0)
  const left = LEFT.repeat(deltaCol < 0 ? -deltaCol : 0)

  if (fromRow === 0 && toCol === 0) return [up, down, left, right, A].join('')
  else if (fromCol === 0 && toRow === 0) return [left, right, up, down, A].join('')
  else if (deltaCol < 0) return [left, right, up, down, A].join('')
  else return [up, down, left, right, A].join('')
}

function getNumericKeypadSequence(input: string): string {
  return getNumericKeypadDirections('A', input[0]) + input
    .split('')
    .map((letter, index, all) => {
      if (index === all.length - 1) return ''
      const from = letter
      const to = all[index + 1]
      return getNumericKeypadDirections(from, to)
    })
    .join('')
}

function getDirectionalKeypadSequence(input: string): string {
  return getDirectionalKeypadDirections('A', input[0]) + input
    .split('')
    .map((letter, index, all) => {
      if (index === all.length - 1) return ''
      const from = letter
      const to = all[index + 1]
      return getDirectionalKeypadDirections(from, to)
    })
    .join('')
}

function getHumanKeypadDirections(numericInput: string): string {
  const level1 = numericInput // robot, numeric keypad
  const level2 = getNumericKeypadSequence(level1) // robot, directional keypad
  const level3 = getDirectionalKeypadSequence(level2) // robot, directional keypad
  const level4 = getDirectionalKeypadSequence(level3) // human, directional keypad
  return level4
}

console.log('[START]')
const lines = loadFile('input.txt')
let totalComplexity = 0
for (const line of lines) {
  const directions = getHumanKeypadDirections(line)
  const numSteps = directions.length
  const numericPart = Number(line.slice(0, -1))
  const complexity = numSteps * numericPart
  totalComplexity += complexity
  console.log(`${line}: ${directions} (${numSteps} * ${numericPart})`)
}
console.log(totalComplexity)

// const level1 = '379A' // robot, numeric keypad
// const level2 = getNumericKeypadSequence(level1) // robot, directional keypad
// const level3 = getDirectionalKeypadSequence(level2) // robot, directional keypad
// const level4 = getDirectionalKeypadSequence(level3) // human, directional keypad

// console.log(level4, level4.length)
// console.log(level3)
// console.log(level2)
// console.log(level1)

// Expected vs. Actual:
// <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
// v<A<AA>>^AvAA<^A>Av<<A>>^AvA^Av<A>^Av<<A>^A>AAvA^Av<A<A>>^AAAvA<^A>A