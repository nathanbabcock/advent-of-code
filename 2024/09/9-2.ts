import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const inputFile = join(__dirname, 'input.txt')
const diskMap = readFileSync(inputFile, 'utf-8').trim()

type BlockSpan = { type: 'free', size: number } | { type: 'file', id: number, size: number }

function getBlockSpans(diskMap: string): BlockSpan[] {
  const spans: BlockSpan[] = []
  let fileIndex = 0
  for (let i = 0; i < diskMap.length; i++) {
    const size = Number(diskMap[i])
    const type = i % 2 === 0 ? 'file' : 'free'

    let span: BlockSpan
    if (type === 'free') {
      span = { type, size }
    } else {
      span = { type, size, id: fileIndex }
      ++fileIndex
    }
    spans.push(span)
  }
  return spans
}

/** Note: Modifies the array in-place */
function compact(spans: BlockSpan[]): void {
  const seenIds = new Set<number>()

  // O(n^2)…or O(n^3)?
  while (true) {
    const spanToMoveIndex = spans.findLastIndex(span => span.type === 'file' && !seenIds.has(span.id))
    if (spanToMoveIndex === -1) break
    const spanToMove = spans[spanToMoveIndex] as BlockSpan & { type: 'file' }
    seenIds.add(spanToMove.id)

    const firstFreeSpaceIndex = spans.findIndex((span, i) => span.type === 'free' && span.size >= spanToMove.size && i < spanToMoveIndex)
    if (firstFreeSpaceIndex === -1) continue
    const firstFreeSpace = spans[firstFreeSpaceIndex]

    spans.splice(spanToMoveIndex, 1, { type: 'free', size: spanToMove.size })
    spans.splice(firstFreeSpaceIndex, 1, spanToMove)
    if (firstFreeSpace.size > spanToMove.size) {
      spans.splice(firstFreeSpaceIndex + 1, 0, {
        type: 'free', size: firstFreeSpace.size - spanToMove.size
      })
    }
  }
}

function checksum(spans: BlockSpan[]): number {
  let blockIndex = 0
  let checksum = 0

  for (const span of spans) {
    for (let i = 0; i < span.size; i++) {
      checksum += span.type === 'free' ? 0 : span.id * blockIndex
      blockIndex++
    }
  }

  return checksum
}

const spans = getBlockSpans(diskMap)
compact(spans)
console.log(checksum(spans))
