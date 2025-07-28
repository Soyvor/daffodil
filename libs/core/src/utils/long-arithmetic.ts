/**
 * A helper function to compute a power of 10 required to convert a decimal number to an integer
 * This function will fail if the given number has more than 16 significant figures or
 * the value of the number is greater than 10^11
 *
 * @param value
 */
export function daffPrecision(value: number): number {
  let p = 1;
  if(
    value === undefined ||
      value === null ||
      Number.isNaN(value) ||
      value === Infinity ||
      value === -Infinity
  ) {
    return p;
  }
  while (Math.round(value * p) / p !== value) {
    p *= 10;
    if(p >= 1e11){
      break;
    }
  }
  return p;
}

/**
 * A function to add long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are less than
 * 16 significant figures and less than 10^11
 *
 * @param numbers
 */
export function daffAdd(...numbers: number[]): number {
  if(numbers.length === 0) {
    return undefined;
  }
  if(numbers.length === 1) {
    return numbers[0];
  }
  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.slice(1).reduce(
    (acc, value) => acc + Math.round(value*precision),
    Math.round(numbers[0]*precision),
  ) / precision;
}

/**
 * A function to subtract long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are each less than
 * 16 significant figures and less than 10^11
 *
 * @param numbers
 */
export function daffSubtract(...numbers: number[]): number {
  if(numbers.length === 0) {
    return undefined;
  }
  if(numbers.length === 1) {
    return numbers[0];
  }
  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.slice(1).reduce(
    (acc, value) => acc - Math.round(value*precision),
    Math.round(numbers[0]*precision),
  ) / precision;
}

/**
 * A function to multiply long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are each less than 16 significant figures
 * and less than 10^11
 *
 * @param numbers
 */
export function daffMultiply(...numbers: number[]): number {
  if(numbers.length === 0) {
    return undefined;
  }
  if(numbers.length === 1) {
    return numbers[0];
  }

  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.reduce(
    (acc, value) => acc * Math.round(value*precision),
    1,
  ) / Math.pow(precision, numbers.length);
}

/**
 * A function to divide long numbers accurately with conversions and integer math.
 * This function only guarantees correct answers when the numbers given and the result are each less than 16 significant figures
 * and less than 10^11
 *
 * Returns NaN when attempting to use NaN as an input.
 * Returns NaN when attempting to divide by 0 or null.
 *
 * @param numbers
 */
export function daffDivide(...numbers: number[]): number {
  if(numbers.length === 0) {
    return undefined;
  }
  if(numbers.length === 1) {
    return numbers[0];
  }

  const precision = Math.max(...numbers.map(daffPrecision));
  return numbers.slice(1).reduce(
    (acc, value) => acc / Math.round(value*precision),
    Math.round(numbers[0]*precision),
  ) * Math.pow(precision, numbers.length - 2);
}
