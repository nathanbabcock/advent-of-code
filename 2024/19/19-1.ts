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

function isDesignPossible(design: string, patterns: string[]): boolean {
  const label = `[${(designs.indexOf(design) + 1)}/${designs.length}] ${design}`
  console.time(label)
  const relevantPatterns = patterns
    .filter(pattern => design.includes(pattern))
    .toSorted((a, b) => a.length - b.length)
  if (relevantPatterns.length === 0) return false

  // Early exit if some chars not covered by any pattern
  let markedDesign = design
  for (const pattern of relevantPatterns)
    markedDesign = markedDesign.replaceAll(new RegExp(pattern, 'ig'), substr => substr.toUpperCase())
  if (markedDesign !== markedDesign.toUpperCase()) return false

  const regex = new RegExp(`^(?:${relevantPatterns.join('|')})+?$`)
  const isMatch = (design.match(regex)?.length ?? -1) > 0
  console.timeEnd(label)
  return isMatch
}

const numPossibleDesigns = designs
  .filter(design => isDesignPossible(design, patterns))
  .length

console.log(numPossibleDesigns)
