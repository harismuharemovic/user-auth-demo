# Test Validation Failure Report

**Attempt:** 1/3
**Remaining Attempts:** 2
**Timestamp:** 2025-10-08 15:35:01 UTC

## Validation Results

```
Fetching issue #30...
Parsing I/O requirements...
Found 3 test case(s)
Parsing test results...
Found 127 test result(s)

=== Test I/O Validation Report ===

Total Test Cases: 3
Passed: 0
Failed: 3

❌ Some test cases failed

### Test Case Results:

❌ TC-001
   Inputs: 3, 6, 9
   Expected: 12
   Test: calculateAverage - TC-001 should return 12 when given inputs (3, 6, 9)
   Error: AssertionError: expected 6 to be 12 // Object.is equality
    at /home/runner/work/user-auth-demo/user-auth-demo/tests/calculateAverage.test.ts:30:20
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at runSuite (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)

❌ TC-002
   Inputs: 10, 20, 30
   Expected: 30
   Test: calculateAverage - TC-002 should return 30 when given inputs (10, 20, 30)
   Error: AssertionError: expected 20 to be 30 // Object.is equality
    at /home/runner/work/user-auth-demo/user-auth-demo/tests/calculateAverage.test.ts:46:20
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at runSuite (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)

❌ TC-003
   Inputs: 5, 5, 5
   Expected: 10
   Test: calculateAverage - TC-003 should return 10 when given inputs (5, 5, 5)
   Error: AssertionError: expected 5 to be 10 // Object.is equality
    at /home/runner/work/user-auth-demo/user-auth-demo/tests/calculateAverage.test.ts:62:20
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:155:11
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:752:26
    at file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1897:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1863:10)
    at runTest (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1574:12)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at runSuite (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)
    at runSuite (file:///home/runner/work/user-auth-demo/user-auth-demo/node_modules/@vitest/runner/dist/chunk-hooks.js:1729:8)


### Unmatched Tests (no TC-XXX ID):

- calculateAverage - Coverage Tests should handle zero values correctly [passed]
- calculateAverage - Coverage Tests should handle negative numbers correctly [passed]
- calculateAverage - Coverage Tests should handle mixed positive and negative numbers [passed]
- calculateAverage - Coverage Tests should handle decimal numbers correctly [passed]
- toPascalCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle empty string [passed]
- toPascalCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle string with only whitespace [passed]
- toPascalCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle string with multiple spaces [passed]
- toPascalCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle tabs and newlines [passed]
- toPascalCase function Single word inputs (DO-178C: Boundary Value Coverage) should capitalize single lowercase word [passed]
- toPascalCase function Single word inputs (DO-178C: Boundary Value Coverage) should maintain single uppercase word [passed]
- toPascalCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle mixed case single word [passed]
- toPascalCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle single character lowercase [passed]
- toPascalCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle single character uppercase [passed]
- toPascalCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle single word with leading/trailing spaces [passed]
- toPascalCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should convert space-separated words [passed]
- toPascalCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should convert three words [passed]
- toPascalCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle multiple spaces between words [passed]
- toPascalCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle mixed separators [passed]
- toPascalCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle already PascalCase input [passed]
- toPascalCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle already camelCase input [passed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle words with numbers [passed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle leading numbers [passed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle hyphenated words [failed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle underscored words [passed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle mixed special characters [failed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle punctuation [passed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle Unicode characters [passed]
- toPascalCase function Special characters (DO-178C: Robustness Coverage) should handle accented characters [failed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle very long strings [passed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle string with only numbers [passed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle string with only special characters [passed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle consecutive capital letters [passed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle single letter words [passed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle alternating case [passed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle words with apostrophes [failed]
- toPascalCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle empty components after split [passed]
- toPascalCase function Regex pattern validation (DO-178C: Decision Coverage) should match word boundaries correctly [passed]
- toPascalCase function Regex pattern validation (DO-178C: Decision Coverage) should handle first character of string [passed]
- toPascalCase function Regex pattern validation (DO-178C: Decision Coverage) should handle capital letters in middle [passed]
- toPascalCase function Regex pattern validation (DO-178C: Decision Coverage) should handle word boundaries with punctuation [failed]
- toCamelCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle empty string [passed]
- toCamelCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle string with only whitespace [passed]
- toCamelCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle string with multiple spaces [passed]
- toCamelCase function Empty and null inputs (DO-178C: Error Condition Coverage) should handle tabs and newlines [passed]
- toCamelCase function Single word inputs (DO-178C: Boundary Value Coverage) should lowercase single uppercase word [passed]
- toCamelCase function Single word inputs (DO-178C: Boundary Value Coverage) should maintain single lowercase word [passed]
- toCamelCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle mixed case single word [passed]
- toCamelCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle single character uppercase [passed]
- toCamelCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle single character lowercase [passed]
- toCamelCase function Single word inputs (DO-178C: Boundary Value Coverage) should handle single word with leading/trailing spaces [failed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should convert space-separated words to camelCase [passed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should convert three words to camelCase [passed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle multiple spaces between words [passed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle mixed separators [passed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle already camelCase input [passed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle PascalCase input [passed]
- toCamelCase function Multiple word inputs (DO-178C: Nominal Case Coverage) should handle all uppercase input [passed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle words with numbers [passed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle leading numbers [passed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle hyphenated words [failed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle underscored words [passed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle mixed special characters [failed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle punctuation [passed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle Unicode characters [passed]
- toCamelCase function Special characters (DO-178C: Robustness Coverage) should handle accented characters [failed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle very long strings [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle string with only numbers [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle string with only special characters [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle consecutive capital letters [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle single letter words [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle alternating case [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle words with apostrophes [passed]
- toCamelCase function Complex edge cases (DO-178C: Stress Test Coverage) should handle empty components after split [passed]
- toCamelCase function Regex pattern validation (DO-178C: Decision Coverage) should match word boundaries correctly [passed]
- toCamelCase function Regex pattern validation (DO-178C: Decision Coverage) should handle first character of string correctly [passed]
- toCamelCase function Regex pattern validation (DO-178C: Decision Coverage) should handle capital letters in middle [passed]
- toCamelCase function Regex pattern validation (DO-178C: Decision Coverage) should handle word boundaries with punctuation [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "hello world" [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "test case example" [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "a b c" [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "HTML CSS" [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "hello123 world456" [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "special@chars test" [passed]
- Cross-function validation (DO-178C: Integration Coverage) toPascalCase and toCamelCase consistency should produce consistent results for "" [passed]
- Cross-function validation (DO-178C: Integration Coverage) Round-trip conversion validation should maintain consistency in round-trip conversions [passed]
- Integration with validateVariableName (DO-178C: System Integration) Generated names should be valid identifiers should generate valid Pascal case identifiers [passed]
- Integration with validateVariableName (DO-178C: System Integration) Generated names should be valid identifiers should generate valid camel case identifiers [passed]
- Integration with validateVariableName (DO-178C: System Integration) Generated names should be valid identifiers should handle inputs that produce invalid identifiers [passed]
- Performance and memory validation (DO-178C: Resource Usage) Performance characteristics should handle reasonable string sizes efficiently [passed]
- Performance and memory validation (DO-178C: Resource Usage) Performance characteristics should produce deterministic results [passed]
- cn utility function Empty inputs should return empty string when no arguments provided [passed]
- cn utility function Empty inputs should handle empty string input [passed]
- cn utility function Empty inputs should handle multiple empty strings [passed]
- cn utility function Single class string should return single class unchanged [passed]
- cn utility function Single class string should return single class with spaces trimmed [passed]
- cn utility function Single class string should handle single class with multiple words [passed]
- cn utility function Multiple class strings should concatenate multiple class strings [passed]
- cn utility function Multiple class strings should handle multiple class strings with spaces [passed]
- cn utility function Multiple class strings should handle mixed empty and non-empty strings [passed]
- cn utility function Array inputs should handle array of classes [passed]
- cn utility function Array inputs should handle nested arrays [passed]
- cn utility function Array inputs should handle arrays with empty strings [passed]
- cn utility function Array inputs should handle mixed array and string inputs [passed]
- cn utility function Object inputs with conditional classes should handle object with truthy conditions [passed]
- cn utility function Object inputs with conditional classes should handle object with falsy conditions [passed]
- cn utility function Object inputs with conditional classes should handle object with mixed condition types [passed]
- cn utility function Object inputs with conditional classes should handle mixed object and string inputs [passed]
- cn utility function Tailwind class merging should merge conflicting padding classes (later wins) [passed]
- cn utility function Tailwind class merging should merge conflicting margin classes [passed]
- cn utility function Tailwind class merging should merge conflicting background colors [passed]
- cn utility function Tailwind class merging should merge conflicting text colors [passed]
- cn utility function Tailwind class merging should preserve non-conflicting classes while merging conflicting ones [failed]
- cn utility function Tailwind class merging should handle complex conflicting class scenarios [failed]
- cn utility function Null and undefined handling should handle null values [passed]
- cn utility function Null and undefined handling should handle undefined values [passed]
- cn utility function Null and undefined handling should handle mixed null/undefined with other types [passed]
- cn utility function Edge cases and complex scenarios should handle very long class lists [passed]
- cn utility function Edge cases and complex scenarios should handle deeply nested arrays and objects [failed]
- cn utility function Edge cases and complex scenarios should handle special characters in class names [passed]
- cn utility function Edge cases and complex scenarios should handle responsive and state variants with conflicts [failed]
- cn utility function Edge cases and complex scenarios should maintain order for non-conflicting responsive classes [passed]
- cn utility function Performance and consistency should return consistent results for identical inputs [passed]
- cn utility function Performance and consistency should handle empty array efficiently [passed]
- cn utility function Performance and consistency should handle empty object efficiently [passed]


Detailed report saved to: /tmp/validation-report.json
```

## Instructions for AI Test Generator

The tests you generated do not match the expected input/output specifications in the GitHub issue.

**Critical Requirements:**
1. Each test case must use the EXACT expected output from the I/O table
2. Test naming must follow: `describe('methodName - TC-XXX', ...)`
3. Review the validation errors above - they show what your tests returned vs. what was expected
4. DO NOT change expected values based on code analysis - use ONLY the specified values

**What to fix:**
- Review each failed TC-XXX case above
- Update the assertions in your test file to match the Expected Output column
- Ensure test descriptions match the pattern for validation to work

Please regenerate the test file with corrections and push your changes.
