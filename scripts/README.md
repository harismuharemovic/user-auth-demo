# Test Request Scripts

## create-test-request.sh

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

