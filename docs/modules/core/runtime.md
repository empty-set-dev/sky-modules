# runtime

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  runtime utility module
</div>

Utilities for managing application runtime state and initialization.

## Installation

```typescript
import runtime from '@sky-modules/core/runtime'
import isRuntime from '@sky-modules/core/runtime/isRuntime'
import startRuntime from '@sky-modules/core/runtime/startRuntime'
```

## API

### runtime

A promise that resolves when the runtime is ready.

```typescript
const runtime: Promise<void>
```

**Returns:** Promise that resolves after `startRuntime()` completes

### isRuntime()

Check if runtime mode is currently active.

```typescript
isRuntime(): boolean
```

**Returns:** `true` if runtime is active, `false` otherwise

### startRuntime()

Initialize runtime after waiting for all pending async tasks.

```typescript
startRuntime(): Promise<void>
```

**Behavior:** Waits for all `fire()` and `task()` calls to complete before setting runtime state

## Usage

### Runtime Status Check

```typescript
if (!isRuntime()) {
  console.log('Application initializing...')
}

await runtime
console.log('Application ready')
```

### Initialization Sequence

```typescript
// Define modules during initialization phase
define('UserService', () => new UserService())
define('Config', () => loadConfig())

// Start runtime after all definitions
await startRuntime()

// Now runtime is active
if (isRuntime()) {
  console.log('All modules initialized')
}
```

### Waiting for Runtime

```typescript
async function setupUI() {
  await runtime
  console.log('Safe to render UI')
}
```
