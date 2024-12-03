export function parseMul(str: string): number {
  return str
    .split(',')
    .map(x => x.replaceAll(/[^0-9]/g, ''))
    .map(Number)
    .reduce((acc, cur) => acc * cur, 1)
}

export function extractMul(str: string): string[] {
  return str.matchAll(/mul\((\d+),(\d+)\)/gs).toArray().map(x => x[0])
}

export function preprocessMul(str: string): string {
  return str.replaceAll(/don't\(\).*?do\(\)/gs, '')
}
