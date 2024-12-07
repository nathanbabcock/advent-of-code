console.time()

import { readFileSync } from 'node:fs'
import { cpus } from 'node:os'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'

type Equation = {
  result: number
  operands: number[]
}

export function parseEquation(line: string): Equation {
  const parts = line.split(' ')
  console.assert(parts[0].endsWith(':'))
  const result = Number(parts[0].slice(0, -1))
  const operands = parts.slice(1).map(Number)
  return { result, operands }
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

const inputFile = join(__dirname, 'input.txt')
const equations = readFileSync(inputFile, 'utf-8')
  .trim()
  .split('\r\n')
  .map(parseEquation)

// divide work into batches
const batchCount = Math.min(18, cpus().length)
console.log('Parallelism: ' + batchCount)
const batchSize = Math.ceil(equations.length / batchCount)
const batches = Array.from({ length: batchCount }, (_, i) =>
  equations.slice(i * batchSize, (i + 1) * batchSize)
)

console.assert(batches.map(b => b.length).reduce((a, b) => a + b, 0) === equations.length)

let totalCalibrationResult = 0
let resultsReceived = 0

// Spawn workers for each batch
const workerScript = new URL('./7-worker.mjs', import.meta.url)
for (const batch of batches) {
  const worker = new Worker(workerScript, { workerData: batch })
  worker.postMessage(batch)
  worker.on('message', (calibrationResult: number) => {
    totalCalibrationResult += calibrationResult
    if (++resultsReceived === batchCount) {
      console.log(totalCalibrationResult)
      console.timeEnd()
    }
  })
}
