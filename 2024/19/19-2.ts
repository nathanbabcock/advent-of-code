import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const lines = content.split('\r\n')
  const patterns = lines[0].split(', ')
  const designs = lines.slice(2)
  return { patterns, designs }
}

const { patterns, designs } = loadFile('input.txt')

const cache = new Map<string, number>()

function waysToSatisfyDesign(design: string, patterns: string[]): number {
  if (design.length === 0) return 1
  if (cache.has(design)) return cache.get(design)!
  const length = patterns
    .filter(pattern => design.startsWith(pattern))
    .map(pattern => design.slice(pattern.length))
    .map(design => waysToSatisfyDesign(design, patterns))
    .reduce((a, b) => a + b, 0)
  cache.set(design, length)
  return length
}

const totalNumberOfArrangements = designs
  .map((design, i, all) => {
    const label = `[${i + 1}/${all.length}] ${design}`
    console.time(label)
    const numArrangements = waysToSatisfyDesign(design, patterns)
    console.timeEnd(label)
    return numArrangements
  })
  .reduce((a, b) => a + b)
console.log(totalNumberOfArrangements)
