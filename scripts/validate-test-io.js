#!/usr/bin/env node

/**
 * Test I/O Validator - Validates test results against expected I/O specifications
 * 
 * This script:
 * 1. Parses GitHub issue to extract I/O table
 * 2. Parses Vitest JSON output
 * 3. Matches test cases to I/O requirements
 * 4. Reports pass/fail status for each test case
 * 
 * Usage: node validate-test-io.js <issue-number> <vitest-json-output-file>
 */

const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Parse I/O table from issue body
 */
function parseIOTable(issueBody) {
  const lines = issueBody.split('\n');
  
  // Find table start
  const headerRegex = /\|\s*Test Case ID\s*\|\s*Input Parameters\s*\|\s*Expected Output\s*\|\s*Notes\s*\|/i;
  const headerIndex = lines.findIndex(line => headerRegex.test(line));
  
  if (headerIndex === -1) {
    throw new Error('No I/O table found in issue');
  }
  
  // Parse data rows (skip header and separator)
  const testCases = [];
  for (let i = headerIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Stop at end of table
    if (!line.startsWith('|') || !line.endsWith('|')) {
      break;
    }
    
    const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
    
    if (cells.length >= 4) {
      const [id, inputs, expectedOutput, notes] = cells;
      testCases.push({ id, inputs, expectedOutput, notes });
    }
  }
  
  return testCases;
}

/**
 * Parse Vitest JSON output
 */
function parseVitestOutput(jsonFile) {
  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  
  const results = [];
  
  // Vitest JSON format: { testResults: [ { assertionResults: [...] } ] }
  if (data.testResults) {
    data.testResults.forEach(testFile => {
      testFile.assertionResults.forEach(test => {
        results.push({
          fullName: test.fullName || test.title,
          ancestorTitles: test.ancestorTitles || [],
          status: test.status, // 'passed' or 'failed'
          failureMessages: test.failureMessages || []
        });
      });
    });
  }
  
  return results;
}

/**
 * Match test results to I/O requirements
 */
function matchTestCases(ioTable, testResults) {
  const matches = [];
  const unmatchedTests = [...testResults];
  
  for (const ioCase of ioTable) {
    // Look for test that mentions this test case ID
    const testIndex = unmatchedTests.findIndex(test => {
      const fullName = test.fullName.toLowerCase();
      const ancestors = test.ancestorTitles.join(' ').toLowerCase();
      const searchText = (fullName + ' ' + ancestors).toLowerCase();
      return searchText.includes(ioCase.id.toLowerCase());
    });
    
    if (testIndex !== -1) {
      const test = unmatchedTests[testIndex];
      unmatchedTests.splice(testIndex, 1);
      
      matches.push({
        testCaseId: ioCase.id,
        inputs: ioCase.inputs,
        expectedOutput: ioCase.expectedOutput,
        notes: ioCase.notes,
        matched: true,
        passed: test.status === 'passed',
        testName: test.fullName,
        failureMessages: test.failureMessages
      });
    } else {
      // Test case not found
      matches.push({
        testCaseId: ioCase.id,
        inputs: ioCase.inputs,
        expectedOutput: ioCase.expectedOutput,
        notes: ioCase.notes,
        matched: false,
        passed: false,
        testName: null,
        failureMessages: ['Test case not found - no test matches this ID']
      });
    }
  }
  
  return { matches, unmatchedTests };
}

/**
 * Generate validation report
 */
function generateReport(matches, unmatchedTests) {
  const passed = matches.filter(m => m.matched && m.passed);
  const failed = matches.filter(m => !m.passed);
  
  const report = {
    totalTestCases: matches.length,
    passedCount: passed.length,
    failedCount: failed.length,
    allPassed: failed.length === 0,
    matches,
    unmatchedTests
  };
  
  return report;
}

/**
 * Format report for display
 */
function formatReport(report) {
  let output = '\n=== Test I/O Validation Report ===\n\n';
  
  output += `Total Test Cases: ${report.totalTestCases}\n`;
  output += `Passed: ${report.passedCount}\n`;
  output += `Failed: ${report.failedCount}\n\n`;
  
  if (report.allPassed) {
    output += '✅ All test cases passed!\n\n';
  } else {
    output += '❌ Some test cases failed\n\n';
  }
  
  output += '### Test Case Results:\n\n';
  
  for (const match of report.matches) {
    const status = match.matched && match.passed ? '✅' : '❌';
    output += `${status} ${match.testCaseId}\n`;
    output += `   Inputs: ${match.inputs}\n`;
    output += `   Expected: ${match.expectedOutput}\n`;
    
    if (match.matched) {
      output += `   Test: ${match.testName}\n`;
      if (!match.passed) {
        output += `   Error: ${match.failureMessages[0] || 'Unknown error'}\n`;
      }
    } else {
      output += `   Error: Test case not found in test results\n`;
    }
    
    output += '\n';
  }
  
  if (report.unmatchedTests.length > 0) {
    output += '\n### Unmatched Tests (no TC-XXX ID):\n\n';
    for (const test of report.unmatchedTests) {
      output += `- ${test.fullName} [${test.status}]\n`;
    }
  }
  
  return output;
}

/**
 * Generate retry guidance for Claude
 */
function generateRetryGuidance(report, attemptNumber) {
  const failed = report.matches.filter(m => !m.passed);
  const passed = report.matches.filter(m => m.matched && m.passed);
  
  let guidance = `### Test Attempt ${attemptNumber} Failed\n\n`;
  guidance += `Please fix the following test cases. You have ${3 - attemptNumber} attempt(s) remaining.\n\n`;
  
  guidance += `**Failed Test Cases:**\n\n`;
  for (const fail of failed) {
    guidance += `- **${fail.testCaseId}**: ${fail.notes || 'No notes'}\n`;
    guidance += `  - Inputs: \`${fail.inputs}\`\n`;
    guidance += `  - Expected Output: \`${fail.expectedOutput}\`\n`;
    
    if (fail.matched) {
      guidance += `  - Current Test: \`${fail.testName}\`\n`;
      guidance += `  - Error: ${fail.failureMessages[0] || 'Test failed'}\n`;
    } else {
      guidance += `  - Error: No test found for this test case ID\n`;
      guidance += `  - Action Required: Create a test with \`describe('methodName - ${fail.testCaseId}', ...)\`\n`;
    }
    
    guidance += '\n';
  }
  
  if (passed.length > 0) {
    guidance += `\n**Passing Test Cases (keep these working):**\n`;
    guidance += passed.map(p => `- ${p.testCaseId}`).join('\n') + '\n';
  }
  
  guidance += `\n**Instructions:**\n`;
  guidance += `1. Review the failed test cases above\n`;
  guidance += `2. Update your test file to handle these specific inputs and outputs\n`;
  guidance += `3. Ensure test naming follows the pattern: \`describe('methodName - TC-XXX')\`\n`;
  guidance += `4. Push your changes - tests will run automatically\n`;
  
  return guidance;
}

// CLI usage
async function main() {
  if (process.argv.length < 4) {
    console.error('Usage: node validate-test-io.js <issue-number> <vitest-json-file>');
    process.exit(1);
  }
  
  const issueNumber = process.argv[2];
  const vitestJsonFile = process.argv[3];
  
  try {
    // Get issue body
    console.log(`Fetching issue #${issueNumber}...`);
    const issueBody = execSync(`gh issue view ${issueNumber} --json body --jq '.body'`, {
      encoding: 'utf-8'
    });
    
    // Parse I/O table
    console.log('Parsing I/O requirements...');
    const ioTable = parseIOTable(issueBody);
    console.log(`Found ${ioTable.length} test case(s)`);
    
    // Parse test results
    console.log('Parsing test results...');
    const testResults = parseVitestOutput(vitestJsonFile);
    console.log(`Found ${testResults.length} test result(s)`);
    
    // Match and validate
    const { matches, unmatchedTests } = matchTestCases(ioTable, testResults);
    const report = generateReport(matches, unmatchedTests);
    
    // Output report
    console.log(formatReport(report));
    
    // Output JSON for workflow
    const outputFile = process.env.OUTPUT_FILE || '/tmp/validation-report.json';
    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`\nDetailed report saved to: ${outputFile}`);
    
    // Exit with appropriate code
    process.exit(report.allPassed ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseIOTable,
  parseVitestOutput,
  matchTestCases,
  generateReport,
  formatReport,
  generateRetryGuidance
};

