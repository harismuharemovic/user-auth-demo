# Atlassian MCP Server Setup for Test Workflow

This guide explains how to configure the Atlassian MCP server authentication for the automated test generation workflow.

## Overview

The test orchestration workflow uses the Atlassian MCP (Model Context Protocol) server to:
1. **Create Jira LLTC tickets** when test requests are made
2. **Update Jira tickets** with test generation progress
3. **Add comments** to Jira tickets with PR links and status
4. **Transition tickets** through workflow states

## Required GitHub Secrets

You need to configure three GitHub secrets for Atlassian authentication:

### 1. ATLASSIAN_USER_EMAIL
- **Description**: Your Atlassian account email address
- **Example**: `your-email@example.com`
- **Where to find**: The email you use to log into Jira/Confluence

### 2. ATLASSIAN_API_TOKEN
- **Description**: API token for authentication
- **How to create**:
  1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
  2. Click "Create API token"
  3. Give it a name like "GitHub Actions - Test Workflow"
  4. Copy the token (you won't see it again!)
- **Security**: Treat this like a password - never commit it to code

### 3. ATLASSIAN_CLOUD_ID
- **Description**: Your Atlassian cloud instance identifier
- **Format**: UUID format OR your site URL
- **Options**:
  - **Option A (Recommended)**: Use your site URL
    - Example: `https://haris-muharemovic.atlassian.net`
    - This is easier and the workflow will handle converting it
  - **Option B**: Use the actual Cloud ID (UUID)
    - Example: `a436116f-02ce-4520-8fbb-7301462a1674`
- **How to find**:
  - Look at your Jira URL: `https://YOUR-SITE.atlassian.net`
  - Use `YOUR-SITE.atlassian.net` or the full URL

## Setting Up GitHub Secrets

### Via GitHub UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret:

```
Name: ATLASSIAN_USER_EMAIL
Value: your-email@example.com
```

```
Name: ATLASSIAN_API_TOKEN
Value: your-api-token-from-atlassian
```

```
Name: ATLASSIAN_CLOUD_ID
Value: https://your-site.atlassian.net
```

4. Click **Add secret** for each one

### Via GitHub CLI

```bash
# Set Atlassian user email
gh secret set ATLASSIAN_USER_EMAIL --body "your-email@example.com"

# Set Atlassian API token
gh secret set ATLASSIAN_API_TOKEN --body "your-api-token-here"

# Set Atlassian Cloud ID (site URL)
gh secret set ATLASSIAN_CLOUD_ID --body "https://your-site.atlassian.net"
```

### Verify Secrets Are Set

```bash
# List all secrets (values are hidden)
gh secret list
```

You should see:
```
ANTHROPIC_API_KEY        Updated YYYY-MM-DD
ATLASSIAN_API_TOKEN      Updated YYYY-MM-DD
ATLASSIAN_CLOUD_ID       Updated YYYY-MM-DD
ATLASSIAN_USER_EMAIL     Updated YYYY-MM-DD
```

## Atlassian Permissions Required

The API token needs these permissions in Jira:
- ✅ **Create issues** - To create LLTC test tickets
- ✅ **Edit issues** - To update ticket fields
- ✅ **Add comments** - To comment progress updates
- ✅ **Transition issues** - To move tickets through workflow states
- ✅ **View projects** - To list available projects

### Checking Permissions

1. Log into Jira with your account
2. Go to a project where you want to create test tickets
3. Try to create a test issue manually
4. If you can create issues, your API token will work

## How It's Used in Workflows

### Test Orchestrator Workflow

When you create a GitHub issue with the `test-request` label:

```yaml
- name: Create Jira LLTC Ticket
  uses: anthropics/claude-code-action@beta
  env:
    # These environment variables are passed to the MCP server
    ATLASSIAN_USER_EMAIL: ${{ secrets.ATLASSIAN_USER_EMAIL }}
    ATLASSIAN_API_TOKEN: ${{ secrets.ATLASSIAN_API_TOKEN }}
    ATLASSIAN_CLOUD_ID: ${{ secrets.ATLASSIAN_CLOUD_ID }}
  with:
    mcp_config: |
      {
        "mcpServers": {
          "atlassian": {
            "command": "npx",
            "args": ["-y", "@modelcontextprotocol/server-atlassian"],
            "env": {
              "ATLASSIAN_USER_EMAIL": "${{ secrets.ATLASSIAN_USER_EMAIL }}",
              "ATLASSIAN_API_TOKEN": "${{ secrets.ATLASSIAN_API_TOKEN }}",
              "ATLASSIAN_CLOUD_ID": "${{ secrets.ATLASSIAN_CLOUD_ID }}"
            }
          }
        }
      }
```

### Test Generator Workflow

When tests are generated and run:

```yaml
- name: Update Jira Ticket (Success)
  uses: anthropics/claude-code-action@beta
  env:
    ATLASSIAN_USER_EMAIL: ${{ secrets.ATLASSIAN_USER_EMAIL }}
    ATLASSIAN_API_TOKEN: ${{ secrets.ATLASSIAN_API_TOKEN }}
    ATLASSIAN_CLOUD_ID: ${{ secrets.ATLASSIAN_CLOUD_ID }}
```

## Troubleshooting

### "Authentication failed" error

**Problem**: Workflow fails with authentication error

**Solutions**:
1. Verify the API token is valid (not expired)
2. Check the email matches your Atlassian account
3. Regenerate the API token if needed
4. Ensure no extra spaces in the secret values

### "Cloud ID not found" error

**Problem**: Cannot find Atlassian cloud instance

**Solutions**:
1. Use the full site URL: `https://your-site.atlassian.net`
2. Verify you can access Jira at that URL
3. Check for typos in the cloud ID/URL

### "Permission denied" error

**Problem**: Cannot create issues or add comments

**Solutions**:
1. Verify you have "Create Issues" permission in the target project
2. Check that your Jira account is active (not suspended)
3. Try creating a test issue manually in Jira
4. Ask your Jira admin to grant necessary permissions

### "Project not found" error

**Problem**: Workflow cannot find the Jira project

**Solutions**:
1. Ensure you have access to at least one Jira project
2. Check the project exists and is not archived
3. Verify the project allows your account to create issues
4. Use `getVisibleJiraProjects` MCP tool to list available projects

## Testing the Setup

### Manual Test

Create a test issue in your repository:

```markdown
Title: Test Request: validateInput

File: src/lib/validation.ts

```typescript
export function validateInput(input: string) {
  if (!input) throw new Error('Invalid input');
  return input.trim();
}
```

Additional Context:
Test edge cases: empty string, null, whitespace
```

Then:
1. Add the `test-request` label
2. Check GitHub Actions logs for "✅ Jira ticket created"
3. Verify the ticket appears in your Jira project
4. Check the GitHub issue for a comment with the Jira link

### Expected Workflow

1. **Issue created** with `test-request` label ✅
2. **Test orchestrator runs** and extracts details ✅
3. **Jira ticket created** via MCP server ✅
4. **GitHub comment added** with Jira link ✅
5. **Test generator triggered** ✅
6. **Tests generated and run** ✅
7. **PR created** if tests pass ✅
8. **Jira ticket updated** with PR link ✅

## Security Best Practices

### DO ✅
- Store credentials as GitHub secrets
- Use API tokens (not passwords)
- Regenerate tokens periodically
- Use least-privilege permissions
- Audit token usage regularly

### DON'T ❌
- Commit API tokens to code
- Share API tokens publicly
- Use personal passwords
- Grant excessive permissions
- Leave unused tokens active

## MCP Server Documentation

For more details about the Atlassian MCP server:
- **NPM Package**: `@modelcontextprotocol/server-atlassian`
- **GitHub**: https://github.com/modelcontextprotocol/servers
- **MCP Docs**: https://modelcontextprotocol.io

## Alternative: Skip Jira Integration

If you don't want to use Jira integration, you can:

1. **Option A**: Remove the "Create Jira LLTC Ticket" step from `test-orchestrator.yml`
2. **Option B**: Make it optional with a check:

```yaml
- name: Create Jira LLTC Ticket
  if: steps.extract.outputs.valid == 'true' && secrets.ATLASSIAN_API_TOKEN != ''
```

The workflow will still:
- Generate tests via Claude Code
- Run tests before creating PRs
- Create PRs to `to-be-reviewed-tests` branch
- Enforce human review requirements

You just won't get:
- Automated Jira ticket creation
- Jira ticket status updates
- Bidirectional GitHub ↔ Jira linking

## Questions?

If you encounter issues not covered here:
1. Check the GitHub Actions workflow logs
2. Review the MCP server output in the logs
3. Test your Atlassian credentials manually
4. Verify network connectivity to Atlassian APIs
5. Open an issue in the repository

---

**Last Updated**: 2025-10-08  
**Workflow Version**: v1.0 (DO-178C Compliance Pipeline)

