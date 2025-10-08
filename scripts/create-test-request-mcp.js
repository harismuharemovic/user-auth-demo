#!/usr/bin/env node

/**
 * Create Test Request using Atlassian MCP
 * This uses the configured MCP to create Jira tickets properly
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.log('Usage: node create-test-request-mcp.js <file-path> <method-name> [additional-context]');
  console.log('Example: node create-test-request-mcp.js src/lib/utils.ts cn "Test empty inputs"');
  process.exit(1);
}

const filePath = process.argv[2];
const methodName = process.argv[3];
const additionalContext = process.argv[4] || 'Test with various inputs and edge cases';

console.log('=== Creating LLTC Test Request via MCP ===');
console.log(`File: ${filePath}`);
console.log(`Method: ${methodName}`);
console.log('');

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`❌ Error: File ${filePath} not found`);
  process.exit(1);
}

// Read and extract code
const fileContent = fs.readFileSync(filePath, 'utf-8');
const codeLines = fileContent.split('\n');
const codeSnippet = codeLines.slice(0, Math.min(20, codeLines.length)).join('\n');

console.log('📖 Code extracted');
console.log('');

// Create prompt for Claude with MCP
const prompt = `Create a Jira LLTC ticket for DO-178C aerospace certification testing.

**Project**: SCRUM (or select an appropriate project)
**Summary**: [LLTC] Unit test for ${methodName} in ${filePath}

**Description**:
# LLTC Generation Request - DO-178C Compliance

## Source Information
- File Path: ${filePath}
- Method/Function: ${methodName}

## Code to Test
\`\`\`typescript
${codeSnippet}
\`\`\`

## Test Requirements
- Test Type: LLTC (Low Level Test Case) - Unit test level
- Coverage Target: 100% statement and branch coverage
- Test all code paths, edge cases, and error conditions

## Additional Context
${additionalContext}

## Acceptance Criteria
- [ ] Test file created with comprehensive test cases
- [ ] All tests pass successfully
- [ ] Code coverage meets 100% target
- [ ] Tests follow DO-178C traceability requirements

**Labels**: ai-generated-test, lltc, requires-review
**Priority**: Medium

After creating the ticket, respond with ONLY the ticket key (e.g., SCRUM-123) on the last line.`;

console.log('🎫 Creating Jira ticket via Atlassian MCP...');
console.log('');

// Call Claude with MCP
const claude = spawn('npx', [
  '-y',
  '@anthropic-ai/claude-code',
  '-p',
  prompt,
  '--model',
  'claude-sonnet-4-20250514'
], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: {
    ...process.env,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY
  }
});

let output = '';
let errorOutput = '';

claude.stdout.on('data', (data) => {
  output += data.toString();
});

claude.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

claude.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Failed to create Jira ticket');
    console.error('Error:', errorOutput);
    process.exit(1);
  }

  // Extract Jira key from output
  const jiraKeyMatch = output.match(/([A-Z]+-\d+)/);
  const jiraKey = jiraKeyMatch ? jiraKeyMatch[1] : null;

  if (!jiraKey) {
    console.error('❌ Could not extract Jira ticket key from response');
    console.error('Output:', output);
    process.exit(1);
  }

  console.log(`✅ Created Jira ticket: ${jiraKey}`);
  console.log('');

  // Create GitHub issue
  console.log('📝 Creating GitHub issue...');

  const issueBody = `File: ${filePath}

\`\`\`typescript
${codeSnippet}
\`\`\`

Additional Context:
${additionalContext}

**Jira Ticket**: ${jiraKey}`;

  const gh = spawn('gh', [
    'issue',
    'create',
    '--title',
    `Test Request: ${methodName}`,
    '--body',
    issueBody,
    '--label',
    'test-request'
  ]);

  let ghOutput = '';

  gh.stdout.on('data', (data) => {
    ghOutput += data.toString();
  });

  gh.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to create GitHub issue');
      process.exit(1);
    }

    const issueUrl = ghOutput.trim();
    console.log(`✅ Created GitHub issue: ${issueUrl}`);
    console.log('');
    console.log('=== Test Request Complete ===');
    console.log(`Jira: https://haris-muharemovic.atlassian.net/browse/${jiraKey}`);
    console.log(`GitHub: ${issueUrl}`);
    console.log('');
    console.log('⏳ Claude Code will now generate tests automatically...');
  });
});

