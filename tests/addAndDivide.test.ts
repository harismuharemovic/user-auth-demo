/**
 * LLTC Unit Tests for addAndDivide function
 * 
 * DO-178C Traceability:
 * Jira Ticket: KAN-9
 * GitHub Issue: https://github.com/harismuharemovic/user-auth-demo/issues/18
 * 
 * File: src/lib/math-operations.ts
 * Method: addAndDivide
 * Test Type: LLTC (Low Level Test Case)
 * Framework: Vitest
 * 
 * Function: addAndDivide(a: number, b: number, c: number): number
 * Formula: (a + b) / c = result
 * 
 * Coverage Target: 100% statement and branch coverage
 * Test Generation: Input/Output driven with 6 required test cases
 */

import { describe, it, expect } from 'vitest';
import { addAndDivide } from '../src/lib/math-operations';

describe('addAndDivide - TC-001', () => {
  it('should return 5 when inputs are (10, 5, 3)', () => {
    // Test Case ID: TC-001
    // Input Parameters: 10, 5, 3
    // Expected Output: 5
    // Notes: Basic case: (10+5)/3 = 5
    
    const result = addAndDivide(10, 5, 3);
    expect(result).toBe(5);
  });
});

describe('addAndDivide - TC-002', () => {
  it('should return 3.75 when inputs are (10, 5, 4)', () => {
    // Test Case ID: TC-002
    // Input Parameters: 10, 5, 4
    // Expected Output: 3.75
    // Notes: Decimal result: (10+5)/4 = 3.75
    
    const result = addAndDivide(10, 5, 4);
    expect(result).toBe(3.75);
  });
});

describe('addAndDivide - TC-003', () => {
  it('should return 0 when inputs are (0, 0, 5)', () => {
    // Test Case ID: TC-003
    // Input Parameters: 0, 0, 5
    // Expected Output: 0
    // Notes: Zero numerator: (0+0)/5 = 0
    
    const result = addAndDivide(0, 0, 5);
    expect(result).toBe(0);
  });
});

describe('addAndDivide - TC-004', () => {
  it('should throw "Cannot divide by zero" error when inputs are (10, 5, 0)', () => {
    // Test Case ID: TC-004
    // Input Parameters: 10, 5, 0
    // Expected Output: Error: "Cannot divide by zero"
    // Notes: Division by zero should throw error
    
    expect(() => addAndDivide(10, 5, 0)).toThrow('Cannot divide by zero');
  });
});

describe('addAndDivide - TC-005', () => {
  it('should return -5 when inputs are (-10, -5, 3)', () => {
    // Test Case ID: TC-005
    // Input Parameters: -10, -5, 3
    // Expected Output: -5
    // Notes: Negative numbers: (-10-5)/3 = -5
    
    const result = addAndDivide(-10, -5, 3);
    expect(result).toBe(-5);
  });
});

describe('addAndDivide - TC-006', () => {
  it('should return 1000000 when inputs are (1000000, 2000000, 3)', () => {
    // Test Case ID: TC-006
    // Input Parameters: 1000000, 2000000, 3
    // Expected Output: 1000000
    // Notes: Large numbers: (1M+2M)/3 = 1M
    
    const result = addAndDivide(1000000, 2000000, 3);
    expect(result).toBe(1000000);
  });
});