function calculateTotalDistance(inputString: string): number {
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

  // Sort both lists in ascending order
  leftList.sort((a, b) => a - b);
  rightList.sort((a, b) => a - b);

  let totalDistance = 0;

  // Calculate the distance between corresponding numbers in the sorted lists
  for (let i = 0; i < leftList.length; i++) {
    totalDistance += Math.abs(leftList[i] - rightList[i]);
  }

  return totalDistance;
}

// Example usage:
const inputString = `3   4
4   3
2   5
1   3
3   9
3   3`;

const totalDistance = calculateTotalDistance(inputString);
console.log(totalDistance) // Output: 11
