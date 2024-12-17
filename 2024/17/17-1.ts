import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compileAndRun } from './17.lib'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  return readFileSync(inputFile, 'utf-8')
}

const input = loadFile('input.txt')
const result = compileAndRun(input)
console.log(result.output.split('').join(','))
