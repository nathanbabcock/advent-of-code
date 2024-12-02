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

// O(n^2) solution
const numSafe = lines.filter(line => {
  return new Array(line.length).fill(0).map((_, i) => {
    const diffs = line.toSpliced(i, 1).map((num, i, arr) => {
      const prev = arr[i - 1] || 0
      return num - prev
    }).toSpliced(0, 1)
    return diffs.every(diff => diff >= 1 && diff <= 3)
      || diffs.every(diff => diff <= -1 && diff >= -3)
  }).some(Boolean)
}).length

console.log(numSafe)
