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

function checkLevels(levels: number[]): { isSafe: true } | { isSafe: false, errorIndex: number } {
  let direction: 'increasing' | 'decreasing' | undefined
  for (let i = 1; i < levels.length; i++) {
    const curr = levels[i]
    const prev = levels[i - 1]
    const diff = curr - prev
    if (direction === undefined) {
      if (diff > 0) {
        direction = 'increasing'
      } else if (diff < 0) {
        direction = 'decreasing'
      } else {
        return { isSafe: false, errorIndex: i }
      }
    }
    if (direction === 'increasing' && diff <= 0 || diff > 3)
      return { isSafe: false, errorIndex: i }
    if (direction === 'decreasing' && (diff >= 0 || diff < -3))
      return { isSafe: false, errorIndex: i }
  }
  return { isSafe: true }
}

function isSafe(levels: number[]): boolean {
  return checkLevels(levels).isSafe
}

function isSafeWithProblemDampener(levels: number[]): boolean {
  const checkResult = checkLevels(levels)
  if (checkResult.isSafe) return true
  const { errorIndex } = checkResult
  return isSafe(levels.toSpliced(errorIndex, 1))
    || isSafe(levels.toSpliced(errorIndex - 1, 1))
    || isSafe(levels.toSpliced(errorIndex - 2, 1))
}

const numSafe = lines.filter(isSafeWithProblemDampener).length

console.log(numSafe)
