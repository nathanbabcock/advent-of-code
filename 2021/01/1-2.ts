import { readFileSync } from 'fs'

const depths = readFileSync('src/1/input.txt', 'utf8')
  .split('\n')
  .map(Number)

console.log(`Read ${depths.length} depths`)

const windows: number[] = []
for (let i = 2; i < depths.length; i++)
  windows.push(depths[i] + depths[i - 1] + depths[i - 2])

let increased = 0
for (let i = 1; i < windows.length; i++)
  if (windows[i] > windows[i - 1]) increased++

console.log(`Increased: ${increased}`)
  
