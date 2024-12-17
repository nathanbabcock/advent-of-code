import { expect, test } from 'vitest'
import { compileAndRun } from './17.lib'

test('bst (opcode 2)', () => {
  const input = `
Register A: 0
Register B: 0
Register C: 9

Program: 2,6`

  const result = compileAndRun(input)

  // Input parsing
  expect(result.inputRegisters.a).toBe(0)
  expect(result.inputRegisters.b).toBe(0)
  expect(result.inputRegisters.c).toBe(9)
  expect(result.instructions).toBe('26')

  // Output
  expect(result.outputRegisters.b).toBe(1)
  expect(result.output).toBe('')
})

test('out (opcode 5)', () => {
  const input = `
Register A: 10
Register B: 0
Register C: 0

Program: 5,0,5,1,5,4`

  const { output } = compileAndRun(input)
  expect(output).toBe('012')
})

test('adv (opcode 0), out (opcode 5), jnz (opcode 3)', () => {
  const input = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`

  const { output, outputRegisters } = compileAndRun(input)
  expect(output).toBe('42567777310')
  expect(outputRegisters.a).toBe(0)
})

test('bxl (opcode 1)', () => {
  const input = `
Register A: 0
Register B: 29
Register C: 0

Program: 1,7`

  const { outputRegisters } = compileAndRun(input)
  expect(outputRegisters.b).toBe(26)
})

test('bxc (opcode 4)', () => {
  const input = `
Register A: 0
Register B: 2024
Register C: 43690

Program: 4,0`

  const { outputRegisters } = compileAndRun(input)
  expect(outputRegisters.b).toBe(44354)
})

test('additional example', () => {
  const input = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`

  const { output } = compileAndRun(input)
  expect(output).toBe('4635635210')
})

test('quine', () => {
  const input = `
Register A: 117440
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`

  const { output } = compileAndRun(input)
  expect(output).toBe('035430')
})
