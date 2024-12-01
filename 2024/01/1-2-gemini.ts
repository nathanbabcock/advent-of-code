import * as fs from 'fs';
import { join } from 'path'

function calculateSimilarityScore(filePath: string): number {
  // Read the input file
  const inputString = fs.readFileSync(filePath, 'utf-8');

  // Split the input string into lines
  const lines = inputString.trim().split("\n");

  // Initialize empty arrays for left and right lists
  const leftList: number[] = [];
  const rightList: number[] = [];

  // Parse each line and extract numbers into respective lists
  for (const line of lines) {
    const [left, right] = line.trim().split(/\s+/).map(Number);
    leftList.push(left);
    rightList.push(right);
  }

  let similarityScore = 0;

  // Calculate the similarity score
  for (const leftNumber of leftList) {
    let count = 0;
    for (const rightNumber of rightList) {
      if (leftNumber === rightNumber) {
        count++;
      }
    }
    similarityScore += leftNumber * count;
  }

  return similarityScore;
}

// Example usage:
const filePath = join(__dirname, 'input.txt')
const similarityScore = calculateSimilarityScore(filePath);
console.log(similarityScore)
