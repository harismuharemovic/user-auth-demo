#!/bin/bash
# Script to create test generation issue from command line

# Usage: ./create-test-issue.sh <file_path> <method_name> <code_file> [requirements]

FILE_PATH="$1"
METHOD_NAME="$2"
CODE_FILE="$3"
REQUIREMENTS="${4:-Test the $METHOD_NAME function}"

if [ -z "$FILE_PATH" ] || [ -z "$METHOD_NAME" ] || [ -z "$CODE_FILE" ]; then
    echo "Usage: $0 <file_path> <method_name> <code_file> [requirements]"
    echo "Example: $0 src/lib/utils.ts cn /tmp/code.txt 'Test utility function'"
    exit 1
fi

# Read code from file
CODE=$(cat "$CODE_FILE")

# Create issue body
ISSUE_BODY=$(cat <<EOF
## Test Generation Request

**File Path:** $FILE_PATH

**Method Name:** $METHOD_NAME

**Code to Test:**
\`\`\`typescript
$CODE
\`\`\`

**Requirements / Context:**
$REQUIREMENTS

**Priority:** Medium

---

**DO-178C Compliance Acknowledgment:**
- ✅ I understand this will be an AI-generated test requiring human review
- ✅ I understand DO-178C compliance requires formal review and approval
- ✅ I will link this test to appropriate LLRs during review

---
*Issue created programmatically via test generation workflow*
EOF
)

# Create the issue with labels
gh issue create \
    --title "Test Request: $METHOD_NAME" \
    --body "$ISSUE_BODY" \
    --label "test-request" \
    --label "ai-assisted" \
    --label "lltc"

echo "✅ Test issue created successfully!"

