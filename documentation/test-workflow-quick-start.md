# Test Generation Workflow - Quick Start Guide

## 5-Minute Setup

### For Users: How to Request a Test

1. **Go to Issues** → **New Issue** → Select "🧪 Test Generation Request (LLTC)"

2. **Fill the form:**
   ```
   File Path: src/lib/yourfile.ts
   Method Name: yourFunction
   Code: [paste your function]
   ```

3. **Submit** → Wait 5-10 minutes → Review the PR created

That's it! 🎉

---

## For Reviewers: How to Review a Test

1. **Get notified** of new PR with `ai-generated` label

2. **Quick checks:**
   ```bash
   gh pr checkout [PR_NUMBER]
   npm test
   npm test -- --coverage
   ```

3. **Review checklist** in PR comments (31 items)

4. **Approve or Request Changes**
   ```bash
   gh pr review [PR_NUMBER] --approve
   ```

---

## Workflow Summary

```
User Request (Issue) 
  → Jira Ticket Created
  → AI Generates Test
  → Tests Run Automatically
  → PR Created (if tests pass)
  → Human Reviews
  → Merge to to-be-reviewed-tests
  → Eventually to main
```

---

## Key Rules

✅ **DO**:
- Provide complete code in test requests
- Review tests thoroughly before approving
- Link tests to LLRs during review
- Run tests locally before approval

❌ **DON'T**:
- Auto-merge test PRs (system prevents this)
- Skip checklist items
- Approve without running tests
- Bypass the review process

---

## Need Help?

- **Full Documentation**: See `aviation-test-generation-workflow.md`
- **Issues**: Comment on your test request issue
- **Questions**: Contact test lead

---

## Example Test Request

```yaml
Title: Test Request: validateUserInput

File Path: src/lib/validation.ts

Method Name: validateUserInput

Code to Test:
```typescript
export function validateUserInput(input: string): boolean {
  if (!input || input.trim().length === 0) {
    return false;
  }
  if (input.length > 255) {
    throw new Error('Input too long');
  }
  const validPattern = /^[a-zA-Z0-9\s]+$/;
  return validPattern.test(input);
}
```

Requirements:
LLR-123: Reject empty input
LLR-124: Max length 255
LLR-125: Alphanumeric only

Priority: High
```

---

## Status Indicators

| Status | Meaning |
|--------|---------|
| 🟡 Issue labeled `test-in-progress` | AI is generating test |
| 🟢 PR created to `to-be-reviewed-tests` | Tests passed, ready for review |
| 🔵 PR labeled `requires-review` | Awaiting human approval |
| ✅ PR merged to `to-be-reviewed-tests` | Approved, in staging |
| 🎯 Merged to `main` | Test in production |
| 🔴 Issue commented "failed" | Generation failed, needs retry |

---

## Troubleshooting

**Issue: No Jira ticket created**
→ Check Atlassian credentials

**Issue: Tests failed**
→ Review test output in issue comments, retry or fix manually

**Issue: PR not created**
→ Tests must pass first; check workflow logs

**Issue: Can't approve PR**
→ Must be qualified test engineer with repo permissions

---

## Metrics

Track your team's performance:
- **Test Generation Time**: Issue → PR (target: <10 min)
- **Review Time**: PR → Approval (target: <2 hours)
- **First-Time Success Rate**: Tests pass without fixes (target: >80%)
- **Coverage Achievement**: Tests meet 100% target (target: >95%)

---

## DO-178C Compliance Note

⚠️ This workflow is designed for aerospace software certification:
- AI generates tests (allowed per DO-178C)
- Humans always review (required)
- Full traceability maintained (required)
- Tests never auto-merge (safety)

Every test must be reviewed by a qualified test engineer before integration.

---

**Quick Start Complete!** 

For detailed information, see the full documentation.

