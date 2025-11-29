# Mitosis Utils

Utility functions for Mitosis code generation and processing.

## Modules

### formatting.ts

**File:** `formatting.ts`

Code formatting utilities for consistent indentation across generated code.

**Features:**
- Automatic indentation detection from existing code
- Tab width normalization
- Preserves code structure while fixing indentation

**Functions:**

#### `fixIndentation(code: string, tabWidth: number = 4): string`

Fixes indentation in generated code to match the specified tab width.

**Parameters:**
- `code` - The code string to fix
- `tabWidth` - Number of spaces per indentation level (default: 4)

**Returns:** Code with fixed indentation

**Usage:**
```typescript
import { fixIndentation } from './utils/formatting'

const code = `
function example() {
if (true) {
console.log('hello')
}
}
`

const fixed = fixIndentation(code, 4)
// Result:
// function example() {
//     if (true) {
//         console.log('hello')
//     }
// }
```

**How it works:**
1. Splits code into lines
2. Detects indentation level based on scope (braces, parentheses)
3. Applies consistent spacing based on `tabWidth`
4. Preserves empty lines and comments

**Supports:**
- JavaScript/TypeScript
- JSX/TSX
- Nested blocks
- Multi-line statements

## Adding New Utilities

To add a new utility function:

1. **Add to `formatting.ts` or create new file:**
```typescript
// codeAnalysis.ts
export function analyzeComplexity(code: string): number {
  // Implementation
  return complexity
}
```

2. **Export from utils if needed:**
```typescript
// index.ts
export * from './formatting'
export * from './codeAnalysis'
```

3. **Add tests:**
```typescript
// __spec__/codeAnalysis.spec.ts
import { analyzeComplexity } from '../codeAnalysis'

describe('analyzeComplexity', () => {
  it('should calculate cyclomatic complexity', () => {
    // ...
  })
})
```

4. **Document in README:**
Update this README with the new utility details.

## Usage in Mitosis Pipeline

These utilities are used throughout the Mitosis compilation pipeline:

```typescript
// In local-vars-plugin.ts
import { fixIndentation } from './utils/formatting'

const generatedCode = codeGeneratorManager.generate(context)
const formattedCode = fixIndentation(generatedCode.code, tabWidth)
```

```typescript
// In hook-post-processor.ts
import { fixIndentation } from './utils/formatting'

const transformedCode = transformHookForTarget(content, target)
const formatted = fixIndentation(transformedCode, 4)
```

## Design Principles

All utilities in this directory should follow these principles:

1. **Pure Functions** - No side effects, deterministic output
2. **Single Responsibility** - Each function does one thing well
3. **Framework Agnostic** - Work with any code, not framework-specific
4. **Well Tested** - Comprehensive test coverage
5. **Documented** - Clear JSDoc comments and examples

## Related Files

- `../local-vars-plugin.ts` - Uses formatting utilities
- `../hook-post-processor.ts` - Uses formatting utilities
- `../framework-generators/` - May use shared utilities
