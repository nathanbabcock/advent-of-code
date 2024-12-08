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

/* Note: Both antennas are assumed to have matching frequency */
function computeAntinodes(antennaA: Pos, antennaB: Pos): [Pos, Pos] {
  const vecAB = { dRow: antennaB.row - antennaA.row, dCol: antennaB.col - antennaA.col }
  const vecBA = { dRow: antennaA.row - antennaB.row, dCol: antennaA.col - antennaB.col }
  const antinodeAB = { row: antennaB.row + vecAB.dRow, col: antennaB.col + vecAB.dCol }
  const antinodeBA = { row: antennaA.row + vecBA.dRow, col: antennaA.col + vecBA.dCol }
  return [antinodeAB, antinodeBA]
}

/** Assumption: map has uniform length items */
function isWithinMap(pos: Pos, map: string[]) {
  const numRows = map.length
  const numCols = map[0].length
  const { row, col } = pos
  if (row < 0 || row >= numRows) return false
  if (col < 0 || col >= numCols) return false
  return true
}

/**
 * Antennae still assumed to be matching.
 * Does *not* discard duplicates or out-of-bounds.
 */
function computeAllAntinodes(antennae: Pos[]): Pos[] {
  const antinodes: Pos[] = []
  forEachPair(antennae, (a, b) => antinodes.push(...computeAntinodes(a, b)))
  // todo: could be a flatmap
  return antinodes
}

const antennae = gatherAntennae(map)
const antinodes = antennae.values()
  .flatMap(computeAllAntinodes)
  .filter(p => isWithinMap(p, map))
const uniqueAntinodes = new Set(antinodes.map(p => `${p.row},${p.col}`))
