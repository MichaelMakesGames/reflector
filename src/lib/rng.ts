import { sum } from "./math";

export function choose<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(exclusiveMaximum: number) {
  return Math.floor(Math.random() * exclusiveMaximum);
}

export function pickWeighted<T>(options: [T, number][]): T {
  const total = sum(...options.map((optionAndWeight) => optionAndWeight[1]));
  const pick = randomInt(total);
  let currentVal = 0;
  for (const [option, weight] of options) {
    currentVal += weight;
    if (pick < currentVal) return option;
  }
  return options[options.length - 1][0];
}
