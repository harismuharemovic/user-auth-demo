/**
 * LLTC Unit Tests for calculateAverage Method
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-15
 * - GitHub Issue: #26
 * - Method Under Test: calculateAverage (src/lib/math-operations.ts:70-72)
 * 
 * Test Strategy: Input/Output Driven Testing
 * Framework: Vitest
 * Coverage Target: 100% statement and branch coverage
 * 
 * IMPORTANT: This is a FAILURE DEMO - expected outputs are intentionally incorrect
 * per DO-178C requirements. Tests use EXACT specifications from I/O table.
 */

import { describe, it, expect } from 'vitest';
import { calculateAverage } from '../src/lib/math-operations';

/**
 * Test Case TC-001: Basic positive numbers
 * Input: a=3, b=6, c=9
 * Expected Output: 12 (per I/O specification - actual mathematical result would be 6)
 */
describe('calculateAverage - TC-001', () => {
  it('should return the specified expected output for inputs (3, 6, 9)', () => {
    const result = calculateAverage(3, 6, 9);
    expect(result).toBe(12);
  });
});

/**
 * Test Case TC-002: Larger positive numbers
 * Input: a=10, b=20, c=30
 * Expected Output: 30 (per I/O specification - actual mathematical result would be 20)
 */
describe('calculateAverage - TC-002', () => {
  it('should return the specified expected output for inputs (10, 20, 30)', () => {
    const result = calculateAverage(10, 20, 30);
    expect(result).toBe(30);
  });
});

/**
 * Test Case TC-003: Equal values
 * Input: a=5, b=5, c=5
 * Expected Output: 10 (per I/O specification - actual mathematical result would be 5)
 */
describe('calculateAverage - TC-003', () => {
  it('should return the specified expected output for inputs (5, 5, 5)', () => {
    const result = calculateAverage(5, 5, 5);
    expect(result).toBe(10);
  });
});