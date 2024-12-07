console.time()

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

type Operator = {
  token: string
  eval: (a: number, b: number) => number
}

const BOUND_OPERATORS = [
  Object.freeze({ token: '+', eval: (a, b) => a + b }),
  Object.freeze({ token: '*', eval: (a, b) => a * b }),

  // part 2:
  Object.freeze({ token: '||', eval: (a, b) => Number(`${a}${b}`) }),
] as const satisfies Readonly<Operator[]>

const UNBOUND = Object.freeze({
  token: '?',
  eval() { throw new Error(`eval called w/ unbound operator`) }
}) satisfies Operator

type Equation = {
  result: number
  operands: number[]
  operators: Operator[]
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
  const operators = Array
    .from({ length: operands.length - 1 })
    .fill(UNBOUND) as typeof UNBOUND[]
  return { result, operands, operators }
}

function evalEquation(equation: Equation): number {
  const remainingOperands = [...equation.operands]
  const remainingOperators = [...equation.operators]

  while (remainingOperands.length > 1) {
    const operandA = remainingOperands.shift()!
    const operandB = remainingOperands.shift()!
    const operator = remainingOperators.shift()!
    const curResult = operator.eval(operandA, operandB)
    remainingOperands.unshift(curResult)
  }

  return remainingOperands[0]
}

/** Returns an array of all possible permutations of unbound operators in the input */
function permuteOperands(equation: Equation): Equation[] {
  const { operators } = equation
  const firstUnboundOperatorIndex = operators.indexOf(UNBOUND)
  if (firstUnboundOperatorIndex === -1) return [equation]

  return BOUND_OPERATORS
    .map(operator => ({
      ...equation,
      operators: operators.with(firstUnboundOperatorIndex, operator)
    }))
    .flatMap(permuteOperands)
}

function progressMessage(message: string, i: number, total: number,): void {
  if (i > 0) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
  }
  process.stdout.write(`${message} ${i + 1} / ${total}`)
  if (i + 1 === total)
    process.stdout.write('\n')
}

const totalCalibrationResult = equations
  .map((equation, i) => {
    progressMessage('Calibrating equation', i, equations.length)

    const permutations = permuteOperands(equation)

    // todo: optimize by checking min/max possible result first

    for (const permutation of permutations) {
      const actualResult = evalEquation(permutation)

      // console.log(permutation.operands.map((operand, index) => operand.toString() + (permutation.operators.at(index) ?? '=')).join('') + actualResult + (actualResult === equation.result ? '✅' : ''))

      if (actualResult === equation.result) return equation.result
    }
    return 0
  }).reduce((a, b) => a + b, 0)

console.log(totalCalibrationResult)
console.timeEnd()
