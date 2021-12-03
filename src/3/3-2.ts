import { readFileSync } from 'fs'

const diagnostics = readFileSync('src/3/input.txt', 'utf8')
  .split(/[\r\n]+/)

type Bit = '0' | '1'
type BitFilter = (diagnostics: string[], pos: number) => Bit

function getMostCommonBit(diagnostics: string[], pos: number): Bit {
  let ones = 0
  let zeros = 0 

  for (const line of diagnostics) {
    if (line[pos] === '1') ones++
    else if (line[pos] === '0') zeros++
  }

  if (ones >= zeros)
    return '1'
  return '0'
}

function getLeastCommonBit(diagnostics: string[], pos: number): Bit {
  let ones = 0
  let zeros = 0 

  for (const line of diagnostics) {
    if (line[pos] === '1') ones++
    else if (line[pos] === '0') zeros++
  }

  if (zeros <= ones)
    return '0'
  return '1'
}

function filterRatings(diagnostics: string[], bitFilter: BitFilter, pos: number = 0): string {
  if (diagnostics.length === 1) return diagnostics[0]
  const bit = bitFilter(diagnostics, pos)
  const filtered = diagnostics.filter(line => line[pos] === bit)
  return filterRatings(filtered, bitFilter, pos + 1)
}

const oxygen = filterRatings(diagnostics, getMostCommonBit)
const oxygen_dec = parseInt(oxygen, 2)
console.log('Oxygen generator rating =', oxygen_dec)

const co2 = filterRatings(diagnostics, getLeastCommonBit)
const co2_dec = parseInt(co2, 2)
console.log('C02 scrubber rating =', co2_dec)

const lifeSupportRating = oxygen_dec * co2_dec
console.log('Life support rating =', lifeSupportRating)
