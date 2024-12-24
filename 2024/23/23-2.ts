import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const lines = content.split('\r\n').map(x => x.split('-'))
  return lines
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

type Clique = {
  vertices: Set<string>

  /** The n subcliques (of size n-1 each) which make up this clique */
  subCliques: Clique[]
}

/**
 * Given the fact that every clique of size `n` will be made up of
 * "sub-cliques" of size `n-1` (exactly `n` of them), this algorithm searches
 * through the previous iteration of cliques in order to find cliques of the
 * next size up.
 */
function nCliques(n: number, subCliques: Clique[]): Clique[] {
  const timeLabel = `find ${n}-cliques`
  console.time(timeLabel)
  const potentialCliques: Clique[] = []
  const finishedCliques: Clique[] = []
  for (let i = 0; i < subCliques.length; i++) {
    progressMessage(`${n}-cliques`, i, subCliques.length)
    const subClique = subCliques[i]
    for (const clique of potentialCliques) {
      if (clique.vertices.size === n) {
        // if n-1 vertices match, add edge
        if (!clique.subCliques.includes(subClique)) {
          if (subClique.vertices.intersection(clique.vertices).size === n - 1) {
            clique.subCliques.push(subClique)
            if (clique.vertices.size === n && clique.subCliques.length === n) {
              potentialCliques.splice(potentialCliques.indexOf(clique), 1)
              finishedCliques.push(clique)
            }
          }
        }
      } else {
        // otherwise, the clique we're looking at is size n-1
        // if n-2 vertices match, spawn a new group
        if (subClique.vertices.intersection(clique.vertices).size === n - 2) {
          if (!clique.subCliques.includes(subClique)) {
            const newClique = {
              vertices: subClique.vertices.union(clique.vertices),
              subCliques: clique.subCliques.concat([subClique])
            }
            if (newClique.vertices.size === n && newClique.subCliques.length === n) {
              finishedCliques.push(newClique)
            } else {
              potentialCliques.push(newClique)
            }
          }
        }
      }
    }
    potentialCliques.push({
      vertices: subClique.vertices.union(new Set()),
      subCliques: [subClique]
    })
  }
  console.timeEnd(timeLabel)
  console.log(`${n}-cliques:`, finishedCliques.length)
  return finishedCliques
}

console.log('[START]')
const pairs = loadFile('input.txt')

const pairCliques: Clique[] = pairs.map(([a, b]) => ({
  vertices: new Set([a, b]),
  subCliques: [],
}))
console.log('2-cliques:', pairCliques.length)

let prevCliques = pairCliques
for (let n = 3; n < Infinity; n++) {
  prevCliques = nCliques(n, prevCliques)
  if (prevCliques.length === 1) break
}

console.log(prevCliques[0].vertices.values().toArray().sort().join(','))
