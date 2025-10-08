#!/bin/bash

# Create Test Request from Jira - Input/Output Driven Workflow
# Usage: ./create-test-request-from-jira.sh <jira-ticket-key>
# Example: ./create-test-request-from-jira.sh KAN-123

set -e

if [ $# -lt 1 ]; then
    echo "Usage: $0 <jira-ticket-key>"
    echo "Example: $0 KAN-123"
    exit 1
fi

JIRA_KEY="$1"

echo "=== Creating I/O-Driven LLTC Test Request ==="
echo "Jira Ticket: $JIRA_KEY"
echo ""

# Check for Jira credentials in environment
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ] || [ -z "$ATLASSIAN_DOMAIN" ]; then
    echo "❌ Missing Jira credentials. Set these environment variables:"
    echo ""
    echo "   export ATLASSIAN_USER_EMAIL='your-email@example.com'"
    echo "   export ATLASSIAN_API_TOKEN='your-api-token'"
    echo "   export ATLASSIAN_DOMAIN='your-site.atlassian.net'"
    echo ""
    exit 1
fi

# Extract domain
DOMAIN=$(echo "$ATLASSIAN_DOMAIN" | sed 's|https://||' | sed 's|/.*||')

echo "🎫 Retrieving Jira ticket via REST API..."
echo ""

# Retrieve Jira ticket
JIRA_RESPONSE=$(curl -s \
    -H "Content-Type: application/json" \
    -u "${ATLASSIAN_USER_EMAIL}:${ATLASSIAN_API_TOKEN}" \
    "https://${DOMAIN}/rest/api/3/issue/${JIRA_KEY}")

# Check for errors
ERROR_MSG=$(echo "$JIRA_RESPONSE" | jq -r '.errorMessages[0]? // empty' 2>/dev/null)
if [ ! -z "$ERROR_MSG" ]; then
    echo "❌ Failed to retrieve Jira ticket: $ERROR_MSG"
    exit 1
fi

# Extract ticket data
TICKET_SUMMARY=$(echo "$JIRA_RESPONSE" | jq -r '.fields.summary')
TICKET_DESC_RAW=$(echo "$JIRA_RESPONSE" | jq -r '.fields.description')

# Convert Atlassian Document Format to Markdown
TICKET_DESC=$(echo "$TICKET_DESC_RAW" | node scripts/adf-to-markdown.js)

if [ -z "$TICKET_SUMMARY" ] || [ "$TICKET_SUMMARY" = "null" ]; then
    echo "❌ Failed to parse Jira ticket"
    exit 1
fi

echo "✅ Retrieved ticket: $TICKET_SUMMARY"
echo ""

# Validate I/O table exists
echo "🔍 Validating I/O table..."
if ! node scripts/validate-io-table.js "$TICKET_DESC" 2>&1 | tee /tmp/io_validation.txt; then
    echo ""
    echo "❌ Jira ticket does not contain valid I/O table"
    echo "Please add a table with this format:"
    echo ""
    echo "| Test Case ID | Input Parameters | Expected Output | Notes |"
    echo "|--------------|------------------|-----------------|-------|"
    echo "| TC-001       | input1, input2   | output1         | Happy path |"
    echo ""
    exit 1
fi

echo ""

# Extract specific fields from description
# Look for patterns like "File: path/to/file.ts" and code blocks
FILE_PATH=$(echo "$TICKET_DESC" | grep -i "^File:" | head -1 | sed 's/File://i' | xargs || echo "")
METHOD_NAME=$(echo "$TICKET_DESC" | grep -i "^Method:" | head -1 | sed 's/Method://i' | xargs || echo "Unknown")

# Extract code block (between ``` markers)
CODE_SNIPPET=$(echo "$TICKET_DESC" | awk '/```/,/```/' | sed '1d;$d' || echo "")

if [ -z "$FILE_PATH" ]; then
    echo "⚠️  Warning: No 'File:' field found in Jira description"
    FILE_PATH="(see Jira ticket)"
fi

if [ -z "$CODE_SNIPPET" ]; then
    echo "⚠️  Warning: No code block found in Jira description"
    CODE_SNIPPET="// See Jira ticket for code"
fi

# Extract I/O table from description
IO_TABLE=$(echo "$TICKET_DESC" | awk '/\| Test Case ID/,/^[^|]/ {print}' | grep -v '^$' || echo "")

echo "📝 Creating GitHub issue..."

# Create enhanced GitHub issue
ISSUE_BODY=$(cat << EOF
## LLTC Test Generation Request - Input/Output Driven

**File**: \`$FILE_PATH\`
**Method**: \`$METHOD_NAME\`
**Jira**: [$JIRA_KEY](https://${DOMAIN}/browse/${JIRA_KEY})

### Method Code
\`\`\`typescript
$CODE_SNIPPET
\`\`\`

### Required Input/Output Test Cases
$IO_TABLE

### Testing Requirements
- ✅ All input/output pairs MUST pass
- ✅ Maximum 3 generation attempts allowed
- ✅ 100% coverage of specified test cases
- ✅ DO-178C traceability required
- ✅ Test naming: Use \`describe("methodName - TC-XXX")\` format

### Additional Context
Generated from Jira ticket: $JIRA_KEY

---
**Workflow**: This is an I/O-driven test generation request. Tests will be validated against the specified input/output pairs automatically.
EOF
)

ISSUE_URL=$(gh issue create \
    --title "[IO-LLTC] $TICKET_SUMMARY" \
    --body "$ISSUE_BODY" \
    --label "test-request" \
    --label "io-driven" \
    --label "lltc")

echo "✅ Created GitHub issue: $ISSUE_URL"
echo ""

# Extract issue number from URL
ISSUE_NUMBER=$(echo "$ISSUE_URL" | grep -oE '[0-9]+$')

# Automatically trigger Claude Code with enhanced prompt
echo "🤖 Triggering Claude Code with I/O requirements..."
gh issue comment "$ISSUE_NUMBER" --body "@claude Please generate comprehensive LLTC tests for this method with the following requirements:

**Input/Output Requirements:**
You MUST generate tests that validate ALL input/output pairs specified in the table above. Each test case ID should map to a specific test suite.

**Test Structure Required:**
- Use describe blocks named: \`describe('$METHOD_NAME - TC-XXX', () => {})\`
- Each test case from the table gets its own describe block
- Include the exact inputs and expected outputs from the specification
- Add clear assertions that validate expected outputs match exactly

**DO-178C Requirements:**
- 100% statement and branch coverage
- All edge cases from I/O table
- Proper error handling tests
- Deterministic outputs only

**Important:** This test will be automatically validated against the I/O specifications. If any test case fails, you will receive specific feedback and have up to 3 attempts to fix it.

**Test File Location:** Place test in \`tests/\` folder with appropriate naming." >/dev/null 2>&1

echo ""
echo "=== Test Request Complete ==="
echo "Jira: https://${DOMAIN}/browse/$JIRA_KEY"
echo "GitHub: $ISSUE_URL"
echo ""
echo "✅ Claude Code triggered automatically - I/O validation will run after generation"
echo "   Monitor progress: gh issue view $ISSUE_NUMBER --comments"

