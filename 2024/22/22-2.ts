import { readFileSync } from 'node:fs'
import { join } from 'node:path'

(Number.prototype as any).mod = function (n: number) {
  return ((this % n) + n) % n
}

declare global {
  interface Number {
    mod(n: number): number
  }
}

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const lines = content.split('\r\n').map(Number)
  return lines
}

function nextSecretNumber(secretNumber: number): number {
  secretNumber = prune(mix(secretNumber * 64, secretNumber))
  secretNumber = prune(mix(Math.floor(secretNumber / 32), secretNumber))
  secretNumber = prune(mix(secretNumber * 2048, secretNumber))
  return secretNumber
}

function nthSecretNumber(secretNumber: number, n: number): number {
  for (let i = 0; i < n; i++) {
    secretNumber = nextSecretNumber(secretNumber)
  }
  return secretNumber
}

function mix(a: number, b: number): number {
  return a ^ b
}

function prune(a: number): number {
  return a.mod(16777216)
}

function progressMessage(message: string, i: number, total: number): void {
  if (i > 0) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
  }
  process.stdout.write(`${message} ${i + 1} / ${total}`)
  if (i + 1 === total) {
    process.stdout.write('\n')
  }
}

function getBestSequence(inputs: number[]): { sequence: string, totalBananas: number } {
  const totalBananas = new Map<string, number>()
  for (const input of inputs) {
    progressMessage('buyer', inputs.indexOf(input), inputs.length)
    const sequenceValues = new Map<string, number>()
    let secretNumber = input
    let prev = secretNumber.mod(10)
    const prevDeltas = []
    for (let i = 0; i < 2000; i++) {
      secretNumber = nextSecretNumber(secretNumber)
      const lastDigit = secretNumber.mod(10)
      const delta = lastDigit - prev
      prev = lastDigit
      prevDeltas.push(delta)
      if (prevDeltas.length > 4)
        prevDeltas.shift()
      if (prevDeltas.length === 4) {
        const sequence = prevDeltas.join(',')
        if (!sequenceValues.has(sequence)) {
          sequenceValues.set(sequence, lastDigit)
          totalBananas.set(sequence, (totalBananas.get(sequence) ?? 0) + lastDigit)
        }
      }
    }
  }

  const bestSequence = totalBananas.entries()
    .toArray()
    .reduce((a, b) => a[1] > b[1] ? a : b)
  return { sequence: bestSequence[0], totalBananas: bestSequence[1] }
}

console.log('[START]')
const lines = loadFile('input.txt')
const total = getBestSequence(lines)
console.log(total)
