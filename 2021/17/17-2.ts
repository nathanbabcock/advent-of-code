import { readFileSync } from 'fs'

const raw = readFileSync('src/17/input.txt', 'utf8')
const regex = /target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)..(-?\d+)/
const matches = raw.match(regex)
const ranges = matches!.slice(1, 5).map(Number) as [number, number, number, number]

// console.log({raw})
// console.log({matches})
console.log({ranges})

function inrange(x: number, min: number, max: number) {
  return x >= min && x <= max
}

function simulateTrajectory(
  initialVelocityX: number,
  initialVelocityY: number,
  targetRange: [number, number, number, number],
  steps: number = 1000
): { hitTarget: boolean, maxY: number } {
  const [xMin, xMax, yMin, yMax] = targetRange
  let x = 0
  let y = 0
  let vx = initialVelocityX
  let vy = initialVelocityY
  let maxY = y

  for (let i = 0; i < steps; i++) {
    x += vx
    y += vy
    vx--
    if (vx < 0) vx = 0
    vy--
    if (y > maxY) maxY = y

    if (inrange(x, xMin, xMax) && inrange(y, yMin, yMax)) {
      return {
        hitTarget: true,
        maxY,
      }
    }
  }

  return {
    hitTarget: false,
    maxY,
  }
}

// const test1 = simulateTrajectory(7, 2, ranges)
// console.log({test1})

// const test2 = simulateTrajectory(6, 3, ranges)
// console.log({test2})

// const test3 = simulateTrajectory(9, 0, ranges)
// console.log({test3})

// const test4 = simulateTrajectory(17, -4, ranges)
// console.log({test4})

// const test5 = simulateTrajectory(6, 9, ranges)
// console.log({test5})

let inputs = 0
for (let vx = -1000; vx < 1000; vx++) {
  for (let vy = -1000; vy < 1000; vy++) {
    const test = simulateTrajectory(vx, vy, ranges)
    if (test.hitTarget) inputs++
  }
}

console.log({inputs})