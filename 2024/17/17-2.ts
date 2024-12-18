/** A precondition that is true before the specified operation */
type Fact = {
  iterationNumber: number
  operationNumber: number
  aConstraints?: Constraint[]
  bConstraints?: Constraint[]
}

type Constraint = {
  condition: (value: number) => boolean
  generator: (i: number) => number
  description: string
  reasoning?: string
}

const program = '2412750347175530'

// 0: 2, 4 = bst 4 => B = A % 8
// 1: 1, 2 = bxl 2 => B = B XOR 2
// 2: 7, 5 = cdv 5 => C = floor(A / 2^B)
// 3: 0, 3 = adv 3 => A = floor(A / 8)
// 4: 4, 7 = bxc 7 => B = B XOR C
// 5: 1, 7 = bxl 7 => B = B XOR 7
// 6: 5, 5 = out 5 => out = out + B
// 7: 3, 0 = jnz 0 => if A != 0 goto 0

const facts: Fact[] = []

// The loop must terminate on the last iteration
facts.push({
  iterationNumber: program.length - 1,
  operationNumber: 7,
  aConstraints: [{
    condition: (value) => value !== 0,
    generator: (i) => i + 1,
    description: 'A != 0',
  }],
})

// The last digit outputted must be the last digit of the program
facts.push({
  iterationNumber: program.length - 1,
  operationNumber: 6,
  bConstraints: [{
    condition: (value) => value % 7 === 0,
    generator: (i) => 7 * i,
    description: 'B % 7 === 0',
  }]
})

// (B XOR 7) % 7 === 0
facts.push({
  iterationNumber: program.length - 1,
  operationNumber: 5,
  bConstraints: [{
    condition: (value) => (value ^ 7) % 7 === 0,
    generator: (i) => (7 * i) ^ 7, // todo: verify
    description: '(B XOR 7) % 7 === 0'
  }]
})
