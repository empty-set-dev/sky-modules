# disposable

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  disposable utility module
</div>

Extensions for managing disposable resources with automatic cleanup.

## Installation

```typescript
import '@sky-modules/core/disposable'
```

## API

### DisposableStack.use(funcReturnsDisposable, ...args)

Add a disposable resource created by a function to the stack.

```typescript
interface DisposableStack {
  use<T, C extends (...args: A) => T & Disposable, A extends unknown[]>(
    funcReturnsDisposable: C,
    ...args: A
  ): { disposable: ReturnType<C> }
}
```

**Parameters:**
- `funcReturnsDisposable` - Function that returns a disposable object
- `args` - Arguments to pass to the function

**Returns:** Object with `disposable` property containing the created resource

### AsyncDisposableStack.use(funcReturnsAsyncDisposable, ...args)

Add an async disposable resource created by a function to the stack.

```typescript
interface AsyncDisposableStack {
  use<T, C extends (...args: A) => T & AsyncDisposable, A extends unknown[]>(
    funcReturnsAsyncDisposable: C,
    ...args: A
  ): { disposable: ReturnType<C> }
}
```

**Parameters:**
- `funcReturnsAsyncDisposable` - Function that returns an async disposable object
- `args` - Arguments to pass to the function

**Returns:** Object with `disposable` property containing the created resource

## Usage

### Synchronous Resources

```typescript
using stack = new DisposableStack()

class FileHandle {
  [Symbol.dispose]() {
    console.log('File closed')
  }
}

const { disposable: file } = stack.use(() => new FileHandle())
// Use file...
// File automatically closed when block exits
```

### Asynchronous Resources

```typescript
await using stack = new AsyncDisposableStack()

class DatabaseConnection {
  async [Symbol.asyncDispose]() {
    console.log('Connection closed')
  }
}

const { disposable: db } = stack.use(() => new DatabaseConnection())
// Use db...
// Connection automatically closed when block exits
```

### Multiple Resources

```typescript
using stack = new DisposableStack()

const { disposable: file1 } = stack.use(() => openFile('file1.txt'))
const { disposable: file2 } = stack.use(() => openFile('file2.txt'))

// Both files automatically closed in reverse order
```
