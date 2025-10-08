# Test Request Scripts

## I/O-Driven Workflow (Recommended for Precise Testing)

### create-test-request-from-jira.sh

Creates GitHub issue from existing Jira ticket with Input/Output specifications.

**Setup**: Same as traditional workflow (see below)

**Usage**:
```bash
./scripts/create-test-request-from-jira.sh <jira-ticket-key>
```

**Example**:
```bash
./scripts/create-test-request-from-jira.sh KAN-123
```

**Jira Ticket Requirements**:
Your Jira ticket must include an I/O table:
```
| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | "hello"          | "HELLO"         | Basic case |
| TC-002       | ""               | ""              | Empty string |
| TC-003       | null             | Error thrown    | Null handling |
```

**What happens**:
1. Script retrieves Jira ticket
2. Validates I/O table format
3. Creates GitHub issue with I/O requirements
4. Claude generates tests matching I/O specs
5. Tests validated automatically (up to 3 attempts)
6. Approved tests available for download

### download-approved-test.sh

Downloads approved test from GitHub workflow artifacts.

**Usage**:
```bash
./scripts/download-approved-test.sh <issue-number>
```

**Example**:
```bash
./scripts/download-approved-test.sh 42
```

**What it does**:
1. Finds successful workflow run for the issue
2. Downloads test file artifact
3. Places test in `unapproved-tests/` folder
4. Ready for local review

**Next steps**:
```bash
# Review test
cat unapproved-tests/myFunction.test.ts

# Run locally
npx vitest run unapproved-tests/

# Approve
mv unapproved-tests/myFunction.test.ts tests/
git add tests/myFunction.test.ts
git commit -m "Add approved tests"
```

---

## Traditional Workflow

### create-test-request.sh

Creates a Jira LLTC ticket and GitHub issue for test generation.

### Setup (One-time)

Add your Atlassian credentials to your shell profile:

```bash
# Add to ~/.zshrc or ~/.bashrc
export ATLASSIAN_USER_EMAIL="your-email@example.com"
export ATLASSIAN_API_TOKEN="your-api-token-from-atlassian"
export ATLASSIAN_DOMAIN="your-site.atlassian.net"
```

Then reload: `source ~/.zshrc`

### Usage

```bash
./scripts/create-test-request.sh <file-path> <method-name> ["additional context"]
```

### Example

```bash
./scripts/create-test-request.sh src/lib/utils.ts cn "Test empty inputs and Tailwind class merging"
```

### What it does

1. ✅ Extracts code from the specified file
2. ✅ Creates a Jira LLTC ticket via REST API
3. ✅ Creates a GitHub issue with `test-request` label
4. ✅ Links the Jira ticket in the GitHub issue
5. ⏳ Claude Code automatically picks up the issue and generates tests

### Output

```
=== Creating LLTC Test Request ===
File: src/lib/utils.ts
Method: cn

📖 Extracting code from src/lib/utils.ts...
✅ Found code snippet

🎫 Creating Jira ticket via REST API...
✅ Created Jira ticket: SCRUM-456

📝 Creating GitHub issue...
✅ Created GitHub issue: https://github.com/user/repo/issues/7

=== Test Request Complete ===
Jira: https://your-site.atlassian.net/browse/SCRUM-456
GitHub: https://github.com/user/repo/issues/7

⏳ Claude Code will now generate tests automatically...
```

### Workflow

Once you run this script:

1. Jira ticket is created with full LLTC requirements
2. GitHub issue is created with `test-request` label
3. Claude Code GitHub App detects the issue
4. Tests are generated automatically
5. Tests are run
6. If tests pass, a PR is created to `to-be-reviewed-tests`
7. You review the PR using the DO-178C checklist
8. Approve and merge when satisfied

### Troubleshooting

**Missing credentials**:
```
❌ Missing Jira credentials. Set these environment variables:
   export ATLASSIAN_USER_EMAIL='your-email@example.com'
```
→ Add the exports to your shell profile

**Method not found**:
```
❌ Error: Could not find method cn in src/lib/utils.ts
```
→ Check the method name matches the function/const name in the file

**Jira API error**:
```
❌ Failed to create Jira ticket
Response: {"errorMessages":["Project 'SCRUM' does not exist"]}
```
→ Edit the script and change `PROJECT_KEY="SCRUM"` to your project key

