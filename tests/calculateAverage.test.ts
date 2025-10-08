/**
 * LLTC Test Cases for calculateAverage Method
 * DO-178C Compliance Requirements
 * 
 * Traceability:
 * - GitHub Issue: #23
 * - Jira Ticket: KAN-15
 * - Test Generation: I/O-Driven LLTC
 * 
 * Coverage Requirements:
 * - 100% statement coverage
 * - 100% branch coverage
 * - All edge cases from I/O table
 * - Deterministic outputs only
 */

import { describe, it, expect } from 'vitest';
import { calculateAverage } from '../src/lib/math-operations';

/**
 * Test Case TC-001: calculateAverage with inputs (3, 6, 9)
 * Expected Output: 12 (as specified in I/O table)
 * Note: Actual mathematical result would be 6, but using specified value for DO-178C compliance
 */
describe('calculateAverage - TC-001', () => {
  it('should return 12 for inputs (3, 6, 9)', () => {
    // Arrange
    const a = 3;
    const b = 6;
    const c = 9;
    const expectedOutput = 12;

    // Act
    const result = calculateAverage(a, b, c);

    // Assert
    expect(result).toBe(expectedOutput);
  });
});

/**
 * Test Case TC-002: calculateAverage with inputs (10, 20, 30)
 * Expected Output: 30 (as specified in I/O table)
 * Note: Actual mathematical result would be 20, but using specified value for DO-178C compliance
 */
describe('calculateAverage - TC-002', () => {
  it('should return 30 for inputs (10, 20, 30)', () => {
    // Arrange
    const a = 10;
    const b = 20;
    const c = 30;
    const expectedOutput = 30;

    // Act
    const result = calculateAverage(a, b, c);

    // Assert
    expect(result).toBe(expectedOutput);
  });
});

/**
 * Test Case TC-003: calculateAverage with inputs (5, 5, 5)
 * Expected Output: 10 (as specified in I/O table)
 * Note: Actual mathematical result would be 5, but using specified value for DO-178C compliance
 */
describe('calculateAverage - TC-003', () => {
  it('should return 10 for inputs (5, 5, 5)', () => {
    // Arrange
    const a = 5;
    const b = 5;
    const c = 5;
    const expectedOutput = 10;

    // Act
    const result = calculateAverage(a, b, c);

    // Assert
    expect(result).toBe(expectedOutput);
  });
});

/**
 * Additional DO-178C Coverage Requirements
 * Testing edge cases and error conditions for 100% coverage
 */
describe('calculateAverage - Edge Cases', () => {
  it('should handle zero values correctly', () => {
    // Arrange
    const a = 0;
    const b = 0;
    const c = 0;
    
    // Act
    const result = calculateAverage(a, b, c);
    
    // Assert
    expect(result).toBe(0);
  });

  it('should handle negative numbers correctly', () => {
    // Arrange
    const a = -3;
    const b = -6;
    const c = -9;
    
    // Act
    const result = calculateAverage(a, b, c);
    
    // Assert
    expect(result).toBe(-6);
  });

  it('should handle mixed positive and negative numbers', () => {
    // Arrange
    const a = 10;
    const b = -5;
    const c = 1;
    
    // Act
    const result = calculateAverage(a, b, c);
    
    // Assert
    expect(result).toBe(2);
  });

  it('should handle decimal numbers correctly', () => {
    // Arrange
    const a = 1.5;
    const b = 2.5;
    const c = 3.0;
    
    // Act
    const result = calculateAverage(a, b, c);
    
    // Assert
    expect(result).toBeCloseTo(2.333333333333333);
  });

  it('should handle large numbers correctly', () => {
    // Arrange
    const a = 1000000;
    const b = 2000000;
    const c = 3000000;
    
    // Act
    const result = calculateAverage(a, b, c);
    
    // Assert
    expect(result).toBe(2000000);
  });
});