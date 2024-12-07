console.time()

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

type Operator = {
  token: string
  eval: (a: number, b: number) => number
}

const OPERATORS = [
  Object.freeze({ token: '+', eval: (a, b) => a + b }),
  Object.freeze({ token: '*', eval: (a, b) => a * b }),

  // part 2:
  Object.freeze({ token: '||', eval: (a, b) => Number(`${a}${b}`) }),
] as const satisfies Readonly<Operator[]>

type Equation = {
  result: number
  operands: number[]
}

const inputFile = join(__dirname, 'input.txt')
const equations = readFileSync(inputFile, 'utf-8')
  .trim()
  .split('\r\n')
  .map(parseEquation)

function parseEquation(line: string): Equation {
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

/** Returns the result if the equation can be satisfied, or 0 otherwise */
function checkEquation(equation: Equation): number {
  const partialEquations: Equation[] = [equation]

  while (partialEquations.length > 0) {
    const curEquation = partialEquations.shift()!
    console.assert(curEquation.operands.length >= 2)
    const operandA = curEquation.operands.at(0)!
    const operandB = curEquation.operands.at(1)!
    for (const operator of OPERATORS) {
      const result = operator.eval(operandA, operandB)

      const newEquation: Equation = {
        result: curEquation.result,
        operands: [result].concat(curEquation.operands.slice(2)),
      }

      if (result > curEquation.result) {
        // Optimization: there's now way to decrease a partial result value,
        // so exit early if we've already gone too high
        continue
      }

      if (newEquation.operands.length > 1) {
        partialEquations.unshift(newEquation)
      } else if (result === curEquation.result) {
        return result
      }
    }
  }

  return 0
}

const totalCalibrationResult = equations
  .map((eq, i) => {
    progressMessage("Checking equation", i, equations.length)
    return checkEquation(eq)
  }).reduce((a, b) => a + b, 0)

console.log(totalCalibrationResult)
console.timeEnd()
