import { readFileSync } from 'fs'

const raw = readFileSync('src/0/test.txt', 'utf8')
const lines = raw.split(/\r?\n/)

console.log('Lines', lines.length)
console.log('Lines', lines)
