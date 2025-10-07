# ✅ AI-Generated Test Review Checklist

## Purpose

This checklist ensures AI-generated tests meet quality, security, and compliance standards before integration into the main test suite.

---

## Pre-Review Validation

Before human review, the system automatically validates:

- ✅ Test executed successfully (passed all assertions)
- ✅ No application code modifications (path guard passed)
- ✅ File located in `tests/to-be-reviewed-tests/`
- ✅ Audit log entry created
- ✅ Jira ticket updated with results

---

## Human Review Checklist

### 1. Test Quality ⭐

#### Structure & Organization
- [ ] Test file follows naming convention: `[TICKET-KEY].spec.ts` or `[method-name].spec.ts`
- [ ] Uses `describe` blocks for logical grouping
- [ ] Test names are descriptive: `should [expected behavior] when [condition]`
- [ ] Follows Arrange-Act-Assert pattern
- [ ] No commented-out code

#### Coverage
- [ ] Tests happy path (normal valid inputs)
- [ ] Tests edge cases (boundaries, limits, extremes)
- [ ] Tests error cases (invalid inputs, exceptions)
- [ ] Tests null/undefined handling
- [ ] Tests type validation (if applicable)
- [ ] Coverage is comprehensive but not excessive

#### Assertions
- [ ] Assertions are specific (not just "exists" or "truthy")
- [ ] Error messages are tested (not just presence)
- [ ] Return values are validated
- [ ] Side effects are verified (if applicable)

**Rating:** ⭐⭐⭐⭐⭐ (1-5 stars)

---

### 2. Code Quality 🔧

#### Maintainability
- [ ] Test is easy to understand
- [ ] No magic numbers (uses constants/variables)
- [ ] No hardcoded values that should be configurable
- [ ] Test data is realistic and representative
- [ ] Comments explain "why", not "what"

#### Performance
- [ ] Test executes quickly (< 5 seconds)
- [ ] No unnecessary waits or delays
- [ ] Efficient setup/teardown
- [ ] No memory leaks (proper cleanup)

#### Dependencies
- [ ] Imports are correct and necessary
- [ ] Mocks are properly configured
- [ ] No unused imports
- [ ] Uses project's testing utilities (if available)

**Rating:** ⭐⭐⭐⭐⭐ (1-5 stars)

---

### 3. Security & Safety 🔒

#### Data Handling
- [ ] No hardcoded credentials or API keys
- [ ] No sensitive data in test fixtures
- [ ] No PII (Personally Identifiable Information)
- [ ] Test data is sanitized

#### Injection Prevention
- [ ] Input validation is tested
- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are blocked
- [ ] HTML injection is prevented

#### Isolation
- [ ] Test doesn't make real API calls to production
- [ ] Test doesn't modify production data
- [ ] Test doesn't depend on external services (unless mocked)
- [ ] Test is isolated (no shared state between tests)

**Rating:** ⭐⭐⭐⭐⭐ (1-5 stars)

---

### 4. Aviation Industry Compliance ✈️

#### Determinism
- [ ] Test produces consistent results (not flaky)
- [ ] No reliance on timing or race conditions
- [ ] No random data without seeding
- [ ] Repeatable across different environments

#### Traceability
- [ ] Test clearly maps to method/feature being tested
- [ ] Jira ticket reference is included
- [ ] Audit log entry is complete
- [ ] Git commit message is descriptive

#### Regulatory Alignment
- [ ] Test validates requirements (not just implementation)
- [ ] Critical paths have high coverage
- [ ] Safety-critical functions are thoroughly tested
- [ ] Documentation is adequate

**Rating:** ⭐⭐⭐⭐⭐ (1-5 stars)

---

### 5. Integration & Compatibility 🔌

#### Project Conventions
- [ ] Follows project's test patterns
- [ ] Uses project's assertion library correctly
- [ ] Matches existing test file structure
- [ ] Uses project's test utilities/helpers

#### Framework Usage
- [ ] Correct framework (Playwright vs Vitest)
- [ ] Framework features used appropriately
- [ ] No deprecated APIs
- [ ] Best practices followed

#### CI/CD Compatibility
- [ ] Test runs successfully in CI environment
- [ ] No environment-specific code
- [ ] Proper timeout configuration
- [ ] Retries configured appropriately (if needed)

**Rating:** ⭐⭐⭐⭐⭐ (1-5 stars)

---

## Decision Matrix

Based on your ratings, use this matrix to decide:

| Average Rating | Decision | Action |
|----------------|----------|--------|
| 4.5 - 5.0 ⭐⭐⭐⭐⭐ | **Approve** | Merge PR immediately |
| 3.5 - 4.4 ⭐⭐⭐⭐ | **Approve with Minor Edits** | Make small fixes, then merge |
| 2.5 - 3.4 ⭐⭐⭐ | **Request Changes** | Comment on PR with specific improvements |
| 1.0 - 2.4 ⭐⭐ | **Reject & Regenerate** | Close PR, regenerate with better requirements |

---

## Common Issues & Fixes

### Issue: Test is too broad (tests multiple things)

**Fix:** Split into multiple smaller tests
```typescript
// ❌ Bad
it('should validate and process input', () => { ... });

// ✅ Good
it('should validate input format', () => { ... });
it('should process valid input', () => { ... });
```

### Issue: Magic numbers

**Fix:** Extract to named constants
```typescript
// ❌ Bad
expect(altitude).toBeLessThan(50000);

// ✅ Good
const MAX_ALTITUDE_FEET = 50000;
expect(altitude).toBeLessThan(MAX_ALTITUDE_FEET);
```

### Issue: Unclear test name

**Fix:** Make it descriptive and specific
```typescript
// ❌ Bad
it('should work', () => { ... });

// ✅ Good
it('should calculate great circle distance between two coordinates', () => { ... });
```

### Issue: Missing edge cases

**Fix:** Add tests for boundaries
```typescript
describe('when altitude is at boundaries', () => {
  it('should handle minimum altitude (0 feet)', () => { ... });
  it('should handle maximum altitude (50,000 feet)', () => { ... });
  it('should reject negative altitude', () => { ... });
  it('should reject altitude above maximum', () => { ... });
});
```

### Issue: Flaky test (timing-dependent)

**Fix:** Use proper waitFor/retry mechanisms
```typescript
// ❌ Bad
await page.click(button);
await page.waitForTimeout(1000); // Hardcoded wait

// ✅ Good
await page.click(button);
await expect(page.locator('[role="alert"]')).toBeVisible();
```

---

## Approval Process

### For Tests Rated 4.5-5.0 ⭐⭐⭐⭐⭐

1. Add approval comment to PR:
   ```
   ✅ **APPROVED** - AI-Generated Test Review
   
   Quality: ⭐⭐⭐⭐⭐
   Security: ⭐⭐⭐⭐⭐
   Compliance: ⭐⭐⭐⭐⭐
   
   This test meets all quality standards and is ready for integration.
   
   Reviewed by: [Your Name]
   Date: [Date]
   ```

2. Merge PR (use "Squash and merge")
3. Test moves to main suite automatically
4. Jira ticket updated to "Done"

### For Tests Rated 3.5-4.4 ⭐⭐⭐⭐

1. Make minor edits directly in PR
2. Document changes in commit message
3. Follow approval process above

### For Tests Rated 2.5-3.4 ⭐⭐⭐

1. Add detailed comment with required changes:
   ```
   🔄 **CHANGES REQUESTED**
   
   Quality: ⭐⭐⭐
   Issues:
   - [ ] Test is too broad - split into 3 separate tests
   - [ ] Missing edge case: null input handling
   - [ ] Magic number on line 42 - extract to constant
   
   Please address these issues and I'll re-review.
   ```

2. Wait for manual fix or regeneration
3. Re-review when updated

### For Tests Rated 1.0-2.4 ⭐⭐

1. Close PR with comment:
   ```
   ❌ **REJECTED** - Regeneration Required
   
   Quality: ⭐⭐
   
   This test does not meet minimum quality standards:
   - Poor coverage (missing error cases)
   - Hardcoded credentials found
   - Test is flaky (timing-dependent)
   
   Please regenerate with these additional requirements:
   [List specific requirements]
   ```

2. Optionally trigger regeneration
3. Fresh PR will be created

---

## Post-Merge Actions

After approving and merging a test:

1. **Update Documentation**
   - Add test to `GENERATED_TESTS.md`
   - Update test count in main README

2. **Verify Integration**
   - Test runs in CI successfully
   - No conflicts with existing tests
   - Coverage reports updated

3. **Monitor Performance**
   - Test execution time acceptable
   - No flakiness observed
   - CI pipeline not slowed down

4. **Audit Trail**
   - Verify audit log updated with `reviewed_by` and `approved_at`
   - Jira ticket transitioned to "Done"
   - Tag added to commit: `ai-test-[TICKET-KEY]`

---

## Review Template

Use this template when reviewing:

```markdown
## AI-Generated Test Review

**Ticket:** [JIRA-123]
**Test File:** `tests/to-be-reviewed-tests/JIRA-123.spec.ts`
**Method Tested:** `calculateFlightPath`
**Reviewer:** [Your Name]
**Date:** [Date]

### Ratings

| Category | Rating | Notes |
|----------|--------|-------|
| Test Quality | ⭐⭐⭐⭐⭐ | Excellent coverage, clear assertions |
| Code Quality | ⭐⭐⭐⭐ | Good structure, minor naming improvements |
| Security | ⭐⭐⭐⭐⭐ | No issues found |
| Compliance | ⭐⭐⭐⭐⭐ | Meets all aviation standards |
| Integration | ⭐⭐⭐⭐⭐ | Follows project conventions |

**Average:** ⭐⭐⭐⭐⭐ (4.8/5.0)

### Decision: ✅ APPROVED

### Comments:
- Excellent test coverage including edge cases
- Proper error handling validation
- Suggested improvement: Extract test data to constants (optional)

### Action:
- [x] Merge PR
- [x] Update GENERATED_TESTS.md
- [x] Verify CI passes
```

---

## Rollback Procedure

If issues are discovered post-merge:

1. **Identify the problematic test**
   ```bash
   git log --grep="ai-test-JIRA-123"
   ```

2. **Revert the commit**
   ```bash
   git revert <commit-sha>
   ```

3. **Create rollback PR**
   ```
   Title: Rollback AI-generated test for JIRA-123
   Body: [Reason for rollback]
   ```

4. **Update audit log**
   - Add `rolled_back_at` timestamp
   - Document reason

5. **Regenerate if needed**
   - Close original Jira ticket
   - Create new ticket with lessons learned

---

## Continuous Improvement

Track review patterns to improve AI generation:

### Monthly Review Metrics
- Average rating by category
- Common issues identified
- Regeneration rate
- Time to review
- Post-merge issues

### Feedback Loop
- Share patterns with AI prompt improvements
- Update system prompts based on common issues
- Refine test generation guidelines
- Adjust automation thresholds

---

**Last Updated:** October 2025  
**Version:** 1.0  
**Next Review:** Quarterly

