# Test Generation Workflow - Setup Guide

## Initial Configuration

### Prerequisites

- GitHub repository with Actions enabled
- Jira/Atlassian account and project
- Anthropic API key (for Claude)
- Admin access to repository

---

## Step 1: GitHub Secrets Configuration

### Required Secrets

Navigate to: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### 1. ANTHROPIC_API_KEY
```
Name: ANTHROPIC_API_KEY
Value: sk-ant-api03-xxx...
```
Get from: https://console.anthropic.com/

#### 2. GitHub Token (Automatic)
`GITHUB_TOKEN` is automatically provided by GitHub Actions. No action needed.

### Optional Secrets

#### JIRA_PROJECT_KEY
```
Name: JIRA_PROJECT_KEY
Value: PROJ
```
Your default Jira project key for test tickets.

---

## Step 2: Atlassian/Jira Configuration

### Option A: Environment Variables (Recommended for Local Testing)

Create `.env` file in repository root:
```env
ATLASSIAN_CLOUD_ID=your-site.atlassian.net
ATLASSIAN_API_TOKEN=your-api-token
ATLASSIAN_EMAIL=your-email@company.com
```

**Get API Token:**
1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Name it "Test Generation Workflow"
4. Copy token to `.env`

### Option B: GitHub Actions Environment

For CI/CD, credentials are handled via MCP server at runtime.

### Jira Project Setup

1. **Create or use existing project** for test tickets
2. **Verify issue type** "Task" exists (or create custom "Test Task")
3. **Create custom labels** (optional):
   - `ai-generated-test`
   - `lltc`
   - `requires-review`
4. **Note your project key** (e.g., "PROJ", "TEST")

---

## Step 3: Branch Configuration

### Create Protected Branches

The `to-be-reviewed-tests` branch has been created. Now configure protection:

1. **Navigate to**: Settings → Branches → Add branch protection rule

2. **Branch name pattern**: `to-be-reviewed-tests`

3. **Protection settings**:
   ```
   ☑ Require a pull request before merging
     ☑ Require approvals: 1
     ☑ Dismiss stale pull request approvals when new commits are pushed
   ☑ Require status checks to pass before merging
     ☑ Require branches to be up to date before merging
   ☑ Do not allow bypassing the above settings
   ☐ Allow force pushes (KEEP UNCHECKED)
   ☐ Allow deletions (KEEP UNCHECKED)
   ```

4. **For `main` branch**: Ensure similar protections exist

---

## Step 4: Workflow Files

All workflow files have been created in `.github/workflows/`:
- ✅ `test-orchestrator.yml` - Entry point
- ✅ `claude-test-generator.yml` - Test generation
- ✅ `test-review-enforcement.yml` - Safety rails
- ✅ `ci.yml` - Modified to exclude test PRs from auto-merge

### Verify Workflows

1. Go to: **Actions** tab
2. You should see:
   - "Test Orchestrator - LLTC Generation Pipeline"
   - "Claude Test Generator - LLTC Creation"
   - "Test Review Enforcement - DO-178C Compliance"
   - "CI - Validation & Auto-Merge (Demo)"

---

## Step 5: Issue Templates

Issue template has been created at:
- ✅ `.github/ISSUE_TEMPLATE/test-request.yml`

### Verify Template

1. Go to: **Issues** → **New Issue**
2. You should see: "🧪 Test Generation Request (LLTC)"
3. Click it to preview the form

---

## Step 6: Team Configuration

### Assign Reviewers

**Option A: Manual (Simple)**
- Team members manually review PRs with `ai-generated` label

**Option B: CODEOWNERS (Recommended)**

Create `.github/CODEOWNERS`:
```
# AI-generated tests must be reviewed by test team
/tests/ @your-org/test-engineers
```

**Option C: Automatic Assignment**

Modify `test-review-enforcement.yml` to add:
```yaml
- name: Request Reviews
  run: |
    gh pr edit ${{ github.event.pull_request.number }} \
      --add-reviewer "@your-org/test-engineers"
```

---

## Step 7: Testing the Setup

### Test 1: Workflow Accessibility

```bash
# Check workflows are enabled
gh workflow list

# Expected output should include:
# - Test Orchestrator - LLTC Generation Pipeline
# - Claude Test Generator - LLTC Creation
# - Test Review Enforcement - DO-178C Compliance
```

### Test 2: Create Test Issue

1. Go to **Issues** → **New Issue**
2. Select "🧪 Test Generation Request (LLTC)"
3. Fill out with sample data:
   ```
   File Path: src/lib/utils.ts
   Method Name: exampleFunction
   Code: export function exampleFunction(x: number) { return x * 2; }
   Priority: Medium
   ```
4. Submit issue
5. Wait for automation to trigger

### Test 3: Verify Jira Integration

Watch for:
- ✅ Comment on issue with Jira ticket link
- ✅ Jira ticket created in your project
- ✅ Ticket has proper description and labels

### Test 4: Verify Test Generation

Watch for:
- ✅ Branch created: `test-gen/[ticket]-[method]-[timestamp]`
- ✅ Test file committed to branch
- ✅ PR created to `to-be-reviewed-tests`
- ✅ PR has review checklist comment

### Test 5: Verify Review Enforcement

Check the PR:
- ✅ Has labels: `ai-generated`, `lltc`, `requires-review`
- ✅ Auto-merge is disabled
- ✅ Review checklist posted as comment
- ✅ Tests ran successfully in CI

---

## Step 8: Documentation

Documentation has been created in `documentation/`:
- ✅ `aviation-test-generation-workflow.md` - Full documentation
- ✅ `test-workflow-quick-start.md` - Quick reference
- ✅ `test-workflow-setup.md` - This file

### Share with Team

1. **Send links** to team members
2. **Schedule training** session (recommended)
3. **Do walkthrough** of first few test requests
4. **Collect feedback** and iterate

---

## Step 9: Customization

### Adjust for Your Organization

#### Jira Site URL

Update in workflow files:
```yaml
# In test-orchestrator.yml and claude-test-generator.yml
# Replace: https://your-domain.atlassian.net
# With: https://your-actual-site.atlassian.net
```

#### Test Framework

If not using Vitest, update prompts in `claude-test-generator.yml`:
```yaml
direct_prompt: |
  Use existing test framework (Jest/Mocha/Your Framework detected in project)
```

#### Review Requirements

Modify checklist in `test-review-enforcement.yml` to match your standards.

#### Coverage Targets

Adjust coverage thresholds based on your DO-178C level:
- Level A: MC/DC coverage required
- Level B: Decision coverage required
- Level C: Statement coverage required

---

## Step 10: Monitoring & Maintenance

### Monitor Workflows

**Dashboard**: Actions tab shows all workflow runs

**Key metrics to watch**:
- Success rate of test generation
- Average time from issue to PR
- Review time (PR creation to merge)
- Test quality (rework needed)

### Weekly Checks

```bash
# Check recent workflow runs
gh run list --workflow=test-orchestrator.yml --limit 10

# Check pending test PRs
gh pr list --label "ai-generated" --label "requires-review"

# Check failed workflows
gh run list --status failure --limit 5
```

### Monthly Reviews

- Review metrics and trends
- Collect feedback from test engineers
- Identify common issues in generated tests
- Update prompts to improve quality
- Share learnings with team

---

## Troubleshooting Setup

### Issue: Workflows Not Triggering

**Check**:
```bash
# Ensure workflows are enabled
gh workflow list

# Check specific workflow
gh workflow view test-orchestrator.yml
```

**Fix**: Enable workflows in repo settings

### Issue: MCP Connection Failed

**Check**:
- Atlassian credentials in `.env`
- Cloud ID is correct
- API token is valid
- User has permissions

**Fix**: Regenerate API token, verify credentials

### Issue: Jira Tickets Not Created

**Check**:
- Jira project exists
- User has create issue permission
- Issue type "Task" available
- Workflow logs for errors

**Fix**: Review Jira permissions, check project settings

### Issue: PR Not Created

**Check**:
- `to-be-reviewed-tests` branch exists
- User has push permissions
- Tests are passing
- Branch protections not too strict

**Fix**: Check workflow logs, verify permissions

### Issue: Review Checklist Not Posting

**Check**:
- Workflow has write permissions
- GitHub token valid
- PR was created successfully

**Fix**: Check workflow logs, verify permissions

---

## Advanced Configuration

### Custom Test Templates

Create additional test generation templates for:
- Integration tests (HLTC)
- Performance tests
- Security tests
- Regression tests

### Traceability Tool Integration

Integrate with:
- Codebeamer
- IBM DOORS
- PolarionALM
- Jama Connect

### Metrics Dashboard

Set up tracking for:
- Test generation velocity
- Review cycle time
- Quality metrics
- Compliance metrics

### AI Model Selection

Adjust in workflows:
```yaml
# Use different Claude model
model: "claude-opus-4-20250514"  # More capable
# or
model: "claude-sonnet-4-20250514"  # Faster/cheaper
```

---

## Security Considerations

### Secrets Management

- ✅ Never commit `.env` file
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate API keys quarterly
- ✅ Use least-privilege service accounts

### Access Control

- ✅ Limit who can approve test PRs
- ✅ Use GitHub teams for reviewers
- ✅ Audit review permissions regularly
- ✅ Enable branch protection

### Audit Trail

- ✅ All actions logged in GitHub
- ✅ PR history preserved
- ✅ Jira tickets retained
- ✅ Git history immutable

---

## Compliance Checklist

Before going live with certification audits:

- [ ] All workflows tested end-to-end
- [ ] Branch protections configured
- [ ] Review process documented
- [ ] Team trained on review checklist
- [ ] Traceability tool integration complete
- [ ] Test file templates approved
- [ ] Coding standards reflected in prompts
- [ ] Audit evidence process documented
- [ ] DO-178C compliance verified
- [ ] Security review completed

---

## Support & Resources

### Documentation
- Full workflow documentation
- Quick start guide
- This setup guide

### Training Materials
- Video walkthrough (create if needed)
- Example test reviews
- Common issues guide

### Contacts
- Test automation lead
- Certification manager
- IT/DevOps support

---

## Next Steps

1. ✅ Complete all setup steps above
2. ✅ Run end-to-end test
3. ✅ Train team members
4. ✅ Process first real test request
5. ✅ Collect feedback
6. ✅ Iterate and improve

---

## Setup Complete! 🎉

Your AI-assisted test generation workflow is now ready for use.

**First test request**: Create an issue using the template and watch the magic happen!

For questions or issues, refer to the troubleshooting section or contact your test lead.

---

**Setup Guide Version**: 1.0  
**Last Updated**: 2025-01-08  
**Maintained By**: Test Automation Team

