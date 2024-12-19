import { readFileSync } from 'node:fs'
import { compileAndRun } from './17.lib'
import { join } from 'node:path'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  return readFileSync(inputFile, 'utf-8')
}
//           0   3   5   5   7   1   7   4   3   0   5   7   2   1   4   2
const A = 0b101_011_010_010_011_101_000_001_011_100_000_011_110_000_001_111
const input = loadFile('input.txt').replace(/Register A: \d+/, `Register A: ${A.toString()}`)
const result = compileAndRun(input)
const program = '2412750347175530'
console.log(`program=${program}`)
console.log(` output=${result.output}`)
console.assert(program === result.output)
console.log(`A=${A.toString()}`)
