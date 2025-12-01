# mode

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  mode utility module
</div>

Utilities for detecting the current build mode and environment.

## Installation

```typescript
import MODE, { DEV, TEST, PROD } from '@sky-modules/core/mode'
```

## API

### MODE

The current build mode as a string.

```typescript
const MODE: string
```

**Value:** One of `'development'`, `'test'`, or `'production'`

### DEV

Check if running in development mode.

```typescript
const DEV: boolean
```

**Returns:** `true` if `MODE === 'development'`

### TEST

Check if running in test mode.

```typescript
const TEST: boolean
```

**Returns:** `true` if `MODE === 'test'`

### PROD

Check if running in production mode.

```typescript
const PROD: boolean
```

**Returns:** `true` if `MODE === 'production'`

## Usage

### Conditional Logging

```typescript
import { DEV } from '@sky-modules/core/mode'

if (DEV) {
  console.log('Development mode: verbose logging enabled')
}
```

### Feature Flags

```typescript
import { PROD } from '@sky-modules/core/mode'

const enableAnalytics = PROD
const enableDebugPanel = !PROD
```

### Mode-based Configuration

```typescript
import MODE from '@sky-modules/core/mode'

const config = {
  apiUrl: MODE === 'production'
    ? 'https://api.example.com'
    : 'http://localhost:3000/api',
  caching: MODE !== 'development'
}
```
