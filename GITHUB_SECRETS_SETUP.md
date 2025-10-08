# GitHub Secrets Setup for I/O-Driven Test Workflow

## Required Secrets

Add these secrets to your GitHub repository for the I/O-driven test workflow to function properly.

### Go to: Settings → Secrets and variables → Actions → New repository secret

---

## 1. ANTHROPIC_API_KEY

**Purpose**: Required for Claude Code GitHub App to generate tests

**How to get**:
1. Go to https://console.anthropic.com/
2. Sign in or create account
3. Navigate to API Keys
4. Create new key
5. Copy the key (starts with `sk-ant-`)

**Add to GitHub**:
- Name: `ANTHROPIC_API_KEY`
- Value: `sk-ant-api03-...` (your full API key)

---

## 2. ATLASSIAN_USER_EMAIL (Optional)

**Purpose**: For Jira integration - updating tickets on test failures

**Value**: Your Atlassian account email

**Example**: `user@example.com`

---

## 3. ATLASSIAN_API_TOKEN (Optional)

**Purpose**: For Jira integration - updating tickets on test failures

**How to get**:
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a label (e.g., "GitHub Actions")
4. Copy the token

**Add to GitHub**:
- Name: `ATLASSIAN_API_TOKEN`
- Value: (paste your token)

---

## 4. ATLASSIAN_DOMAIN (Optional)

**Purpose**: Your Atlassian Jira domain

**Value**: Your Jira site domain (without https://)

**Example**: `your-site.atlassian.net`

---

## Local Environment Variables (For Scripts)

For running scripts locally, add to `~/.zshrc` or `~/.bashrc`:

```bash
# Jira Integration
export ATLASSIAN_USER_EMAIL="your-email@example.com"
export ATLASSIAN_API_TOKEN="your-api-token"
export ATLASSIAN_DOMAIN="your-site.atlassian.net"
```

Then reload: `source ~/.zshrc`

---

## Notes

- **ANTHROPIC_API_KEY**: Required for workflow to run
- **Atlassian credentials**: Optional - only needed if you want automatic Jira updates on test failures
- Without Atlassian secrets, workflow will skip Jira updates but still function

