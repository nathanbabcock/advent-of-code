import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const OPERATORS = ['+', '*', '||'] as const
const UNBOUND = '?'

type Operator = typeof OPERATORS[number]
type Unbound = typeof UNBOUND

type Equation = {
  result: number
  operands: number[]
  operators: (Operator | Unbound)[]
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
  const operators = Array.from({ length: operands.length - 1 }).fill(UNBOUND) as Unbound[]
  return { result, operands, operators }
}

function evalEquation(equation: Equation): number {
  if (equation.operators.includes(UNBOUND))
    throw new Error('Cannot solve an equation with unbound operators:' + equation)

  const remainingOperands = [...equation.operands]
  const remainingOperators = [...equation.operators]

  while (remainingOperands.length > 1) {
    const operandA = remainingOperands.shift()!
    const operandB = remainingOperands.shift()!
    const operator = remainingOperators.shift()!
    const curResult = operator === '*' ? operandA * operandB
      : operator === '+' ? operandA + operandB
        : Number(`${operandA}${operandB}`)
    remainingOperands.unshift(curResult)
  }

  return remainingOperands[0]
}

/** Returns an array of all possible permutations of unbound operators in the input */
function permuteOperands(equation: Equation): Equation[] {
  const { operators } = equation
  const firstUnboundOperatorIndex = operators.indexOf(UNBOUND)
  if (firstUnboundOperatorIndex === -1) return [equation]

  return OPERATORS
    .map(operator => ({
      ...equation,
      operators: operators.with(firstUnboundOperatorIndex, operator)
    }))
    .flatMap(permuteOperands)
}

const totalCalibrationResult = equations
  .map(equation => {
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
