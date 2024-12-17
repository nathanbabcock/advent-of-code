import { expect, test } from 'vitest'
import { compileAndRun } from './17.lib'

test('1', () => {
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