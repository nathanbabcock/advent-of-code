import { describe, expect, test } from 'vitest'
import { getBulkPrice, getPrice, getRegions, getSides, loadFromFile } from './12.lib'

describe("example 1", () => {
  const garden = loadFromFile('example-1.txt')

  test("load from file", () => {
    expect(garden.length).toBe(4)
  })

  test("number of regions", () => {
    const regions = getRegions(garden)
    expect(regions.length).toBe(5)
  })

  test("area", () => {
    const regions = getRegions(garden)
    const a = regions.find(region => region.label === 'A')
    const b = regions.find(region => region.label === 'B')
    const c = regions.find(region => region.label === 'C')
    const d = regions.find(region => region.label === 'D')
    const e = regions.find(region => region.label === 'E')
    expect(a?.area).toEqual(4)
    expect(b?.area).toEqual(4)
    expect(c?.area).toEqual(4)
    expect(e?.area).toEqual(3)
    expect(d?.area).toEqual(1)
  })

  test("perimeter", () => {
    const regions = getRegions(garden)
    const a = regions.find(region => region.label === 'A')
    const b = regions.find(region => region.label === 'B')
    const c = regions.find(region => region.label === 'C')
    const d = regions.find(region => region.label === 'D')
    const e = regions.find(region => region.label === 'E')
    expect(a?.perimeter).toEqual(10)
    expect(b?.perimeter).toEqual(8)
    expect(c?.perimeter).toEqual(10)
    expect(e?.perimeter).toEqual(8)
    expect(d?.perimeter).toEqual(4)
  })

  test("price", () => {
    const regions = getRegions(garden)
    const priceA = getPrice(regions.find(region => region.label === 'A')!)
    const priceB = getPrice(regions.find(region => region.label === 'B')!)
    const priceC = getPrice(regions.find(region => region.label === 'C')!)
    const priceD = getPrice(regions.find(region => region.label === 'D')!)
    const priceE = getPrice(regions.find(region => region.label === 'E')!)
    expect(priceA).toBe(40)
    expect(priceB).toBe(32)
    expect(priceC).toBe(40)
    expect(priceD).toBe(4)
    expect(priceE).toBe(24)
  })

  test("bulk price", () => {
    const regions = getRegions(garden)
    const priceA = getBulkPrice(regions.find(region => region.label === 'A')!)
    const priceB = getBulkPrice(regions.find(region => region.label === 'B')!)
    const priceC = getBulkPrice(regions.find(region => region.label === 'C')!)
    const priceD = getBulkPrice(regions.find(region => region.label === 'D')!)
    const priceE = getBulkPrice(regions.find(region => region.label === 'E')!)
    expect(priceA).toBe(16)
    expect(priceB).toBe(16)
    expect(priceC).toBe(32)
    expect(priceD).toBe(4)
    expect(priceE).toBe(12)
  })
})

describe("example 2", () => {
  const garden = loadFromFile('example-2.txt')

  test("number of regions", () => {
    const regions = getRegions(garden)
    expect(regions.length).toBe(5)
  })

  test("area", () => {
    const regions = getRegions(garden)
    const xs = regions.filter(r => r.label === 'X')
    const o = regions.find(r => r.label === 'O')
    expect(xs.length).toBe(4)
    expect(xs.every(x => x.area === 1))
    expect(o?.area).toEqual(21)
  })

  test("perimeter", () => {
    const regions = getRegions(garden)
    const xs = regions.filter(r => r.label === 'X')
    const o = regions.find(r => r.label === 'O')
    expect(xs.every(x => x.perimeter === 4))
    expect(o?.perimeter).toEqual(36)
  })

  test("price", () => {
    const regions = getRegions(garden)
    const priceX = getPrice(regions.find(region => region.label === 'X')!)
    const priceO = getPrice(regions.find(region => region.label === 'O')!)
    expect(priceO).toBe(756)
    expect(priceX).toBe(4)
  })
})

describe("example 3", () => {
  const garden = loadFromFile('example-3.txt')

  test("price", () => {
    const regions = getRegions(garden)
    const prices = [
      { label: 'R', price: 216 },
      { label: 'I', price: 32 },
      { label: 'C', price: 392 },
      { label: 'F', price: 180 },
      { label: 'V', price: 260 },
      { label: 'J', price: 220 },
      { label: 'C', price: 4 },
      { label: 'E', price: 234 },
      { label: 'I', price: 308 },
      { label: 'M', price: 60 },
      { label: 'S', price: 24 },
    ]
    for (const price of prices) {
      expect(regions.filter(r => r.label === price.label).some(r => getPrice(r) === price.price))
    }
  })

  test("bulk price", () => {
    const regions = getRegions(garden)
    const prices = [
      { label: 'R', price: 120 },
      { label: 'I', price: 16 },
      { label: 'C', price: 308 },
      { label: 'F', price: 120 },
      { label: 'V', price: 130 },
      { label: 'J', price: 132 },
      { label: 'C', price: 4 },
      { label: 'E', price: 104 },
      { label: 'I', price: 224 },
      { label: 'M', price: 30 },
      { label: 'S', price: 18 },
    ]
    for (const price of prices) {
      expect(regions.filter(r => r.label === price.label).some(r => getBulkPrice(r) === price.price))
    }
  })
})

describe("example 4", () => {
  const garden = loadFromFile('example-4.txt')

  test("sides", () => {
    const regions = getRegions(garden)
    const sidesX = getSides(regions.find(region => region.label === 'X')!)
    const sidesE = getSides(regions.find(region => region.label === 'E')!)
    expect(sidesX).toBe(4)
    expect(sidesE).toBe(12)
  })

  test("bulk price", () => {
    const regions = getRegions(garden)
    const priceE = getBulkPrice(regions.find(region => region.label === 'E')!)
    const priceX = getBulkPrice(regions.find(region => region.label === 'X')!)
    expect(priceE).toBe(204)
    expect(priceX).toBe(16)
  })
})

describe("example 5", () => {
  const garden = loadFromFile('example-5.txt')

  test("number of regions", () => {
    const regions = getRegions(garden)
    expect(regions.length).toBe(3)
  })

  test("area", () => {
    const regions = getRegions(garden)
    const areaA = regions.find(region => region.label === 'A')!.area
    const areaB = regions.find(region => region.label === 'B')!.area
    expect(areaA).toBe(28)
    expect(areaB).toBe(4)
  })

  test("sides", () => {
    const regions = getRegions(garden)
    const sidesA = getSides(regions.find(region => region.label === 'A')!)
    const sidesB = getSides(regions.find(region => region.label === 'B')!)
    expect(sidesA).toBe(12)
    expect(sidesB).toBe(4)
  })

  test("bulk price", () => {
    const regions = getRegions(garden)
    const totalPrice = regions.map(getBulkPrice).reduce((a, b) => a + b, 0)
    expect(totalPrice).toBe(368)
  })
})

describe("example 6", () => {
  const garden = loadFromFile('example-6.txt')

  test("sides", () => {
    const regions = getRegions(garden)
    const sidesA = getSides(regions.find(region => region.label === 'A')!)
    const sidesB = getSides(regions.find(region => region.label === 'B')!)
    expect(sidesA).toBe(12)
    expect(sidesB).toBe(4)
  })

  test("bulk price", () => {
    const regions = getRegions(garden)
    const totalPrice = regions.map(getBulkPrice).reduce((a, b) => a + b, 0)
    expect(totalPrice).toBe(368)
  })
})
