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
