#!/bin/bash

# Test Workflow Setup Verification Script
# Checks that all required secrets and configurations are in place

set -e

echo "=================================="
echo "Test Workflow Setup Verification"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check gh CLI is installed
echo "1. Checking GitHub CLI..."
if command_exists gh; then
    echo -e "${GREEN}✓${NC} GitHub CLI is installed"
else
    echo -e "${RED}✗${NC} GitHub CLI is not installed"
    echo "   Install from: https://cli.github.com/"
    ((errors++))
fi
echo ""

# Check if we're in a git repository
echo "2. Checking Git repository..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Inside a Git repository"
    
    # Check if authenticated with gh
    if gh auth status > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Authenticated with GitHub CLI"
    else
        echo -e "${RED}✗${NC} Not authenticated with GitHub CLI"
        echo "   Run: gh auth login"
        ((errors++))
    fi
else
    echo -e "${RED}✗${NC} Not in a Git repository"
    ((errors++))
fi
echo ""

# Check GitHub secrets
echo "3. Checking GitHub Secrets..."

check_secret() {
    local secret_name=$1
    local required=$2
    
    if gh secret list 2>/dev/null | grep -q "^${secret_name}"; then
        echo -e "${GREEN}✓${NC} ${secret_name} is configured"
        return 0
    else
        if [ "$required" = "required" ]; then
            echo -e "${RED}✗${NC} ${secret_name} is NOT configured (required)"
            ((errors++))
        else
            echo -e "${YELLOW}⚠${NC} ${secret_name} is NOT configured (optional for test workflow without Jira)"
            ((warnings++))
        fi
        return 1
    fi
}

# Check required secrets
check_secret "ANTHROPIC_API_KEY" "required"
check_secret "ATLASSIAN_USER_EMAIL" "optional"
check_secret "ATLASSIAN_API_TOKEN" "optional"
check_secret "ATLASSIAN_CLOUD_ID" "optional"

echo ""

# Check if all Atlassian secrets are present or all absent
atlassian_count=$(gh secret list 2>/dev/null | grep -c "ATLASSIAN" || echo "0")
if [ "$atlassian_count" -gt 0 ] && [ "$atlassian_count" -lt 3 ]; then
    echo -e "${YELLOW}⚠${NC} Partial Atlassian configuration detected"
    echo "   You have $atlassian_count of 3 Atlassian secrets configured."
    echo "   For Jira integration, you need all 3:"
    echo "   - ATLASSIAN_USER_EMAIL"
    echo "   - ATLASSIAN_API_TOKEN"
    echo "   - ATLASSIAN_CLOUD_ID"
    ((warnings++))
fi

echo ""

# Check workflow files
echo "4. Checking Workflow Files..."

check_workflow() {
    local workflow_name=$1
    local workflow_path=".github/workflows/${workflow_name}"
    
    if [ -f "$workflow_path" ]; then
        echo -e "${GREEN}✓${NC} ${workflow_name} exists"
        return 0
    else
        echo -e "${RED}✗${NC} ${workflow_name} is missing"
        ((errors++))
        return 1
    fi
}

check_workflow "test-orchestrator.yml"
check_workflow "claude-test-generator.yml"
check_workflow "test-review-enforcement.yml"
check_workflow "ci.yml"

echo ""

# Check for required branch
echo "5. Checking Required Branches..."
if git rev-parse --verify to-be-reviewed-tests > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 'to-be-reviewed-tests' branch exists locally"
elif git ls-remote --heads origin to-be-reviewed-tests | grep -q to-be-reviewed-tests; then
    echo -e "${GREEN}✓${NC} 'to-be-reviewed-tests' branch exists remotely"
    echo -e "${YELLOW}ℹ${NC} Run: git fetch && git checkout to-be-reviewed-tests"
else
    echo -e "${RED}✗${NC} 'to-be-reviewed-tests' branch does not exist"
    echo "   Create it with: git checkout -b to-be-reviewed-tests && git push -u origin to-be-reviewed-tests"
    ((errors++))
fi

echo ""

# Check test framework
echo "6. Checking Test Framework..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
    
    # Check for test script
    if grep -q '"test"' package.json; then
        echo -e "${GREEN}✓${NC} Test script is defined"
    else
        echo -e "${RED}✗${NC} Test script is not defined in package.json"
        ((errors++))
    fi
    
    # Check for test frameworks
    if grep -q '"playwright"' package.json || grep -q '"@playwright/test"' package.json; then
        echo -e "${GREEN}✓${NC} Playwright is installed"
    else
        echo -e "${YELLOW}⚠${NC} Playwright not found in package.json"
        ((warnings++))
    fi
    
    if grep -q '"vitest"' package.json; then
        echo -e "${GREEN}✓${NC} Vitest is installed"
    else
        echo -e "${YELLOW}⚠${NC} Vitest not found in package.json"
        ((warnings++))
    fi
else
    echo -e "${RED}✗${NC} package.json not found"
    ((errors++))
fi

echo ""

# Check documentation
echo "7. Checking Documentation..."
check_doc() {
    local doc_name=$1
    local doc_path="documentation/${doc_name}"
    
    if [ -f "$doc_path" ]; then
        echo -e "${GREEN}✓${NC} ${doc_name} exists"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} ${doc_name} is missing"
        ((warnings++))
        return 1
    fi
}

check_doc "atlassian-mcp-setup.md"
check_doc "test-workflow-quick-reference.md"
check_doc "test-workflow-fixes-summary.md"

echo ""

# Summary
echo "=================================="
echo "Summary"
echo "=================================="
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Your test workflow is properly configured."
    echo ""
    echo "Next steps:"
    echo "1. Create a GitHub issue with the test-request label"
    echo "2. Watch the workflow create a Jira ticket and generate tests"
    echo "3. Review the PR when it's created"
    echo ""
    echo "See documentation/test-workflow-quick-reference.md for usage."
    exit 0
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup is functional with $warnings warning(s)${NC}"
    echo ""
    echo "Your basic setup is working, but you may want to address the warnings above."
    echo ""
    if [ "$atlassian_count" -lt 3 ]; then
        echo "Note: Without Atlassian secrets, Jira integration won't work."
        echo "The workflow will still generate tests, but won't create Jira tickets."
        echo ""
        echo "To enable Jira integration, see: documentation/atlassian-mcp-setup.md"
    fi
    echo ""
    exit 0
else
    echo -e "${RED}✗ Setup has $errors error(s) and $warnings warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before using the test workflow."
    echo ""
    echo "For help, see:"
    echo "- documentation/atlassian-mcp-setup.md"
    echo "- documentation/test-workflow-fixes-summary.md"
    echo ""
    exit 1
fi

