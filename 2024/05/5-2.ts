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
    return fixed
  } else {
    return update
  }
}

// O(m * n^2)
const sum = updates.map(update => {
  let fixedUpdate = update
  const getInvalid = () => orderingRules
    .map(rule => isValid(fixedUpdate, rule))
    .filter(result => !result.valid)

  if (getInvalid().length === 0) return 0

  for (let latestInvalid = getInvalid(); latestInvalid.length > 0; latestInvalid = getInvalid()) {
    fixedUpdate = fixOrdering(fixedUpdate, latestInvalid.at(0)!.rule!)
  }

  return getMiddle(fixedUpdate)
}).reduce((a, b) => a + b, 0)

console.log(sum)
