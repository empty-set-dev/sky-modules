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
    - [bind](#bind)
    - [mergeNamespace](#mergenamespace)
    - [not](#not)


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

##### `toShuffled(): Array<T>`

Создает новую перемешанную копию массива без изменения оригинала.

**Возвращает:** Новый массив с теми же элементами в случайном порядке.

**Пример:**
```typescript
const original = [1, 2, 3, 4, 5]
const shuffled = original.toShuffled()
console.log(original) // [1, 2, 3, 4, 5] (без изменений)
console.log(shuffled) // [3, 1, 5, 2, 4] (случайный порядок)
```

#### Детали реализации

Все методы реализованы через `Object.defineProperty`:
- `enumerable: false` - не появятся в `for...in` или `Object.keys()`
- `writable: true` - могут быть переопределены
- `configurable: true` - могут быть удалены или реконфигурированы

Каждый метод проверяет свое существование перед определением.

#### Использование

Импортируйте все расширения:

```typescript
import '@sky-modules/core/Array'
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

### bind

[← Назад к оглавлению](#содержание) • [Исходный код](https://github.com/empty-set-dev/sky-modules/tree/main/core/bind)

TypeScript декоратор для автоматической привязки методов к экземплярам класса.

#### Возможности

- Автоматическая привязка контекста `this`
- Работает как декоратор свойств
- Ленивая инициализация
- Эффективное использование памяти (использует Symbol ключи)

#### API

##### `bind`

TypeScript декоратор, который автоматически привязывает методы класса к их экземпляру.

###### Сигнатура декоратора

```typescript
function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
): PropertyDescriptor
```

#### Использование

Импортируйте декоратор:

```typescript
import { bind } from '@sky-modules/core/bind'
```

Или используйте глобально:

```typescript
import '@sky-modules/core/bind/global'
```

##### Базовый пример

```typescript
import { bind } from '@sky-modules/core/bind'

class MyClass {
    name = 'MyClass'

    @bind
    greet() {
        return `Привет от ${this.name}`
    }
}

const instance = new MyClass()
const greet = instance.greet

// Работает корректно без явной привязки
console.log(greet()) // "Привет от MyClass"
```

##### С обработчиками событий

```typescript
class Button {
    label = 'Нажми меня'

    @bind
    handleClick() {
        console.log(`${this.label} была нажата`)
    }

    render() {
        // Безопасно передавать как callback
        element.addEventListener('click', this.handleClick)
    }
}
```

##### С колбэками

```typescript
class DataProcessor {
    prefix = 'Обработано: '

    @bind
    process(data: string) {
        return this.prefix + data
    }

    processAll(items: string[]) {
        // Безопасно использовать как callback
        return items.map(this.process)
    }
}
```

#### Детали реализации

- Использует `Symbol()` для приватного хранения во избежание конфликтов имен свойств
- Ленивая привязка при первом обращении для лучшей производительности
- Возвращает настраиваемый property descriptor (может быть переопределен)
- Привязанная функция кешируется после первого обращения

#### Поддержка TypeScript

Декоратор работает с опцией `experimentalDecorators` в `tsconfig.json`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

#### Преимущества

1. **Без ручной привязки**: Не нужно привязывать в конструкторе или использовать стрелочные функции
2. **Эффективное использование памяти**: Только одна привязанная функция на экземпляр
3. **Типобезопасность**: Полная поддержка TypeScript
4. **Дружественность к фреймворкам**: Работает с любым фреймворком, использующим колбэки

#### Альтернативы

Без `@bind`:

```typescript
class MyClass {
    constructor() {
        // Ручная привязка в конструкторе
        this.greet = this.greet.bind(this)
    }

    greet() {
        return `Привет от ${this.name}`
    }
}

// Или стрелочная функция (менее гибко)
class MyClass {
    greet = () => {
        return `Привет от ${this.name}`
    }
}
```

С декоратором `@bind` привязка обрабатывается автоматически и эффективно.

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

### not

[← Назад к оглавлению](#содержание) • [Исходный код](https://github.com/empty-set-dev/sky-modules/tree/main/core/not)

Типобезопасные утилиты для проверки null/undefined с кастомными типами ошибок.

#### Возможности

- Типобезопасные проверки null, undefined и nullish
- Кастомные типы ошибок для лучшей обработки ошибок
- Функции-утверждения для сужения типов
- Поддержка type guards в TypeScript

#### API

##### Проверки Undefined

###### `notUndefined<T>(value: undefined | T, message: string): T`

Возвращает значение, если оно не undefined, иначе выбрасывает `UndefinedError`.

```typescript
const value: string | undefined = getValue()
const result = notUndefined(value, 'Значение должно быть определено')
// result теперь имеет тип string
```

###### `assertIsNotUndefined<T>(value: undefined | T, message: string): asserts value is T`

Утверждает, что значение не undefined, используя assertion signatures TypeScript.

```typescript
const value: string | undefined = getValue()
assertIsNotUndefined(value, 'Значение должно быть определено')
// value теперь имеет тип string в оставшейся области видимости
```

###### `UndefinedError`

Кастомный класс ошибки для undefined значений.

##### Проверки Null

###### `notNull<T>(value: null | T, message: string): T`

Возвращает значение, если оно не null, иначе выбрасывает `NullError`.

```typescript
const value: string | null = getValue()
const result = notNull(value, 'Значение не должно быть null')
// result теперь имеет тип string
```

###### `assertIsNotNull<T>(value: null | T, message: string): asserts value is T`

Утверждает, что значение не null, используя assertion signatures TypeScript.

```typescript
const value: string | null = getValue()
assertIsNotNull(value, 'Значение не должно быть null')
// value теперь имеет тип string в оставшейся области видимости
```

###### `NullError`

Кастомный класс ошибки для null значений.

##### Проверки Nullish

###### `notNullish<T>(value: undefined | null | T, message: string): T`

Возвращает значение, если оно не nullish (null или undefined), иначе выбрасывает `NullishError`.

```typescript
const value: string | null | undefined = getValue()
const result = notNullish(value, 'Значение должно быть определено')
// result теперь имеет тип string
```

###### `assertIsNotNullish<T>(value: undefined | null | T, message: string): asserts value is T`

Утверждает, что значение не nullish, используя assertion signatures TypeScript.

```typescript
const value: string | null | undefined = getValue()
assertIsNotNullish(value, 'Значение должно быть определено')
// value теперь имеет тип string в оставшейся области видимости
```

###### `NullishError`

Кастомный класс ошибки для nullish значений.

#### Использование

Импортируйте модуль:

```typescript
import '@sky-modules/core/not'
```

Или импортируйте отдельные функции:

```typescript
import { notUndefined, notNull, notNullish } from '@sky-modules/core/not'
```

#### Сообщения об ошибках

Все ошибки включают описательные сообщения:

- `UndefinedError`: "unexpected undefined: [ваше сообщение]"
- `NullError`: "unexpected null: [ваше сообщение]"
- `NullishError`: "unexpected nullish: [ваше сообщение]"

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
- 🎮 [Примеры использования](https://empty-set-dev.github.io/sky-modules/playground)
- 🛠️ [API справочник](https://empty-set-dev.github.io/sky-modules/modules)

## Лицензия

ISC License - смотрите [LICENSE](LICENSE) файл для деталей.

---

Создано с ❤️ командой Empty Set Dev
