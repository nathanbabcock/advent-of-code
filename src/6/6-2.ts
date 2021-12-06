import { readFileSync } from 'fs'

const NUM_BUCKETS = 8
function initFishBuckets(num_buckets: number): number[] {
  const buckets: number[] = []
  for (let i = 0; i <= num_buckets; i++)
    buckets[i] = 0
  return buckets
}

function fishBuckets(numbers: number[]): number[] {
  const buckets = initFishBuckets(NUM_BUCKETS)
  for (const num of numbers)
    buckets[num]++
  return buckets
}

const raw = readFileSync('src/6/input.txt', 'utf8')
const fish = raw.split(',').map(Number)
const buckets = fishBuckets(fish)

console.log('Fish', fish.length)
console.log('Fish', fish)

console.log('Buckets', buckets.length)
console.log('Buckets', buckets)

function simulate(buckets: number[], days: number): number {
  for (let i = 0; i < days; i++) {
    const newBuckets = initFishBuckets(buckets.length - 1)
    newBuckets[6] = buckets[0]
    newBuckets[8] = buckets[0]
    for (let j = 1; j < buckets.length; j++)
      newBuckets[j - 1] += buckets[j]
    buckets = newBuckets
  }
  return buckets.reduce((a, b) => a + b, 0)
}

// console.log('After 18 days', simulate(buckets, 18))
// console.log('After 80 days', simulate(buckets, 80))
console.log('After 256 days', simulate(buckets, 256))
