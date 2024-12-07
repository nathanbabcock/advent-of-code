import { isMainThread, parentPort, workerData } from "node:worker_threads"

if (isMainThread) {
  console.error("This script should be run as a worker")
  process.exit(1)
}

// type Operator = {
//   token: string
//   eval: (a: number, b: number) => number
// }

const OPERATORS = [
  Object.freeze({ token: '+', eval: (a, b) => a + b }),
  Object.freeze({ token: '*', eval: (a, b) => a * b }),

  // part 2:
  Object.freeze({ token: '||', eval: (a, b) => Number(`${a}${b}`) }),
]

/** Returns the result if the equation can be satisfied, or 0 otherwise */
function checkEquation(equation) {
  const partialEquations = [equation]

  while (partialEquations.length > 0) {
    const curEquation = partialEquations.shift()
    console.assert(curEquation.operands.length >= 2)
    const operandA = curEquation.operands.at(0)
    const operandB = curEquation.operands.at(1)
    for (const operator of OPERATORS) {
      const result = operator.eval(operandA, operandB)

      const newEquation = {
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

const batch = workerData
const calibrationResult = batch.map(checkEquation).reduce((a, b) => a + b, 0)
parentPort.postMessage(calibrationResult)
