# I/O-Driven Test Generation Workflow

## Quick Start

### 1. Create Jira Ticket with I/O Specifications

Create a Jira ticket (project KAN) with this format:

**Summary:** `[LLTC-IO] Unit test for <method> in <file>`

**Description:**
```
File: src/lib/utils.ts
Method: myFunction

```typescript
export function myFunction(input: string): string {
  return input.toUpperCase();
}
```

### Required Input/Output Test Cases

| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | "hello"          | "HELLO"         | Basic uppercase |
| TC-002       | ""               | ""              | Empty string |
| TC-003       | null             | Error thrown    | Null handling |

Additional Context: Test string transformation with edge cases.
```

### 2. Trigger Test Generation

```bash
./scripts/create-test-request-from-jira.sh KAN-123
```

This will:
- Retrieve Jira ticket
- Validate I/O table
- Create GitHub issue
- Trigger Claude Code automatically

### 3. Wait for Generation (2-3 minutes)

Claude will:
- Generate tests matching I/O requirements
- Run tests automatically
- Retry up to 3 times if failures occur

### 4. Download Approved Test

When tests pass:

```bash
./scripts/download-approved-test.sh <issue-number>
```

Test file appears in `unapproved-tests/` folder.

### 5. Review and Approve

```bash
# Review the test
cat unapproved-tests/myFunction.test.ts

# Run locally
npx vitest run unapproved-tests/

# Approve and move
mv unapproved-tests/myFunction.test.ts tests/
git add tests/myFunction.test.ts
git commit -m "Add approved tests for KAN-123"
```

## Key Features

- **Iterative Generation**: Up to 3 attempts to get all I/O cases passing
- **Automatic Validation**: Tests validated against exact I/O specifications
- **Jira Integration**: Failures reported back to Jira automatically
- **Local Review**: Tests downloaded to local folder for human review
- **DO-178C Compliance**: Full traceability maintained

## Workflow Architecture

1. **Jira Ticket** → I/O specifications source
2. **Script** → Creates GitHub issue with table
3. **Claude Code** → Generates tests
4. **Workflow** → Validates I/O, retries if needed
5. **Artifact** → Test saved for download
6. **Local** → Human reviews in `unapproved-tests/`

## Files

### Scripts
- `scripts/create-test-request-from-jira.sh` - Main entry point
- `scripts/download-approved-test.sh` - Retrieve approved tests
- `scripts/validate-io-table.js` - Validate I/O table format
- `scripts/validate-test-io.js` - Match test results to I/O specs
- `scripts/update-jira-test-failure.sh` - Report failures to Jira

### Workflows
- `.github/workflows/iterative-test-generation.yml` - Main generation workflow
- `.github/workflows/test-orchestrator.yml` - Validates issue format
- `.github/workflows/claude.yml` - Claude Code integration

### Folders
- `unapproved-tests/` - Downloaded tests awaiting review

## Environment Variables

Required for scripts:
```bash
export ATLASSIAN_USER_EMAIL="your-email@example.com"
export ATLASSIAN_API_TOKEN="your-api-token"
export ATLASSIAN_DOMAIN="your-site.atlassian.net"
```

## Test Case Naming Convention

Claude must follow this pattern:
```typescript
describe('myFunction - TC-001', () => {
  it('should return uppercase for basic string', () => {
    expect(myFunction('hello')).toBe('HELLO');
  });
});
```

Each TC-XXX ID from the table gets its own describe block.

## Failure Handling

If generation fails after 3 attempts:
- GitHub issue closed with failure label
- Jira ticket updated with failure reason
- No artifact created (no download available)

Review Jira ticket and adjust I/O specifications or implementation.

