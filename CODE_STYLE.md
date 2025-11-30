# Code Style Guide

This document consolidates all code style guidelines for the Sky Modules project.

## TypeScript

### Formatting

#### Indentation
- **Use 4 spaces for indentation** (not 2 spaces or tabs)
- Apply consistently across all TypeScript, JavaScript, and JSON files
- Documentation code examples should also use 4 spaces

### Type Safety
- **Never use `any` type** - use specific types or generics instead
- Prefer type inference where possible
- Use strict TypeScript configuration
- Use type guards with type predicates for runtime checks

### Imports and Exports
```typescript
// Global modules (extend global scope)
import '@sky-modules/core/Array/global'

// Individual functionality
import { mergeNamespace } from '@sky-modules/core'
import { bind } from '@sky-modules/core/bind'
```

### Path Resolution
- Use `baseUrl: '.'` and `paths` for internal imports
- **Never hardcode `@sky-modules` paths** - use dynamic paths
- Enable `skipLibCheck: true` to avoid @types/three errors

## File Conventions

### File Endings
- **All files must end with a newline character**

### Naming Conventions
```
Module Structure:
core/ModuleName/
├── index.ts           # Public API
├── ModuleName.ts     # Implementation
└── README.md          # English documentation
└── README.ru.md       # Russian documentation

Mitosis Components:
component/
├── Component.lite.tsx         # Mitosis source
├── Component.lite.css         # Styles
├── Component.recipe.lite.ts   # Styling recipes
└── index.lite.ts              # Exports

Test Files:
- *.spec.ts
- *.spec.tsx
```

## Comments and Documentation

### Code Comments
- **Use English comments only**
- Comment the "why", not the "what"
- Avoid obvious comments

### Documentation Files
- Write in both English (`.md`) and Russian (`.ru.md`)
- Use `.mdx` format for generated documentation
- Keep API documentation concise with Parameters and Returns sections
- Avoid excessive examples and verbose descriptions

## Code Patterns

### No Hardcoding
- **Never use hardcoded values** - always use dynamic solutions
- Make code configurable and flexible
- Avoid magic numbers and strings

### Framework Agnostic
- **Never write "for Sky Modules"** in descriptions
- Framework is universal and should remain platform-agnostic
- Design for reusability across different contexts

### React Components
- **For polymorphic components**: use generic functions instead of union types
- Avoids `unknown` props issues
```typescript
// Good
function Button<T extends ElementType = 'button'>(props: PolymorphicProps<T>) {
  // ...
}

// Bad
type ButtonProps = ButtonAsButton | ButtonAsLink  // Creates unknown props
```

## Module System

### Slices
- Slices auto-generate `index.ts` - **never edit manually**
- Only use modules listed in `slice.json`
- Build process:
  1. `buildSlice.ts` reads `slice.json`
  2. Auto-generates `index.ts` from modules list
  3. Creates `tsconfig.build.json`
  4. Compiles and packages

### Module Structure
```typescript
// Use 'define' for module registration only
// It has no functional purpose beyond system registration
define('module-name', () => {
  // Module implementation
})
```

## Mitosis Development

### File Watching
- File watcher has 300ms debounce to prevent rapid rebuilds
- CSS changes skip Mitosis build, only copy files
- Clean changed components before rebuild

### Build Rules
- Never skip hooks without user request
- Don't use force flags unless explicitly asked
- Respect caching system (`.dev/mitosis/<app-id>/`)

## Testing

### Test Organization
```typescript
// Import centralized test utilities
import { setupCanvasMocks, wait, waitFor, createSpy } from '../../cli/test-utils'

// Setup mocks
setupCanvasMocks()

// Use helpers
await wait(1000)
await waitFor(() => condition, 5000)
const spy = createSpy((x) => x * 2)
```

### Coverage Requirements
- Thresholds: 100% (statements, branches, functions, lines)
- Reports: text, html, lcov, json
- Location: `.dev/coverage/`

## Console Output

### CLI Tools
- Use `Console.log()` from `cli/utilities/Console.ts` for colored output
- **Never use `console.log()`** in CLI code
- Ensure consistent formatting across commands

## Git Workflow

### Branch Strategy
- Work on `@anyasky91` branch by default
- Main branch: `main`
- **Always ask permission before commits**
- **Never leave Claude signature in commits or anywhere else**

### Commit Commands
- `:cm` or `:км` - commit and merge to main
- On `:км` command - execute immediately without confirmation
- After merge to main - **always return to previous branch**

## Problem Solving

### Research First
- **Never make assumptions or fabricate facts**
- If problem doesn't resolve on first try, search online
- For complex issues, look for solutions in internet and documentation
- Always ask user for missing information instead of guessing

### Persistence
- **Fix until it works** - don't give up on synchronization or event issues
- Continue making corrections until problem is solved
- Test thoroughly before considering task complete

## Error Handling

### Build Failures
If build fails, check in order:
1. TypeScript `paths` configuration
2. `slice.json` module names match directories
3. No `any` types in code
4. `baseUrl` is set correctly
5. Regenerate configs with `sky init ts-configs`

### Runtime Errors
- Use proper error types (AssertionError, custom errors)
- Preserve error context when re-throwing
- Handle async errors appropriately

## Best Practices

### DRY (Don't Repeat Yourself)
- Extract common patterns into utilities
- Reuse existing modules instead of creating duplicates
- Keep code modular and composable

### KISS (Keep It Simple, Stupid)
- Prefer simple solutions over complex ones
- Don't over-engineer
- Make code readable and maintainable

### Performance
- Use lazy loading for CLI commands (dynamic imports)
- Implement caching where appropriate (Mitosis builds)
- Optimize for build speed and runtime performance

### Security
- Validate external inputs
- Avoid command injection vulnerabilities
- Don't expose sensitive information in errors or logs
