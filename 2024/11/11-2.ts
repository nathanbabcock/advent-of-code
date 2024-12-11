import { readFileSync } from 'node:fs'
import { join } from 'node:path'

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

function blinkTimes(stones: string, n: number): string {
  for (let i = 0; i < n; i++) {
    stones = blink(stones)
    progressMessage('blink', i, n)
  }
  return stones
}

function numStones(stones: string): number {
  return stones.split(' ').length
}

function analyzeStoneDistribution(stones: string): void {
  const stoneCounts: Map<string, number> = new Map()
  const totalStones = stones.split(' ').length
  stones.split(' ').forEach(stone => {
    const prevNum = stoneCounts.get(stone) ?? 0
    stoneCounts.set(stone, prevNum + 1)
  })
  console.log(stoneCounts
    .entries()
    .toArray()
    .map(x => [x[0], x[1] / totalStones] as const)
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, 10))
}

const newStones = blinkTimes(stones, 35)
const count = numStones(newStones)
console.log(count)
analyzeStoneDistribution(newStones)
