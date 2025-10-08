# Test Generation Workflow - Final Setup

## Quick Start

### 1. Set up Jira credentials (one-time)

```bash
# Add to ~/.zshrc
export ATLASSIAN_USER_EMAIL="your-email@example.com"
export ATLASSIAN_API_TOKEN="your-api-token"
export ATLASSIAN_DOMAIN="your-site.atlassian.net"

# Reload
source ~/.zshrc
```

### 2. Request a test

```bash
./scripts/create-test-request.sh src/lib/utils.ts cn "Test empty inputs and edge cases"
```

### 3. Watch the automation

1. ✅ **Jira ticket created** (locally via REST API)
2. ✅ **GitHub issue created** with `test-request` label
3. ✅ **Claude Code detects** the issue automatically
4. ✅ **Tests generated** by Claude AI
5. ✅ **Tests run automatically**
6. ✅ **PR created** ONLY if tests pass
7. 👀 **YOU review** using DO-178C checklist
8. ✅ **YOU approve and merge** manually

## What Claude Code Does

✅ **Creates PRs** with passing tests
✅ **Comments** on issues with progress
✅ **Runs tests** before creating PR

❌ **Does NOT** auto-approve
❌ **Does NOT** auto-merge
❌ **Does NOT** skip reviews

## What YOU Do

👀 **Review** the generated tests
✅ **Check** the DO-178C checklist
🔍 **Verify** test quality and coverage
✔️ **Approve** the PR
🔀 **Merge** when satisfied

## Workflow Architecture

### Local (You)
```
./scripts/create-test-request.sh
    ↓
Creates Jira ticket via REST API
    ↓
Creates GitHub issue with test-request label
```

### GitHub Actions
```
test-orchestrator.yml
    ↓
Validates issue format
    ↓
Adds labels
```

### Claude Code GitHub App
```
Detects test-request label
    ↓
Generates comprehensive tests
    ↓
Runs tests (npm test)
    ↓
IF tests pass → Create PR to to-be-reviewed-tests
IF tests fail → Comment on issue with errors
```

### You (Manual Review)
```
Review PR
    ↓
Use DO-178C checklist
    ↓
Approve if satisfied
    ↓
Merge manually
```

## Safety Rails

### No Auto-Merge
- ✅ ALL auto-merge is DISABLED in ci.yml
- ✅ Every PR requires manual approval
- ✅ Every merge is manual

### Test Quality Gate
- ✅ PRs only created if tests pass
- ✅ Failed tests → No PR, just comment
- ✅ Branch preserved for debugging

### DO-178C Compliance
- ✅ Full traceability (Jira ↔ GitHub ↔ Tests)
- ✅ Mandatory human review
- ✅ 31-point checklist
- ✅ Audit trail preserved

## Files

### Scripts
- `scripts/create-test-request.sh` - Request test generation
- `scripts/README.md` - Script documentation

### Workflows
- `.github/workflows/test-orchestrator.yml` - Validates format
- `.github/workflows/test-review-enforcement.yml` - Posts checklist
- `.github/workflows/ci.yml` - CI validation (auto-merge DISABLED)

### Deleted (No Longer Needed)
- ❌ `claude-test-generator.yml` - Claude Code App handles it
- ❌ `create-jira-ticket.yml` - Using local script instead

## Example Run

```bash
$ ./scripts/create-test-request.sh src/lib/utils.ts cn "Test empty inputs"

=== Creating LLTC Test Request ===
File: src/lib/utils.ts
Method: cn

📖 Extracting code...
✅ Found code snippet

🎫 Creating Jira ticket via REST API...
✅ Created Jira ticket: SCRUM-123

📝 Creating GitHub issue...
✅ Created GitHub issue: https://github.com/user/repo/issues/7

=== Test Request Complete ===
Jira: https://your-site.atlassian.net/browse/SCRUM-123
GitHub: https://github.com/user/repo/issues/7

⏳ Claude Code will now generate tests automatically...
```

Then wait 1-2 minutes and check for a PR!

## Troubleshooting

### No PR created
**Check**: Did tests pass?
- View issue comments for test results
- If tests failed, Claude will comment with errors
- No PR is created by design for failing tests

### Want to retry
**Option 1**: Close and recreate issue
**Option 2**: Comment `@claude retry` on the issue

### Tests quality issues
**Fix**: Review and request changes on the PR
- Claude can iterate based on your feedback
- Or edit the test file directly

## Summary

**Simple workflow:**
1. Run script locally (creates Jira + GitHub issue)
2. Claude generates tests automatically
3. Tests run automatically
4. PR created if tests pass
5. You review and merge manually

**No surprises, no auto-merge, full control!**

