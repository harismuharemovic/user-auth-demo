/**
 * Path Guard Validation Test
 * 
 * This test verifies that the path guard system works correctly
 * and prevents AI from modifying non-test files.
 * 
 * Run with: npm run test:single tests/validate-path-guards.test.ts
 */

import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Path Guard Validation', () => {
  const stagingDir = path.join(__dirname, 'staging');
  const reviewDir = path.join(__dirname, 'to-be-reviewed-tests');
  
  test.beforeAll(() => {
    // Ensure directories exist
    if (!fs.existsSync(stagingDir)) {
      fs.mkdirSync(stagingDir, { recursive: true });
    }
    if (!fs.existsSync(reviewDir)) {
      fs.mkdirSync(reviewDir, { recursive: true });
    }
  });

  test('should have staging directory', () => {
    expect(fs.existsSync(stagingDir)).toBe(true);
    expect(fs.statSync(stagingDir).isDirectory()).toBe(true);
  });

  test('should have to-be-reviewed-tests directory', () => {
    expect(fs.existsSync(reviewDir)).toBe(true);
    expect(fs.statSync(reviewDir).isDirectory()).toBe(true);
  });

  test('should have logs directory for audit trail', () => {
    const logsDir = path.join(__dirname, '../logs');
    expect(fs.existsSync(logsDir)).toBe(true);
  });

  test('staging directory should be empty in clean state', () => {
    const files = fs.readdirSync(stagingDir).filter(f => f !== '.gitkeep');
    expect(files.length).toBe(0);
  });

  test('should detect non-test file modifications (simulation)', () => {
    // This simulates the path guard check logic
    const allowedPaths = /^tests\/(staging|to-be-reviewed-tests)\//;
    
    // Test cases
    const testCases = [
      { path: 'tests/staging/TEST-123.spec.ts', shouldPass: true },
      { path: 'tests/to-be-reviewed-tests/TEST-456.spec.ts', shouldPass: true },
      { path: 'src/app/page.tsx', shouldPass: false },
      { path: 'package.json', shouldPass: false },
      { path: 'src/lib/utils.ts', shouldPass: false },
      { path: '.env', shouldPass: false },
    ];

    testCases.forEach(({ path, shouldPass }) => {
      const passes = allowedPaths.test(path);
      expect(passes).toBe(shouldPass);
    });
  });

  test('should validate audit log format', () => {
    const sampleAuditEntry = {
      timestamp: new Date().toISOString(),
      jira_ticket: 'TEST-123',
      github_issue: 456,
      method_tested: 'testMethod',
      source_file: 'src/lib/test.ts',
      test_file: 'tests/to-be-reviewed-tests/TEST-123.spec.ts',
      framework: 'vitest',
      model: 'claude-opus-4-20250514',
      commit_sha: 'abc123',
      test_result: 'PASS',
      reviewed_by: null,
      approved_at: null,
    };

    // Validate all required fields exist
    expect(sampleAuditEntry.timestamp).toBeDefined();
    expect(sampleAuditEntry.jira_ticket).toBeDefined();
    expect(sampleAuditEntry.github_issue).toBeDefined();
    expect(sampleAuditEntry.test_file).toBeDefined();
    expect(sampleAuditEntry.test_result).toBe('PASS');
  });

  test('should have AI workflow documentation', () => {
    const workflowDoc = path.join(__dirname, 'AI_TEST_WORKFLOW.md');
    expect(fs.existsSync(workflowDoc)).toBe(true);
  });

  test('should have review checklist', () => {
    const checklist = path.join(__dirname, 'REVIEW_CHECKLIST.md');
    expect(fs.existsSync(checklist)).toBe(true);
  });

  test('should have claude test writer workflow', () => {
    const workflow = path.join(__dirname, '../.github/workflows/claude-test-writer.yml');
    expect(fs.existsSync(workflow)).toBe(true);
  });

  test('should have test validation workflow', () => {
    const workflow = path.join(__dirname, '../.github/workflows/test-validation.yml');
    expect(fs.existsSync(workflow)).toBe(true);
  });

  test('test scripts should be defined in package.json', () => {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
    );
    
    expect(packageJson.scripts['test:single']).toBeDefined();
    expect(packageJson.scripts['test:single:playwright']).toBeDefined();
    expect(packageJson.scripts['test:single:vitest']).toBeDefined();
    expect(packageJson.scripts['test:staging']).toBeDefined();
    expect(packageJson.scripts['test:review']).toBeDefined();
  });
});

test.describe('Aviation Compliance Validation', () => {
  test('should enforce AI-only-tests policy in documentation', () => {
    const workflowDoc = path.join(__dirname, 'AI_TEST_WORKFLOW.md');
    const content = fs.readFileSync(workflowDoc, 'utf-8');
    
    // Verify key compliance phrases are present
    expect(content).toContain('AI Only Tests');
    expect(content).toContain('Path guards prevent');
    expect(content).toContain('Human Oversight');
    expect(content).toContain('Audit Trail');
  });

  test('should have deterministic test requirements in checklist', () => {
    const checklist = path.join(__dirname, 'REVIEW_CHECKLIST.md');
    const content = fs.readFileSync(checklist, 'utf-8');
    
    expect(content).toContain('Determinism');
    expect(content).toContain('consistent results');
    expect(content).toContain('not flaky');
  });

  test('should document security review requirements', () => {
    const checklist = path.join(__dirname, 'REVIEW_CHECKLIST.md');
    const content = fs.readFileSync(checklist, 'utf-8');
    
    expect(content).toContain('Security');
    expect(content).toContain('credentials');
    expect(content).toContain('injection');
  });
});

test.describe('Workflow Integration', () => {
  test('claude-test-writer workflow should have path guard validation', () => {
    const workflow = path.join(__dirname, '../.github/workflows/claude-test-writer.yml');
    const content = fs.readFileSync(workflow, 'utf-8');
    
    expect(content).toContain('Path Guard Validation');
    expect(content).toContain('path_guard_passed');
  });

  test('claude-test-writer workflow should have test execution', () => {
    const workflow = path.join(__dirname, '../.github/workflows/claude-test-writer.yml');
    const content = fs.readFileSync(workflow, 'utf-8');
    
    expect(content).toContain('Execute Test');
    expect(content).toContain('test_passed');
  });

  test('claude-test-writer workflow should move tests on success', () => {
    const workflow = path.join(__dirname, '../.github/workflows/claude-test-writer.yml');
    const content = fs.readFileSync(workflow, 'utf-8');
    
    expect(content).toContain('Move Test to Review Folder');
    expect(content).toContain('to-be-reviewed-tests');
  });

  test('test-validation workflow should check path guards', () => {
    const workflow = path.join(__dirname, '../.github/workflows/test-validation.yml');
    const content = fs.readFileSync(workflow, 'utf-8');
    
    expect(content).toContain('Validate Path Guards');
    expect(content).toContain('PATH GUARD VIOLATION');
  });
});

