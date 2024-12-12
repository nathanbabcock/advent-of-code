import { readFileSync } from "node:fs"
import { join } from "node:path"

export type Garden = string[]

export type Cell = {
  row: number
  col: number
}

export type Region = {
  label: string
  cells: Cell[]
  area: number
  perimeter: number
}

export function loadFromFile(filename: string): Garden {
  const inputFile = join(__dirname, filename)
  const garden = readFileSync(inputFile, 'utf-8').trim().split('\r\n')
  return garden
}

export function getRegions(garden: Garden): Region[] {
  const regions: Region[] = []
  const visited = new Set<string>()
  for (let row = 0; row < garden.length; row++) {
    for (let col = 0; col < garden[0].length; col++) {
      const visitedKey = `${row},${col}`
      if (visited.has(visitedKey)) continue
      const region = growRegion(garden, { row, col })
      region.cells.forEach(({ row, col }) => visited.add(`${row},${col}`))
      regions.push(region)
    }
  }
  return regions
}

export function isInBounds(garden: Garden, row: number, col: number): boolean {
  const numRows = garden.length
  const numCols = garden[0].length
  if (row < 0 || row >= numRows) return false
  if (col < 0 || col >= numCols) return false
  return true
}

export function growRegion(garden: Garden, cell: Cell): Region {
  const unvisitedCells = new Set<string>([`${cell.row},${cell.col}`])
  const visitedCells = new Set<string>()
  const label = garden[cell.row][cell.col]
  let perimeter = 0

  while (unvisitedCells.size > 0) {
    const cellHash = unvisitedCells.values().next().value!
    unvisitedCells.delete(cellHash)
    const [row, col] = cellHash.split(',').map(Number)
    let cellPerimeter = 4
    for (const [deltaRow, deltaCol] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const neighborRow = row + deltaRow
      const neighborCol = col + deltaCol
      if (!isInBounds(garden, neighborRow, neighborCol)) continue
      const neighborLabel = garden[neighborRow][neighborCol]
      if (neighborLabel === label) {
        perimeter -= 1
        const neighborHash = `${neighborRow},${neighborCol}`
        if (!visitedCells.has(neighborHash)) {
          unvisitedCells.add(neighborHash)
        }
      }
    }
    perimeter += cellPerimeter
    visitedCells.add(cellHash)
  }

  return {
    label: garden[cell.row][cell.col],
    cells: visitedCells
      .values()
      .map(x => {
        const [row, col] = x.split(',').map(Number)
        return { row, col }
      })
      .toArray(),
    area: visitedCells.size,
    perimeter,
  }
}

export function getPrice(region: Region): number {
  return region.area * region.perimeter
}

function getEdges(row: number, col: number, region: Region): Set<string> {
  const edges = new Set<string>()
  const cells = new Set(region.cells.map(cell => `${cell.row},${cell.col}`))

  const cellHash = `${row},${col}`
  for (const [deltaRow, deltaCol] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const neighborRow = row + deltaRow
    const neighborCol = col + deltaCol
    const neighborHash = `${neighborRow},${neighborCol}`
    if (!cells.has(neighborHash)) {
      const edgeNormal =
        neighborRow < row ? 'N'
          : neighborRow > row ? 'S'
            : neighborCol < col ? 'W'
              : 'E'
      // Note: choose consistent ordering for the hash
      const edgeHash = [cellHash, neighborHash, edgeNormal].toSorted().join('|')
      edges.add(edgeHash)
    }
  }

  return edges
}

function growSide(startingEdgeHash: string, edges: Set<string>): Set<string> {
  const unvisitedEdges = new Set([startingEdgeHash])
  const visitedEdges = new Set<string>()

  while (unvisitedEdges.size > 0) {
    const edgeHash = unvisitedEdges.values().next().value!
    unvisitedEdges.delete(edgeHash)
    visitedEdges.add(edgeHash)
    const [[rowA, colA], [rowB, colB], norm] = edgeHash.split('|')
      .slice(0, 2)
      .map(x => x.split(',').map(Number))
      .concat(edgeHash.split('|').at(-1) as any)
    const isVertical = rowA === rowB
    const deltas = isVertical ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]]
    for (const [deltaRow, deltaCol] of deltas) {
      const neighborRowA = rowA + deltaRow
      const neighborColA = colA + deltaCol
      const neighborRowB = rowB + deltaRow
      const neighborColB = colB + deltaCol
      const neighborHashA = `${neighborRowA},${neighborColA}`
      const neighborHashB = `${neighborRowB},${neighborColB}`
      const newEdgeHash = [neighborHashA, neighborHashB, norm].toSorted().join('|')
      if (!edges.has(newEdgeHash)) continue
      if (visitedEdges.has(newEdgeHash)) continue
      unvisitedEdges.add(newEdgeHash)
    }
  }

  return visitedEdges
}

export function getSides(region: Region): number {
  let allRegionEdges = region.cells
    .map(cell => getEdges(cell.row, cell.col, region))
    .reduce((a, b) => a.union(b))
  const sides: Set<String>[] = []

  while (allRegionEdges.size > 0) {
    const edgeHash = allRegionEdges.values().next().value!
    const side = growSide(edgeHash, allRegionEdges)
    sides.push(side)
    allRegionEdges = allRegionEdges.difference(side)
  }

  return sides.length
}

export function getBulkPrice(region: Region): number {
  return getSides(region) * region.area
}

