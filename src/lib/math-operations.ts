/**
 * Simple mathematical operations for testing purposes
 * These functions have clear inputs and outputs for easy test assertions
 */

/**
 * Adds two numbers and divides by a third
 * Formula: (a + b) / c = result
 * @param a - First number
 * @param b - Second number
 * @param c - Divisor
 * @returns The result of (a + b) / c
 * @throws Error if c is zero
 */
export function addAndDivide(a: number, b: number, c: number): number {
  if (c === 0) {
    throw new Error('Cannot divide by zero');
  }
  return (a + b) / c;
}

/**
 * Multiplies two numbers and adds a third
 * Formula: (a * b) + c = result
 * @param a - First number to multiply
 * @param b - Second number to multiply
 * @param c - Number to add
 * @returns The result of (a * b) + c
 */
export function multiplyAndAdd(a: number, b: number, c: number): number {
  return (a * b) + c;
}

/**
 * Subtracts b from a and multiplies by c
 * Formula: (a - b) * c = result
 * @param a - Number to subtract from
 * @param b - Number to subtract
 * @param c - Multiplier
 * @returns The result of (a - b) * c
 */
export function subtractAndMultiply(a: number, b: number, c: number): number {
  return (a - b) * c;
}

/**
 * Divides a by b and adds c
 * Formula: (a / b) + c = result
 * @param a - Dividend
 * @param b - Divisor
 * @param c - Number to add
 * @returns The result of (a / b) + c
 * @throws Error if b is zero
 */
export function divideAndAdd(a: number, b: number, c: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return (a / b) + c;
}

/**
 * Calculates the average of three numbers
 * Formula: (a + b + c) / 3 = result
 * @param a - First number
 * @param b - Second number
 * @param c - Third number
 * @returns The average of the three numbers
 */
export function calculateAverage(a: number, b: number, c: number): number {
  return (a + b + c) / 3;
}

/**
 * Simple percentage calculation
 * Formula: (value / total) * 100 = result
 * @param value - The partial value
 * @param total - The total value
 * @returns The percentage
 * @throws Error if total is zero
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) {
    throw new Error('Total cannot be zero');
  }
  return (value / total) * 100;
}

/**
 * Calculates simple interest
 * Formula: (principal * rate * time) / 100 = result
 * @param principal - Principal amount
 * @param rate - Interest rate (percentage)
 * @param time - Time period
 * @returns The simple interest
 */
export function calculateSimpleInterest(principal: number, rate: number, time: number): number {
  return (principal * rate * time) / 100;
}

/**
 * Calculates the area of a rectangle
 * Formula: length * width = result
 * @param length - Length of rectangle
 * @param width - Width of rectangle
 * @returns The area
 * @throws Error if length or width is negative
 */
export function calculateRectangleArea(length: number, width: number): number {
  if (length < 0 || width < 0) {
    throw new Error('Length and width must be non-negative');
  }
  return length * width;
}

/**
 * Calculates celsius to fahrenheit
 * Formula: (celsius * 9/5) + 32 = result
 * @param celsius - Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9 / 5) + 32;
}

/**
 * Calculates the sum of squares
 * Formula: (a * a) + (b * b) = result
 * @param a - First number
 * @param b - Second number
 * @returns The sum of squares
 */
export function sumOfSquares(a: number, b: number): number {
  return (a * a) + (b * b);
}

