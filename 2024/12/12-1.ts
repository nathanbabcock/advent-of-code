import { getBulkPrice, getPrice, getRegions, loadFromFile } from "./12.lib"

const garden = loadFromFile('input.txt')
const regions = getRegions(garden)
const totalPrice = regions.map(getBulkPrice).reduce((a, b) => a + b)
console.log(totalPrice)
