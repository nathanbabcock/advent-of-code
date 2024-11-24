import { readFileSync } from 'fs'

const depths = readFileSync('src/1/input.txt', 'utf8')
  .split('\n')
  .map(Number)

console.log(`Read ${depths.length} depths`)

let increased = 0
for (let i = 1; i < depths.length; i++)
  if (depths[i] > depths[i - 1]) increased++

console.log(`Increased: ${increased}`)
