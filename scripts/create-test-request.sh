#!/bin/bash

# Create Test Request - Creates Jira ticket via MCP and GitHub issue
# Usage: ./create-test-request.sh <file-path> <method-name> ["additional context"]

set -e

if [ $# -lt 2 ]; then
    echo "Usage: $0 <file-path> <method-name> [additional-context]"
    echo "Example: $0 src/lib/utils.ts cn 'Test empty inputs and Tailwind class merging'"
    exit 1
fi

FILE_PATH="$1"
METHOD_NAME="$2"
ADDITIONAL_CONTEXT="${3:-Test with various inputs and edge cases}"

echo "=== Creating LLTC Test Request ==="
echo "File: $FILE_PATH"
echo "Method: $METHOD_NAME"
echo ""

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
    echo "❌ Error: File $FILE_PATH not found"
    exit 1
fi

# Extract code snippet (function definition)
echo "📖 Extracting code from $FILE_PATH..."
CODE_SNIPPET=$(grep -A 20 "function $METHOD_NAME\|export.*$METHOD_NAME\|const $METHOD_NAME" "$FILE_PATH" | head -20)

if [ -z "$CODE_SNIPPET" ]; then
    echo "❌ Error: Could not find method $METHOD_NAME in $FILE_PATH"
    exit 1
fi

echo "✅ Found code snippet"
echo ""

# Check for Jira credentials in environment
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ] || [ -z "$ATLASSIAN_DOMAIN" ]; then
    echo "❌ Missing Jira credentials. Set these environment variables:"
    echo ""
    echo "   export ATLASSIAN_USER_EMAIL='your-email@example.com'"
    echo "   export ATLASSIAN_API_TOKEN='your-api-token'"
    echo "   export ATLASSIAN_DOMAIN='your-site.atlassian.net'"
    echo ""
    echo "Or add them to your ~/.zshrc or ~/.bashrc"
    exit 1
fi

echo "🎫 Creating Jira ticket via REST API..."
echo ""

# Extract domain
DOMAIN=$(echo "$ATLASSIAN_DOMAIN" | sed 's|https://||' | sed 's|/.*||')

# Create Jira ticket via REST API
JIRA_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -u "${ATLASSIAN_USER_EMAIL}:${ATLASSIAN_API_TOKEN}" \
    "https://${DOMAIN}/rest/api/3/issue" \
    -d '{
      "fields": {
        "project": {
          "key": "KAN"
        },
        "summary": "[LLTC] Unit test for '"$METHOD_NAME"' in '"$FILE_PATH"'",
        "description": {
          "type": "doc",
          "version": 1,
          "content": [
            {
              "type": "heading",
              "attrs": { "level": 1 },
              "content": [{ "type": "text", "text": "LLTC Generation Request - DO-178C Compliance" }]
            },
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "File: '"$FILE_PATH"'" }]
            },
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "Method: '"$METHOD_NAME"'" }]
            },
            {
              "type": "paragraph",
              "content": [{ "type": "text", "text": "'"$ADDITIONAL_CONTEXT"'" }]
            }
          ]
        },
        "issuetype": {
          "name": "Task"
        },
        "labels": ["ai-generated-test", "lltc", "requires-review"]
      }
    }')

# Extract ticket key
JIRA_KEY=$(echo "$JIRA_RESPONSE" | jq -r '.key' 2>/dev/null)

if [ -z "$JIRA_KEY" ] || [ "$JIRA_KEY" = "null" ]; then
    echo "❌ Failed to create Jira ticket"
    echo "Response: $JIRA_RESPONSE"
    exit 1
fi

echo "✅ Created Jira ticket: $JIRA_KEY"
echo ""

# Create GitHub issue
echo "📝 Creating GitHub issue..."

ISSUE_BODY=$(cat << EOF
File: $FILE_PATH

\`\`\`typescript
$CODE_SNIPPET
\`\`\`

Additional Context:
$ADDITIONAL_CONTEXT

**Jira Ticket**: $JIRA_KEY
EOF
)

ISSUE_URL=$(gh issue create \
    --title "Test Request: $METHOD_NAME" \
    --body "$ISSUE_BODY" \
    --label "test-request")

echo "✅ Created GitHub issue: $ISSUE_URL"
echo ""
echo "=== Test Request Complete ==="
echo "Jira: https://your-domain.atlassian.net/browse/$JIRA_KEY"
echo "GitHub: $ISSUE_URL"
echo ""
echo "⏳ Claude Code will now generate tests automatically..."

