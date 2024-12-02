import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')

const lines = readFileSync(inputFile, 'utf-8')
  .trim()
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => line
    .trim()
    .split(/\s+/)
    .map(Number)
  )

const numSafe = lines.filter(line => {
  const diffs = line.map((num, i) => {
    const prev = line[i - 1] || 0
    return num - prev
  }).toSpliced(0, 1)
  return diffs.every(diff => diff >= 1 && diff <= 3)
    || diffs.every(diff => diff <= -1 && diff >= -3)
}).length

console.log(numSafe)
