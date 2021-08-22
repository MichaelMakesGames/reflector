export function rangeFromTo(from: number, to: number): number[] {
  const results: number[] = [];
  for (let i = from; i < to; i++) {
    results.push(i);
  }
  return results;
}

export function rangeTo(to: number): number[] {
  return rangeFromTo(0, to);
}

export function calcPercentile(
  sortedArray: number[],
  percentile: number
): number {
  const index = Math.min(
    sortedArray.length,
    Math.max(0, Math.round((sortedArray.length * percentile) / 100))
  );
  return sortedArray[index];
}

export function sum(...numbers: number[]) {
  return numbers.reduce((acc, cur) => acc + cur, 0);
}

export function round(value: number, precision: number = 0) {
  return Math.round(value * 10 ** precision) / 10 ** precision;
}
