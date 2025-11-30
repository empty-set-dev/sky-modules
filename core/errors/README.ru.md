# Errors

Ориентированные на безопасность классы ошибок для обработки загрязнения прототипов и перезаписи глобалей.

## Установка

```typescript
import {
  SecurityError,
  PrototypePollutionError,
  GlobalOverwriteError,
  InvalidScopeError,
  DANGEROUS_KEYS
} from '@sky-modules/core/errors'
```

## API

### SecurityError

Базовый класс ошибок для нарушений безопасности.

```typescript
class SecurityError extends Error {
  constructor(message: string)
}
```

**Параметры:**
- `message` - Сообщение об ошибке

### PrototypePollutionError

Выбрасывается при попытке загрязнения прототипа.

```typescript
class PrototypePollutionError extends SecurityError {
  constructor(key: string)
}
```

**Параметры:**
- `key` - Опасный ключ, который был использован

**Сообщение:** `Prototype pollution attempt detected: "<key>"`

### GlobalOverwriteError

Выбрасывается при попытке перезаписи защищенной глобали.

```typescript
class GlobalOverwriteError extends SecurityError {
  constructor(key: string)
}
```

**Параметры:**
- `key` - Глобаль, которая перезаписывается

**Сообщение:** `Attempt to overwrite protected global: "<key>"`

### InvalidScopeError

Выбрасывается, когда область видимости namespace невалидна.

```typescript
class InvalidScopeError extends SecurityError {
  constructor(namespace: string)
}
```

**Параметры:**
- `namespace` - Путь namespace

**Сообщение:** `Invalid scope for namespace "<namespace>": cannot be used as namespace container`

### DANGEROUS_KEYS

Массив ключей, которые могут привести к загрязнению прототипа.

```typescript
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype']
```

## Примеры использования

### Обработка ошибок безопасности

```typescript
import { PrototypePollutionError } from '@sky-modules/core/errors'

try {
  // Потенциально опасная операция
  Object.assign(obj, { __proto__: malicious })
} catch (error) {
  if (error instanceof PrototypePollutionError) {
    console.error('Нарушение безопасности предотвращено')
  }
}
```

### Проверка опасных ключей

```typescript
import { DANGEROUS_KEYS } from '@sky-modules/core/errors'

function safeAssign(target, source) {
  for (const key in source) {
    if (DANGEROUS_KEYS.includes(key)) {
      throw new PrototypePollutionError(key)
    }
    target[key] = source[key]
  }
}
```

### Валидация областей видимости

```typescript
import { InvalidScopeError } from '@sky-modules/core/errors'

function validateNamespace(obj, ns) {
  if (typeof obj !== 'object' || obj === null) {
    throw new InvalidScopeError(ns)
  }
}
```

## Примечания

- Все ошибки безопасности автоматически захватывают трассировку стека
- Имена ошибок устанавливаются в имена конструкторов для лучшей отладки
- Используйте эти ошибки для предотвращения атак загрязнения прототипа
