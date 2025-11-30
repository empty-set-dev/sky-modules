# env

Access environment variables with support for both Node.js and browser environments.

## Installation

```typescript
import env from '@sky-modules/core/env'
```

## API

### env

An object containing environment variables accessible across all platforms.

```typescript
interface Env {}

const env: Env
```

**Type:** Extensible global interface for environment variables

**Resolution:**
- Node.js: Uses `process.env`
- Browser: Uses `import.meta.env`

## Usage

### Accessing Variables

```typescript
import env from '@sky-modules/core/env'

console.log(env.NODE_ENV)
console.log(env.API_URL)
console.log(env.SECRET_KEY)
```

### Environment Detection

```typescript
import env from '@sky-modules/core/env'

const isDevelopment = env.NODE_ENV === 'development'
const apiUrl = env.API_URL || 'http://localhost:3000'
```

### Type-safe Environment Variables

```typescript
declare global {
  interface Env {
    DATABASE_URL: string
    JWT_SECRET: string
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  }
}

import env from '@sky-modules/core/env'

const connection = connect(env.DATABASE_URL)
const secret = env.JWT_SECRET
```
