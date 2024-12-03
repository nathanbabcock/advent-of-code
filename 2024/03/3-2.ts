import { readFileSync } from "node:fs"
import { join } from "node:path"
import { extractMul, parseMul, preprocessMul } from "./3.lib"

const inputFile = join(__dirname, 'input.txt')
const content = preprocessMul(readFileSync(inputFile, 'utf-8'))
const result = extractMul(content).map(parseMul).reduce((acc, cur) => acc + cur, 0)
console.log(result)