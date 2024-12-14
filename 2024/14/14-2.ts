import { readFileSync } from "node:fs"
import { join } from "node:path"

function loadFile(filename: string): Robot[] {
  const inputFile = join(__dirname, filename)
  const lines = readFileSync(inputFile, 'utf-8').trim().split('\r\n')
  return lines.map(parseRobot)
}

type Robot = {
  x: number
  y: number
  vx: number
  vy: number
}

function parseRobot(string: string): Robot {
  const regex = /-?\d+/g // g flag for global matching
  const matches = string.match(regex)!
  const [x, y, vx, vy] = matches.map(Number)
  return { x, y, vx, vy }
}

function simulateRobot(robot: Robot, time: number, mapWidth: number, mapHeight: number): Robot {
  const newRobot = {
    x: (robot.x + robot.vx * time) % mapWidth,
    y: (robot.y + robot.vy * time) % mapHeight,
    vx: robot.vx,
    vy: robot.vy,
  }
  if (newRobot.x < 0) newRobot.x += mapWidth
  if (newRobot.y < 0) newRobot.y += mapHeight
  return newRobot
}

function divideIntoGrid(robots: Robot[], mapWidth: number, mapHeight: number, xBuckets: number, yBuckets: number): Robot[][][] {
  const grid: Robot[][][] = Array.from({ length: yBuckets }, () => Array.from({ length: xBuckets }, () => ([])))

  const xBucketWidth = mapWidth / xBuckets
  const yBucketHeight = mapHeight / yBuckets

  for (const robot of robots) {
    const xBucketIndex = Math.floor(robot.x / xBucketWidth)
    const yBucketIndex = Math.floor(robot.y / yBucketHeight)
    grid[yBucketIndex][xBucketIndex].push(robot)
  }

  return grid
}

function printRobots(robots: Robot[], width: number, height: number) {
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const numRobots = robots.filter(robot => robot.y === row && robot.x === col).length
      if (numRobots === 0) process.stdout.write('.')
      else process.stdout.write(numRobots.toString())
    }
    process.stdout.write('\n')
  }
}

function shannonEntropy(grid: Robot[][][]): number {
  const numRobots = grid.flat(2).length
  return -1 * grid
    .flat(1)
    .map(robots => robots.length / numRobots)
    .map(p_i => p_i * Math.log2(p_i))
    .map(x => isNaN(x) ? 0 : x) // handle log2(0)
    .reduce((a, b) => a + b)
}

const WIDTH = 101
const HEIGHT = 103
const STEPS = 10000
const GRIDSIZE = 8
let robots = loadFile('input.txt')
console.log('----')
for (let t = 1; t <= STEPS; t++) {
  robots = robots.map(robot => simulateRobot(robot, 1, WIDTH, HEIGHT))
  const grid = divideIntoGrid(robots, WIDTH, HEIGHT, GRIDSIZE, GRIDSIZE)
  const entropy = shannonEntropy(grid)
  if (entropy < 5) {
    console.log(`t=${t}, entropy=${entropy}`)
    printRobots(robots, WIDTH, HEIGHT)
  }
}
