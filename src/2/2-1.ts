import { readFileSync } from 'fs'

const depths = readFileSync('src/2/input.txt', 'utf8')
  .split('\n')

let horiz = 0
let depth = 0
let aim = 0
for (const command of depths) {
  const parts = command.split(' ')
  const direction = parts[0]
  const amount = parseInt(parts[1])
  if (direction === 'forward') {
    horiz += amount
    depth += aim * amount
  } else if (direction === 'down')
    aim += amount
  else if (direction === 'up')
    aim -= amount
}

console.log(horiz * depth)
