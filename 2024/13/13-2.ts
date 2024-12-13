import { readFileSync } from "node:fs"
import { join } from "node:path"

type ClawMachine = {
  buttons: {
    label: string
    deltaX: number
    deltaY: number
  }[]
  prize: {
    x: number
    y: number
  }
}

type Button = ClawMachine['buttons'][number]
type Prize = ClawMachine['prize']

function loadFile(filename: string): ClawMachine[] {
  const inputFile = join(__dirname, filename)
  const clawMachineStrings = readFileSync(inputFile, 'utf-8')
    .trim()
    .split('\r\n\r\n')
  return clawMachineStrings.map(parseClawMachine)
}

function parseClawMachine(string: string): ClawMachine {
  const lines = string.split('\r\n')
  const buttonLines = lines.slice(0, -1)
  const prizeLine = lines.at(-1)!
  const buttons = buttonLines.map(parseButton)
  const prize = parsePrize(prizeLine)
  return { buttons, prize }
}

function parseButton(buttonString: string): Button {
  // Input: "Button A: X+94, Y+34"
  const parts = buttonString.split(':')
  const label = parts.at(0)!.slice("Button ".length)
  const deltas = parts.at(1)!.trim().split(', ')
  const deltaX = Number(deltas.at(0)!.slice(1))
  const deltaY = Number(deltas.at(1)!.slice(1))
  return { label, deltaX, deltaY }
}

function parsePrize(prizeString: string): Prize {
  // Input: "Prize: X=8400, Y=5400"
  const parts = prizeString.slice("Prize: ".length).split(", ")
  const x = Number(parts.at(0)!.slice(2))
  const y = Number(parts.at(1)!.slice(2))
  return { x, y }
}

function gaussianElimination(matrix: number[][]): number[] {
  const n = matrix.length

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Find the pivot row
    let pivotRow = i
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(matrix[j][i]) > Math.abs(matrix[pivotRow][i])) {
        pivotRow = j
      }
    }

    // Swap rows if necessary
    if (pivotRow !== i) {
      [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]]
    }

    // Make the pivot element 1
    const pivot = matrix[i][i]
    for (let j = i; j <= n; j++) {
      matrix[i][j] /= pivot
    }

    // Eliminate the pivot column in other rows
    for (let j = i + 1; j < n; j++) {
      const factor = matrix[j][i]
      for (let k = i; k <= n; k++) {
        matrix[j][k] -= factor * matrix[i][k]
      }
    }
  }

  // Back substitution
  const solution: number[] = []
  for (let i = n - 1; i >= 0; i--) {
    solution[i] = matrix[i][n]
    for (let j = i + 1; j < n; j++) {
      solution[i] -= matrix[i][j] * solution[j]
    }
  }

  return solution
}

function getMatrix(clawMachine: ClawMachine): number[][] {
  // todo: hardcoded for the two button case
  return [
    [clawMachine.buttons[0].deltaX, clawMachine.buttons[1].deltaX, clawMachine.prize.x],
    [clawMachine.buttons[0].deltaY, clawMachine.buttons[1].deltaY, clawMachine.prize.y],
  ]
}

function getSingleSolution(clawMachine: ClawMachine): {
  aPresses: number
  bPresses: number
} {
  const matrix = getMatrix(clawMachine)
  const solution = gaussianElimination(matrix)
  const [aPresses, bPresses] = solution
  return { aPresses, bPresses }
}

function getTokenCost(aPresses: number, bPresses: number): number {
  return aPresses * 3 + bPresses * 1
}

function isApproximatelyWholeNumber(num: number) {
  const nearestWhole = Math.round(num)
  const diff = Math.abs(nearestWhole - num)
  return diff < 0.0001
}

const ADJUSTMENT = 10000000000000
function adjustClawMachinePrice(clawMachine: ClawMachine): ClawMachine {
  return {
    ...clawMachine,
    prize: {
      x: clawMachine.prize.x + ADJUSTMENT,
      y: clawMachine.prize.y + ADJUSTMENT,
    }
  }
}

const clawMachines = loadFile('input.txt').map(adjustClawMachinePrice)
const solutions = clawMachines.map(s => ({ ...s, solution: getSingleSolution(s) }))
const solutionsAndPrices = solutions.map(s => ({
  ...s,
  tokenCost: getTokenCost(s.solution.aPresses, s.solution.bPresses)
}))
const validSolutionsAndPrices = solutionsAndPrices.filter(s => {
  const { aPresses, bPresses } = s.solution
  return isApproximatelyWholeNumber(aPresses)
    && isApproximatelyWholeNumber(bPresses)
    && aPresses > 0
    && bPresses > 0
})
// verify
for (const s of validSolutionsAndPrices) {
  const xIsValid = Math.round(s.solution.aPresses) * s.buttons[0].deltaX + Math.round(s.solution.bPresses) * s.buttons[1].deltaX === s.prize.x
  const yIsValid = Math.round(s.solution.aPresses) * s.buttons[0].deltaY + Math.round(s.solution.bPresses) * s.buttons[1].deltaY === s.prize.y
  if (!xIsValid || !yIsValid) {
    throw new Error('Found invalid solution' + JSON.stringify(s, null, 2))
  }
}
// console.log(validSolutionsAndPrices)
const totalPrice = validSolutionsAndPrices
  .map(s => s.tokenCost)
  .reduce((a, b) => a + b)
console.log(totalPrice)
