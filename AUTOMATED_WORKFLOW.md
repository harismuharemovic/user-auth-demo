# 🚀 Fully Automated Test Generation Workflow

## For You (The User)

### Simple Command
Just tell me: **"Generate tests for [function name]"** or **"Test [function name]"**

That's it! I'll handle everything automatically.

### What Happens Automatically

```
You: "Test validateVariableName"
    ↓
Me: [Automatically runs script]
    ↓
✅ Jira ticket created (KAN-X)
✅ GitHub issue created (#X)
✅ Claude Code triggered automatically
✅ Tests generated (~60 seconds)
✅ Tests verified (all passing)
✅ PR created (#X)
    ↓
Me: "✅ Done! Tests ready for review: PR #X"
```

**Total time: ~2 minutes**  
**Your effort: One sentence**

## Examples

### Example 1: Quick Test Request
```
You: "Test the toPascalCase function"

Me: "Creating tests for toPascalCase...
     ✅ Jira: KAN-6
     ✅ Issue: #11
     ✅ Claude triggered
     ⏳ Generating tests...
     ✅ Tests created: src/lib/code-helpers.test.ts
     ✅ All 12 tests passing
     ✅ PR ready: #12
     
     Review: https://github.com/user/repo/pull/12"
```

### Example 2: With Context
```
You: "Generate tests for validateVariableName - make sure to test 
     reserved keywords and unicode characters"

Me: [Automatically creates ticket and tests with that context]
    "✅ Done! Tests include reserved keywords and unicode tests. PR #13"
```

### Example 3: From Code Snippet
```
You: [Pastes code snippet]
     "Test this function"

Me: [Identifies the function, creates tests automatically]
    "✅ Tests generated for parseUserInput. PR #14"
```

## What I Do Automatically

When you request tests, I automatically:

1. **Identify the target**
   - Extract file path and method name
   - Read the source code
   - Validate it exists

2. **Load credentials** (from stored .env)
   ```bash
   ATLASSIAN_USER_EMAIL=h.muharemovic@gmail.com
   ATLASSIAN_API_TOKEN=[stored]
   ATLASSIAN_DOMAIN=haris-muharemovic.atlassian.net
   ```

3. **Run the script**
   ```bash
   ./scripts/create-test-request.sh <file> <method> "<context>"
   ```

4. **Script automatically does:**
   - Creates Jira LLTC ticket
   - Creates GitHub issue
   - **Triggers Claude with @claude mention** ← NEW!
   - Provides monitoring info

5. **Monitor progress**
   - Wait for Claude to finish (~60s)
   - Check if tests were created
   - Verify tests pass
   - Find the PR

6. **Report results**
   - Link to Jira ticket
   - Link to GitHub issue  
   - Link to PR
   - Test results summary

## No Manual Steps Required

❌ You DON'T need to:
- Create Jira tickets manually
- Create GitHub issues manually
- Comment "@claude" to trigger
- Check if workflow completed
- Monitor the progress
- Verify tests pass

✅ I handle ALL of that automatically!

## Current Status Check

Let me check the current test generation:

```bash
# Check issue #10 (validateVariableName)
gh issue view 10 --comments | tail -20

# Check for PR
gh pr list | head -5

# Check test file
ls -la src/lib/code-helpers.test.ts
```

## The Updated Script

The script now automatically:
```bash
#!/bin/bash
# ... creates Jira ticket ...
# ... creates GitHub issue ...

# 🆕 AUTOMATICALLY triggers Claude!
gh issue comment "$ISSUE_NUMBER" --body "@claude Please generate comprehensive LLTC tests..."

echo "✅ Claude Code triggered automatically"
```

No more manual @mentions needed!

## Credentials Setup (One-Time)

Create `.env` in repo root (already gitignored):
```bash
ATLASSIAN_USER_EMAIL=h.muharemovic@gmail.com
ATLASSIAN_API_TOKEN=<your-token>
ATLASSIAN_DOMAIN=haris-muharemovic.atlassian.net
```

I'll automatically load these when needed.

## Monitoring Commands

If you want to watch progress yourself:
```bash
# Watch issue comments
gh issue view <issue-num> --comments

# Watch for PR
gh pr list

# Check test file
cat src/lib/<function>.test.ts

# Run tests
npm test src/lib/<function>.test.ts
```

But you don't need to - I'll tell you when it's done!

## What You Review

After I say "Done!", you review:
1. Open the PR link I provide
2. Check the DO-178C checklist (auto-posted)
3. Review the test quality
4. Approve and merge when satisfied

## Full Workflow Diagram

```
┌─────────────────────────────────────────────┐
│ You: "Test myFunction"                      │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ AI: Automatic Execution                     │
│  1. Load credentials from .env              │
│  2. Run create-test-request.sh              │
│  3. Script creates Jira ticket              │
│  4. Script creates GitHub issue             │
│  5. Script triggers @claude automatically   │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ Claude Code (GitHub App)                    │
│  1. Detects @claude mention                 │
│  2. Generates comprehensive tests           │
│  3. Runs tests locally                      │
│  4. Creates PR if tests pass                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ AI: Monitors & Reports                      │
│  1. Waits for completion                    │
│  2. Checks test results                     │
│  3. Verifies PR created                     │
│  4. Reports to you with links               │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│ You: Review & Approve                       │
│  - Review PR using checklist                │
│  - Approve when satisfied                   │
│  - Merge manually                           │
└─────────────────────────────────────────────┘
```

## Summary

**Before**: Complex multi-step process with manual triggers  
**After**: One sentence → Complete test suite + PR

**Your effort**: "Test X"  
**My effort**: Everything else, automatically  
**Time**: ~2 minutes  
**Result**: Production-ready DO-178C compliant tests

🚀 **That's it! Just tell me what to test.**

