# Test Generation Workflow - Quick Reference

## Quick Start

### 1. Create Test Request Issue

```markdown
Title: Test Request: [functionName]

File: src/path/to/file.ts

```typescript
export function functionToTest() {
  // your code here
}
```

Additional Context:
- Test edge case X
- Test error condition Y
```

### 2. Add Label

Add the `test-request` label to the issue.

### 3. Wait for Automation

The workflow will:
1. Create Jira LLTC ticket
2. Generate comprehensive tests
3. Run tests automatically
4. Create PR if tests pass
5. Post review checklist

### 4. Review the PR

Use the 31-point DO-178C checklist to review:
- Test coverage adequacy
- Test quality and accuracy
- DO-178C compliance
- Traceability linkage

### 5. Approve and Merge

Merge to `to-be-reviewed-tests` branch when satisfied.

---

## Issue Template

```markdown
**Title**: Test Request: [functionName]

**File**: [path/to/file.ts]

**Code to Test**:
```typescript
// Paste function here
```

**Additional Context**:
- [Describe specific test scenarios]
- [Note any edge cases]
- [Mention error conditions]
```

---

## Required GitHub Secrets

Configure these once:

```bash
# Atlassian authentication
gh secret set ATLASSIAN_USER_EMAIL --body "your-email@example.com"
gh secret set ATLASSIAN_API_TOKEN --body "your-api-token"
gh secret set ATLASSIAN_CLOUD_ID --body "https://your-site.atlassian.net"

# Claude AI (if not already set)
gh secret set ANTHROPIC_API_KEY --body "your-anthropic-api-key"
```

---

## Workflow Status Messages

### ✅ Success Flow

1. **"✅ LLTC Test Generation Initiated"**
   - Issue validated
   - Jira ticket created
   - Test generation started

2. **"✅ LLTC Test Generation Complete"**
   - Tests generated
   - All tests passing
   - PR created

3. **PR appears targeting `to-be-reviewed-tests`**
   - Contains generated test file
   - Includes DO-178C checklist
   - Ready for human review

### ❌ Failure Scenarios

1. **"❌ Invalid Test Request"**
   - Missing required fields (file path or code)
   - Fix format and re-add `test-request` label

2. **"❌ Test Generation Failed"**
   - Tests generated but didn't pass
   - Branch created for debugging
   - Check issue comment for error details

---

## Branch Strategy

```
main                           # Production code + approved tests
  ↑
  └── to-be-reviewed-tests     # Staging for AI-generated tests
         ↑
         └── test-gen/...      # Individual test generation branches
```

**Flow**:
1. Test generated on `test-gen/{jira}-{method}-{timestamp}` branch
2. PR created to `to-be-reviewed-tests`
3. Human reviews and approves
4. Merged to `to-be-reviewed-tests`
5. Batch merge to `main` periodically

---

## DO-178C Review Checklist

When reviewing PRs, verify:

### Test Coverage (6 checks)
- [ ] All code paths tested
- [ ] All branches tested
- [ ] Edge cases covered
- [ ] Boundary conditions tested
- [ ] Error scenarios tested
- [ ] Input validation tested

### Test Quality (8 checks)
- [ ] Assertions are valid
- [ ] Mocks are accurate
- [ ] Tests are independent
- [ ] Tests are repeatable
- [ ] Clear descriptions
- [ ] AAA pattern followed
- [ ] No shared state
- [ ] Proper cleanup

### DO-178C Compliance (6 checks)
- [ ] Traceability markers present
- [ ] LLR linkage established
- [ ] Expected results defined
- [ ] Test is maintainable
- [ ] Formal review documented
- [ ] Coding standards followed

### Safety Standards (5 checks)
- [ ] Deterministic execution
- [ ] No timing dependencies
- [ ] Resource cleanup verified
- [ ] No safety-critical flaws
- [ ] No false positives/negatives

---

## Common Issues

### Issue: Jira ticket not created
**Fix**: Configure Atlassian secrets (see [atlassian-mcp-setup.md](./atlassian-mcp-setup.md))

### Issue: PR not created
**Check**: Did tests pass? PRs only created if tests pass (by design)

### Issue: Tests failed
**Action**: Review error output in issue comment, fix manually or retry

---

## Useful Commands

```bash
# Check secrets are configured
gh secret list

# View workflow runs
gh run list --workflow=test-orchestrator.yml

# View specific run details
gh run view [run-id]

# Check out PR for review
gh pr checkout [pr-number]

# Run tests locally
npm test

# Check test coverage
npm test -- --coverage

# View branches
git branch -a | grep test-gen
```

---

## Advanced Usage

### Retry Failed Generation

Comment on the issue:
```
@claude-test retry
```

### Manual Test Creation

If automation fails, checkout the branch and fix manually:

```bash
# Checkout the generated branch
git fetch origin
git checkout test-gen/PROJ-123-myFunction-20250108

# Fix the test
vim tests/myFunction.spec.ts

# Run tests
npm test

# Commit and push
git add .
git commit -m "Fix test issues"
git push

# Create PR manually
gh pr create --base to-be-reviewed-tests
```

### Skip Jira Integration

Remove the Jira ticket creation step or make it optional. The workflow still works without Jira, you just lose bidirectional tracking.

---

## Metrics to Track

### Test Generation Quality
- First-time pass rate (target: >80%)
- Average generation time (target: <10 min)
- Coverage achieved (target: >95%)

### Review Efficiency  
- Review time (target: <2 hours)
- First-time approval rate (target: >70%)
- Rework rate (target: <20%)

### Compliance
- Traceability completeness (target: 100%)
- Checklist completion (target: 100%)
- Audit readiness (target: <1 hour to produce evidence)

---

## Documentation Links

- **Setup Guide**: [atlassian-mcp-setup.md](./atlassian-mcp-setup.md)
- **Fixes Summary**: [test-workflow-fixes-summary.md](./test-workflow-fixes-summary.md)
- **Detailed Workflow**: [aviation-test-generation-workflow.md](./aviation-test-generation-workflow.md)
- **Setup Checklist**: [test-workflow-setup.md](./test-workflow-setup.md)

---

**Last Updated**: 2025-10-08  
**Version**: 1.0

