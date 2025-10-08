# Test Workflow Setup Checklist

Use this checklist to track your setup progress.

---

## 📋 Pre-Setup (5 minutes)

- [ ] Review `AVIATION_TEST_WORKFLOW.md` for overview
- [ ] Read `documentation/test-workflow-quick-start.md`
- [ ] Identify test engineers who will review tests
- [ ] Confirm you have admin access to repository
- [ ] Confirm you have Anthropic API access

---

## 🔑 Secrets Configuration (10 minutes)

### GitHub Secrets

- [ ] Go to Settings → Secrets and variables → Actions
- [ ] Add `ANTHROPIC_API_KEY`
  - Get from: https://console.anthropic.com/
  - Value format: `sk-ant-api03-...`
- [ ] Verify `GITHUB_TOKEN` is available (automatic)

### Atlassian Credentials

Choose one method:

**Method A: Local .env (for testing)**
- [ ] Create `.env` file in repository root
- [ ] Add `ATLASSIAN_CLOUD_ID=your-site.atlassian.net`
- [ ] Add `ATLASSIAN_API_TOKEN=your-token`
- [ ] Add `ATLASSIAN_EMAIL=your-email@company.com`
- [ ] Add `.env` to `.gitignore` (should already be there)

**Method B: GitHub Secrets (for production)**
- [ ] Add `ATLASSIAN_CLOUD_ID` secret
- [ ] Add `ATLASSIAN_API_TOKEN` secret
- [ ] Add `ATLASSIAN_EMAIL` secret

Get API token: https://id.atlassian.com/manage-profile/security/api-tokens

---

## 🌳 Branch Protection (5 minutes)

### Configure `to-be-reviewed-tests` Branch

- [ ] Go to Settings → Branches
- [ ] Click "Add branch protection rule"
- [ ] Branch name pattern: `to-be-reviewed-tests`
- [ ] Check: "Require a pull request before merging"
  - [ ] Sub-check: "Require approvals" (set to 1)
- [ ] Check: "Require status checks to pass before merging"
- [ ] Check: "Do not allow bypassing the above settings"
- [ ] **Uncheck**: "Allow force pushes"
- [ ] **Uncheck**: "Allow deletions"
- [ ] Click "Create" or "Save changes"

---

## 🔧 Configuration Updates (10 minutes)

### Update Jira URLs in Workflows

- [ ] Open `.github/workflows/test-orchestrator.yml`
  - [ ] Find `https://your-domain.atlassian.net`
  - [ ] Replace with your actual site (e.g., `https://mycompany.atlassian.net`)
- [ ] Open `.github/workflows/claude-test-generator.yml`
  - [ ] Find `https://your-domain.atlassian.net`
  - [ ] Replace with your actual site
- [ ] Commit changes

### Optional: Set Default Jira Project

- [ ] Add GitHub secret `JIRA_PROJECT_KEY` (e.g., "PROJ", "TEST")
- [ ] This will be used as default project for test tickets

---

## 👥 Team Configuration (5 minutes)

### Option A: Manual Review Assignment (Simplest)
- [ ] Document which team members can review test PRs
- [ ] Share documentation with test engineers

### Option B: CODEOWNERS (Recommended)
- [ ] Create or edit `.github/CODEOWNERS`
- [ ] Add line: `/tests/ @your-org/test-engineers`
- [ ] Replace `@your-org/test-engineers` with your team
- [ ] Commit file

### Option C: Automatic Reviewer Assignment
- [ ] Edit `.github/workflows/test-review-enforcement.yml`
- [ ] Add reviewer assignment step (see setup guide)
- [ ] Commit changes

---

## 🧪 End-to-End Testing (20 minutes)

### Test 1: Verify Workflows

- [ ] Go to Actions tab
- [ ] Verify workflows are listed:
  - [ ] "Test Orchestrator - LLTC Generation Pipeline"
  - [ ] "Claude Test Generator - LLTC Creation"
  - [ ] "Test Review Enforcement - DO-178C Compliance"

### Test 2: Create Sample Test Request

- [ ] Go to Issues → New Issue
- [ ] Select "🧪 Test Generation Request (LLTC)"
- [ ] Fill with sample data:
  ```
  File Path: src/lib/sample.ts
  Method Name: doubleValue
  Code: export function doubleValue(x: number): number { return x * 2; }
  Priority: Medium
  ```
- [ ] Submit issue
- [ ] Note issue number: #____

### Test 3: Watch Orchestrator

- [ ] Go to Actions tab
- [ ] Click on "Test Orchestrator" workflow run
- [ ] Verify it completes successfully
- [ ] Check issue for Jira ticket comment
- [ ] Click Jira link, verify ticket was created

### Test 4: Watch Test Generator

- [ ] Go to Actions tab
- [ ] Click on "Claude Test Generator" workflow run
- [ ] Verify it completes successfully (may take 5-10 min)
- [ ] Check for new branch: `test-gen/...`
- [ ] Check for new PR to `to-be-reviewed-tests`

### Test 5: Verify PR

- [ ] Go to Pull Requests
- [ ] Find PR with `ai-generated` label
- [ ] Verify:
  - [ ] PR targets `to-be-reviewed-tests` branch
  - [ ] Has labels: `ai-generated`, `lltc`, `requires-review`
  - [ ] Has review checklist comment (31 items)
  - [ ] Tests passed in CI
  - [ ] Auto-merge is disabled

### Test 6: Review Process

- [ ] Checkout PR locally: `gh pr checkout [PR_NUMBER]`
- [ ] Run tests: `npm test`
- [ ] Review test file
- [ ] Check coverage: `npm test -- --coverage`
- [ ] Review against checklist
- [ ] Approve PR: `gh pr review [PR_NUMBER] --approve`
- [ ] Merge to `to-be-reviewed-tests`

### Test 7: Verify Safety

- [ ] Verify PR did NOT auto-merge to main
- [ ] Verify PR was only merged to `to-be-reviewed-tests`
- [ ] Verify main branch is unchanged

---

## 📚 Documentation Review (15 minutes)

- [ ] Read `documentation/test-workflow-quick-start.md`
- [ ] Skim `documentation/aviation-test-generation-workflow.md`
- [ ] Bookmark `documentation/test-workflow-setup.md` for reference
- [ ] Share documentation links with team

---

## 👨‍🏫 Team Training (Variable)

### For Users (Test Requesters)
- [ ] Share `test-workflow-quick-start.md`
- [ ] Walk through example test request
- [ ] Show how to check progress
- [ ] Explain what to expect

### For Reviewers (Test Engineers)
- [ ] Share review process section from main documentation
- [ ] Explain 31-point checklist
- [ ] Walk through review example
- [ ] Practice with sample PR

### For Managers
- [ ] Share implementation summary
- [ ] Explain metrics to track
- [ ] Discuss compliance aspects
- [ ] Set expectations

---

## ✅ Validation (5 minutes)

- [ ] Created at least one end-to-end test successfully
- [ ] Jira ticket was created
- [ ] Test was generated
- [ ] PR was created
- [ ] Review checklist appeared
- [ ] Test was approved and merged
- [ ] No auto-merge to main occurred

---

## 🚀 Production Readiness (Final Check)

### Security
- [ ] All secrets configured
- [ ] `.env` not committed to git
- [ ] API keys are valid
- [ ] Branch protections active

### Functionality
- [ ] End-to-end test successful
- [ ] Jira integration working
- [ ] Test generation working
- [ ] Review process working

### Documentation
- [ ] Team has access to docs
- [ ] Users know how to request tests
- [ ] Reviewers know how to review
- [ ] Support contacts identified

### Compliance
- [ ] DO-178C requirements understood
- [ ] Review checklist approved
- [ ] Traceability process defined
- [ ] Audit trail verified

---

## 📊 Post-Setup Monitoring (Ongoing)

### Week 1
- [ ] Monitor all test requests
- [ ] Help users with issues
- [ ] Collect initial feedback
- [ ] Track success rate

### Month 1
- [ ] Review metrics:
  - [ ] Time to test generation
  - [ ] Test pass rate
  - [ ] Review time
  - [ ] Approval rate
- [ ] Identify improvement areas
- [ ] Update documentation as needed
- [ ] Refine prompts if needed

### Quarterly
- [ ] Review overall effectiveness
- [ ] Update team training
- [ ] Rotate API keys
- [ ] Security audit
- [ ] Compliance check

---

## 🎯 Success Criteria

You're ready for production when:

✅ All checklist items above are complete  
✅ At least 3 test requests processed successfully  
✅ Team trained and comfortable with process  
✅ Documentation accessible and understood  
✅ Metrics tracking in place  
✅ Support process defined  

---

## 🆘 Troubleshooting Quick Links

**Issue during setup?** → See `documentation/test-workflow-setup.md` - Troubleshooting section

**Workflow not working?** → Check Actions tab logs

**Jira not connecting?** → Verify credentials in `.env`

**Tests failing?** → Review test output in workflow logs

**Need help?** → Contact test automation lead

---

## 📅 Setup Timeline

| Phase | Time | Status |
|-------|------|--------|
| Pre-Setup | 5 min | ⬜ |
| Secrets Config | 10 min | ⬜ |
| Branch Protection | 5 min | ⬜ |
| Config Updates | 10 min | ⬜ |
| Team Config | 5 min | ⬜ |
| Testing | 20 min | ⬜ |
| Documentation | 15 min | ⬜ |
| **Total** | **~70 min** | |

---

## ✨ Completion

Once all items are checked:

🎉 **Congratulations!** Your aviation test generation workflow is fully operational!

**Next steps:**
1. Announce to team
2. Process first real test request
3. Monitor and iterate
4. Track metrics
5. Celebrate success! 🚀

---

**Setup Started**: __________  
**Setup Completed**: __________  
**First Test Generated**: __________  
**Team Go-Live**: __________

---

**Questions?** Review documentation or contact test automation lead.

**Ready?** Start with the first checkbox! ✅

