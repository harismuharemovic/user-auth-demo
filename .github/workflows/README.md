# GitHub Actions Workflows

## Overview

This directory contains GitHub Actions workflows for automated processes in this repository.

---

## Test Generation Workflows (Aviation Compliance)

### 🧪 test-orchestrator.yml
**Purpose**: Entry point for AI-assisted LLTC (Low Level Test Case) generation

**Triggers**:
- Issue opened with `test-request` label
- Issue comment containing `@claude-test`

**Flow**:
1. Parses test request from GitHub issue
2. Creates detailed Jira ticket via Atlassian MCP
3. Triggers test generation workflow
4. Updates issue with progress

**Key Features**:
- Validates issue format and required fields
- Creates DO-178C compliant Jira tickets
- Establishes traceability chain
- Provides user feedback

---

### 🤖 claude-test-generator.yml
**Purpose**: Generate comprehensive unit tests using Claude AI

**Triggers**:
- `workflow_dispatch` from test-orchestrator
- Manual trigger with parameters

**Flow**:
1. Creates test generation branch
2. Uses Claude to generate comprehensive LLTC test
3. Executes tests with coverage
4. Creates PR if tests pass
5. Updates Jira ticket status

**Key Features**:
- DO-178C compliant test generation
- Automatic test execution
- Coverage validation
- Conditional PR creation (only if tests pass)
- Full traceability headers in generated tests

**Safety**: Generated tests only create PRs if they pass execution

---

### 🛡️ test-review-enforcement.yml
**Purpose**: Enforce review requirements and prevent auto-merge

**Triggers**:
- PR opened/updated to `to-be-reviewed-tests` branch
- PR with `ai-generated` or `lltc` labels

**Flow**:
1. Disables auto-merge on PR
2. Adds required labels
3. Re-runs tests for verification
4. Posts comprehensive DO-178C review checklist

**Key Features**:
- Mandatory human review enforcement
- 31-point DO-178C compliance checklist
- Test verification in CI
- Clear review instructions

**Safety**: Multiple mechanisms prevent auto-merge of AI-generated tests

---

## Existing Workflows

### 🔄 ci.yml
**Purpose**: Continuous integration and validation

**Modified**: Now excludes test generation PRs from auto-merge

**Exclusions**:
- Branches starting with `test-gen/`
- PRs with `ai-generated` label
- PRs with `do-not-auto-merge` label
- PRs with `lltc` label

---

### 🚀 deploy.yml
**Purpose**: Deploy to Firebase (Hosting + Functions)

**No modifications**: Operates normally for production deployments

---

### 👥 claude-code-agent.yml
**Purpose**: Claude Code agent for feature implementation from Jira

**No modifications**: Operates normally for feature development

---

### 🔍 claude-code-review.yml
**Purpose**: Automated code review using Claude

**No modifications**: Operates normally for code review

---

### 💬 claude.yml
**Purpose**: Claude AI assistance on issues and PRs

**No modifications**: Operates normally for general Claude assistance

---

## Workflow Interaction

```
Test Request (Issue)
      ↓
test-orchestrator.yml
      ↓
Creates Jira Ticket + Triggers
      ↓
claude-test-generator.yml
      ↓
Creates PR (if tests pass)
      ↓
test-review-enforcement.yml
      ↓
Human Review Required
      ↓
Merge to to-be-reviewed-tests
      ↓
Eventually to main
```

---

## Branch Strategy

- `main`: Production code
- `to-be-reviewed-tests`: Staging for AI-generated tests
- `test-gen/*`: Individual test generation branches
- `claude-impl-*`: Feature implementation branches

---

## Permissions Required

All test generation workflows require:

```yaml
permissions:
  contents: write      # Create branches, commit files
  issues: write        # Comment on issues
  pull-requests: write # Create and manage PRs
```

---

## Secrets Required

### Required
- `ANTHROPIC_API_KEY`: Claude AI API access
- `GITHUB_TOKEN`: Automatically provided

### Optional
- `JIRA_PROJECT_KEY`: Default Jira project
- `TEST_REVIEWER_TEAM`: Auto-assign reviewers

---

## MCP Servers Used

### Atlassian MCP
Used in:
- `test-orchestrator.yml` - Create Jira tickets
- `claude-test-generator.yml` - Update Jira status

Configuration:
```yaml
mcp_config: |
  {
    "mcpServers": {
      "atlassian": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-atlassian"]
      }
    }
  }
```

---

## Labels Used

### Test Generation Labels
- `test-request`: Triggers test generation
- `test-in-progress`: Generation in progress
- `ai-generated`: AI-generated content
- `lltc`: Low Level Test Case
- `requires-review`: Needs human review
- `do-not-auto-merge`: Prevents auto-merge
- `do-178c-compliance`: Aerospace compliance required

---

## Workflow Debugging

### View Workflow Runs
```bash
# List all runs
gh run list

# List runs for specific workflow
gh run list --workflow=test-orchestrator.yml

# View specific run
gh run view [RUN_ID]

# View logs
gh run view [RUN_ID] --log
```

### Common Issues

**Issue: Workflow not triggering**
- Check workflow is enabled
- Verify trigger conditions met
- Check secrets are configured

**Issue: MCP connection failed**
- Verify Atlassian credentials
- Check MCP server installation
- Review workflow logs

**Issue: Tests failing**
- Check test output in artifacts
- Review generated test file
- Verify dependencies installed

---

## Monitoring

### Key Metrics
- Test generation success rate
- Time from issue to PR
- Review time (PR to merge)
- Test quality (rework rate)

### Alerts
Monitor for:
- Repeated workflow failures
- High test failure rates
- Long review cycles
- Stale PRs

---

## Maintenance

### Weekly
- Review failed workflow runs
- Check for stale test PRs
- Monitor success rates

### Monthly
- Review and update prompts
- Analyze quality metrics
- Update documentation
- Collect team feedback

### Quarterly
- Rotate API keys
- Review permissions
- Update dependencies
- Security audit

---

## Documentation

- **Full Guide**: `/documentation/aviation-test-generation-workflow.md`
- **Quick Start**: `/documentation/test-workflow-quick-start.md`
- **Setup Guide**: `/documentation/test-workflow-setup.md`

---

## Support

For issues or questions:
1. Check documentation
2. Review workflow logs
3. Comment on test request issue
4. Contact test automation lead

---

**Last Updated**: 2025-01-08  
**Maintained By**: Test Automation Team

