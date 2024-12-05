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
function isValid(update: number[], rule: { before: number, after: number }) {
  const beforeIndex = update.indexOf(rule.before)
  const afterIndex = update.indexOf(rule.after)
  if (beforeIndex === -1) return { valid: true }
  if (afterIndex === -1) return { valid: true }
  if (beforeIndex > afterIndex) return { valid: false, rule }
  return { valid: true }
}

function isAllValid(update: number[]) {
  return orderingRules.every(rule => isValid(update, rule).valid)
}

function getMiddle(array: number[]) {
  console.assert(array.length % 2 === 1)
  const index = (array.length - 1) / 2
  return array[index]
}

function fixOrdering(update: number[], rule: { before: number, after: number }): number[] {
  const beforeIndex = update.indexOf(rule.before)
  const afterIndex = update.indexOf(rule.after)
  if (beforeIndex > afterIndex) {
    const fixed = update
      .toSpliced(beforeIndex, 1)
      .toSpliced(afterIndex, 0, update[beforeIndex])
    console.log("fixed from", update, "to", fixed)
    return fixed
  } else {
    return update
  }
}

// O(m * n^2)
const sum = updates.map(update => {
  const results = orderingRules.map(rule => isValid(update, rule))
  let invalidResults = results.filter(result => !result.valid)
  if (invalidResults.length === 0) return 0
  let newUpdate = update
  while (invalidResults.length > 0) {
    newUpdate = fixOrdering(newUpdate, invalidResults.at(0)!.rule!)
    invalidResults = orderingRules
      .map(rule => isValid(newUpdate, rule))
      .filter(result => !result.valid)
  }
  return getMiddle(newUpdate)
}).reduce((a, b) => a + b, 0)

console.log(sum)
