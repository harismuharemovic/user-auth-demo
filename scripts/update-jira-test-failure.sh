#!/bin/bash

# Update Jira Ticket on Test Generation Failure
# Usage: ./update-jira-test-failure.sh <jira-key> <failed-test-case-id> <github-issue-number> <validation-output>

set -e

if [ $# -lt 4 ]; then
    echo "Usage: $0 <jira-key> <failed-test-case-id> <github-issue-number> <validation-output>"
    exit 1
fi

JIRA_KEY="$1"
FAILED_TC="$2"
ISSUE_NUMBER="$3"
VALIDATION_OUTPUT="$4"

echo "=== Updating Jira Ticket on Test Failure ==="
echo "Jira: $JIRA_KEY"
echo "Failed Test Case: $FAILED_TC"
echo ""

# Check for Jira credentials
if [ -z "$ATLASSIAN_USER_EMAIL" ] || [ -z "$ATLASSIAN_API_TOKEN" ] || [ -z "$ATLASSIAN_DOMAIN" ]; then
    echo "⚠️  Warning: Missing Jira credentials, skipping Jira update"
    exit 0
fi

# Extract domain
DOMAIN=$(echo "$ATLASSIAN_DOMAIN" | sed 's|https://||' | sed 's|/.*||')

# Create comment body in Atlassian Document Format
COMMENT_BODY=$(cat << EOF
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 2 },
        "content": [
          { "type": "text", "text": "❌ AI Test Generation Failed" }
        ]
      },
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Automated test generation failed after 3 attempts." }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [
          { "type": "text", "text": "Failure Summary" }
        ]
      },
      {
        "type": "bulletList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Failed Test Case: ", "marks": [{"type": "strong"}] },
                  { "type": "text", "text": "$FAILED_TC" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "GitHub Issue: ", "marks": [{"type": "strong"}] },
                  { "type": "text", "text": "#$ISSUE_NUMBER" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Attempts: ", "marks": [{"type": "strong"}] },
                  { "type": "text", "text": "3 of 3" }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [
          { "type": "text", "text": "Recommendations" }
        ]
      },
      {
        "type": "orderedList",
        "content": [
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Review the input/output specifications in this ticket" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Verify the method implementation handles all specified cases" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Check if expected outputs are realistic and correct" }
                ]
              }
            ]
          },
          {
            "type": "listItem",
            "content": [
              {
                "type": "paragraph",
                "content": [
                  { "type": "text", "text": "Consider manual test creation or code fixes" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
EOF
)

# Add comment to Jira
echo "Adding comment to Jira ticket..."
COMMENT_RESPONSE=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -u "${ATLASSIAN_USER_EMAIL}:${ATLASSIAN_API_TOKEN}" \
    "https://${DOMAIN}/rest/api/3/issue/${JIRA_KEY}/comment" \
    -d "$COMMENT_BODY")

COMMENT_ID=$(echo "$COMMENT_RESPONSE" | jq -r '.id' 2>/dev/null)

if [ -z "$COMMENT_ID" ] || [ "$COMMENT_ID" = "null" ]; then
    echo "⚠️  Warning: Failed to add comment to Jira"
    echo "Response: $COMMENT_RESPONSE"
else
    echo "✅ Comment added to Jira ticket"
fi

# Add label
echo "Adding failure label to Jira ticket..."
LABEL_RESPONSE=$(curl -s -X PUT \
    -H "Content-Type: application/json" \
    -u "${ATLASSIAN_USER_EMAIL}:${ATLASSIAN_API_TOKEN}" \
    "https://${DOMAIN}/rest/api/3/issue/${JIRA_KEY}" \
    -d '{
      "update": {
        "labels": [
          {"add": "test-generation-failed"}
        ]
      }
    }')

echo "✅ Jira ticket updated"
echo ""
echo "View ticket: https://${DOMAIN}/browse/${JIRA_KEY}"

