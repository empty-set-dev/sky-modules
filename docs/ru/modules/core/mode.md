# mode

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  mode utility module
</div>

Утилиты для определения текущего режима сборки и окружения.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import MODE, { DEV, TEST, PROD } from '@sky-modules/core/mode'
```

## API

### MODE

Текущий режим сборки в виде строки.

```typescript
const MODE: string
```

**Значение:** Одно из `'development'`, `'test'` или `'production'`

### DEV

Проверяет, работает ли в режиме разработки.

```typescript
const DEV: boolean
```

**Возвращает:** `true` если `MODE === 'development'`

### TEST

Проверяет, работает ли в режиме тестирования.

```typescript
const TEST: boolean
```

**Возвращает:** `true` если `MODE === 'test'`

### PROD

Проверяет, работает ли в режиме продакшена.

```typescript
const PROD: boolean
```

**Возвращает:** `true` если `MODE === 'production'`

## Использование

### Условное логирование

```typescript
import { DEV } from '@sky-modules/core/mode'

if (DEV) {
  console.log('Режим разработки: подробное логирование включено')
}
```

### Feature flags

```typescript
import { PROD } from '@sky-modules/core/mode'

const enableAnalytics = PROD
const enableDebugPanel = !PROD
```

### Конфигурация на основе режима

```typescript
import MODE from '@sky-modules/core/mode'

const config = {
  apiUrl: MODE === 'production'
    ? 'https://api.example.com'
    : 'http://localhost:3000/api',
  caching: MODE !== 'development'
}
```
