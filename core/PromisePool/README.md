# PromisePool

Concurrent promise execution with configurable concurrency limit.

## Overview

PromisePool manages concurrent execution of asynchronous tasks with a configurable maximum concurrency limit. It queues tasks when the limit is reached and automatically executes queued tasks as slots become available.

**Key Features:**
- Configurable concurrency limit
- Automatic task queuing
- Wait for all tasks to complete
- Type-safe task arguments
- Zero dependencies

**Use Cases:**
- Rate limiting API requests
- Controlling concurrent file operations
- Managing database connection pools
- Preventing resource exhaustion
- Batch processing with concurrency control

## Installation

```typescript
import PromisePool from '@sky-modules/core/PromisePool'
```

## Basic Usage

### Creating a Pool

```typescript
// Default pool (max 10 concurrent tasks)
const pool = new PromisePool()

// Custom concurrency limit
const limitedPool = new PromisePool(3)  // Max 3 concurrent tasks
```

### Running Tasks

```typescript
const pool = new PromisePool(5)

// Define async task
const fetchData = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

// Run task in pool
await pool.run(fetchData, 'https://api.example.com/data')
```

### Multiple Concurrent Tasks

```typescript
const pool = new PromisePool(3)

const urls = [
  'https://api.example.com/users',
  'https://api.example.com/posts',
  'https://api.example.com/comments'
]

// Run all tasks (max 3 concurrent)
await Promise.all(
  urls.map(url => pool.run(fetchData, url))
)
```

### Waiting for Completion

```typescript
const pool = new PromisePool(2)

// Start multiple tasks
pool.run(task1, arg1)
pool.run(task2, arg2)
pool.run(task3, arg3)

// Wait for all tasks to complete
await pool.wait()

console.log('All tasks completed')
```

## API Reference

### Constructor

```typescript
constructor(maxCount?: number)
```

Creates a new PromisePool with specified concurrency limit.

**Parameters:**
- `maxCount` - Maximum concurrent tasks (default: 10)

**Example:**
```typescript
const pool = new PromisePool(5)  // Max 5 concurrent
```

### Methods

#### `run<A>(task, ...args)`

Execute task in the pool.

```typescript
async run<A extends unknown[]>(
  task: PromisePool.Task<A>,
  ...args: A
): Promise<void>
```

**Parameters:**
- `task` - Async function to execute
- `args` - Arguments to pass to task

**Returns:** Promise that resolves when task completes

**Behavior:**
- If pool has available slots: executes immediately
- If pool is full: queues task until slot available
- Tasks execute in order they were queued

**Example:**
```typescript
await pool.run(async (id, name) => {
  await saveUser(id, name)
}, 123, 'John')
```

#### `wait()`

Wait for all running tasks to complete.

```typescript
async wait(): Promise<void>
```

**Returns:** Promise that resolves when all tasks finish

**Example:**
```typescript
// Fire and forget tasks
pool.run(task1)
pool.run(task2)
pool.run(task3)

// Wait for all to complete
await pool.wait()
```

### Types

#### `PromisePool.Task<T>`

Type for async task functions.

```typescript
type Task<T extends unknown[]> = (...args: T) => Promise<void>
```

**Example:**
```typescript
const task: PromisePool.Task<[number, string]> = async (id, name) => {
  // Task implementation
}
```

## Examples

### Rate Limiting API Requests

```typescript
const pool = new PromisePool(3)  // Max 3 concurrent requests

const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Fetch users with rate limiting
const users = await Promise.all(
  userIds.map(async (id) => {
    let userData: User

    await pool.run(async () => {
      const response = await fetch(`/api/users/${id}`)
      userData = await response.json()
    })

    return userData!
  })
)

console.log(`Fetched ${users.length} users`)
```

### File Processing

```typescript
const pool = new PromisePool(5)  // Max 5 concurrent file ops

const files = [
  'file1.txt',
  'file2.txt',
  'file3.txt',
  // ... many more files
]

// Process files concurrently
for (const file of files) {
  pool.run(async () => {
    const content = await fs.readFile(file, 'utf-8')
    const processed = processContent(content)
    await fs.writeFile(`output/${file}`, processed)
  })
}

// Wait for all files to be processed
await pool.wait()

console.log('All files processed')
```

### Database Operations

```typescript
const pool = new PromisePool(10)  // Max 10 concurrent DB ops

interface UserData {
  id: number
  name: string
  email: string
}

const usersData: UserData[] = [
  /* ... large dataset ... */
]

// Insert users with concurrency control
await Promise.all(
  usersData.map(user =>
    pool.run(async (data: UserData) => {
      await db.insert('users', data)
    }, user)
  )
)

console.log(`Inserted ${usersData.length} users`)
```

### Batch Processing

```typescript
const pool = new PromisePool(3)

const items = Array.from({ length: 100 }, (_, i) => i)

// Process in batches of 3
for (const item of items) {
  await pool.run(async (id: number) => {
    await processItem(id)
    console.log(`Processed item ${id}`)
  }, item)
}
```

### Web Scraping

```typescript
const pool = new PromisePool(2)  // Polite scraping: max 2 concurrent

const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  // ... many URLs
]

const results: string[] = []

await Promise.all(
  urls.map(async (url) => {
    let content: string

    await pool.run(async () => {
      const response = await fetch(url)
      content = await response.text()
    })

    results.push(content!)
  })
)
```

### Image Processing

```typescript
const pool = new PromisePool(4)  // Max 4 concurrent image ops

const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', /* ... */]

await Promise.all(
  images.map(imagePath =>
    pool.run(async () => {
      const image = await loadImage(imagePath)
      const resized = await resize(image, 800, 600)
      const optimized = await optimize(resized)
      await save(optimized, `output/${imagePath}`)
    })
  )
)

console.log('All images processed')
```

## Advanced Patterns

### Task Priority (Manual)

```typescript
const highPriorityPool = new PromisePool(5)
const lowPriorityPool = new PromisePool(2)

// High priority tasks
await highPriorityPool.run(criticalTask)

// Low priority tasks
await lowPriorityPool.run(backgroundTask)
```

### Error Handling

```typescript
const pool = new PromisePool(3)

const tasks = [task1, task2, task3, task4, task5]

const results = await Promise.allSettled(
  tasks.map(task =>
    pool.run(async () => {
      try {
        await task()
      } catch (error) {
        console.error('Task failed:', error)
        throw error
      }
    })
  )
)

const succeeded = results.filter(r => r.status === 'fulfilled').length
const failed = results.filter(r => r.status === 'rejected').length

console.log(`Success: ${succeeded}, Failed: ${failed}`)
```

### Progress Tracking

```typescript
const pool = new PromisePool(5)

let completed = 0
const total = items.length

for (const item of items) {
  pool.run(async () => {
    await processItem(item)
    completed++
    console.log(`Progress: ${completed}/${total}`)
  })
}

await pool.wait()
```

### Retry Logic

```typescript
const pool = new PromisePool(3)

async function runWithRetry<T>(
  task: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let result: T

      await pool.run(async () => {
        result = await task()
      })

      return result!
    } catch (error) {
      lastError = error as Error
      console.log(`Attempt ${attempt} failed, retrying...`)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw lastError!
}

// Usage
await runWithRetry(async () => {
  return await fetchData('/api/unreliable')
})
```

### Resource Pooling

```typescript
class DatabasePool {
  private connectionPool: PromisePool

  constructor(maxConnections: number) {
    this.connectionPool = new PromisePool(maxConnections)
  }

  async query<T>(sql: string, params: unknown[]): Promise<T> {
    let result: T

    await this.connectionPool.run(async () => {
      const connection = await getConnection()
      try {
        result = await connection.execute(sql, params)
      } finally {
        await connection.release()
      }
    })

    return result!
  }

  async close() {
    await this.connectionPool.wait()
  }
}

const db = new DatabasePool(10)

// All queries respect connection limit
const users = await db.query('SELECT * FROM users', [])
const posts = await db.query('SELECT * FROM posts', [])
```

## Performance Considerations

### Choosing Concurrency Limit

```typescript
// Too low: underutilizes resources
const slow = new PromisePool(1)

// Too high: may exhaust resources
const risky = new PromisePool(1000)

// Balanced: based on system capabilities
const balanced = new PromisePool(
  navigator.hardwareConcurrency || 4
)
```

### Memory Usage

```typescript
// Careful with large datasets
const pool = new PromisePool(10)

// Bad: creates all promises at once
await Promise.all(
  hugeArray.map(item => pool.run(processItem, item))
)

// Better: process in chunks
for (let i = 0; i < hugeArray.length; i += 100) {
  const chunk = hugeArray.slice(i, i + 100)
  await Promise.all(
    chunk.map(item => pool.run(processItem, item))
  )
}
```

### Task Granularity

```typescript
// Too fine-grained: overhead from queuing
const pool = new PromisePool(10)
for (let i = 0; i < 10000; i++) {
  await pool.run(async () => { /* tiny task */ })
}

// Better: batch small tasks
const pool = new PromisePool(10)
const batchSize = 100
for (let i = 0; i < 10000; i += batchSize) {
  await pool.run(async () => {
    for (let j = i; j < i + batchSize; j++) {
      // process item
    }
  })
}
```

## Best Practices

### 1. Choose Appropriate Concurrency

```typescript
// For I/O-bound tasks (network, disk)
const ioPool = new PromisePool(20)  // Higher concurrency OK

// For CPU-bound tasks
const cpuPool = new PromisePool(
  navigator.hardwareConcurrency || 4
)
```

### 2. Handle Errors Properly

```typescript
await pool.run(async () => {
  try {
    await riskyOperation()
  } catch (error) {
    // Handle error, don't let it crash pool
    logger.error('Task failed:', error)
  }
})
```

### 3. Clean Up Resources

```typescript
await pool.run(async () => {
  const resource = await acquire()
  try {
    await useResource(resource)
  } finally {
    await release(resource)  // Always clean up
  }
})
```

### 4. Use wait() for Fire-and-Forget

```typescript
// Start tasks without blocking
pool.run(task1)
pool.run(task2)
pool.run(task3)

// Do other work...

// Wait when ready
await pool.wait()
```

### 5. Monitor Performance

```typescript
const pool = new PromisePool(5)
const startTime = Date.now()
let tasksCompleted = 0

for (const item of items) {
  pool.run(async () => {
    await processItem(item)
    tasksCompleted++

    if (tasksCompleted % 100 === 0) {
      const elapsed = (Date.now() - startTime) / 1000
      const rate = tasksCompleted / elapsed
      console.log(`Rate: ${rate.toFixed(2)} tasks/sec`)
    }
  })
}

await pool.wait()
```

## Comparison with Alternatives

### vs Promise.all()

```typescript
// Promise.all: unlimited concurrency
await Promise.all(tasks.map(t => t()))

// PromisePool: controlled concurrency
const pool = new PromisePool(5)
await Promise.all(tasks.map(t => pool.run(t)))
```

### vs p-limit

```typescript
// p-limit
import pLimit from 'p-limit'
const limit = pLimit(5)
await Promise.all(tasks.map(t => limit(t)))

// PromisePool (similar API)
const pool = new PromisePool(5)
await Promise.all(tasks.map(t => pool.run(t)))
```

## Testing

```typescript
import { describe, it, expect, vi } from 'vitest'
import PromisePool from '@sky-modules/core/PromisePool'

describe('PromisePool', () => {
  it('should limit concurrency', async () => {
    const pool = new PromisePool(2)
    let concurrent = 0
    let maxConcurrent = 0

    const task = async () => {
      concurrent++
      maxConcurrent = Math.max(maxConcurrent, concurrent)
      await new Promise(resolve => setTimeout(resolve, 50))
      concurrent--
    }

    await Promise.all([
      pool.run(task),
      pool.run(task),
      pool.run(task),
      pool.run(task)
    ])

    expect(maxConcurrent).toBeLessThanOrEqual(2)
  })
})
```

## Related Modules

- [core/EventEmitter](../EventEmitter/) - Event-driven programming
- [core/async](../async/) - Async utilities
- [core/idle](../idle/) - Idle callbacks

## Examples

See [PromisePool.spec.ts](./PromisePool.spec.ts) for comprehensive usage examples and test cases.
