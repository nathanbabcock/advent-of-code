import { expect, test } from "vitest"
import { extractMul, parseMul } from "./3.lib"

test('parseMul', () => {
  const str = 'mul(2,4)'
  const result = parseMul(str)
  expect(result).toBe(2 * 4)
})

test('extractMul', () => {
  const input = 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))'
  const result = extractMul(input)
  expect(result).toEqual(['mul(2,4)', 'mul(5,5)', 'mul(11,8)', 'mul(8,5)'])
})
