export type Registers = {
  a: number
  b: number
  c: number
}

export type Program = (registers: Registers) => { output: string, registers: Registers }

export function compile(instructions: string): Program {
  return (registers) => {
    return { output: '', registers }
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
