import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const map = readFileSync(inputFile, 'utf-8').trim().split('\r\n')

const BARRIER = '#'
const GUARD = '^'
const EMPTY = '.'

type GuardState = {
  pos: {
    row: number
    col: number
  }
  direction: {
    row: number
    col: number
  }
}

function guardStateEquals(a: GuardState, b: GuardState) {
  return a.pos.row === b.pos.row
    && a.pos.col === b.pos.col
    && a.direction.row === b.direction.row
    && a.direction.col === b.direction.col
}

function getInitialGuardState(map: string[]): GuardState {
  for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    const row = map[rowIndex]
    const colIndex = row.indexOf(GUARD)
    if (colIndex !== -1) {
      return {
        pos: {
          row: rowIndex,
          col: colIndex,
        },
        direction: {
          row: -1,
          col: 0,
        }
      }
    }
  }
  throw new Error("Guard not found")
}

let guardState = getInitialGuardState(map)

function stepGuard(guardState: GuardState, map: string[]): GuardState {
  const destRow = guardState.pos.row + guardState.direction.row
  const destCol = guardState.pos.col + guardState.direction.col
  const dest = map.at(destRow)?.at(destCol) ?? '.' // (fallback means off-map)
  if (dest === BARRIER) {
    // turn right
    return {
      pos: guardState.pos,
      direction: {
        row: guardState.direction.col,
        col: -guardState.direction.row,
      }
    }
  } else {
    // walk forward
    return {
      pos: {
        row: destRow,
        col: destCol,
      },
      direction: guardState.direction,
    }
  }
}

const prevGuardStates = [guardState]

// step the guard continuously until he revisits a prev state,
// or goes off the map
while (true) {
  guardState = stepGuard(guardState, map)
  const { row, col } = guardState.pos
  if (row < 0 || row >= map.length)
    break
  else if (col < 0 || col >= map[0].length)
    break
  else if (prevGuardStates.some(x => guardStateEquals(x, guardState)))
    break
  else
    prevGuardStates.push(guardState)
}

const uniquePositions = new Set(prevGuardStates.map(state => `${state.pos.row},${state.pos.col}`)).size

console.log(uniquePositions)
