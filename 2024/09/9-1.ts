import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const diskMap = readFileSync(inputFile, 'utf-8').trim()

type Block = { type: 'free' } | { type: 'file', id: number }
const FREE_SPACE: Block = { type: 'free' }

function getBlocks(diskMap: string): Block[] {
  const blocks: Block[] = []
  let fileIndex = 0
  for (let i = 0; i < diskMap.length; i++) {
    const size = Number(diskMap[i])
    const type = i % 2 === 0 ? 'file' : 'free'

    let block: Block
    if (type === 'free') {
      block = FREE_SPACE
    } else {
      block = {
        type: 'file',
        id: fileIndex
      }
      ++fileIndex
    }

    for (let j = 0; j < size; j++) {
      blocks.push(block)
    }
  }
  return blocks
}

/** Note: Modifies the array in-place */
function compact(blocks: Block[]): void {
  let firstFree = 0
  let lastFile = blocks.length - 1

  while (true) {
    if (firstFree >= blocks.length) break
    if (lastFile < 0) break
    if (firstFree > lastFile) break

    if (blocks[firstFree].type !== 'free') {
      firstFree++
      continue
    }
    if (blocks[lastFile].type !== 'file') {
      lastFile--
      continue
    }

    blocks[firstFree] = blocks[lastFile]
    blocks[lastFile] = FREE_SPACE
  }
}

function checksum(blocks: Block[]): number {
  return blocks
    .map((block, index) => block.type === 'free' ? 0 : block.id * index)
    .reduce((a, b) => a + b, 0)
}

const blocks = getBlocks(diskMap)
compact(blocks)
console.log(checksum(blocks))
