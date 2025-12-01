# mixin

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  mixin utility module
</div>

Декоратор для добавления функциональности из одного класса в другой.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import mixin from '@sky-modules/core/mixin'
```

## API

### mixin(mixinConstructor)

Создает декоратор класса, который добавляет методы и свойства из класса-миксина.

```typescript
mixin<M extends Class, T extends Class>(
  mixinConstructor: M
): (constructor: T) => void
```

**Параметры:**
- `mixinConstructor` - Класс для использования в качестве источника миксина

**Возвращает:** Функция-декоратор, которая модифицирует прототип целевого класса

## Использование

### Базовый миксин

```typescript
class Logger {
  log(message: string) {
    console.log(message)
  }
}

@mixin(Logger)
class Service {
  name = 'MyService'
}

const service = new Service()
service.log('Сервис инициализирован') // Унаследован от Logger
```

### Несколько миксинов

```typescript
class Validator {
  validate(data: unknown): boolean {
    return data !== null && data !== undefined
  }
}

class Serializer {
  serialize(obj: unknown): string {
    return JSON.stringify(obj)
  }
}

@mixin(Validator)
@mixin(Serializer)
class DataHandler {
  process(data: unknown) {
    if (this.validate(data)) {
      return this.serialize(data)
    }
  }
}
```

### Миксин с hooks

```typescript
class Lifecycle {
  __hooks = {
    onInit: () => console.log('Инициализирован')
  }
}

@mixin(Lifecycle)
class Component {
  constructor() {
    this.onInit?.()
  }
}
```
