# Mitosis Framework Generators

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  framework-generators utility module
</div>

Framework-specific code generators for Mitosis compilation. These modules were extracted from `local-vars-plugin.ts` to support multiple frameworks with clean separation of concerns.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { framework-generators } from '@sky-modules/core'
```

## Overview

The framework generators system uses the **Strategy Pattern** to handle framework-specific code generation. Each generator knows how to:
1. Detect if it can handle a code file (framework detection)
2. Generate framework-specific code for missing variables
3. Handle framework-specific patterns (generics, props, reactive syntax)

## Architecture

```
FrameworkCodeGeneratorManager (Strategy Manager)
├── VueGenerator (Strategy)
├── SvelteGenerator (Strategy)
├── AngularGenerator (Strategy)
└── ReactGenerator (Strategy, Fallback)
```

## Modules

### FrameworkCodeGeneratorManager

**File:** `FrameworkCodeGeneratorManager.ts`

Main manager that delegates to appropriate framework generator.

**Features:**
- Strategy pattern implementation
- Automatic framework detection
- Generator priority ordering
- Fallback to React for unmatched code

**Usage:**
```typescript
import { FrameworkCodeGeneratorManager } from './framework-generators'

const manager = new FrameworkCodeGeneratorManager()

const result = manager.generate({
  code: generatedCode,
  missingVars: extractedVars,
  globalImports: imports,
  generics: '<T>',
  componentName: 'Button'
})
```

**Generator Order:**
1. VueGenerator - Checks first (most specific patterns)
2. SvelteGenerator - Checks second (specific script tag)
3. AngularGenerator - Checks third (decorator patterns)
4. ReactGenerator - Fallback (most generic patterns)

### ReactGenerator

**File:** `ReactGenerator.ts`

Generates React-compatible code with TypeScript generics support.

**Detects:**
- `import { ... } from 'react'`
- React hooks (`useState`, `useEffect`, etc.)

**Generates:**
```typescript
// Input: missing variable 'styles'
// Output:
function Button<T>(props: ButtonProps<T>) {
  const styles = props.styles;
  // ...
}
```

**Features:**
- Generic type parameter support
- Destructuring from props
- Rest props handling (`const { foo, ...rest } = props`)

### VueGenerator

**File:** `VueGenerator.ts`

Generates Vue 3 Composition API compatible code.

**Detects:**
- `<script setup>`
- `import { ... } from 'vue'`

**Generates:**
```typescript
// Input: missing variable 'styles'
// Output:
<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<ButtonProps>();
const { styles } = toRefs(props);
</script>
```

**Features:**
- `defineProps` with TypeScript generics
- `toRefs` for reactive destructuring
- Vue 3 Composition API patterns

### SvelteGenerator

**File:** `SvelteGenerator.ts`

Generates Svelte-compatible code with reactive statements.

**Detects:**
- `<script lang="ts">`
- `<script lang='ts'>`
- `<script context=`

**Generates:**
```typescript
// Input: missing variable 'styles'
// Output:
<script lang="ts">
export let styles: any = undefined;
</script>

// Input: rest props
// Output:
<script lang="ts">
$: restProps = (() => {
  const { foo, bar, ...rest } = $$props;
  return rest;
})();
</script>
```

**Features:**
- `export let` for props
- Reactive statements (`$:`) for rest props
- Svelte generics support via script tag attribute

### AngularGenerator

**File:** `AngularGenerator.ts`

Generates Angular-compatible code with decorators.

**Detects:**
- `@Component` decorator
- `import { ... } from '@angular/core'`

**Generates:**
```typescript
// Input: missing variable 'styles'
// Output:
export class ButtonComponent {
  @Input() styles: any;
  // ...
}
```

**Features:**
- `@Input()` decorator for props
- Class-based component pattern
- TypeScript class syntax

## Types

### Common Types

**File:** `types.ts`

```typescript
interface ExtractedVariable {
  name: string
  value: string
  line: number
  isRest?: boolean
  omittedKeys?: string
  sourceValue?: string
}

interface GenerationContext {
  code: string
  missingVars: ExtractedVariable[]
  globalImports: string[]
  generics: string | null
  componentName: string
}

interface GenerationResult {
  code: string
}

interface FrameworkGenerator {
  canHandle(code: string): boolean
  generate(context: GenerationContext): GenerationResult
}
```

## Adding a New Framework Generator

To add support for a new framework:

1. **Create Generator File**
```typescript
// QwikGenerator.ts
import type { FrameworkGenerator, GenerationContext, GenerationResult } from './types'

export class QwikGenerator implements FrameworkGenerator {
  canHandle(code: string): boolean {
    return code.includes('import { component$ }')
  }

  generate(context: GenerationContext): GenerationResult {
    // Generate Qwik-specific code
    return { code: modifiedCode }
  }
}
```

2. **Register in Manager**
```typescript
// FrameworkCodeGeneratorManager.ts
import { QwikGenerator } from './QwikGenerator'

constructor() {
  this.generators = [
    new VueGenerator(),
    new SvelteGenerator(),
    new QwikGenerator(),  // Add here
    new AngularGenerator(),
    new ReactGenerator(),
  ]
}
```

3. **Add Tests**
```typescript
// __spec__/QwikGenerator.spec.ts
describe('QwikGenerator', () => {
  it('should detect Qwik code', () => {
    // ...
  })
})
```

## Testing

All generators have comprehensive test suites in `__spec__/`:

```bash
vitest run cli/mitosis/framework-generators
```

Tests cover:
- Framework detection (`canHandle`)
- Variable generation
- Rest props handling
- Generic types support
- Edge cases

## Integration

Used by `local-vars-plugin.ts` during Mitosis compilation:

```typescript
import { FrameworkCodeGeneratorManager } from './framework-generators'

const codeGeneratorManager = new FrameworkCodeGeneratorManager()

// In plugin:
const result = codeGeneratorManager.generate({
  code: generatedCode,
  missingVars,
  globalImports,
  generics,
  componentName
})
```

## Benefits of Extraction

Extracting framework generators provides:

1. **Separation of Concerns** - Each framework has its own generator
2. **Testability** - Can test each generator independently
3. **Extensibility** - Easy to add new frameworks
4. **Maintainability** - Framework-specific logic is isolated
5. **Strategy Pattern** - Clean delegation via manager

## Related Files

- `../local-vars-plugin.ts` - Main plugin that uses generators
- `../hook-post-processor.ts` - Post-processes hooks after generation
- `../utils/formatting.ts` - Shared formatting utilities
