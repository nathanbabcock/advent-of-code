import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compileAndRun } from './17.lib'

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const input = readFileSync(inputFile, 'utf-8')
  return compileAndRun(input)
}

