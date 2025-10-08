#!/usr/bin/env node

/**
 * I/O Table Validator - Validates Jira ticket has proper input/output table
 * 
 * Expected table format in Jira description:
 * | Test Case ID | Input Parameters | Expected Output | Notes |
 * |--------------|------------------|-----------------|-------|
 * | TC-001       | input1, input2   | output1         | Happy path |
 * 
 * Usage: node validate-io-table.js <jira-description-text>
 */

const validateIOTable = (descriptionText) => {
  if (!descriptionText) {
    return { valid: false, error: 'No description provided' };
  }

  // Look for markdown table pattern
  const tableRegex = /\|\s*Test Case ID\s*\|\s*Input Parameters\s*\|\s*Expected Output\s*\|\s*Notes\s*\|/i;
  const hasHeader = tableRegex.test(descriptionText);

  if (!hasHeader) {
    return { 
      valid: false, 
      error: 'Missing I/O table header. Expected: | Test Case ID | Input Parameters | Expected Output | Notes |' 
    };
  }

  // Extract table rows (skip header and separator)
  const lines = descriptionText.split('\n');
  const headerIndex = lines.findIndex(line => tableRegex.test(line));
  
  if (headerIndex === -1) {
    return { valid: false, error: 'Could not locate table header' };
  }

  // Skip header and separator line
  const dataRows = lines.slice(headerIndex + 2).filter(line => {
    // Match table row: | TC-001 | ... | ... | ... |
    return line.trim().startsWith('|') && line.trim().endsWith('|') && line.split('|').length >= 5;
  });

  if (dataRows.length === 0) {
    return { 
      valid: false, 
      error: 'No test case rows found in table. Add at least one test case.' 
    };
  }

  // Parse and validate rows
  const testCases = [];
  const errors = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);

    if (cells.length < 4) {
      errors.push(`Row ${i + 1}: Insufficient columns (expected 4, got ${cells.length})`);
      continue;
    }

    const [id, inputs, expectedOutput, notes] = cells;

    // Validate Test Case ID format
    if (!id || !id.match(/^TC-\d+$/i)) {
      errors.push(`Row ${i + 1}: Invalid Test Case ID "${id}". Expected format: TC-001`);
    }

    // Validate inputs are not empty
    if (!inputs || inputs.trim() === '') {
      errors.push(`Row ${i + 1}: Empty Input Parameters for ${id}`);
    }

    // Validate expected output is not empty
    if (!expectedOutput || expectedOutput.trim() === '') {
      errors.push(`Row ${i + 1}: Empty Expected Output for ${id}`);
    }

    testCases.push({
      id: id,
      inputs: inputs,
      expectedOutput: expectedOutput,
      notes: notes || ''
    });
  }

  if (errors.length > 0) {
    return { 
      valid: false, 
      error: 'Table validation errors:\n' + errors.join('\n') 
    };
  }

  return { 
    valid: true, 
    testCases,
    count: testCases.length
  };
};

// CLI usage
if (require.main === module) {
  const input = process.argv.slice(2).join(' ');
  
  if (!input) {
    console.error('Usage: node validate-io-table.js <jira-description-text>');
    process.exit(1);
  }

  const result = validateIOTable(input);
  
  if (result.valid) {
    console.log('✅ Valid I/O table');
    console.log(`Found ${result.count} test case(s):`);
    result.testCases.forEach(tc => {
      console.log(`  - ${tc.id}: ${tc.inputs} → ${tc.expectedOutput}`);
    });
    process.exit(0);
  } else {
    console.error('❌ Invalid I/O table');
    console.error(result.error);
    process.exit(1);
  }
}

module.exports = { validateIOTable };

