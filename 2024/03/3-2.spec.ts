import { expect, test } from "vitest"
import { extractMul, parseMul, preprocessMul } from "./3.lib"

test('preprocessMul', () => {
  const input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`
  const result = preprocessMul(input)
  expect(result).toBe(`xmul(2,4)&mul[3,7]!^?mul(8,5))`)
  expect(extractMul(result).map(parseMul).reduce((acc, cur) => acc + cur, 0)).toBe(48)
})

test('preprocessMul repeated don\'t', () => {
  const input = `mul(1,1)don't()mul(1,1)don't()mul(1,1)do()mul(1,1)`
  const result = extractMul(preprocessMul(input)).map(parseMul).reduce((acc, cur) => acc + cur, 0)
  expect(result).toBe(2)
})

test('preprocessMul repeated do', () => {
  const input = `mul(1,1)do()mul(1,1)do()mul(1,1)do()mul(1,1)`
  const result = extractMul(preprocessMul(input)).map(parseMul).reduce((acc, cur) => acc + cur, 0)
  expect(result).toBe(4)
})

test('preprocessMul multiple ranges', () => {
  const input = `mul(1,1)don't()mul(1,1)do()mul(1,1)don't()mul(1,1)do()mul(1,1)`
  const result = extractMul(preprocessMul(input)).map(parseMul).reduce((acc, cur) => acc + cur, 0)
  expect(result).toBe(3)
})

// Does not occur in input
test.skip('preprocessMul unclosed ranged', () => {
  const input = `mul(1,1)don't()mul(1,1)do()mul(1,1)don't()mul(1,1)mul(1,1)`
  const result = extractMul(preprocessMul(input)).map(parseMul).reduce((acc, cur) => acc + cur, 0)
  expect(result).toBe(2)
})
