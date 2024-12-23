import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const lines = content.split('\r\n').map(x => x.split('-'))
  return lines
}

function adjacencyMatrix(pairs: string[][]): { labels: string[], matrix: number[][] } {
  const matrix: number[][] = []
  const labels: string[] = []
  for (const [a, b] of pairs) {
    if (!labels.includes(a)) {
      labels.push(a)
      matrix.push(new Array(labels.length - 1).fill(0))
      for (const row of matrix) row.push(0)
    }
    if (!labels.includes(b)) {
      labels.push(b)
      matrix.push(new Array(labels.length - 1).fill(0))
      for (const row of matrix) row.push(0)
    }
    const aIndex = labels.indexOf(a)
    const bIndex = labels.indexOf(b)
    matrix[aIndex][bIndex] = 1
    matrix[bIndex][aIndex] = 1
  }
  return { labels, matrix }
}

console.log('[START]')
const pairs = loadFile('input.txt')
const adj = adjacencyMatrix(pairs)

let triplets = new Set<string>()
for (const a of adj.labels) {
  for (const b of adj.labels) {
    for (const c of adj.labels) {
      if (a === b || b === c || a === c) continue
      if (![a, b, c].some(x => x.startsWith('t'))) continue
      const aIndex = adj.labels.indexOf(a)
      const bIndex = adj.labels.indexOf(b)
      const cIndex = adj.labels.indexOf(c)
      if (adj.matrix[aIndex][bIndex] && adj.matrix[bIndex][cIndex] && adj.matrix[cIndex][aIndex]) {
        triplets.add([a, b, c].sort().join(','))
      }
    }
  }
}
console.log(triplets.size)