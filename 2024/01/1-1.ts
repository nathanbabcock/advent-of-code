import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')

const lines = readFileSync(inputFile, 'utf-8')
  .trim()
  .split(/\r?\n/)
  .map(line => line.trim().split(/\s+/))

const leftListSorted = lines
  .map(([left, _]) => parseInt(left))
  .toSorted()

const rightListSorted =
  lines.map(([_, right]) => parseInt(right))
  .toSorted()

const sum = leftListSorted
  .map((left, i) => Math.abs(left - rightListSorted[i]))
  .reduce((acc, cur) => acc + cur, 0)

console.log(sum)
