import { readFileSync } from 'node:fs'
import { join } from 'node:path'

console.time()

const inputFile = join(__dirname, 'input.txt')
const stones = readFileSync(inputFile, 'utf-8').trim()

function blink(stones: string): string {
  if (stones.includes(' ')) {
    return stones.split(' ').map(blink).join(' ')
  }

  const stone = stones
  if (stone === "0") return "1"
  if (stone.length % 2 === 0) {
    const firstHalf = Number(stone.slice(0, stone.length / 2))
    const secondHalf = Number(stone.slice(stone.length / 2))
    return `${firstHalf} ${secondHalf}`
  }
  return `${Number(stone) * 2024}`
}

const cache = new Map<string, number>()
function countStones(singleStone: string, blinkTimes: number): number {
  if (blinkTimes === 0) return 1
  const cacheKey = `${singleStone}-${blinkTimes}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)!
  const nextStones = blink(singleStone).split(' ')
  const count = nextStones
    .map(stone => countStones(stone, blinkTimes - 1))
    .reduce((a, b) => a + b, 0)
  cache.set(cacheKey, count)
  return count
}

const blinkTimes = 75
const count = stones
  .split(' ')
  .map(stone => countStones(stone, blinkTimes))
  .reduce((a, b) => a + b, 0)
console.log(count)
console.log(`Cache size: ${cache.size}`)

console.timeEnd()