import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const sections = readFileSync(inputFile, 'utf-8')
  .trim()
  .split('\r\n\r\n')

const orderingRules = sections[0].split(/\r?\n/).map(line => {
  const [before, after] = line.split('|').map(Number)
  return { before, after }
})

const updates = sections[1].split(/\r?\n/).map(line => line.split(',').map(Number))

// O(n^2)
function isValid(update: number[]): boolean {
  for (const rule of orderingRules) {
    const beforeIndex = update.indexOf(rule.before)
    const afterIndex = update.indexOf(rule.after)
    if (beforeIndex === -1) continue
    if (afterIndex === -1) continue
    if (beforeIndex > afterIndex) return false
  }
  return true
}

function getMiddle(array: number[]) {
  console.assert(array.length % 2 === 1)
  const index = (array.length - 1) / 2
  return array[index]
}

// O(m * n^2)
const sum = updates.map(isValid).map((valid, index) => {
  if (!valid) return 0
  return getMiddle(updates[index])
}).reduce((a, b) => a + b, 0)

console.log(sum)
