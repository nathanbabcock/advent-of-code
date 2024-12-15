import { readFileSync } from "node:fs"
import { join } from "node:path"

const UP = '^'
const DOWN = 'v'
const LEFT = '<'
const RIGHT = '>'
const ROBOT = '@'
const EMPTY = '.'
const WALL = '#'
const BOX = 'O'

function loadFile(filename: string): {
  warehouse: Warehouse
  directions: Directions
  robot: Robot
} {
  const inputFile = join(__dirname, filename)
  const parts = readFileSync(inputFile, 'utf-8').trim().split('\r\n\r\n')
  const robot = { row: -1, col: -1 }
  const warehouse = parts.at(0)!.split('\r\n')
    .map((row, rowIndex) => {
      const robotColIndex = row.indexOf(ROBOT)
      if (robotColIndex !== -1) {
        robot.row = rowIndex
        robot.col = robotColIndex
        return row.replace(ROBOT, EMPTY)
      } else {
        return row
      }
    })
  console.assert(robot.row !== -1 && robot.col !== -1, 'could not find robot')
  const directions = parts.at(1)!.replaceAll('\r\n', '')
  return { warehouse, directions, robot }
}

type Warehouse = string[]
type Directions = string
type Direction = string & { length: 1 }
type Robot = { row: number, col: number }

const DirectionVector: Record<string, [deltaRow: number, deltaCol: number]> = {
  [UP]: [-1, 0],
  [DOWN]: [1, 0],
  [LEFT]: [0, -1],
  [RIGHT]: [0, 1],
}

function isInBounds(row: number, col: number, warehouse: Warehouse) {
  const height = warehouse.length
  const width = warehouse[0].length
  if (row < 0 || row >= height) return false
  if (col < 0 || col >= width) return false
  return true
}

/** Note: modifies `warehouse` and `robot` in-place */
function moveRobot(directionChar: Direction, warehouse: Warehouse, robot: Robot): void {
  const direction = DirectionVector[directionChar]
  if (!direction) throw new Error(`Could not get direction vector for ${directionChar}`)
  const emptyCell = getFirstEmptyCellInDirection([robot.row, robot.col], direction, warehouse)
  if (!emptyCell) return
  const [emptyRow, emptyCol] = emptyCell
  const [deltaRow, deltaCol] = direction
  const destRow = robot.row + deltaRow
  const destCol = robot.col + deltaCol

  // Swap dest contents w/ first empty cell
  warehouse[emptyRow] = warehouse[emptyRow].split('').with(emptyCol, warehouse[destRow][destCol]).join('')
  warehouse[destRow] = warehouse[destRow].split('').with(destCol, EMPTY).join('')
  robot.row = destRow
  robot.col = destCol
}

/**
 * Note: start position is *not* inclusive;
 * (starts looking at the `start`'s first neighbor in `direction`)
 */
function getFirstEmptyCellInDirection(
  start: [row: number, col: number],
  direction: [deltaRow: number, deltaCol: number],
  warehouse: Warehouse
): [emptyRow: number, emptyCol: number] | undefined {
  let curPos = [...start]
  const [deltaRow, deltaCol] = direction
  while (true) {
    const [curRow, curCol] = curPos
    const destRow = curRow + deltaRow
    const destCol = curCol + deltaCol
    if (!isInBounds(destRow, destCol, warehouse)) return undefined
    const dest = warehouse[destRow][destCol]
    if (dest === EMPTY) return [destRow, destCol]
    if (dest === WALL) return undefined
    if (dest === BOX) curPos = [destRow, destCol]
    else throw new Error('unhandled map tile type')
  }
}

function printWarehouse(warehouse: Warehouse, robot: Robot): void {
  const height = warehouse.length
  const width = warehouse[0].length
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (robot.row === row && robot.col === col) {
        process.stdout.write(ROBOT)
      } else {
        process.stdout.write(warehouse[row][col])
      }
    }
    process.stdout.write('\n')
  }
  process.stdout.write('\n')
}

function gps(row: number, col: number): number {
  return row * 100 + col
}

function totalGPS(warehouse: Warehouse): number {
  return warehouse.flatMap((row, rowIndex) => row
    .split('')
    .map((col, colIndex) => col === BOX ? gps(rowIndex, colIndex) : 0)
  ).reduce((a, b) => a + b)
}

const { warehouse, directions, robot } = loadFile('example-3.txt')
console.log('Initial state:')
printWarehouse(warehouse, robot)

for (const direction of directions) {
  console.log(`Move ${direction}:`)
  moveRobot(direction as Direction, warehouse, robot)
  printWarehouse(warehouse, robot)
}

console.log('Done!\n')

const answer = totalGPS(warehouse)
console.log(answer)