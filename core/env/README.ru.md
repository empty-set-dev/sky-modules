# env

Доступ к переменным окружения с поддержкой Node.js и браузера.

## Установка

```typescript
import env from '@sky-modules/core/env'
```

## API

### env

Объект, содержащий переменные окружения, доступные на всех платформах.

```typescript
interface Env {}

const env: Env
```

**Тип:** Расширяемый глобальный интерфейс для переменных окружения

**Разрешение:**
- Node.js: Использует `process.env`
- Браузер: Использует `import.meta.env`

## Использование

### Доступ к переменным

```typescript
import env from '@sky-modules/core/env'

console.log(env.NODE_ENV)
console.log(env.API_URL)
console.log(env.SECRET_KEY)
```

### Определение окружения

```typescript
import env from '@sky-modules/core/env'

const isDevelopment = env.NODE_ENV === 'development'
const apiUrl = env.API_URL || 'http://localhost:3000'
```

### Безопасные переменные окружения

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
