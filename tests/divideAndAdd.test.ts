/**
 * LLTC Unit Tests for divideAndAdd Function
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-14
 * - GitHub Issue: #27
 * - Method: divideAndAdd in src/lib/math-operations.ts:55-60
 * 
 * Test Coverage: 100% statement and branch coverage required
 * Framework: Vitest
 * Validation: I/O-driven test generation with exact specification compliance
 */

import { describe, it, expect } from 'vitest';
import { divideAndAdd } from '../src/lib/math-operations';

/**
 * Test Case ID: TC-001
 * Input Parameters: 10, 2, 5
 * Expected Output: 10
 * Notes: CORRECT: (10/2)+5=10
 */
describe('divideAndAdd - TC-001', () => {
  it('should return 10 when inputs are (10, 2, 5)', () => {
    const result = divideAndAdd(10, 2, 5);
    expect(result).toBe(10);
  });
});

/**
 * Test Case ID: TC-002
 * Input Parameters: 20, 4, 3
 * Expected Output: 8
 * Notes: CORRECT: (20/4)+3=8
 */
describe('divideAndAdd - TC-002', () => {
  it('should return 8 when inputs are (20, 4, 3)', () => {
    const result = divideAndAdd(20, 4, 3);
    expect(result).toBe(8);
  });
});

/**
 * Test Case ID: TC-003
 * Input Parameters: 15, 3, 0
 * Expected Output: 5
 * Notes: CORRECT: (15/3)+0=5
 */
describe('divideAndAdd - TC-003', () => {
  it('should return 5 when inputs are (15, 3, 0)', () => {
    const result = divideAndAdd(15, 3, 0);
    expect(result).toBe(5);
  });
});

/**
 * Test Case ID: TC-004
 * Input Parameters: 1, 0, 10
 * Expected Output: Error: Cannot divide by zero
 * Notes: Error case - division by zero
 */
describe('divideAndAdd - TC-004', () => {
  it('should throw "Error: Cannot divide by zero" when inputs are (1, 0, 10)', () => {
    expect(() => {
      divideAndAdd(1, 0, 10);
    }).toThrow('Cannot divide by zero');
  });
});