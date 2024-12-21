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

function getNumericKeypadDirections(from: string, to: string): string {
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

const cache = new Map<string, number>()
const getCacheKey = (from: string, to: string, depth: number) => `${from}-${to}-${depth}`

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

function getNumberOfPresses(input: string, depth: number): number {
  if (depth === 0) return input.length
  return getNumberOfPresses(getDirectionalKeypadDirections('A', input[0]), depth - 1) + input
    .split('')
    .map((letter, index, all) => {
      if (index === all.length - 1) return 0
      const from = letter
      const to = all[index + 1]
      const cacheKey = getCacheKey(from, to, depth)
      const cacheValue = cache.get(cacheKey)
      if (cacheValue) return cacheValue
      const directions = getDirectionalKeypadDirections(from, to)
      const numPresses = getNumberOfPresses(directions, depth - 1)
      cache.set(cacheKey, numPresses)
      return numPresses
    }).reduce((a, b) => a + b)
}


console.log('[START]')
const lines = loadFile('input.txt')
let totalComplexity = 0
for (const line of lines) {
  const robotNumPad = line // robot, numeric keypad
  const firstDirectionalPad = getNumericKeypadSequence(robotNumPad) // robot, directional keypad
  const after25MorePads = getNumberOfPresses(firstDirectionalPad, 25) // after 2x directional keypads
  const numSteps = after25MorePads
  const numericPart = Number(line.slice(0, -1))
  const complexity = numSteps * numericPart
  totalComplexity += complexity
  console.log(`${line}: ${numSteps} * ${numericPart}`)
}
console.log(totalComplexity)
