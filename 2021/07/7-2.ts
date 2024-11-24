import { readFileSync } from 'fs'

const raw = readFileSync('src/7/input.txt', 'utf8')
const numbers = raw.split(/,/).map(Number)

console.log('Numbers', numbers.length)
// console.log('Numbers', numbers)

function triangle(n: number) {
  return n * (n + 1) / 2
}

const max = numbers.reduce((max, n) => Math.max(max, n), 0)
const min = numbers.reduce((min, n) => Math.min(min, n), max)

let minHamming = Infinity
for (let i = min; i <= max; i++) {
  let hamming = 0
  for (const number of numbers) {
    const dist = Math.abs(i - number)
    hamming += triangle(dist)
  }

  if (hamming < minHamming)
    minHamming = hamming
}

console.log('Min Hamming', minHamming)