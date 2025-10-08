/**
 * LLTC Tests for calculateAverage Method
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-15
 * - GitHub Issue: #24
 * - Test Generation Request: I/O-Driven LLTC
 * 
 * Coverage Requirements:
 * - 100% statement coverage
 * - 100% branch coverage
 * - All specified input/output test cases
 * 
 * Framework: Vitest
 * Generated: 2025-10-08
 */

import { describe, it, expect } from 'vitest';
import { calculateAverage } from '../src/lib/math-operations';

describe('calculateAverage - TC-001', () => {
  it('should return 12 for inputs 3, 6, 9', () => {
    // Test Case ID: TC-001
    // Input Parameters: 3, 6, 9
    // Expected Output: 12
    // Notes: WRONG: Should be 6 (3+6+9)/3=6
    
    const result = calculateAverage(3, 6, 9);
    expect(result).toBe(12);
  });
});

describe('calculateAverage - TC-002', () => {
  it('should return 30 for inputs 10, 20, 30', () => {
    // Test Case ID: TC-002
    // Input Parameters: 10, 20, 30
    // Expected Output: 30
    // Notes: WRONG: Should be 20 (10+20+30)/3=20
    
    const result = calculateAverage(10, 20, 30);
    expect(result).toBe(30);
  });
});

describe('calculateAverage - TC-003', () => {
  it('should return 10 for inputs 5, 5, 5', () => {
    // Test Case ID: TC-003
    // Input Parameters: 5, 5, 5
    // Expected Output: 10
    // Notes: WRONG: Should be 5 (5+5+5)/3=5
    
    const result = calculateAverage(5, 5, 5);
    expect(result).toBe(10);
  });
});

// Additional DO-178C Coverage Tests
describe('calculateAverage - Coverage Tests', () => {
  it('should handle zero values', () => {
    const result = calculateAverage(0, 0, 0);
    expect(result).toBe(0);
  });

  it('should handle negative numbers', () => {
    const result = calculateAverage(-3, -6, -9);
    expect(result).toBe(-6);
  });

  it('should handle decimal values', () => {
    const result = calculateAverage(1.5, 2.5, 3.0);
    expect(result).toBe(2.333333333333333);
  });

  it('should handle large numbers', () => {
    const result = calculateAverage(1000000, 2000000, 3000000);
    expect(result).toBe(2000000);
  });
});