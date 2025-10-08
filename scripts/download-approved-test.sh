#!/bin/bash

# Download Approved Test from GitHub Artifacts
# Usage: ./download-approved-test.sh <issue-number>
# Example: ./download-approved-test.sh 42

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <issue-number>"
    echo "Example: $0 42"
    exit 1
fi

ISSUE_NUMBER="$1"

echo "=== Downloading Approved Test for Issue #$ISSUE_NUMBER ==="
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
echo "Repository: $REPO"

# Find the workflow run for this issue
echo "🔍 Finding workflow run for issue #$ISSUE_NUMBER..."

# Get branch name pattern - Claude branches have timestamps like claude/issue-18-20251008-1242
# We'll search for any branch matching claude/issue-{N}
BRANCH_PATTERN="claude/issue-${ISSUE_NUMBER}-"

# Find the most recent workflow run for this branch that has completed
# We need to find the exact branch name first
EXACT_BRANCH=$(gh run list \
    --workflow=iterative-test-generation.yml \
    --limit 20 \
    --json headBranch \
    --jq '.[] | .headBranch' | grep "claude/issue-${ISSUE_NUMBER}-" | head -1)

if [ -z "$EXACT_BRANCH" ]; then
    echo "❌ No workflow runs found for issue #$ISSUE_NUMBER"
    exit 1
fi

echo "Found branch: $EXACT_BRANCH"

# Find the most recent completed workflow run for this exact branch
WORKFLOW_RUN=$(gh run list \
    --workflow=iterative-test-generation.yml \
    --branch "$EXACT_BRANCH" \
    --status completed \
    --limit 1 \
    --json databaseId,conclusion,headBranch \
    --jq '.[0]')

if [ -z "$WORKFLOW_RUN" ] || [ "$WORKFLOW_RUN" = "null" ]; then
    echo "❌ No completed workflow run found for issue #$ISSUE_NUMBER"
    echo "   Branch pattern: $BRANCH_PATTERN"
    echo ""
    echo "Possible reasons:"
    echo "  - Tests haven't run yet"
    echo "  - Wrong issue number"
    echo "  - Workflow is still running"
    echo ""
    echo "Check workflow status: gh run list --branch $BRANCH_PATTERN"
    exit 1
fi

RUN_ID=$(echo "$WORKFLOW_RUN" | jq -r '.databaseId')
echo "✅ Found workflow run: $RUN_ID"

# Download the approved-test-file artifact
echo "📥 Downloading test file artifact..."

# Create temp directory
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Download artifact
if ! gh run download "$RUN_ID" \
    --name approved-test-file \
    --dir "$TEMP_DIR" 2>/dev/null; then
    
    echo "❌ Failed to download artifact"
    echo ""
    echo "This could mean:"
    echo "  - Artifact has expired (artifacts expire after 90 days)"
    echo "  - Tests didn't pass (no artifact was created)"
    echo "  - Wrong issue number"
    echo ""
    echo "Check artifacts: gh run view $RUN_ID"
    exit 1
fi

# Find test files in downloaded artifact
TEST_FILES=$(find "$TEMP_DIR" -type f \( -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.test.js" -o -name "*.test.jsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" -o -name "*.spec.js" -o -name "*.spec.jsx" \))

if [ -z "$TEST_FILES" ]; then
    echo "❌ No test files found in artifact"
    exit 1
fi

# Create unapproved-tests directory if it doesn't exist
mkdir -p unapproved-tests

# Copy test files to unapproved-tests folder
echo ""
echo "📋 Test files found:"
for TEST_FILE in $TEST_FILES; do
    BASENAME=$(basename "$TEST_FILE")
    DEST="unapproved-tests/$BASENAME"
    
    cp "$TEST_FILE" "$DEST"
    echo "  ✅ $BASENAME → $DEST"
done

echo ""
echo "=== Download Complete ==="
echo ""
echo "Test file(s) saved to: unapproved-tests/"
echo ""
echo "Next steps:"
echo "  1. Review the test file(s) in unapproved-tests/"
echo "  2. Run tests locally: npx vitest run unapproved-tests/"
echo "  3. If approved, move to tests/ folder: mv unapproved-tests/*.test.ts tests/"
echo "  4. Commit and push: git add tests/ && git commit -m 'Add approved tests for issue #$ISSUE_NUMBER'"
echo ""

