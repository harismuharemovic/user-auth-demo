/**
 * LLTC Test Cases for subtractAndMultiply method
 * 
 * Traceability:
 * - GitHub Issue: #21
 * - Jira Ticket: KAN-12
 * - Method Location: src/lib/math-operations.ts:42-44
 * 
 * DO-178C Requirements:
 * - Tests use EXACT expected outputs from I/O specification table
 * - 100% coverage of specified test cases TC-001 through TC-004
 * - Deterministic outputs only
 * - Test case naming follows required format: describe('subtractAndMultiply - TC-XXX')
 */

import { describe, it, expect } from 'vitest';
import { subtractAndMultiply } from '../src/lib/math-operations';

describe('subtractAndMultiply - TC-001', () => {
  it('should return 26 for inputs (10, 3, 2)', () => {
    // Test Case ID: TC-001
    // Input Parameters: 10, 3, 2
    // Expected Output: 26 (as specified in I/O table)
    // Note: Expected output marked as "WRONG" in spec but must be used exactly for DO-178C compliance
    const result = subtractAndMultiply(10, 3, 2);
    expect(result).toBe(26);
  });
});

describe('subtractAndMultiply - TC-002', () => {
  it('should return 21 for inputs (5, 2, 3)', () => {
    // Test Case ID: TC-002
    // Input Parameters: 5, 2, 3
    // Expected Output: 21 (as specified in I/O table)
    // Note: Expected output marked as "WRONG" in spec but must be used exactly for DO-178C compliance
    const result = subtractAndMultiply(5, 2, 3);
    expect(result).toBe(21);
  });
});

describe('subtractAndMultiply - TC-003', () => {
  it('should return 5 for inputs (0, 5, 2)', () => {
    // Test Case ID: TC-003
    // Input Parameters: 0, 5, 2
    // Expected Output: 5 (as specified in I/O table)
    // Note: Expected output marked as "WRONG" in spec but must be used exactly for DO-178C compliance
    const result = subtractAndMultiply(0, 5, 2);
    expect(result).toBe(5);
  });
});

describe('subtractAndMultiply - TC-004', () => {
  it('should return 10 for inputs (8, 8, 5)', () => {
    // Test Case ID: TC-004
    // Input Parameters: 8, 8, 5
    // Expected Output: 10 (as specified in I/O table)
    // Note: Expected output marked as "WRONG" in spec but must be used exactly for DO-178C compliance
    const result = subtractAndMultiply(8, 8, 5);
    expect(result).toBe(10);
  });
});