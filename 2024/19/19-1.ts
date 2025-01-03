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

function isDesignPossible(design: string, patterns: string[]): boolean {
  if (design.length === 0) return true
  if (cache.has(design)) return cache.get(design)! > 0
  const length = patterns
    .filter(pattern => design.startsWith(pattern))
    .map(pattern => design.slice(pattern.length))
    .map(design => isDesignPossible(design, patterns))
    .filter(Boolean)
    .length
  cache.set(design, length)
  return length > 0
}

const numPossibleDesigns = designs
  .filter((design, i, all) => {
    const label = `[${i + 1}/${all.length}] ${design}`
    console.time(label)
    const isPossible = isDesignPossible(design, patterns)
    console.timeEnd(label)
    return isPossible
  })
  .length
console.log(numPossibleDesigns)
