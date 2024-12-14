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

function getQuadrants(robots: Robot[], mapWidth: number, mapHeight: number): Robot[][] {
  console.assert(mapWidth % 2 === 1)
  console.assert(mapHeight % 2 === 1)
  const xMidpoint = Math.floor(mapWidth / 2)
  const yMidpoint = Math.floor(mapHeight / 2)
  const quadrants: Robot[][] = new Array(4).fill(undefined).map(_ => ([]))

  for (const robot of robots) {
    if (robot.x < xMidpoint && robot.y < yMidpoint)
      quadrants[0].push(robot)
    else if (robot.x > xMidpoint && robot.y < yMidpoint)
      quadrants[1].push(robot)
    else if (robot.x > xMidpoint && robot.y > yMidpoint)
      quadrants[2].push(robot)
    else if (robot.x < xMidpoint && robot.y > yMidpoint)
      quadrants[3].push(robot)
  }

  return quadrants
}

const WIDTH = 101
const HEIGHT = 103
const STEPS = 100
const robots = loadFile('input.txt')
  .map(robot => simulateRobot(robot, STEPS, WIDTH, HEIGHT))
const quadrants = getQuadrants(robots, WIDTH, HEIGHT)
const safetyFactor = quadrants
  .map(quadrant => quadrant.length)
  .reduce((a, b) => a * b)
console.log(safetyFactor)

