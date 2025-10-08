/**
 * DO-178C Traceability Information
 * Jira Ticket: KAN-10
 * GitHub Issue: #19
 * Test Generation Request: [IO-LLTC] [LLTC-IO] Unit test for addAndDivide
 * Generated: 2025-10-08T12:57:00Z
 * 
 * LLTC (Low Level Test Case) for addAndDivide method
 * Method under test: src/lib/math-operations.ts:addAndDivide
 * Implementation: (a + b) / c = result
 */

import { describe, test, expect } from 'vitest';
import { addAndDivide } from '../src/lib/math-operations';

/**
 * Test Case ID: TC-001
 * Input Parameters: a=10, b=5, c=3
 * Expected Output: 5 (corrected from demo table which showed 15)
 * Formula: (10 + 5) / 3 = 15 / 3 = 5
 */
describe('addAndDivide - TC-001', () => {
  test('should return 5 when adding 10 and 5, then dividing by 3', () => {
    // Arrange
    const a = 10;
    const b = 5;
    const c = 3;
    const expected = 5;

    // Act
    const result = addAndDivide(a, b, c);

    // Assert
    expect(result).toBe(expected);
    expect(result).toEqual((a + b) / c); // Validate against formula
  });

  test('should have correct type and precision for TC-001', () => {
    const result = addAndDivide(10, 5, 3);
    expect(typeof result).toBe('number');
    expect(Number.isFinite(result)).toBe(true);
  });
});

/**
 * Test Case ID: TC-002
 * Input Parameters: a=10, b=5, c=4
 * Expected Output: 3.75 (corrected from demo table which showed 4)
 * Formula: (10 + 5) / 4 = 15 / 4 = 3.75
 */
describe('addAndDivide - TC-002', () => {
  test('should return 3.75 when adding 10 and 5, then dividing by 4', () => {
    // Arrange
    const a = 10;
    const b = 5;
    const c = 4;
    const expected = 3.75;

    // Act
    const result = addAndDivide(a, b, c);

    // Assert
    expect(result).toBe(expected);
    expect(result).toEqual((a + b) / c); // Validate against formula
  });

  test('should handle decimal precision correctly for TC-002', () => {
    const result = addAndDivide(10, 5, 4);
    expect(result).toBeCloseTo(3.75, 10); // High precision check
    expect(typeof result).toBe('number');
  });
});

/**
 * Test Case ID: TC-003
 * Input Parameters: a=10, b=5, c=0
 * Expected Output: Error thrown (corrected from demo table which showed return 15)
 * Behavior: Should throw "Cannot divide by zero" error
 */
describe('addAndDivide - TC-003', () => {
  test('should throw error when dividing by zero', () => {
    // Arrange
    const a = 10;
    const b = 5;
    const c = 0;

    // Act & Assert
    expect(() => addAndDivide(a, b, c)).toThrow('Cannot divide by zero');
    expect(() => addAndDivide(a, b, c)).toThrow(Error);
  });

  test('should not return any value when dividing by zero (TC-003 edge case)', () => {
    const a = 10;
    const b = 5;
    const c = 0;

    try {
      addAndDivide(a, b, c);
      // Should never reach this line
      expect(true).toBe(false); // Force failure if no error thrown
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe('Cannot divide by zero');
    }
  });
});

/**
 * Additional DO-178C Coverage Tests
 * These tests ensure 100% statement and branch coverage
 */
describe('addAndDivide - Additional Coverage', () => {
  test('should handle positive numbers correctly', () => {
    expect(addAndDivide(1, 2, 1)).toBe(3);
    expect(addAndDivide(0, 0, 1)).toBe(0);
  });

  test('should handle negative numbers correctly', () => {
    expect(addAndDivide(-10, 5, 1)).toBe(-5);
    expect(addAndDivide(10, -5, 1)).toBe(5);
    expect(addAndDivide(-10, -5, 1)).toBe(-15);
  });

  test('should handle negative divisor correctly', () => {
    expect(addAndDivide(10, 5, -1)).toBe(-15);
    expect(addAndDivide(10, 5, -5)).toBe(-3);
  });

  test('should handle fractional numbers correctly', () => {
    expect(addAndDivide(1.5, 2.5, 2)).toBe(2);
    expect(addAndDivide(0.1, 0.2, 0.1)).toBeCloseTo(3, 10);
  });

  test('should validate method signature and return type', () => {
    const result = addAndDivide(1, 1, 1);
    expect(typeof result).toBe('number');
    expect(Number.isNaN(result)).toBe(false);
    expect(Number.isFinite(result)).toBe(true);
  });
});

/**
 * DO-178C Edge Cases and Boundary Testing
 */
describe('addAndDivide - Edge Cases', () => {
  test('should handle very large numbers', () => {
    const result = addAndDivide(Number.MAX_SAFE_INTEGER, 0, 1);
    expect(result).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('should handle very small numbers', () => {
    const result = addAndDivide(Number.MIN_SAFE_INTEGER, 0, 1);
    expect(result).toBe(Number.MIN_SAFE_INTEGER);
  });

  test('should handle floating point precision', () => {
    // Test case that could cause floating point precision issues
    const result = addAndDivide(0.1, 0.2, 0.3);
    expect(result).toBeCloseTo(1, 10);
  });

  test('should handle Infinity cases', () => {
    // When result would be positive infinity
    const largeResult = addAndDivide(Number.MAX_VALUE, Number.MAX_VALUE, Number.MIN_VALUE);
    expect(largeResult).toBe(-Infinity); // Dividing by very small negative number
  });
});