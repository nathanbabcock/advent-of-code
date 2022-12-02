import { readFileSync } from 'fs'
import { z } from 'zod'
import { Combinator, Map } from '../lib/combinator'
import { Library } from '../lib/library'
import { Char, Max, Op, Parse, Split, Sum } from '../lib/op'
import { deriveProgram, runProgram } from '../lib/program'

const steps: any[] = []

const input = '1000\r\n2000\r\n3000\r\n\r\n4000\r\n\r\n5000\r\n6000\r\n\r\n7000\r\n8000\r\n9000\r\n\r\n10000'
const output = 24000

steps[0] = input

// STEP 1: `split`
steps[1] = [
  `1000
2000
3000`,
  `4000`,
  `5000
6000`,
  `7000
8000
9000`,
  `10000`
]

// STEP 2: `map(split)`
steps[2] = [
  ['1000', '2000', '3000'],
  ['4000'],
  ['5000', '6000'],
  ['7000', '8000', '9000'],
  ['10000'],
]

// STEP 3: `map(map(parse))`
steps[3] = [
  [1000, 2000, 3000],
  [4000],
  [5000, 6000],
  [7000, 8000, 9000],
  [10000],
]

// STEP 4: `map(sum)`
steps[4] = [6000, 4000, 11000, 24000, 10000]

// STEP 5: `max`
steps[5] = output // 24000

// Minimal set of "primitive" types (for binding to generic functions like `map`)
const _types = [
  z.string(),
  z.number(),
  Char, // z.string().length(1)
  z.function(),
  z.array(z.any()),
]

// Minimal library of functions to use
const ops: Op[] = [Split, Parse, Sum, Max]
const combinators: Combinator[] = [Map]
const library = new Library(ops, combinators)

// Pre-seed the library with augmented types (2 levels deep)
for (let i = 0; i < combinators.length * ops.length * 2; i++)
  library.deriveNextOp()


function main() {
  console.log('Library 📚 = ')
  console.log(library.getOps().map(op => op.name))

  // Training input/output (translated the problem description)
  // In this case, no intermediate stepping stones were needed!
  const input = steps[0]
  const output = steps[5]

  // Derive a program that solves the simplified example problem
  const program = deriveProgram(input, output, library)
  console.log(`Program (length ${program.length}):`)
  program.forEach(asst => console.log('  ' + asst.toString()))

  // Run the derived program on the real problem input
  const realInput = readFileSync('days/1.txt').toString()
  const realAnswer = 71124
  const answer = runProgram(program, realInput)
  console.log(`Answer: ${answer} ${answer === realAnswer ? '⭐' : '💩'}`)
}

main()
