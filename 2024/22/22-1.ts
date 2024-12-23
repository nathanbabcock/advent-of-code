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

console.log('[START]')
const lines = loadFile('input.txt')
let sum = 0
for (const line of lines) {
  const nth = nthSecretNumber(line, 2000)
  console.log(`${line}: ${nth}`)
  sum += nth
}
console.log(sum)
