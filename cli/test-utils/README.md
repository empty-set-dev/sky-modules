# Test Utilities

Centralized testing utilities and mocks for Sky Modules.

## Structure

```
cli/test-utils/
├── index.ts           # Main exports
├── setup.ts           # Global test setup
├── helpers.ts         # Test helper functions
├── mocks/
│   └── canvas.ts      # Canvas API mocks
├── e2e/
│   ├── index.ts       # E2E exports
│   ├── helpers.ts     # E2E helpers
│   └── example.e2e.spec.ts  # Example E2E test
└── benchmark/
    ├── index.ts       # Benchmark exports
    ├── helpers.ts     # Benchmark helpers
    └── example.bench.ts     # Example benchmark
```

## Usage

### Basic Setup

Import the test utilities in your test files:

```typescript
import { setupCanvasMocks, wait, waitFor } from '../../cli/test-utils'
import { describe, test, expect } from 'vitest'

describe('MyComponent', () => {
    test('should work', async () => {
        setupCanvasMocks()

        // Your test code here
    })
})
```

### Canvas Mocks

For tests that use Canvas API:

```typescript
import { setupCanvasMocks, MockCanvasRenderingContext2D } from '../../cli/test-utils'

// Setup mocks before tests
setupCanvasMocks()

// Now you can use canvas in tests
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
```

Or create a test-setup file (like `Canvas/test-setup.ts`):

```typescript
import { setupCanvasMocks } from '../cli/test-utils'

setupCanvasMocks()
```

Then import it at the top of your spec files:

```typescript
// @vitest-environment jsdom
import './test-setup'
```

### Helper Functions

#### `wait(ms: number)`

Wait for a specific amount of time:

```typescript
await wait(1000) // Wait 1 second
```

#### `waitFor(condition, timeout?, interval?)`

Wait for a condition to become true:

```typescript
let value = false
setTimeout(() => value = true, 100)

await waitFor(() => value, 5000, 50)
```

#### `createSpy(implementation?)`

Create a spy function:

```typescript
const spy = createSpy((x: number) => x * 2)
spy(5)
expect(spy).toHaveBeenCalledWith(5)
```

#### `mockConsole()`

Mock console methods and suppress output:

```typescript
const restore = mockConsole()
console.log('This will not appear')
restore()
console.log('This will appear')
```

#### `createDeferred()`

Create a deferred promise:

```typescript
const { promise, resolve, reject } = createDeferred<string>()

setTimeout(() => resolve('done'), 100)
await expect(promise).resolves.toBe('done')
```

#### `flushPromises()`

Flush all pending promises:

```typescript
Promise.resolve().then(() => console.log('async'))
await flushPromises()
// Now the async code has executed
```

#### `expectToThrow(fn)`

Expect a function to throw and capture the error:

```typescript
const error = await expectToThrow(() => {
    throw new Error('test error')
})
expect(error.message).toBe('test error')
```

#### `createSequentialMock(...values)`

Create a mock that returns different values on successive calls:

```typescript
const mock = createSequentialMock(1, 2, 3)
expect(mock()).toBe(1)
expect(mock()).toBe(2)
expect(mock()).toBe(3)
```

## Adding New Mocks

To add new mocks:

1. Create a new file in `cli/test-utils/mocks/`
2. Export your mock classes/functions
3. Add exports to `cli/test-utils/index.ts`
4. Document usage in this README

Example:

```typescript
// cli/test-utils/mocks/localStorage.ts
export class MockLocalStorage {
    private store: Record<string, string> = {}

    getItem(key: string): string | null {
        return this.store[key] || null
    }

    setItem(key: string, value: string): void {
        this.store[key] = value
    }
}

export function setupLocalStorageMock() {
    global.localStorage = new MockLocalStorage() as any
}
```

## E2E Testing

For testing CLI commands in isolated environments:

```typescript
import { e2e } from '../../cli/test-utils'
import { describe, test, expect, beforeEach, afterEach } from 'vitest'

describe('CLI E2E Tests', () => {
    let workspace: ReturnType<typeof e2e.createTestWorkspace>['workspace']
    let cleanup: ReturnType<typeof e2e.createTestWorkspace>['cleanup']

    beforeEach(() => {
        const testEnv = e2e.createTestWorkspace('my-test')
        workspace = testEnv.workspace
        cleanup = testEnv.cleanup
    })

    afterEach(() => {
        cleanup()
    })

    test('sky command should work', async () => {
        // Write test files
        workspace.writeFile('.sky/sky.config.ts', 'export default {...}')

        // Run command
        const result = await workspace.runCommand('check')

        // Assert results
        e2e.assertCommandSuccess(result)
        expect(e2e.commandOutputContains(result, 'success')).toBe(true)
    })
})
```

### E2E Helper Functions

- `runSkyCommand(command, options)` - Execute a sky CLI command
- `createTestWorkspace(name)` - Create temporary test workspace
- `TestWorkspace.writeFile(path, content)` - Write files to workspace
- `TestWorkspace.runCommand(command)` - Run command in workspace
- `assertCommandSuccess(result)` - Assert command succeeded
- `assertCommandFailed(result)` - Assert command failed
- `commandOutputContains(result, text)` - Check output contains text
- `parseCommandJSON(result)` - Parse JSON output

See `cli/test-utils/e2e/example.e2e.spec.ts` for complete examples.

## Benchmark Testing

For performance testing and comparing implementations:

```typescript
import { benchmark } from '../../cli/test-utils'

// Compare multiple implementations
benchmark.benchmarkCompare('Array operations', {
    'push method': () => {
        const arr: number[] = []
        for (let i = 0; i < 1000; i++) arr.push(i)
    },
    'spread operator': () => {
        let arr: number[] = []
        for (let i = 0; i < 1000; i++) arr = [...arr, i]
    },
})

// Test different data sizes
benchmark.benchmarkArraySizes(
    'Map operation',
    data => data.map(x => x * 2),
    i => i,
    [100, 1000, 10000]
)

// Single function benchmark
benchmark.benchmarkFunction('Complex operation', () => {
    // Your code here
})
```

### Benchmark Helper Functions

- `benchmarkCompare(name, implementations, options)` - Compare multiple implementations
- `benchmarkFunction(name, fn, options)` - Benchmark single function
- `benchmarkArraySizes(name, operation, generator, sizes)` - Test different array sizes
- `createBenchmarkData(generator, count)` - Create test data
- `measureExecutionTime(fn)` - Measure single execution time
- `averageExecutionTime(fn, iterations)` - Get average execution time
- `comparePerformance(fn1, fn2, iterations)` - Compare two functions

**Running benchmarks:**
```bash
vitest bench <folder>
```

See `cli/test-utils/benchmark/example.bench.ts` for complete examples.

## Best Practices

1. **Keep mocks simple**: Mock only what you need for tests
2. **Reuse utilities**: Don't recreate common test patterns
3. **Document new utilities**: Add examples to this README
4. **Test your utilities**: Even test utilities should have tests
5. **Use TypeScript**: Maintain type safety in test code
6. **E2E tests**: Test real command execution in isolated workspaces
7. **Benchmarks**: Use for performance-critical code only

## Testing the Test Utilities

Test utilities themselves should be tested to ensure reliability:

```bash
# Run unit tests
sky test cli/test-utils

# Run E2E tests
sky test cli/test-utils/e2e

# Run benchmarks
vitest bench cli/test-utils/benchmark
```
