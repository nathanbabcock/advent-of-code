import { readFileSync } from 'fs'
import { Line, Point } from './Line.js'

const raw = readFileSync('src/5/input.txt', 'utf8')
const lines = raw.split(/\r?\n/)
  .map(line => line.split('->')
    .map(point => point.split(',')
      .map(num => Number(num.trim()))
    ).map(point => Point.fromArray(point as [number, number]))
  ).map(line => Line.fromArray(line as [Point, Point]))
  .map(line => line.getPoints(true))

console.log('Lines', lines.length)
// console.log('Lines', lines)

const max = Point.getMax(lines.flat())
console.log('Max', max)

// Init map
const map: number[][] = []
for (let y = 0; y <= max.y; y++) {
  map[y] = []
  for (let x = 0; x <= max.x; x++)
    map[y][x] = 0
}

// Fill map
for (const point of lines.flat())
  map[point.y][point.x]++

// Print map
// console.log(map.map(row => row.join('')).join('\n'))

const overlaps = map.flat().filter(num => num > 1).length
console.log('Overlaps', overlaps)