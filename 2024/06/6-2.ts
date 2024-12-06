import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const map = readFileSync(inputFile, 'utf-8').trim().split('\r\n')

const OBSTRUCTION = '#'
const GUARD = '^'

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

function stepGuard(guardState: GuardState, map: string[]): GuardState {
  const destRow = guardState.pos.row + guardState.direction.row
  const destCol = guardState.pos.col + guardState.direction.col
  const dest = map.at(destRow)?.at(destCol) ?? '.' // (fallback means off-map)
  if (dest === OBSTRUCTION) {
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

type GuardSimulationResult = {
  ending: 'off-map' | 'loop'
  uniquePositions: GuardState['pos'][]
}

function simulateGuard(initialGuardState: GuardState, map: string[]): GuardSimulationResult {
  let guardState = initialGuardState
  const prevGuardStates = [guardState]
  const getUniquePositions = () => {
    return Array.from(
      new Set(prevGuardStates.map(state => `${state.pos.row},${state.pos.col}`))
    ).map(string => {
      const [row, col] = string.split(',').map(Number)
      return { row, col }
    })
  }

  // step the guard continuously until he revisits a prev state,
  // or goes off the map
  while (true) {
    guardState = stepGuard(guardState, map)
    const { row, col } = guardState.pos
    if (row < 0 || row >= map.length)
      return {
        ending: 'off-map',
        uniquePositions: getUniquePositions()
      }
    else if (col < 0 || col >= map[0].length)
      return {
        ending: 'off-map',
        uniquePositions: getUniquePositions()
      }
    else if (prevGuardStates.some(x => guardStateEquals(x, guardState)))
      return {
        ending: 'loop',
        uniquePositions: getUniquePositions()
      }
    else
      prevGuardStates.push(guardState)
  }
}

const initialGuardState = getInitialGuardState(map)
const { uniquePositions } = simulateGuard(initialGuardState, map)

// Try putting an obstacle at every point in the guard's path and simulate
// Takes ~10s, could be optimized further by pruning obstacles that will
// immediately send off-map.
const loopers = uniquePositions.filter((pos, i) => {
  if (i > 0) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
  }
  process.stdout.write(`Checking barrier pos ${i + 1} / ${uniquePositions.length}`)
  if (i + 1 === uniquePositions.length)
    process.stdout.write('\n')

  // not allowed to place barrier directly on top of guard
  if (pos.row === initialGuardState.pos.row && pos.col === initialGuardState.pos.col)
    return false
  const newMap = map.with(pos.row, map[pos.row].split('').with(pos.col, OBSTRUCTION).join(''))
  const { ending } = simulateGuard(initialGuardState, newMap)
  return ending === 'loop'
})

console.log(loopers.length)
