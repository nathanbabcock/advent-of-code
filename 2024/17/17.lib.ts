export type Registers = {
  a: number
  b: number
  c: number
}

export type Program = (registers: Registers) => { output: string, registers: Registers }

export function compile(instructions: string): Program {
  return (registers) => {
    let instructionPointer = 0
    let outputRegisters = { ...registers }
    let output = ''
    while (true) {
      const opcode = Number(instructions.at(instructionPointer))
      const comboOperand = Number(instructions.at(instructionPointer + 1))
      if (isNaN(opcode) || isNaN(comboOperand)) break
      const operator = OPERATORS[opcode]
      if (!operator) throw new Error(`No operator for opcode ${opcode}`)
      const result = operator(comboOperand, outputRegisters, output, instructionPointer)
      instructionPointer = result.newInstructionPointer
      output = result.newOutput
      outputRegisters = result.newRegisters
      console.log({ instructionPointer, output, outputRegisters })
    }

    return { output, registers: outputRegisters }
  }
}

const INPUT_REGEX = /Register A: (\d+)\r?\nRegister B: (\d+)\r?\nRegister C: (\d+)\r?\n\r?\nProgram: ((?:\d,)*\d)/gm
export function compileAndRun(input: string) {
  const matches = input.matchAll(INPUT_REGEX)!.next().value!
  const [_, aStr, bStr, cStr, programStr] = matches
  const instructions = programStr.replaceAll(',', '')
  const program = compile(instructions)
  const inputRegisters = { a: Number(aStr), b: Number(bStr), c: Number(cStr) }
  const { registers: outputRegisters, output } = program(inputRegisters)
  return { inputRegisters, instructions, program, outputRegisters, output }
}

type Operator = (
  operand: number,
  registers: Registers,
  output: string,
  instructionPointer: number
) => {
  newRegisters: Registers,
  newOutput: string
  newInstructionPointer: number
}

function evalComboOperand(operand: number, registers: Registers): number {
  if (operand === 0) return 0
  if (operand === 1) return 1
  if (operand === 2) return 2
  if (operand === 3) return 3
  if (operand === 4) return registers.a
  if (operand === 5) return registers.b
  if (operand === 6) return registers.c
  else throw new Error(`Invalid operand ${operand}`)
}

const DEBUG: boolean = true

const adv: Operator = (operand, registers, output, instructionPointer) => {
  const newA = Math.floor(registers.a / Math.pow(2, evalComboOperand(operand, registers)))
  if (DEBUG) console.log(`adv ${operand} => a=${newA}`)
  return {
    newRegisters: { ...registers, a: newA },
    newInstructionPointer: instructionPointer + 2,
    newOutput: output,
  }
}

const bxl: Operator = (operand, registers, output, instructionPointer) => {
  const newB = registers.b ^ operand
  if (DEBUG) console.log(`bxl ${operand} => b=${newB}`)
  return {
    newRegisters: { ...registers, b: newB },
    newInstructionPointer: instructionPointer + 2,
    newOutput: output,
  }
}

const bst: Operator = (operand, registers, output, instructionPointer) => {
  const newB = evalComboOperand(operand, registers) % 8
  if (DEBUG) console.log(`bst ${operand} => b=${newB}`)
  return {
    newRegisters: { ...registers, b: newB },
    newInstructionPointer: instructionPointer + 2,
    newOutput: output,
  }
}

const jnz: Operator = (operand, registers, output, instructionPointer) => {
  if (DEBUG) console.log(`jnz ${operand}`)
  return {
    newRegisters: registers,
    newInstructionPointer: registers.a === 0 ? instructionPointer + 2 : operand,
    newOutput: output,
  }
}

const bxc: Operator = (operand, registers, output, instructionPointer) => {
  const newB = registers.b ^ registers.c
  if (DEBUG) console.log(`bxc ${operand} => b=${newB}`)
  return {
    newRegisters: { ...registers, b: newB },
    newInstructionPointer: instructionPointer + 2,
    newOutput: output,
  }
}

const out: Operator = (operand, registers, output, instructionPointer) => {
  if (DEBUG) console.log(`out ${operand} => output=${output + ((evalComboOperand(operand, registers) % 8))}`)
  return {
    newRegisters: registers,
    newOutput: output + (evalComboOperand(operand, registers) % 8),
    newInstructionPointer: instructionPointer + 2,
  }
}

const bdv: Operator = (operand, registers, output, instructionPointer) => {
  const newB = Math.floor(registers.a / Math.pow(2, evalComboOperand(operand, registers)))
  if (DEBUG) console.log(`bdv ${operand} => b=${newB}`)
  return {
    newRegisters: { ...registers, b: newB },
    newInstructionPointer: instructionPointer + 2,
    newOutput: output,
  }
}

const cdv: Operator = (operand, registers, output, instructionPointer) => {
  const newC = Math.floor(registers.a / Math.pow(2, evalComboOperand(operand, registers)))
  if (DEBUG) console.log(`cdv ${operand} => c=${newC}`)
  return {
    newRegisters: { ...registers, c: newC },
    newInstructionPointer: instructionPointer + 2,
    newOutput: output,
  }
}

const OPERATORS: Record<number, Operator> = {
  0: adv,
  1: bxl,
  2: bst,
  3: jnz,
  4: bxc,
  5: out,
  6: bdv,
  7: cdv,
}
