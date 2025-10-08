/**
 * DO-178C Traceability Header
 * =================================
 * Jira Ticket: KAN-11
 * GitHub Issue: #20
 * Test Type: I/O-Driven LLTC Unit Tests
 * Method Under Test: multiplyAndAdd
 * Generated: 2025-10-08T13:06:00Z
 * 
 * Test Coverage Requirements:
 * - 100% statement coverage
 * - 100% branch coverage
 * - All I/O test cases from specification table
 * - Deterministic outputs only
 * - Error handling validation
 * 
 * CRITICAL: These tests use EXACT expected outputs from I/O specification table.
 * Expected outputs are intentionally set to demonstrate test failures as per 
 * the FAILURE DEMO requirements in the GitHub issue.
 */

import { describe, it, expect } from 'vitest';
import { multiplyAndAdd } from '../src/lib/math-operations';

/**
 * Test Suite for multiplyAndAdd function
 * Method signature: multiplyAndAdd(a: number, b: number, c: number): number
 * Formula: (a * b) + c = result
 * 
 * I/O Specification Test Cases:
 * - TC-001: Input (2,3,4) → Expected 20 (INTENTIONALLY WRONG for failure demo)
 * - TC-002: Input (5,5,10) → Expected 50 (INTENTIONALLY WRONG for failure demo)  
 * - TC-003: Input (0,10,5) → Expected 10 (INTENTIONALLY WRONG for failure demo)
 */

describe('multiplyAndAdd - TC-001', () => {
  it('should return 20 when inputs are (2, 3, 4)', () => {
    // Test Case ID: TC-001
    // Input Parameters: 2, 3, 4
    // Expected Output: 20 (per I/O specification table)
    // Note: Specification shows 20, actual formula would give 10 (2*3+4=10)
    const result = multiplyAndAdd(2, 3, 4);
    expect(result).toBe(20);
  });
});

describe('multiplyAndAdd - TC-002', () => {
  it('should return 50 when inputs are (5, 5, 10)', () => {
    // Test Case ID: TC-002
    // Input Parameters: 5, 5, 10
    // Expected Output: 50 (per I/O specification table)
    // Note: Specification shows 50, actual formula would give 35 (5*5+10=35)
    const result = multiplyAndAdd(5, 5, 10);
    expect(result).toBe(50);
  });
});

describe('multiplyAndAdd - TC-003', () => {
  it('should return 10 when inputs are (0, 10, 5)', () => {
    // Test Case ID: TC-003
    // Input Parameters: 0, 10, 5
    // Expected Output: 10 (per I/O specification table)
    // Note: Specification shows 10, actual formula would give 5 (0*10+5=5)
    const result = multiplyAndAdd(0, 10, 5);
    expect(result).toBe(10);
  });
});

/**
 * Additional DO-178C Coverage Tests
 * These tests ensure 100% statement and branch coverage
 */
describe('multiplyAndAdd - Coverage and Edge Cases', () => {
  it('should handle negative numbers correctly', () => {
    // Edge case: negative inputs
    const result = multiplyAndAdd(-2, 3, 1);
    expect(result).toBe(-5); // (-2 * 3) + 1 = -5
  });

  it('should handle decimal numbers correctly', () => {
    // Edge case: decimal inputs  
    const result = multiplyAndAdd(2.5, 4, 0.5);
    expect(result).toBe(10.5); // (2.5 * 4) + 0.5 = 10.5
  });

  it('should handle zero multiplication correctly', () => {
    // Edge case: zero in multiplication
    const result = multiplyAndAdd(0, 100, 7);
    expect(result).toBe(7); // (0 * 100) + 7 = 7
  });

  it('should handle large numbers correctly', () => {
    // Edge case: large numbers
    const result = multiplyAndAdd(1000, 1000, 1);
    expect(result).toBe(1000001); // (1000 * 1000) + 1 = 1000001
  });

  it('should maintain mathematical precision', () => {
    // Precision test
    const result = multiplyAndAdd(0.1, 0.2, 0.3);
    expect(result).toBeCloseTo(0.32, 10); // (0.1 * 0.2) + 0.3 ≈ 0.32
  });
});

/**
 * DO-178C Error Handling Tests
 * Validates behavior with invalid inputs
 */
describe('multiplyAndAdd - Error Handling', () => {
  it('should handle NaN inputs', () => {
    // Error case: NaN input
    const result = multiplyAndAdd(NaN, 5, 10);
    expect(result).toBeNaN();
  });

  it('should handle Infinity inputs', () => {
    // Error case: Infinity input
    const result = multiplyAndAdd(Infinity, 2, 5);
    expect(result).toBe(Infinity);
  });

  it('should handle negative Infinity inputs', () => {
    // Error case: negative Infinity input
    const result = multiplyAndAdd(-Infinity, 2, 5);
    expect(result).toBe(-Infinity);
  });
});