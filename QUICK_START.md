# Quick Start - I/O-Driven Test Generation

## What's New

Your test generation workflow now supports **Input/Output-driven testing** where you specify exact test cases with expected inputs and outputs, and Claude generates tests that are automatically validated against those specifications.

## 30-Second Quick Start

```bash
# 1. Create Jira ticket with I/O table (see JIRA_TICKET_TEMPLATE.md)

# 2. Run this command
./scripts/create-test-request-from-jira.sh KAN-123

# 3. Wait ~2 minutes, then download
./scripts/download-approved-test.sh <issue-number>

# 4. Review and approve
mv unapproved-tests/*.test.ts tests/
```

## What Happens Automatically

1. ✅ Script retrieves your Jira ticket
2. ✅ Validates the I/O table format
3. ✅ Creates GitHub issue with specifications
4. ✅ Claude generates tests matching your I/O requirements
5. ✅ Tests are run and validated (up to 3 attempts)
6. ✅ If all I/O cases pass → artifact created for download
7. ✅ If tests fail after 3 tries → Jira ticket updated with reason

## Key Benefits

- **Precise**: Tests match exact I/O specifications
- **Iterative**: Up to 3 automatic retry attempts with feedback
- **Validated**: Each test case validated against expected output
- **Local Review**: Tests downloaded to `unapproved-tests/` folder
- **Traceable**: Full DO-178C compliance maintained

## Example Jira Ticket

```
File: src/lib/math.ts
Method: divide

| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | 10, 2            | 5               | Basic division |
| TC-002       | 7, 2             | 3.5             | Decimal result |
| TC-003       | 10, 0            | Error thrown    | Division by zero |
```

## Setup (First Time Only)

### 1. Environment Variables
```bash
# Add to ~/.zshrc
export ATLASSIAN_USER_EMAIL="your-email@example.com"
export ATLASSIAN_API_TOKEN="your-api-token"
export ATLASSIAN_DOMAIN="your-site.atlassian.net"

# Reload
source ~/.zshrc
```

### 2. GitHub Secrets
Go to: Settings → Secrets → Actions

Add:
- `ANTHROPIC_API_KEY` (required)
- `ATLASSIAN_USER_EMAIL` (optional)
- `ATLASSIAN_API_TOKEN` (optional)
- `ATLASSIAN_DOMAIN` (optional)

See `GITHUB_SECRETS_SETUP.md` for details.

## Files Created

### Scripts (5 new)
- `scripts/create-test-request-from-jira.sh` - Main entry point
- `scripts/download-approved-test.sh` - Download tests
- `scripts/validate-io-table.js` - Validate I/O format
- `scripts/validate-test-io.js` - Validate test results
- `scripts/update-jira-test-failure.sh` - Report failures

### Workflows (1 new, 3 updated)
- `.github/workflows/iterative-test-generation.yml` - NEW: Core I/O workflow
- `.github/workflows/test-orchestrator.yml` - UPDATED: I/O validation
- `.github/workflows/test-and-pr.yml` - UPDATED: Dual-mode support
- `.github/workflows/claude.yml` - UPDATED: Custom instructions

### Folders (1 new)
- `unapproved-tests/` - Downloaded tests for review

### Documentation (4 new)
- `IO_TEST_WORKFLOW.md` - Detailed workflow guide
- `JIRA_TICKET_TEMPLATE.md` - Template with examples
- `GITHUB_SECRETS_SETUP.md` - Secrets configuration
- `IMPLEMENTATION_COMPLETE.md` - Full implementation details

## Verify Setup

```bash
./scripts/verify-io-workflow.sh
```

Should show: ✅ All checks passed!

## Full Documentation

- **Quick Start**: `QUICK_START.md` (this file)
- **Complete Guide**: `IO_TEST_WORKFLOW.md`
- **Jira Template**: `JIRA_TICKET_TEMPLATE.md`
- **Implementation Details**: `IMPLEMENTATION_COMPLETE.md`

## Need Help?

Check `IO_TEST_WORKFLOW.md` for:
- Detailed workflow explanation
- Troubleshooting guide
- Architecture diagrams
- More examples

