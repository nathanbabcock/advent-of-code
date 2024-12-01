import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')

const lines = readFileSync(inputFile, 'utf-8')
  .trim()
  .split(/\r?\n/)
  .map(line => line.trim().split(/\s+/).map(Number))

const leftList = lines.map(([left, _]) => left)
const rightList = lines.map(([_, right]) => right)

const numberCounts = new Map<number, number>()
for (const number of leftList) {
  if (numberCounts.has(number)) continue
  const count = rightList.filter(n => n === number).length
  numberCounts.set(number, count)
}

const sum = leftList.reduce((acc, cur) => {
  const count = numberCounts.get(cur) ?? 0
  return acc + cur * count
}, 0)

console.log(sum)
