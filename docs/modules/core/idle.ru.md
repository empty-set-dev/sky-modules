# Idle

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  idle utility module
</div>

Утилита async задержки с поддержкой AbortSignal.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import idle from '@sky-modules/core/idle'
```

## API

### idle(timeout, parameters?)

Ожидание указанной длительности.

```typescript
idle(timeout: Time, parameters?: { signal?: AbortSignal }): Promise<void>
```

**Параметры:**
- `timeout` - Длительность в секундах (тип Time)
- `parameters.signal` - Опциональный AbortSignal для отмены задержки

**Возвращает:** Promise, который разрешается после таймаута или отклоняется при отмене

## Использование

### Базовая задержка

```typescript
console.log('Starting...')
await idle(2) // Ждать 2 секунды
console.log('Done!')
```

### Отменяемая задержка

```typescript
const controller = new AbortController()

const delayPromise = idle(10, { signal: controller.signal })

// Отменить через 2 секунды
setTimeout(() => controller.abort(), 2000)

await delayPromise
```

### Ограничение частоты

```typescript
async function processItems(items: string[]) {
  for (const item of items) {
    await processItem(item)
    await idle(0.5) // Ждать 500мс между элементами
  }
}
```

### Повтор с экспоненциальной задержкой

```typescript
async function retryWithBackoff(fn: () => Promise<void>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fn()
      return
    } catch (error) {
      if (i < maxRetries - 1) {
        await idle(Math.pow(2, i)) // 1с, 2с, 4с...
      } else {
        throw error
      }
    }
  }
}
```
