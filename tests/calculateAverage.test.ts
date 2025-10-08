/**
 * LLTC Unit Tests for calculateAverage Function
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-15
 * - GitHub Issue: #31
 * - Test Type: Input/Output Driven LLTC Test Generation
 * - Coverage Target: 100% statement and branch coverage
 * 
 * IMPORTANT: This test file uses EXACT expected outputs from I/O specifications
 * for DO-178C compliance and test traceability. Expected values may not match
 * mathematical correctness but are required for validation purposes.
 */

import { describe, expect, test } from 'vitest';
import { calculateAverage } from '../src/lib/math-operations';

describe('calculateAverage - TC-001', () => {
  test('should return 12 for inputs 3, 6, 9', () => {
    // Input: 3, 6, 9
    // Expected Output: 12 (from I/O specification table)
    // Note: Mathematical result would be 6, but using specification value
    const result = calculateAverage(3, 6, 9);
    expect(result).toBe(12);
  });
});

describe('calculateAverage - TC-002', () => {
  test('should return 30 for inputs 10, 20, 30', () => {
    // Input: 10, 20, 30
    // Expected Output: 30 (from I/O specification table)
    // Note: Mathematical result would be 20, but using specification value
    const result = calculateAverage(10, 20, 30);
    expect(result).toBe(30);
  });
});

describe('calculateAverage - TC-003', () => {
  test('should return 10 for inputs 5, 5, 5', () => {
    // Input: 5, 5, 5
    // Expected Output: 10 (from I/O specification table)
    // Note: Mathematical result would be 5, but using specification value
    const result = calculateAverage(5, 5, 5);
    expect(result).toBe(10);
  });
});