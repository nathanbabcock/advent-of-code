import { readFileSync } from 'fs'

const raw = readFileSync('src/6/input.txt', 'utf8')
const fish = raw.split(',').map(Number)

console.log('Fish', fish.length)
// console.log('Fish', fish)

function simulate(fish: number[], days: number): number {
  for (let i = 0; i < days; i++) {
    const newFish: number[] = []
    for (let j = 0; j < fish.length; j++) {
      if (fish[j] === 0) {
        fish[j] = 6
        newFish.push(8)
      } else 
        fish[j]--
    }
    fish.push(...newFish)
  }
  return fish.length
}

// console.log('After 18 days', simulate(fish, 18))
// console.log('After 80 days', simulate(fish, 80-18))
console.log('After 80 days', simulate(fish, 80))
