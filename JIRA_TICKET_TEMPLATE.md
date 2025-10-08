# Jira Ticket Template for I/O-Driven Test Generation

## Summary
```
[LLTC-IO] Unit test for <method-name> in <file-path>
```

## Description

### File and Method Information
```
File: src/lib/utils.ts
Method: myFunction
```

### Method Code
```typescript
export function myFunction(input: string, options?: Options): string {
  if (!input) {
    throw new Error('Input is required');
  }
  
  return input.toUpperCase();
}
```

### Required Input/Output Test Cases

| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | "hello", undefined | "HELLO" | Basic uppercase conversion |
| TC-002       | "test", {trim: true} | "TEST" | With options object |
| TC-003       | "", undefined | Error thrown | Empty string should error |
| TC-004       | null, undefined | Error thrown | Null should error |
| TC-005       | "ALREADY_UPPER", undefined | "ALREADY_UPPER" | Already uppercase |
| TC-006       | "mixed CaSe 123", undefined | "MIXED CASE 123" | Mixed case with numbers |

### Additional Context
- Test all edge cases for input validation
- Verify error messages match expected format
- Ensure deterministic behavior (no random values)

---

## Labels
- `ai-generated-test`
- `lltc`
- `requires-review`

## Issue Type
Task

## Project
KAN (or your project key)

---

## Notes

### Input Parameters Format
- Use comma-separated list for multiple parameters
- Use `undefined` for optional parameters not provided
- Use `null` explicitly when testing null handling
- Use quotes for string literals

### Expected Output Format
- Exact string for string outputs
- `Error thrown` for expected errors
- Specify error message if important: `Error: "Invalid input"`
- For objects: `{key: "value"}` 
- For arrays: `["item1", "item2"]`

### Test Case IDs
- Must follow pattern: `TC-XXX` (TC-001, TC-002, etc.)
- Sequential numbering
- Each ID must be unique

---

## Example Tickets

### Example 1: String Utility
```
File: src/lib/string-utils.ts
Method: slugify

| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | "Hello World" | "hello-world" | Basic slugification |
| TC-002       | "Test@123" | "test-123" | Special characters |
| TC-003       | "" | "" | Empty string |
```

### Example 2: Validation Function
```
File: src/lib/validators.ts
Method: validateEmail

| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | "test@example.com" | true | Valid email |
| TC-002       | "invalid-email" | false | Missing @ symbol |
| TC-003       | "" | false | Empty string |
| TC-004       | null | false | Null input |
```

### Example 3: Math Function
```
File: src/lib/math.ts
Method: divide

| Test Case ID | Input Parameters | Expected Output | Notes |
|--------------|------------------|-----------------|-------|
| TC-001       | 10, 2 | 5 | Basic division |
| TC-002       | 7, 2 | 3.5 | Decimal result |
| TC-003       | 10, 0 | Error thrown | Division by zero |
| TC-004       | 0, 5 | 0 | Zero numerator |
```

