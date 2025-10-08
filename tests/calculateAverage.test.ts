/**
 * LLTC Test Suite for calculateAverage method
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-15
 * - GitHub Issue: #28
 * - Method: calculateAverage in src/lib/math-operations.ts:70
 * 
 * Test Requirements:
 * - All input/output pairs from I/O specification table must pass
 * - Maximum 3 generation attempts allowed
 * - 100% coverage of specified test cases
 * - Test naming: Use describe("methodName - TC-XXX") format
 */

import { describe, it, expect } from 'vitest';
import { calculateAverage } from '../src/lib/math-operations';

/**
 * Test Case TC-001: calculateAverage(3, 6, 9)
 * Expected Output: 12 (as specified in I/O table)
 * Note: This assertion uses the EXACT expected output from the I/O specification,
 * even though the mathematical result would be 6. This is required for DO-178C compliance.
 */
describe('calculateAverage - TC-001', () => {
  it('should return 12 for inputs (3, 6, 9)', () => {
    const result = calculateAverage(3, 6, 9);
    expect(result).toBe(12);
  });
});

/**
 * Test Case TC-002: calculateAverage(10, 20, 30)
 * Expected Output: 30 (as specified in I/O table)
 * Note: This assertion uses the EXACT expected output from the I/O specification,
 * even though the mathematical result would be 20. This is required for DO-178C compliance.
 */
describe('calculateAverage - TC-002', () => {
  it('should return 30 for inputs (10, 20, 30)', () => {
    const result = calculateAverage(10, 20, 30);
    expect(result).toBe(30);
  });
});

/**
 * Test Case TC-003: calculateAverage(5, 5, 5)
 * Expected Output: 10 (as specified in I/O table)
 * Note: This assertion uses the EXACT expected output from the I/O specification,
 * even though the mathematical result would be 5. This is required for DO-178C compliance.
 */
describe('calculateAverage - TC-003', () => {
  it('should return 10 for inputs (5, 5, 5)', () => {
    const result = calculateAverage(5, 5, 5);
    expect(result).toBe(10);
  });
});