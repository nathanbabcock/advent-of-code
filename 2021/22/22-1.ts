import { readFileSync } from 'fs'

const raw = readFileSync('src/22/input.txt', 'utf8')
const lines = raw.split(/\r?\n/)

type Directive = {
  on: boolean,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  zMin: number,
  zMax: number,
}

const state: boolean[][][] = []

// init
for (let x = 0; x <= 100; x++) {
  state.push([])
  for (let y = 0; y <= 100; y++) {
    state[x].push([])
    for (let z = 0; z <= 100; z++) {
      state[x][y].push(false)
    }
  }
}

console.log(`Array = ${state.length} x ${state[0].length} x ${state[0][0].length}`)
console.log('Lines', lines.length)

const directives: Directive[] = []
for (const line of lines) {
  const directive: any = {}
  const parts = line.split(' ')
  directive.on = parts[0] === 'on'
  const ranges = parts[1].split(',')
  const xRange = ranges[0].substring(2).split('..')
  const yRange = ranges[1].substring(2).split('..')
  const zRange = ranges[2].substring(2).split('..')
  directive.xMin = parseInt(xRange[0])
  directive.xMax = parseInt(xRange[1])
  directive.yMin = parseInt(yRange[0])
  directive.yMax = parseInt(yRange[1])
  directive.zMin = parseInt(zRange[0])
  directive.zMax = parseInt(zRange[1])
  directives.push(directive as Directive)
}


console.log('Directives', directives.length)
// console.log(directives[0])

for (const directive of directives) {
  // console.log({directive})
  if (directive.xMin < -50 || directive.xMin > 50) continue
  if (directive.xMax < -50 || directive.xMax > 50) continue
  if (directive.yMin < -50 || directive.yMin > 50) continue
  if (directive.yMax < -50 || directive.yMax > 50) continue
  if (directive.zMin < -50 || directive.zMin > 50) continue
  if (directive.zMax < -50 || directive.zMax > 50) continue
  for (let x = directive.xMin; x <= directive.xMax; x++)
    for (let y = directive.yMin; y <= directive.yMax; y++)
      for (let z = directive.zMin; z <= directive.zMax; z++)
        state[x + 50][y + 50][z + 50] = directive.on
}

let count = 0
for (let x = 0; x <= 100; x++)
  for (let y = 0; y <= 100; y++)
    for (let z = 0; z <= 100; z++)
      if (state[x][y][z]) count++

console.log({count})
