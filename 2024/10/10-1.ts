import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const topoMap = readFileSync(inputFile, 'utf-8').trim().split('\r\n')

type TopoMap = string[]
type Step = { row: number, col: number, isDeadEnd?: false }
type Trail = Step[]

function isInBounds(map: TopoMap, { row, col }: Step) {
  if (row < 0 || row >= map.length) return false
  if (col < 0 || col >= map[0].length) return false
  return true
}

function getNeighbors({ row, col }: Step): Step[] {
  return [
    { row: row + 1, col },
    { row, col: col + 1 },
    { row: row - 1, col },
    { row, col: col - 1 },
  ]
}

function getElevation(map: TopoMap, step: Step): number {
  return Number(map[step.row][step.col])
}

function getTrails(map: TopoMap, start: Step): Trail[] {
  const finishedTrails: Trail[] = []
  const partialTrails: Trail[] = [[start]]

  while (partialTrails.length > 0) {
    for (const partialTrail of partialTrails) {
      const lastStep = partialTrail.at(-1)!
      const nextSteps = getNeighbors(lastStep)
        .filter(step => isInBounds(map, step))
        .filter(step => getElevation(map, step) === getElevation(map, lastStep) + 1)
      partialTrails.splice(partialTrails.indexOf(partialTrail), 1)
      for (const nextStep of nextSteps) {
        const newTrail = partialTrail.concat([nextStep])
        if (getElevation(map, nextStep) === 9) {
          finishedTrails.push(newTrail)
        } else {
          partialTrails.push(newTrail)
        }
      }
    }
  }

  return finishedTrails
}

function getTrailheads(topoMap: TopoMap): Step[] {
  return topoMap.flatMap((row, rowIndex) => row
    .split('')
    .map((col, colIndex) =>
      col === '0' && { row: rowIndex, col: colIndex }
    ).filter(Boolean)
  ) as Step[]
}

function numUniqueTrails(trails: Trail[]): number {
  return new Set(trails
    .map(trail => trail.at(-1)!)
    .map(step => `${step.row},${step.col}`)
  ).size
}

const trailHeads = getTrailheads(topoMap)
const allTrails = trailHeads.map(trailHead => {
  const curTrails = getTrails(topoMap, trailHead)
  const score = numUniqueTrails(curTrails)
  const rating = curTrails.length
  return { trailHead, trails: curTrails, score, rating }
})

console.log(allTrails.map(x => x.rating))

const totalScore = allTrails.map(x => x.rating).reduce((a, b) => a + b, 0)
console.log(totalScore)
