# Aviation Test Generation Workflow
## AI-Assisted LLTC Creation with DO-178C Compliance

---

## Overview

This workflow enables aerospace software teams to leverage AI for test generation while maintaining full compliance with DO-178C certification requirements. The system provides automated Low Level Test Case (LLTC) generation with mandatory human review and comprehensive traceability.

### Key Principles

1. **AI for Testing Only**: AI generates tests, not production code (compliant with aerospace regulations)
2. **Human-in-the-Loop**: Every AI-generated test undergoes mandatory qualified engineer review
3. **Full Traceability**: Complete audit trail from request to integration
4. **DO-178C Compliance**: Meets DO-178C § 6.4 Software Testing Process requirements
5. **No Auto-Merge**: AI-generated tests never auto-merge; always require human approval

---

## Architecture

### Workflow Components

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Creates Test Request                    │
│                    (GitHub Issue Template)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      v
┌─────────────────────────────────────────────────────────────────┐
│              Test Orchestrator Workflow (GHA)                    │
│  • Parses request                                                │
│  • Creates Jira LLTC ticket via MCP                             │
│  • Triggers test generation                                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      v
┌─────────────────────────────────────────────────────────────────┐
│           Claude Test Generator Workflow (GHA)                   │
│  • Generates comprehensive LLTC test                             │
│  • Executes tests automatically                                  │
│  • Creates PR if tests pass                                      │
│  • Updates Jira ticket status                                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      v (only if tests pass)
┌─────────────────────────────────────────────────────────────────┐
│              Pull Request to to-be-reviewed-tests                │
│  • Includes comprehensive test code                              │
│  • Includes DO-178C review checklist                             │
│  • Includes test execution results                               │
│  • Auto-merge DISABLED                                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      v
┌─────────────────────────────────────────────────────────────────┐
│          Test Review Enforcement Workflow (GHA)                  │
│  • Disables auto-merge                                           │
│  • Posts review checklist                                        │
│  • Re-runs tests for verification                                │
│  • Enforces review requirements                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      v
┌─────────────────────────────────────────────────────────────────┐
│               Human Review by Test Engineer                      │
│  • Reviews test code line-by-line                                │
│  • Verifies DO-178C compliance checklist                         │
│  • Links test to LLRs in traceability system                     │
│  • Approves or requests changes                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      v (after approval)
┌─────────────────────────────────────────────────────────────────┐
│           Merge to to-be-reviewed-tests Branch                   │
│  • Test becomes part of reviewed test suite                      │
│  • Eventually merged to main in batch                            │
│  • Becomes part of certification basis                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Guide

### How to Request a Test

1. **Navigate to GitHub Issues**
   - Go to your repository's Issues tab
   - Click "New Issue"

2. **Select Test Generation Template**
   - Choose "🧪 Test Generation Request (LLTC)"
   - This loads the structured form

3. **Fill Out the Form**
   
   **Required Fields:**
   - **File Path**: Full path to source file (e.g., `src/lib/validation.ts`)
   - **Method Name**: Function to test (e.g., `validateUserInput`)
   - **Code Snippet**: Complete method implementation (paste in code block)
   - **Priority**: How urgent is this test
   
   **Optional Fields:**
   - **Requirements/Context**: LLR IDs, specific scenarios to test
   - **Coverage Goals**: Target coverage percentages
   - **Test Categories**: Which types of tests to include

4. **Submit the Issue**
   - Review your inputs
   - Check the DO-178C compliance acknowledgments
   - Click "Submit new issue"

5. **Wait for Automation**
   - Jira ticket will be created automatically (you'll get a comment with link)
   - Claude will generate the test
   - PR will be created if tests pass
   - You'll be notified at each step

### Example Test Request

```yaml
File Path: src/lib/validation.ts
Method Name: validateUserInput

Code to Test:
```typescript
export function validateUserInput(input: string): boolean {
  if (!input || input.trim().length === 0) {
    return false;
  }
  
  if (input.length > 255) {
    throw new Error('Input too long');
  }
  
  const validPattern = /^[a-zA-Z0-9\s]+$/;
  return validPattern.test(input);
}
```

Requirements:
- LLR-123: Input validation must reject empty strings
- LLR-124: Input length must not exceed 255 characters
- LLR-125: Only alphanumeric characters and spaces allowed

Coverage Goals:
- 100% statement coverage
- 100% branch coverage
- All error paths tested
```

---

## Review Process

### For Test Engineers

When you receive a PR for review, follow this process:

#### 1. Initial Assessment

- Check that PR has `ai-generated` and `lltc` labels
- Verify PR targets `to-be-reviewed-tests` branch
- Confirm tests are passing in CI
- Read the PR description and linked Jira ticket

#### 2. Local Testing

```bash
# Checkout the PR branch
gh pr checkout [PR_NUMBER]

# Install dependencies
npm ci

# Run tests
npm test

# Check coverage
npm test -- --coverage

# Review coverage report
open coverage/index.html
```

#### 3. Code Review

Review the test file against the comprehensive checklist posted in the PR:

**Test Coverage & Adequacy** (6 checks)
- Complete coverage of all code paths
- Branch coverage (all if/else, switch, ternary)
- Edge cases (min, max, zero, empty, null, undefined)
- Error paths and exceptions
- Input validation logic
- Coverage targets met

**Test Quality & Correctness** (8 checks)
- Assertions validate correct behavior
- Mocks accurately represent real behavior
- Tests are independent (no order dependencies)
- Tests are repeatable (deterministic)
- Clear test descriptions
- AAA pattern (Arrange-Act-Assert)
- No false positives
- No false negatives

**DO-178C Compliance** (6 checks)
- Traceability header with Jira reference
- LLR linkage documented
- Expected results defined
- Correctly identified as LLTC
- Formal review requirements met
- Audit trail sufficient

**Code Quality & Standards** (6 checks)
- Follows company coding standards
- Clear and maintainable
- No code smells
- Valid imports
- No linter errors
- Correct TypeScript types

**Safety & Aerospace Standards** (5 checks)
- Deterministic execution
- No timing dependencies
- Proper resource cleanup
- No security issues
- Appropriate LLTC scope

#### 4. Traceability

- Open your traceability tool (Codebeamer, DOORS, etc.)
- Link the test to corresponding LLRs
- Verify bidirectional traceability
- Document in the PR comments

#### 5. Decision

**If all checks pass:**
```bash
# Approve the PR
gh pr review [PR_NUMBER] --approve --body "LLTC review complete. All DO-178C requirements met. Traceability established."
```

**If issues found:**
```bash
# Request changes
gh pr review [PR_NUMBER] --request-changes --body "Issues found during review. See inline comments."

# Add inline comments on specific lines
# Use GitHub UI for this
```

#### 6. After Approval

- Merge the PR to `to-be-reviewed-tests` branch
- Update Jira ticket status to "Done"
- Document review completion in your records

---

## Workflow Files Reference

### 1. `test-orchestrator.yml`

**Purpose**: Entry point for test generation pipeline

**Triggers**:
- Issue opened with `test-request` label
- Issue comment with `@claude-test` mention

**Key Steps**:
1. Extract test request details from issue
2. Validate required information
3. Create Jira LLTC ticket via Atlassian MCP
4. Comment on issue with Jira link
5. Trigger test generation workflow

**MCP Usage**: Atlassian MCP for Jira ticket creation

### 2. `claude-test-generator.yml`

**Purpose**: Generate and execute LLTC tests

**Triggers**:
- `workflow_dispatch` from orchestrator
- Manual trigger with parameters

**Key Steps**:
1. Create test generation branch (`test-gen/[jira-key]-[method]-[timestamp]`)
2. Use Claude Code to generate comprehensive test
3. Execute tests with coverage
4. Commit test file (only if tests pass)
5. Create PR to `to-be-reviewed-tests` (only if tests pass)
6. Update Jira ticket status
7. Comment on original issue

**MCP Usage**: Atlassian MCP for Jira updates

**AI Prompt Includes**:
- DO-178C LLTC requirements
- Test file header with traceability
- Comprehensive coverage requirements
- Aerospace testing best practices

### 3. `test-review-enforcement.yml`

**Purpose**: Enforce review requirements and prevent auto-merge

**Triggers**:
- PR opened/updated to `to-be-reviewed-tests` branch
- PR with `ai-generated` or `lltc` labels

**Key Steps**:
1. Disable auto-merge on PR
2. Add required labels
3. Re-run tests for verification
4. Post comprehensive DO-178C review checklist
5. Warn if tests fail

**Safety Rails**:
- Forces manual review
- No bypass mechanisms
- Clear compliance requirements

### 4. `ci.yml` (Modified)

**Purpose**: Prevent auto-merge for test PRs

**Modification**: Added exclusion conditions to auto-merge job:
- Excludes branches starting with `test-gen/`
- Excludes PRs with `ai-generated` label
- Excludes PRs with `do-not-auto-merge` label
- Excludes PRs with `lltc` label

---

## Branch Strategy

```
main (production)
│
├── feature-xyz (normal development)
├── claude-impl-123 (Claude implementations)
│
└── to-be-reviewed-tests (AI-generated tests staging)
    ├── test-gen/PROJ-123-validateInput-20250108
    ├── test-gen/PROJ-124-processData-20250108
    └── ...
```

**Branch Purposes**:

- `main`: Production code and approved tests
- `to-be-reviewed-tests`: Staging area for AI-generated tests awaiting review
- `test-gen/*`: Individual test generation branches (one per request)

**Merge Flow**:

1. Test generated → `test-gen/[details]` branch
2. PR created → targets `to-be-reviewed-tests`
3. Human reviews and approves
4. Merge to `to-be-reviewed-tests`
5. Periodically, batch merge `to-be-reviewed-tests` → `main`

**Why This Strategy?**:
- Clear separation of AI-generated vs human code
- Easy to review all pending tests
- Safety buffer before production
- Audit trail preservation
- Batch integration reduces noise

---

## DO-178C Compliance

### Certification Requirements Met

**DO-178C § 6.4 Software Testing Process**

| Requirement | How We Meet It |
|------------|----------------|
| Test cases trace to requirements | Mandatory LLR linkage during review |
| Tests detect errors | Comprehensive coverage requirements |
| Expected results defined | Required in test header and assertions |
| Tests are repeatable | Independence checks in review checklist |
| Test results documented | Automated execution reports |
| Tests are reviewed | Mandatory qualified engineer review |

**DO-326A Airworthiness Security**

| Requirement | How We Meet It |
|------------|----------------|
| Audit trail | Full GitHub/Jira traceability |
| Human oversight | No auto-merge; mandatory review |
| Security controls | GitHub permissions and protections |
| Change management | Git history and PR process |

### Audit Evidence

For certification audits, this workflow provides:

1. **Test Request**: GitHub issue (requirement source)
2. **Work Item**: Jira ticket (test specification)
3. **Test Code**: Git commit (implementation)
4. **Test Results**: CI artifacts (execution evidence)
5. **Review**: PR approval (qualified review)
6. **Traceability**: Issue→Jira→PR→Commit (complete chain)
7. **Integration**: Merge to main (acceptance)

### Compliance Notes

**What's Allowed**:
- ✅ AI-generated test code (DO-178C permits AI for testing)
- ✅ Automated test execution
- ✅ AI-assisted review checklists

**What's Required**:
- ✅ Human review by qualified engineer
- ✅ Traceability to requirements (LLRs)
- ✅ Formal review against checklist
- ✅ Explicit approval before integration

**What's Prohibited**:
- ❌ Auto-merging AI-generated tests
- ❌ Bypassing review process
- ❌ Using AI for production code (in this workflow)

---

## Troubleshooting

### Issue: Test Request Not Triggering

**Check**:
1. Issue has `test-request` label
2. Required fields filled out (file path, code snippet)
3. Code snippet in proper code block (```typescript)
4. `ANTHROPIC_API_KEY` secret configured

**Fix**: Re-label issue or comment with `@claude-test`

### Issue: Jira Ticket Not Created

**Check**:
1. Atlassian credentials configured in `.env`
2. MCP server accessible
3. User has Jira create permissions
4. Correct cloud ID / site URL

**Fix**: Check workflow logs for MCP errors

### Issue: Test Generation Failed

**Possible Causes**:
1. Code snippet incomplete or malformed
2. Missing dependencies in test
3. Incorrect import paths
4. Syntax errors

**Fix**: Check workflow logs, examine test file on branch, retry with clarification

### Issue: Tests Failing in CI

**Check**:
1. All dependencies installed (`npm ci`)
2. Test file imports correct
3. Mocks configured properly
4. Environment variables needed

**Fix**: Review test output in artifacts, fix manually on branch, push fix

### Issue: PR Not Created

**Reason**: Tests must pass before PR creation

**Fix**: Review test failures, regenerate test, or fix manually

### Issue: PR Auto-Merged Incorrectly

**Should Not Happen**: Multiple safeguards prevent this

**If It Does**:
1. Revert the merge
2. Review ci.yml conditions
3. Check branch protection rules
4. Report as critical bug

---

## Configuration

### Required GitHub Secrets

| Secret | Purpose | Example |
|--------|---------|---------|
| `ANTHROPIC_API_KEY` | Claude AI access | `sk-ant-...` |
| `GITHUB_TOKEN` | Automatically provided | - |

### Optional GitHub Secrets

| Secret | Purpose | Example |
|--------|---------|---------|
| `JIRA_PROJECT_KEY` | Default Jira project | `PROJ` |
| `TEST_REVIEWER_TEAM` | Auto-request reviews | `@org/test-team` |

### Environment Variables (.env)

For local Atlassian MCP testing:

```env
ATLASSIAN_CLOUD_ID=your-site-id
ATLASSIAN_API_TOKEN=your-api-token
ATLASSIAN_EMAIL=your-email@company.com
```

### Branch Protection Rules

**For `to-be-reviewed-tests` branch**:
- ✅ Require pull request reviews (1+ approvals)
- ✅ Require status checks to pass
- ✅ No force pushes
- ✅ No deletions
- ⚠️ Do NOT enable auto-merge

**For `main` branch**:
- ✅ All protections as configured
- ✅ Additional approval for test merges

---

## Metrics & KPIs

Track these metrics to measure workflow effectiveness:

### Test Generation Metrics
- **Time to Test**: Issue creation → PR creation
- **Generation Success Rate**: % of test requests resulting in passing tests
- **First-Time Pass Rate**: % of generated tests passing without manual fixes

### Review Metrics
- **Review Time**: PR creation → approval
- **Approval Rate**: % of tests approved vs. rejected
- **Iteration Count**: Average rounds of review per test

### Quality Metrics
- **Coverage Achievement**: % of tests meeting coverage targets
- **Defect Escape**: Defects found in AI tests during later testing
- **Rework Rate**: % of tests requiring changes post-generation

### Compliance Metrics
- **Traceability Complete**: % of tests with full LLR links
- **Review Checklist Completion**: % of reviews completing all checklist items
- **Audit Readiness**: Time to produce audit evidence

---

## Best Practices

### For Test Requesters

1. **Be Specific**: Provide complete code context, not just function signature
2. **Include LLRs**: Reference specific requirements to test
3. **List Edge Cases**: Call out scenarios you know need coverage
4. **Check Format**: Use proper markdown code blocks for code snippets
5. **Review Generated Tests**: Even though someone else reviews, you can too

### For Test Reviewers

1. **Don't Rush**: Thorough review is critical for certification
2. **Test Locally**: Always run tests in your environment
3. **Check Coverage**: Use coverage tools to verify claims
4. **Link Requirements**: Complete traceability before approving
5. **Document Issues**: Clear comments help improve future generation
6. **Verify Mocks**: Ensure mocked behavior matches reality

### For Test Engineers

1. **Batch Reviews**: Review multiple tests in one session when possible
2. **Share Patterns**: Document common issues for training
3. **Update Checklists**: Improve checklists based on findings
4. **Monitor Trends**: Track which types of tests need most rework
5. **Provide Feedback**: Help improve AI generation over time

---

## Future Enhancements

### Planned Features

1. **HLTC Support**: Extend to High Level Test Cases (integration/system tests)
2. **Test Modification**: AI-assisted test updates when code changes
3. **Coverage Gap Detection**: Automatically identify untested code
4. **Traceability Automation**: Auto-suggest LLR links during generation
5. **Batch Test Generation**: Generate tests for entire modules
6. **Test Quality Scoring**: AI-based quality assessment before human review

### Integration Opportunities

1. **Codebeamer Integration**: Direct traceability tool integration
2. **DOORS Connector**: For teams using IBM DOORS
3. **Code Coverage Tools**: Integration with Coveralls, CodeCov
4. **Static Analysis**: Integration with SonarQube, Coverity
5. **Test Management**: Integration with Zephyr, TestRail

---

## Support & Contact

### Getting Help

1. **Documentation Issues**: Open issue in this repo
2. **Test Generation Problems**: Comment on original test request issue
3. **Review Questions**: Comment on PR or contact test lead
4. **Workflow Improvements**: Create feature request issue

### Training

New team members should:
1. Read this documentation completely
2. Review 2-3 example test PRs
3. Shadow an experienced reviewer
4. Generate a simple test request
5. Review their first test with supervision

---

## Appendix: Example Files

### Example Generated Test File

```typescript
/**
 * LLTC Test Case - DO-178C Compliance
 * 
 * @testType LLTC (Low Level Test Case)
 * @jiraTicket PROJ-123
 * @githubIssue #45
 * @testedFile src/lib/validation.ts
 * @testedFunction validateUserInput
 * @generatedBy AI (Claude) - Requires Human Review
 * @reviewStatus PENDING
 * @traceability LLR-123, LLR-124, LLR-125
 * 
 * Purpose: Validate low-level requirements for validateUserInput
 * Coverage Target: 100% statement and branch coverage
 * 
 * Test Categories:
 * - Normal operation / happy path scenarios
 * - Boundary conditions and edge cases
 * - Error handling and exceptional conditions
 * - Input validation scenarios
 */

import { describe, it, expect } from 'vitest';
import { validateUserInput } from '../src/lib/validation';

describe('validateUserInput - LLTC', () => {
  describe('Normal Operation (LLR-125)', () => {
    it('should accept valid alphanumeric input', () => {
      // Arrange
      const validInput = 'Hello World 123';
      
      // Act
      const result = validateUserInput(validInput);
      
      // Assert
      expect(result).toBe(true);
    });

    it('should accept input with spaces', () => {
      const input = 'Multiple   spaces';
      expect(validateUserInput(input)).toBe(true);
    });
  });

  describe('Edge Cases & Boundaries (LLR-124)', () => {
    it('should reject empty string (LLR-123)', () => {
      expect(validateUserInput('')).toBe(false);
    });

    it('should reject whitespace-only string (LLR-123)', () => {
      expect(validateUserInput('   ')).toBe(false);
    });

    it('should accept string at maximum length (255 chars)', () => {
      const maxLength = 'a'.repeat(255);
      expect(validateUserInput(maxLength)).toBe(true);
    });

    it('should throw error for string exceeding maximum length (LLR-124)', () => {
      const tooLong = 'a'.repeat(256);
      expect(() => validateUserInput(tooLong)).toThrow('Input too long');
    });
  });

  describe('Error Handling (LLR-125)', () => {
    it('should reject input with special characters', () => {
      const specialChars = 'Hello@World!';
      expect(validateUserInput(specialChars)).toBe(false);
    });

    it('should reject input with only special characters', () => {
      expect(validateUserInput('!@#$%')).toBe(false);
    });
  });

  describe('Input Validation Edge Cases', () => {
    it('should handle null input gracefully', () => {
      expect(validateUserInput(null as any)).toBe(false);
    });

    it('should handle undefined input gracefully', () => {
      expect(validateUserInput(undefined as any)).toBe(false);
    });

    it('should accept single character', () => {
      expect(validateUserInput('a')).toBe(true);
    });

    it('should accept numbers only', () => {
      expect(validateUserInput('12345')).toBe(true);
    });

    it('should accept letters only', () => {
      expect(validateUserInput('abcXYZ')).toBe(true);
    });
  });
});
```

### Example Review Comment

```markdown
## Review Complete ✅

### Summary
LLTC test for `validateUserInput` has been reviewed and approved.

### Checklist Completion
All 31 checklist items verified and passing:
- ✅ Test Coverage & Adequacy (6/6)
- ✅ Test Quality & Correctness (8/8)
- ✅ DO-178C Compliance (6/6)
- ✅ Code Quality & Standards (6/6)
- ✅ Safety & Aerospace Standards (5/5)

### Test Execution
- All 12 test cases passing
- Statement coverage: 100%
- Branch coverage: 100%
- Function coverage: 100%

### Traceability
Linked to requirements in Codebeamer:
- LLR-123: Empty string validation ✅
- LLR-124: Length limit validation ✅
- LLR-125: Character pattern validation ✅

### Findings
No issues found. Test is comprehensive, correct, and compliant.

### Recommendation
**APPROVED** - Ready to merge to `to-be-reviewed-tests` branch.

---
*Review conducted by: John Smith, Senior Test Engineer*
*Date: 2025-01-08*
*Review duration: 45 minutes*
```

---

## Conclusion

This workflow provides a robust, compliant, and auditable process for AI-assisted test generation in aerospace software development. By combining automation with mandatory human oversight, it accelerates test creation while maintaining the highest standards required for DO-178C certification.

For questions or support, contact your test lead or certification manager.

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-08  
**Maintained By**: Test Automation Team

