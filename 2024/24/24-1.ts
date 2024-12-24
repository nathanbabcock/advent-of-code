import { readFileSync } from 'node:fs'
import { join } from 'node:path'

type WireValue = {
  type: 'literal',
  value: boolean,
} | {
  type: 'gate',
  wireA: string,
  wireB: string,
  gate: 'XOR' | 'AND' | 'OR',
}

function loadFile(filename: string) {
  const inputFile = join(__dirname, filename)
  const content = readFileSync(inputFile, 'utf-8')
  const sections = content.split('\r\n\r\n')
  const wires = new Map<string, WireValue>()

  const literals = sections[0].split('\r\n')
  for (const literal of literals) {
    const parts = literal.split(': ')
    const wire = parts[0]
    const value = Boolean(Number(parts[1]))
    wires.set(wire, { type: 'literal', value })
  }

  const gates = sections[1].split('\r\n')
  for (const gateStr of gates) {
    const parts = gateStr.split(' ')
    const wireA = parts[0]
    const gate = parts[1] as 'XOR' | 'AND' | 'OR'
    const wireB = parts[2]
    const wire = parts[4]
    wires.set(wire, { type: 'gate', wireA, wireB, gate })
  }

  return wires
}

function getZs(wires: Map<string, WireValue>): string[] {
  return wires.keys().toArray().filter(k => k.startsWith('z'))
}

function evalWire(wire: string, wires: Map<string, WireValue>): boolean {
  const value = wires.get(wire)
  if (!value) throw new Error(`no value for ${wire}`)
  if (value.type === 'literal') return value.value
  if (value.gate === 'XOR') return Boolean(Number(evalWire(value.wireA, wires)) ^ Number(evalWire(value.wireB, wires)))
  if (value.gate === 'AND') return evalWire(value.wireA, wires) && evalWire(value.wireB, wires)
  if (value.gate === 'OR') return evalWire(value.wireA, wires) || evalWire(value.wireB, wires)
  throw new Error(`unknown gate ${value.gate}`)
}

function solve(wires: Map<string, WireValue>): number {
  const zs = getZs(wires).sort().map(wire => evalWire(wire, wires))
  const binStr = '0b' + zs.toReversed().map(Number).join('')
  const decimal = Number(binStr)
  return decimal
}

const wires = loadFile('input.txt')
const answer = solve(wires)
console.log(answer)
