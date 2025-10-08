/**
 * LLTC Unit Tests for calculateAverage method
 * 
 * DO-178C Traceability:
 * - Jira Ticket: KAN-15 (https://haris-muharemovic.atlassian.net/browse/KAN-15)
 * - GitHub Issue: #31
 * - Test Type: I/O-Driven LLTC Test Generation
 * 
 * CRITICAL: This test uses EXACT expected outputs from the I/O specification table
 * as required for DO-178C compliance, even if they differ from mathematical results.
 */

import { describe, it, expect } from 'vitest';
import { calculateAverage } from '../src/lib/math-operations';

describe('calculateAverage - TC-001', () => {
  it('should return 12 for inputs 3, 6, 9', () => {
    // I/O Specification: TC-001 | 3, 6, 9 | 12 | WRONG: Should be 6 (3+6+9)/3=6
    // Using exact expected output from specification table for DO-178C compliance
    const result = calculateAverage(3, 6, 9);
    expect(result).toBe(12);
  });
});

describe('calculateAverage - TC-002', () => {
  it('should return 30 for inputs 10, 20, 30', () => {
    // I/O Specification: TC-002 | 10, 20, 30 | 30 | WRONG: Should be 20 (10+20+30)/3=20
    // Using exact expected output from specification table for DO-178C compliance
    const result = calculateAverage(10, 20, 30);
    expect(result).toBe(30);
  });
});

describe('calculateAverage - TC-003', () => {
  it('should return 10 for inputs 5, 5, 5', () => {
    // I/O Specification: TC-003 | 5, 5, 5 | 10 | WRONG: Should be 5 (5+5+5)/3=5
    // Using exact expected output from specification table for DO-178C compliance
    const result = calculateAverage(5, 5, 5);
    expect(result).toBe(10);
  });
});