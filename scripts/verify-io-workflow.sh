#!/bin/bash

# Verify I/O-Driven Test Workflow Setup

echo "=== Verifying I/O-Driven Test Workflow Setup ==="
echo ""

ERRORS=0

# Check scripts
echo "📄 Checking Scripts..."

SCRIPTS=(
    "scripts/create-test-request-from-jira.sh"
    "scripts/download-approved-test.sh"
    "scripts/validate-io-table.js"
    "scripts/validate-test-io.js"
    "scripts/update-jira-test-failure.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "  ✅ $script (executable)"
        else
            echo "  ⚠️  $script (not executable)"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo "  ❌ $script (missing)"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Check workflows
echo "⚙️  Checking Workflows..."

WORKFLOWS=(
    ".github/workflows/iterative-test-generation.yml"
    ".github/workflows/test-orchestrator.yml"
    ".github/workflows/claude.yml"
    ".github/workflows/test-and-pr.yml"
)

for workflow in "${WORKFLOWS[@]}"; do
    if [ -f "$workflow" ]; then
        echo "  ✅ $workflow"
    else
        echo "  ❌ $workflow (missing)"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""

# Check folders
echo "📁 Checking Folders..."

if [ -d "unapproved-tests" ]; then
    echo "  ✅ unapproved-tests/ exists"
else
    echo "  ❌ unapproved-tests/ missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check documentation
echo "📚 Checking Documentation..."

DOCS=(
    "IO_TEST_WORKFLOW.md"
    "JIRA_TICKET_TEMPLATE.md"
    "GITHUB_SECRETS_SETUP.md"
    "IMPLEMENTATION_COMPLETE.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ⚠️  $doc (missing)"
    fi
done

echo ""

# Check environment variables
echo "🔐 Checking Environment Variables..."

if [ -z "$ATLASSIAN_USER_EMAIL" ]; then
    echo "  ⚠️  ATLASSIAN_USER_EMAIL not set (optional for Jira integration)"
else
    echo "  ✅ ATLASSIAN_USER_EMAIL set"
fi

if [ -z "$ATLASSIAN_API_TOKEN" ]; then
    echo "  ⚠️  ATLASSIAN_API_TOKEN not set (optional for Jira integration)"
else
    echo "  ✅ ATLASSIAN_API_TOKEN set"
fi

if [ -z "$ATLASSIAN_DOMAIN" ]; then
    echo "  ⚠️  ATLASSIAN_DOMAIN not set (optional for Jira integration)"
else
    echo "  ✅ ATLASSIAN_DOMAIN set"
fi

echo ""

# Check Node.js
echo "🟢 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js installed: $NODE_VERSION"
else
    echo "  ❌ Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check GitHub CLI
echo "🐙 Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    GH_VERSION=$(gh --version | head -1)
    echo "  ✅ GitHub CLI installed: $GH_VERSION"
else
    echo "  ❌ GitHub CLI not found"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Summary
echo "=== Summary ==="
if [ $ERRORS -eq 0 ]; then
    echo "✅ All checks passed! I/O-driven workflow is ready."
    echo ""
    echo "Next steps:"
    echo "  1. Set GitHub secrets (see GITHUB_SECRETS_SETUP.md)"
    echo "  2. Create Jira ticket with I/O table (see JIRA_TICKET_TEMPLATE.md)"
    echo "  3. Run: ./scripts/create-test-request-from-jira.sh <jira-key>"
    exit 0
else
    echo "❌ Found $ERRORS error(s). Please fix before using workflow."
    exit 1
fi

