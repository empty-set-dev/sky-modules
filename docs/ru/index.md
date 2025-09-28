# Sky Modules

Мощные TypeScript утилиты для современной разработки

## Установка

```bash
npm install @sky-modules/core
```

## Использование

```typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Слияние объектов с типобезопасностью
const result = mergeNamespace(obj1, obj2)

// Добавление в глобальную область
globalify({ myUtility: someFunction })
```

## Модули


### Содержание

- **Основные модули**
    - [Array](#array)
    - [mergeNamespace](#mergenamespace)


## Основные модули

### Array

[← Назад к оглавлению](#содержание) • [Исходный код](https://github.com/empty-set-dev/sky-modules/tree/main/core/Array)

### Расширения Array

Этот модуль расширяет прототип встроенного JavaScript Array дополнительными утилитарными методами.

#### Методы

##### `last(): T`

Возвращает последний элемент массива.

**Возвращает:** Последний элемент массива, или `undefined` если массив пустой.

**Пример:**
```typescript
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.last()) // 5

const empty: number[] = []
console.log(empty.last()) // undefined
```

##### `remove(element: T): boolean`

Удаляет первое вхождение указанного элемента из массива.

**Параметры:**
- `element: T` - Элемент для удаления из массива

**Возвращает:** `true` если элемент был найден и удален, `false` в противном случае.

**Пример:**
```typescript
const fruits = ['яблоко', 'банан', 'яблоко', 'апельсин']
console.log(fruits.remove('банан')) // true
console.log(fruits) // ['яблоко', 'яблоко', 'апельсин']

console.log(fruits.remove('виноград')) // false
console.log(fruits) // ['яблоко', 'яблоко', 'апельсин'] (без изменений)
```

##### `shuffle(): this`

Перемешивает массив на месте используя алгоритм Фишера-Йетса.

**Возвращает:** Тот же экземпляр массива (для цепочки методов).

**Пример:**
```typescript
const numbers = [1, 2, 3, 4, 5]
numbers.shuffle()
console.log(numbers) // [3, 1, 5, 2, 4] (случайный порядок)
```

##### `toShuffled(): this`

Создает новую перемешанную копию массива без изменения оригинала.

**Возвращает:** Новый массив с теми же элементами в случайном порядке.

**Пример:**
```typescript
const original = [1, 2, 3, 4, 5]
const shuffled = original.toShuffled()
console.log(original) // [1, 2, 3, 4, 5] (без изменений)
console.log(shuffled) // [3, 1, 5, 2, 4] (случайный порядок)
```

#### Типобезопасность

Все методы правильно типизированы и работают с обобщенными массивами:

```typescript
const strings: string[] = ['а', 'б', 'в']
const lastString: string = strings.last() // Тип: string

const numbers: number[] = [1, 2, 3]
const removed: boolean = numbers.remove(2) // Тип: boolean
```

#### Неперечисляемые свойства

Все добавленные методы помечены как неперечисляемые, что означает, что они не появятся при итерации по свойствам массива или при использовании `Object.keys()`.

#### Использование

Импортируйте глобальные расширения, чтобы методы стали доступны для всех массивов:

```typescript
import '@sky-modules/core/Array/global'
```

Или импортируйте отдельные методы:

```typescript
import '@sky-modules/core/Array/Array+last'
import '@sky-modules/core/Array/Array+remove'
import '@sky-modules/core/Array/Array+shuffle'
import '@sky-modules/core/Array/Array+toShuffled'
```

[← Назад к оглавлению](#содержание)

---

### mergeNamespace

[← Назад к оглавлению](#содержание) • [Исходный код](https://github.com/empty-set-dev/sky-modules/tree/main/core/mergeNamespace)

Продвинутое слияние пространств имён с типобезопасностью

Утилита `mergeNamespace` предоставляет мощные возможности для слияния объектов, сохраняя поведение функций и добавляя новые свойства. Идеально подходит для объектов конфигурации, систем плагинов и сложных структур данных.

#### Установка

```bash
npm install @sky-modules/core
```

#### Использование

```typescript
import { mergeNamespace } from '@sky-modules/core'

// Базовое использование
const target = { func: () => 'hello' }
const source = { func: { newProp: 'world' } }

mergeNamespace(target, source)

console.log(target.func())         // → 'hello'
console.log(target.func.newProp)   // → 'world'
```

#### API

##### `mergeNamespace<T, S>(target: T, source: S): T & S`

Сливает свойства из `source` в `target`, сохраняя существующую функциональность.

###### Параметры

- `target` - Целевой объект для слияния
- `source` - Исходный объект для слияния

###### Возвращает

Объединённый объект с комбинированным типом `T & S`

#### Примеры

##### Объекты конфигурации

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

##### Системы плагинов

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

##### Функциональная конфигурация

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

#### Типобезопасность

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

#### Производительность

- **Нулевые накладные расходы** - Без влияния на производительность во время выполнения
- **Эффективность памяти** - Свойства добавляются напрямую
- **Оптимизированные типы** - Полный вывод типов TypeScript

#### Обработка ошибок

```typescript
try {
    mergeNamespace(target, source)
} catch (error) {
    // Обработка конфликтов слияния или проблем с типами
    console.error('Слияние не удалось:', error)
}
```

#### Продвинутое использование

##### Вложенное слияние

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

##### Условное слияние

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

#### Связанные модули

Этот модуль хорошо работает с другими утилитами Sky для расширенной работы с объектами и управления конфигурацией.

#### Исходный код

Посмотреть [исходный код на GitHub](https://github.com/empty-set-games/sky-modules/blob/main/core/mergeNamespace/index.ts).

[← Назад к оглавлению](#содержание)

---


## Разработка

```bash
# Клонирование репозитория
git clone https://github.com/empty-set-dev/sky-modules.git
cd sky-modules

# Установка зависимостей
pnpm install

# Запуск разработки
pnpm dev
```

## Документация

- 📖 [Полная документация](https://empty-set-dev.github.io/sky-modules)
- 🎮 [Примеры использования](https://empty-set-dev.github.io/sky-modules/examples)
- 🛠️ [API справочник](https://empty-set-dev.github.io/sky-modules/modules)

## Лицензия

ISC License - смотрите [LICENSE](https://github.com/empty-set-games/sky-modules/blob/main/LICENSE) файл для деталей.

---

Создано с ❤️ командой Empty Set Dev
