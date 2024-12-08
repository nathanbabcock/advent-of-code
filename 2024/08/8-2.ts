import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const map = readFileSync(inputFile, 'utf-8').trim().split('\r\n')

type Pos = { row: number; col: number }
const EMPTY = '.'

function gatherAntennae(map: string[]) {
  const antennae = new Map<string, Pos[]>()
  map.forEach((rowChar, rowIndex) => {
    Array.from(rowChar).forEach((colChar, colIndex) => {
      if (colChar === EMPTY) return
      const prevList = antennae.get(colChar) ?? []
      const newList = prevList.concat({ row: rowIndex, col: colIndex })
      antennae.set(colChar, newList)
    })
  })
  return antennae
}

/**
 * Calls a callback on every unique pair of the items given.
 * Never pairs an item with itself.
 */
function forEachPair<T>(items: T[], callback: (itemA: T, itemB: T) => void) {
  for (const itemA of items) {
    for (const itemB of items) {
      if (itemA === itemB) continue
      callback(itemA, itemB)
    }
  }
}

/** Greatest Common Divisor */
function gcd(a: number, b: number): number {
  let gcd = 1
  for (let i = 1; i < Math.min(a, b); i++) {
    if (a % i === 0 && b % i === 0) gcd = i
  }
  return gcd
}

/* Note: Both antennas are assumed to have matching frequency */
function computeAntinodes(antennaA: Pos, antennaB: Pos, isWithinBounds: (pos: Pos) => boolean): Pos[] {
  const antinodes: Pos[] = []
  const vecAB = { dRow: antennaB.row - antennaA.row, dCol: antennaB.col - antennaA.col }

  // reduce fraction, e.g. [4,4] => [1,1]
  const gcdAB = gcd(vecAB.dRow, vecAB.dCol)
  const stepAB = { dRow: vecAB.dRow / gcdAB, dCol: vecAB.dCol / gcdAB }

  // step from A towards B
  for (let pos = antennaA; isWithinBounds(pos); pos = { row: pos.row + stepAB.dRow, col: pos.col + stepAB.dCol }) {
    if (pos === antennaA) continue
    antinodes.push({ ...pos })
  }

  // step from B towards A
  for (let pos = antennaB; isWithinBounds(pos); pos = { row: pos.row - stepAB.dRow, col: pos.col - stepAB.dCol }) {
    if (pos === antennaB) continue
    antinodes.push({ ...pos })
  }

  return antinodes
}

/** Assumption: map has uniform length items */
function isWithinMap(pos: Pos, map: string[]): boolean {
  const numRows = map.length
  const numCols = map[0].length
  const { row, col } = pos
  if (row < 0 || row >= numRows) return false
  if (col < 0 || col >= numCols) return false
  return true
}

/**
 * Antennae still assumed to be matching.
 * Does *not* discard duplicates, but *does* discard out-of-bounds.
 */
function computeAllAntinodes(antennae: Pos[], map: string[]): Pos[] {
  const antinodes: Pos[] = []
  forEachPair(antennae, (a, b) => {
    const isWithinBounds = (pos: Pos) => isWithinMap(pos, map)
    const newAntinodes = computeAntinodes(a, b, isWithinBounds)
    antinodes.push(...newAntinodes)
  })
  return antinodes
}

const antennae = gatherAntennae(map)
const antinodes = antennae.values()
  .flatMap(list => computeAllAntinodes(list, map))
const uniqueAntinodes = new Set(antinodes.map(p => `${p.row},${p.col}`))

console.log(uniqueAntinodes.size)
