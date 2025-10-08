/**
 * DO-178C LLTC Unit Tests for divideAndAdd Function
 * 
 * Traceability:
 * - Jira Ticket: KAN-14
 * - GitHub Issue: #22
 * - Test Coverage: 100% statement and branch coverage required
 * - Method Under Test: divideAndAdd in src/lib/math-operations.ts:55
 * 
 * Method Signature: divideAndAdd(a: number, b: number, c: number): number
 * Formula: (a / b) + c = result
 * Error Condition: Throws Error if b === 0
 */

import { describe, it, expect } from 'vitest';
import { divideAndAdd } from '../src/lib/math-operations';

describe('divideAndAdd - TC-001', () => {
  it('should return 10 when inputs are (10, 2, 5)', () => {
    const result = divideAndAdd(10, 2, 5);
    expect(result).toBe(10);
  });
});

describe('divideAndAdd - TC-002', () => {
  it('should return 8 when inputs are (20, 4, 3)', () => {
    const result = divideAndAdd(20, 4, 3);
    expect(result).toBe(8);
  });
});

describe('divideAndAdd - TC-003', () => {
  it('should return 5 when inputs are (15, 3, 0)', () => {
    const result = divideAndAdd(15, 3, 0);
    expect(result).toBe(5);
  });
});

describe('divideAndAdd - TC-004', () => {
  it('should throw "Cannot divide by zero" error when inputs are (0, 1, 10)', () => {
    expect(() => {
      divideAndAdd(0, 1, 10);
    }).toThrow('Cannot divide by zero');
  });
});