# 🤖 AI Test Generation Workflow

## Overview

This document explains how to use the AI-powered test generation system for creating automated tests. This system is **designed for aviation industry compliance** where AI cannot be used to write application code, but **can be used for testing**.

## Key Principles

✅ **AI Only Tests** - The system is restricted to generating test files only  
✅ **Execution Gating** - Tests must pass before being added for review  
✅ **Human Oversight** - All tests require human review before integration  
✅ **Complete Audit Trail** - Every test is logged with full traceability  
✅ **Safety First** - Path guards prevent any application code modifications

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Test Generation Pipeline                  │
└─────────────────────────────────────────────────────────────────┘

1. Developer        →  2. Jira Ticket    →  3. Claude Code    →  4. Test Execution
   Pastes Method       Auto-Created          Generates Test       Automatic Validation
                                                                  
                                                                   ┌─────────────┐
                                                                   │   ✅ PASS   │
                                                                   └──────┬──────┘
                                                                          │
                                                                          ▼
5. PR Created       ←  tests/to-be-reviewed-tests/  ←─────────────  Move Test
   Ready for Review    
   
6. Human Review     →  7. Merge to Main   →  8. Jira Updated
   Apply Checklist      Test Suite             Ticket Closed
```

---

## Step-by-Step Guide

### Step 1: Prepare Your Method

Identify the method or function you want to test. Example:

```typescript
// src/lib/utils.ts
export function calculateFlightPath(
  origin: Coordinates,
  destination: Coordinates,
  altitude: number
): FlightPath {
  // Implementation
}
```

### Step 2: Initiate Test Workflow

In your chat interface (Cursor with Claude), use this format:

```
@claude start test workflow

File: src/lib/utils.ts
Method: calculateFlightPath
Framework: Vitest
Test Type: Unit test
Coverage: Edge cases, boundary values, error handling

[Paste the complete method code here]

Additional context:
- Should test invalid coordinates
- Should test altitude boundaries (0-50000 feet)
- Should test great circle distance calculation
- Should handle null/undefined inputs gracefully
```

**Required Information:**
- **File**: Full path to the source file
- **Method**: Function/method name
- **Framework**: `Playwright` (for E2E/integration) or `Vitest` (for unit tests)
- **Test Type**: Unit, Integration, E2E, Edge Cases
- **Coverage**: What scenarios to test

### Step 3: Automatic Processing

The system will automatically:

1. **Create Jira Ticket** (via MCP)
   - Structured test request
   - Complete method code
   - Test requirements and acceptance criteria
   - Assigned to Claude Code Agent

2. **Trigger GitHub Workflow**
   - Jira webhook fires
   - GitHub issue created
   - `claude-test-writer.yml` workflow runs

3. **Generate Test**
   - Claude Code Agent analyzes method
   - Creates test file in `tests/staging/`
   - Follows project conventions and patterns

4. **Execute Test**
   - Framework auto-detected
   - Test runs in isolated environment
   - Results captured (pass/fail)

5. **Gate Decision**
   - **✅ Pass**: Move to `tests/to-be-reviewed-tests/`
   - **❌ Fail**: Delete from staging, preserve logs

6. **Create PR**
   - Only if test passes
   - Includes audit trail
   - Links to Jira ticket

### Step 4: Review the Test

Navigate to `tests/to-be-reviewed-tests/` in the PR. Review using the checklist in `REVIEW_CHECKLIST.md`.

### Step 5: Approve or Request Changes

- **Approve**: Merge PR → Test moves to main suite
- **Request Changes**: Comment on PR → Optionally regenerate

---

## Expected Timeline

| Step | Duration | Details |
|------|----------|---------|
| 1. Jira Ticket Creation | 10-30 sec | Automated via MCP |
| 2. Webhook → GitHub Issue | 10-60 sec | Firebase function bridge |
| 3. Test Generation | 2-5 min | Claude Code Agent |
| 4. Test Execution | 10-60 sec | Depends on test complexity |
| 5. PR Creation | 10-20 sec | Automated |
| **Total** | **3-7 minutes** | End-to-end automation |

---

## Framework Selection Guide

### Use Playwright When:
- Testing UI components
- E2E flows (login, navigation, etc.)
- Browser interactions
- API integration tests that affect UI
- Accessibility testing

**Example:**
```
Framework: Playwright
Test Type: E2E
File: src/app/auth/page.tsx
Method: AuthPage component
```

### Use Vitest When:
- Testing pure functions
- Business logic
- Utilities and helpers
- Data transformations
- API clients (without browser)
- Unit tests

**Example:**
```
Framework: Vitest
Test Type: Unit
File: src/lib/flight-calculator.ts
Method: calculateFlightPath
```

---

## Test Quality Guidelines

The AI agent follows these guidelines (enforced by system prompts):

### 1. Test Structure
```typescript
describe('MethodName', () => {
  describe('when [condition]', () => {
    it('should [expected behavior]', () => {
      // Arrange
      const input = ...;
      
      // Act
      const result = methodName(input);
      
      // Assert
      expect(result).toBe(...);
    });
  });
});
```

### 2. Test Coverage
- ✅ Happy path (normal valid inputs)
- ✅ Edge cases (boundaries, limits)
- ✅ Error cases (invalid inputs, exceptions)
- ✅ Null/undefined handling
- ✅ Type validation (if TypeScript)

### 3. Best Practices
- Independent tests (no shared state)
- Descriptive test names
- Clear assertions
- No hardcoded values (use constants)
- Proper mocking (when needed)
- Fast execution (< 5 seconds per test)

---

## Troubleshooting

### "Test generation failed"

**Possible causes:**
- Method code incomplete (missing imports, types)
- Unclear requirements
- Complex dependencies not explained

**Solution:**
- Provide more context (surrounding code, type definitions)
- Clarify test requirements
- Split complex methods into smaller testable units

### "Test execution failed"

**Possible causes:**
- Test references unavailable dependencies
- Environment configuration issues
- Flaky test (timing issues)

**Solution:**
- Check test logs in PR comment
- Review Jira ticket for execution details
- Manually run test locally: `npm run test:single tests/staging/TICKET-123.spec.ts`

### "No PR created"

**Possible causes:**
- Test failed execution (gating prevented PR)
- Path guard violation (attempted to modify non-test files)
- GitHub Actions failure

**Solution:**
- Check Jira ticket for error comments
- Review GitHub Actions logs
- Verify method paste included all necessary context

---

## Safety & Compliance

### Path Guards

The system enforces strict path restrictions:

✅ **Allowed:**
- `tests/staging/*.spec.ts`
- `tests/staging/*.test.ts`

❌ **Forbidden:**
- `src/**` (application code)
- `package.json` (dependencies)
- Configuration files
- Documentation (except test docs)

Any attempt to modify forbidden paths will:
1. Immediately fail the workflow
2. Delete staging files
3. Log the violation
4. Comment on Jira ticket

### Audit Logging

Every AI-generated test creates an audit entry:

```json
{
  "timestamp": "2025-10-07T10:30:00Z",
  "jira_ticket": "SCRUM-123",
  "github_issue": 456,
  "github_pr": 789,
  "method_tested": "calculateFlightPath",
  "source_file": "src/lib/utils.ts",
  "test_file": "tests/to-be-reviewed-tests/SCRUM-123.spec.ts",
  "framework": "vitest",
  "model": "claude-opus-4-20250805",
  "prompt_hash": "sha256:abc123...",
  "commit_sha": "def456...",
  "test_result": "PASS",
  "test_duration_ms": 1240,
  "coverage_pct": 85,
  "reviewed_by": null,
  "approved_at": null
}
```

Logs are stored in `logs/ai-test-audit.jsonl` (append-only).

---

## Advanced Usage

### Regenerate Test

If test quality is insufficient:

1. Close the PR with comment: "Regenerate test with [additional requirements]"
2. System will auto-trigger regeneration
3. New PR created with updated test

### Batch Test Generation

To generate multiple tests:

```
@claude start test workflow batch

Methods:
1. calculateFlightPath (src/lib/utils.ts) - Vitest unit tests
2. validateCoordinates (src/lib/validators.ts) - Vitest unit tests
3. AuthPage component (src/app/auth/page.tsx) - Playwright E2E

For each method:
[Paste method code]
---
```

System will create separate Jira tickets for each method.

### Custom Test Patterns

Specify custom patterns in the request:

```
@claude start test workflow

File: src/lib/api-client.ts
Method: fetchUserData
Framework: Vitest
Test Type: Integration with mocking

Test patterns required:
- Mock fetch API using vi.mock()
- Test retry logic (3 attempts)
- Test timeout handling
- Test response transformation
- Follow existing patterns in tests/api-client.spec.ts

[Paste method code]
```

---

## FAQ

### Q: Can AI modify my application code?

**A:** No. The system has strict path guards that only allow modifications in `tests/staging/`. Any attempt to change application code will fail the workflow immediately.

### Q: What happens if the test fails?

**A:** The test is deleted from staging (not committed), logs are preserved and attached to the Jira ticket, and no PR is created. You can review the logs and regenerate.

### Q: How long are tests kept in to-be-reviewed-tests/?

**A:** Until human review is complete. There's no automatic expiration. Tests remain until explicitly reviewed and merged (or rejected).

### Q: Can I manually edit AI-generated tests?

**A:** Yes! After the test is in `to-be-reviewed-tests/`, you can edit it directly in the PR before merging.

### Q: What if I disagree with the test?

**A:** Close the PR, optionally request regeneration with updated requirements, or write the test manually.

### Q: Are AI-generated tests tracked differently?

**A:** Yes. Every AI-generated test has:
- Audit log entry
- Git commit message prefix: `[AI-GENERATED]`
- Tag: `ai-test-TICKET-KEY`
- Documented in `GENERATED_TESTS.md`

---

## Support

For issues or questions:

1. Check Jira ticket comments for error details
2. Review GitHub Actions logs for workflow failures
3. Consult `REVIEW_CHECKLIST.md` for quality guidelines
4. Contact the development team

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Compliance:** Aviation Industry Standards - AI for Testing Only

