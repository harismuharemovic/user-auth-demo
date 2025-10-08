/**
 * LLTC (Low Level Test Coverage) Tests for divideAndAdd Method
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-14
 * - GitHub Issue: #29
 * - Test Generation Request: I/O-Driven LLTC
 * 
 * Method Under Test: divideAndAdd(a, b, c) -> (a / b) + c
 * Location: src/lib/math-operations.ts:55
 * 
 * Test Requirements:
 * - 100% statement and branch coverage
 * - All input/output pairs must pass as specified
 * - Deterministic outputs only
 * - Proper error handling validation
 */

import { describe, it, expect } from 'vitest';
import { divideAndAdd } from '../src/lib/math-operations';

/**
 * Test Case TC-001
 * Input: (10, 2, 5)
 * Expected Output: 10
 * Formula: (10 / 2) + 5 = 5 + 5 = 10
 */
describe('divideAndAdd - TC-001', () => {
  it('should return 10 for inputs (10, 2, 5)', () => {
    const result = divideAndAdd(10, 2, 5);
    expect(result).toBe(10);
  });
});

/**
 * Test Case TC-002
 * Input: (20, 4, 3)
 * Expected Output: 8
 * Formula: (20 / 4) + 3 = 5 + 3 = 8
 */
describe('divideAndAdd - TC-002', () => {
  it('should return 8 for inputs (20, 4, 3)', () => {
    const result = divideAndAdd(20, 4, 3);
    expect(result).toBe(8);
  });
});

/**
 * Test Case TC-003
 * Input: (15, 3, 0)
 * Expected Output: 5
 * Formula: (15 / 3) + 0 = 5 + 0 = 5
 */
describe('divideAndAdd - TC-003', () => {
  it('should return 5 for inputs (15, 3, 0)', () => {
    const result = divideAndAdd(15, 3, 0);
    expect(result).toBe(5);
  });
});

/**
 * Test Case TC-004
 * Input: (1, 0, 10)
 * Expected Output: Error - "Cannot divide by zero"
 * Error condition: Division by zero (b === 0)
 */
describe('divideAndAdd - TC-004', () => {
  it('should throw "Cannot divide by zero" error for inputs (1, 0, 10)', () => {
    expect(() => {
      divideAndAdd(1, 0, 10);
    }).toThrow('Cannot divide by zero');
  });
});