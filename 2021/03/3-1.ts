import { readFileSync } from 'fs'

const diagnostics = readFileSync('src/3/input.txt', 'utf8')
  .split(/[\r\n]+/)

let γ: string = ''
let ε: string = ''

for (let pos = 0; pos < diagnostics[0].length; pos++) {
  let ones = 0
  let zeros = 0 

  for (const line of diagnostics) {
    if (line[pos] === '1') ones++
    else if (line[pos] === '0') zeros++
  }

  if (ones > zeros) {
    γ += '1'
    ε += '0'
  } else {
    γ += '0'
    ε += '1'
  }
}

console.log(`diagnostics.length     = ${diagnostics.length}`)
console.log(`diagnostics has \\n     = ${!!diagnostics.find(item => item.includes('\n'))}`)
console.log(`diagnostics has \\r     = ${!!diagnostics.find(item => item.includes('\r'))}`)
console.log(`diagnostics[0].length  = ${diagnostics[0].length}`)
console.log(`diagnostics[0].charCodeAt(diagnostics[0].length - 1) = `, diagnostics[0].charCodeAt(diagnostics[0].length - 1))
console.log(`diagnostics[0]         = ${diagnostics[0]}`)
console.log('gamma (γ) in binary    =', γ)
console.log('epsilon (ε) in binary  =', ε)
const γ_dec = parseInt(γ, 2)
const ε_dec = parseInt(ε, 2)
console.log('gamma (γ) in decimal    =', γ_dec)
console.log('epsilon (ε) in decimal  =', ε_dec)
const powerConsumption = γ_dec * ε_dec
console.log('Power consumption = ', powerConsumption)
