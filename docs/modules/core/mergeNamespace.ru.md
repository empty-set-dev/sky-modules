# mergeNamespace

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  mergeNamespace utility module
</div>

<div style="margin-bottom: 2em;">
  📚 <a href="/modules/">← Back to All Modules</a>
</div>


Продвинутое слияние пространств имён с типобезопасностью

Утилита `mergeNamespace` предоставляет мощные возможности для слияния объектов, сохраняя поведение функций и добавляя новые свойства. Идеально подходит для объектов конфигурации, систем плагинов и сложных структур данных.

## Установка

```bash
npm install @sky-modules/core
```

## Использование

```typescript
import { mergeNamespace } from '@sky-modules/core'

// Базовое использование
const target = { func: () => 'hello' }
const source = { func: { newProp: 'world' } }

mergeNamespace(target, source)

console.log(target.func())         // → 'hello'
console.log(target.func.newProp)   // → 'world'
```

## API

### `mergeNamespace<T, S>(target: T, source: S): T & S`

Сливает свойства из `source` в `target`, сохраняя существующую функциональность.

#### Параметры

- `target` - Целевой объект для слияния
- `source` - Исходный объект для слияния

#### Возвращает

Объединённый объект с комбинированным типом `T & S`

## Примеры

### Объекты конфигурации

```typescript
const config = {
    api: () => fetch('/api'),
    database: () => connectDB()
}

const extensions = {
    api: {
        timeout: 5000,
        retries: 3
    },
    database: {
        pool: { min: 1, max: 10 }
    }
}

mergeNamespace(config, extensions)

// Использование как функции
const response = await config.api()

// Использование как объекта
const timeout = config.api.timeout  // → 5000
const pool = config.database.pool   // → { min: 1, max: 10 }
```

### Системы плагинов

```typescript
class Logger {
    log(message: string) {
        console.log(`[LOG] ${message}`)
    }
}

const logger = new Logger()

// Добавление метаданных к логгеру
mergeNamespace(logger, {
    log: {
        level: 'info',
        timestamp: true,
        format: 'json'
    }
})

// Использование как метода
logger.log('Hello world')

// Использование конфигурации
if (logger.log.timestamp) {
    // Логика добавления временной метки
}
```

### Функциональная конфигурация

```typescript
const math = {
    add: (a: number, b: number) => a + b,
    multiply: (a: number, b: number) => a * b
}

const mathConfig = {
    add: { precision: 2 },
    multiply: { overflow: 'error' }
}

mergeNamespace(math, mathConfig)

// Функции работают нормально
const sum = math.add(1.234, 2.345)  // → 3.579

// Конфигурация доступна
const precision = math.add.precision  // → 2
```

## Типобезопасность

Утилита предоставляет полную поддержку TypeScript:

```typescript
interface ApiConfig {
    timeout: number
    retries: number
}

interface Api {
    (): Promise<Response>
    config?: ApiConfig
}

const api: Api = () => fetch('/api')

mergeNamespace(api, {
    config: { timeout: 5000, retries: 3 }
})

// TypeScript знает и о функции, и о свойствах
const response = await api()           // ✓ Вызов функции
const timeout = api.config?.timeout    // ✓ Доступ к свойству
```

## Производительность

- **Нулевые накладные расходы** - Без влияния на производительность во время выполнения
- **Эффективность памяти** - Свойства добавляются напрямую
- **Оптимизированные типы** - Полный вывод типов TypeScript

## Обработка ошибок

```typescript
try {
    mergeNamespace(target, source)
} catch (error) {
    // Обработка конфликтов слияния или проблем с типами
    console.error('Слияние не удалось:', error)
}
```

## Продвинутое использование

### Вложенное слияние

```typescript
const complex = {
    utils: {
        string: () => 'helper',
        number: () => 42
    }
}

const extensions = {
    utils: {
        string: {
            trim: true,
            lowercase: false
        },
        number: {
            precision: 2
        }
    }
}

mergeNamespace(complex, extensions)

// Все комбинации работают
complex.utils.string()                    // → 'helper'
complex.utils.string.trim                 // → true
complex.utils.number()                    // → 42
complex.utils.number.precision            // → 2
```

### Условное слияние

```typescript
const feature = {
    process: (data: any) => processData(data)
}

const conditionalConfig = {
    process: {
        enabled: process.env.NODE_ENV === 'production',
        debug: process.env.DEBUG === 'true'
    }
}

mergeNamespace(feature, conditionalConfig)

if (feature.process.enabled) {
    feature.process(data)
}
```

## Связанные модули

- [globalify](/modules/core/globalify) - Интеграция глобальных пространств имён
- [canClone](/modules/core/canClone) - Утилиты клонирования объектов

## Исходный код

Посмотреть [исходный код на GitHub](https://github.com/empty-set-dev/sky-modules/blob/main/core/mergeNamespace/index.ts).