# Система Define

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  define utility module
</div>

**Система define** — это основа возможностей сериализации и сетевой синхронизации Sky Core. Она создает глобальный реестр всех классов и функций, обеспечивая:

- ✅ Сериализацию с метаданными классов
- ✅ Десериализацию с восстановлением экземпляров классов
- ✅ Горячую замену модулей (HMR)
- ✅ Сетевую синхронизацию
- ✅ Отладку и интроспекцию


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { define } from '@sky-modules/core'
```

## Быстрый Старт

```typescript
import '@sky-modules/core/define'

// Определить класс
@define('app.User')
class User {
    @string name
    @number age

    greet() {
        return `Привет, я ${this.name}!`
    }
}

// Создать экземпляр
const user = new User()
user.name = 'Анна'
user.age = 25

// Сериализовать (с информацией о классе!)
const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Анна',
//   age: 25
// }

// Десериализовать (восстанавливает экземпляр User!)
const restored = load(json)
restored.greet() // "Привет, я Анна!"
restored instanceof User // true
```

## Основные Концепции

### 1. Реестр

Каждая определенная сущность хранится в глобальном реестре:

```typescript
@define('app.MyClass')
class MyClass { }

// Хранится как:
{
    'app.MyClass': {
        name: 'app.MyClass',
        value: MyClass,
        [idSymbol]: 1,        // Уникальный числовой ID
        [uidSymbol]: 'app.MyClass',  // Полный путь
        [typeSymbol]: 'class',       // Тип: 'class' | 'func' | 'object'
        [nameSymbol]: 'MyClass'      // Короткое имя
    }
}
```

### 2. Символы Метаданных

Каждая зарегистрированная сущность получает метаданные через Символы:

- `[idSymbol]` - Уникальный числовой идентификатор для сетевого протокола
- `[uidSymbol]` - Строка полного пути для десериализации
- `[nameSymbol]` - Короткое имя для отладки
- `[typeSymbol]` - Тип сущности ('class', 'func', 'object', 'array')

### 3. Система Схем

Определяйте реактивные структуры данных с помощью декораторов:

```typescript
@define('app.User')
class User {
    @string name      // Реактивное строковое свойство
    @number age       // Реактивное числовое свойство
    @boolean active   // Реактивное булевое свойство
    @array(Post) posts // Реактивный массив постов
}
```

## Справочник API

### @define(name: string)

Зарегистрировать класс в глобальном реестре.

```typescript
@define('namespace.ClassName')
class MyClass {
    // ...
}
```

**Параметры:**
- `name` - Уникальный идентификатор (рекомендуется: `domain.module.Class`)

**Возвращает:** Декоратор класса

**Пример:**
```typescript
@define('game.entities.Player')
class Player {
    @string name
    @number health = 100
}
```

### define(name: string, value: any)

Зарегистрировать функцию или объект.

```typescript
define('app.utils.helper', helper)
export function helper() {
    // ...
}
```

**Параметры:**
- `name` - Уникальный идентификатор
- `value` - Функция или объект для регистрации

**Возвращает:** Значение (для цепочки вызовов)

**Пример:**
```typescript
define('app.config', config)
export const config = {
    apiUrl: 'https://api.example.com'
}
```

### schema(name: string, schemaObject: object)

Определить переиспользуемую схему.

```typescript
const AddressSchema = schema('app.Address', {
    street: string,
    city: string,
    country: string
})
```

**Параметры:**
- `name` - Уникальный идентификатор
- `schemaObject` - Объект, описывающий структуру

**Возвращает:** Объект схемы

## Декораторы Свойств

### Примитивные Типы

```typescript
@string name        // string
@number age         // number
@boolean active     // boolean
```

### Опциональные Типы

```typescript
@optional.string nickname    // string | undefined
@optional.number score       // number | undefined
@optional.boolean premium    // boolean | undefined
```

### Nullable Типы

```typescript
@nullable.string avatar      // string | null
@nullable.number lastSeen    // number | null
```

### Nullish Типы

```typescript
@nullish.string bio          // string | null | undefined
```

### Сложные Типы

```typescript
@object(Address) address     // Вложенный объект
@array(User) friends         // Массив объектов
@func onUpdate               // Свойство-функция
```

## Продвинутое Использование

### Пользовательские Схемы

Определяйте сложные вложенные структуры:

```typescript
const PersonSchema = {
    name: string,
    age: number,
    address: {
        street: string,
        city: string
    },
    friends: [PersonSchema] // Рекурсивно!
}

@define('app.Person')
class Person {
    @object(PersonSchema) data
}
```

### Горячая Замена Модулей

Система define поддерживает HMR:

```typescript
if (import.meta.hot) {
    import.meta.hot.accept()

    // Классы автоматически перерегистрируются
    // Существующие экземпляры продолжают работать!
}
```

### Интроспекция

Доступ к реестру для отладки:

```typescript
import local from '@sky-modules/core/define/local'

// Получить все определенные сущности
console.log(local.defines)

// Найти конкретный класс
const UserClass = local.defines['app.User']?.value
console.log(UserClass[local.uidSymbol]) // 'app.User'
```

## Сериализация

### save(object)

Сериализовать объект с метаданными класса:

```typescript
const user = new User()
user.name = 'Анна'

const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Анна',
//   age: 25
// }
```

### load(json)

Десериализовать и восстановить экземпляр класса:

```typescript
const restored = load(json)
restored instanceof User // true
restored.greet() // Методы работают!
```

### plain(schema, data)

Создать типизированный объект из простых данных:

```typescript
const UserSchema = {
    name: string,
    age: number
}

const user = plain(UserSchema, {
    name: 'Анна',
    age: 25
})
// user теперь реактивен и типизирован!
```

## Лучшие Практики

### 1. Используйте Пространства Имен

```typescript
// ✅ Хорошо - организованная иерархия
@define('game.entities.Player')
@define('game.systems.Physics')
@define('ui.components.Button')

// ❌ Плохо - плоская структура, возможны конфликты
@define('Player')
@define('Physics')
```

### 2. Определяйте Все, Что Сериализуете

```typescript
// ✅ Хорошо
@define('app.User')
class User {
    @define('app.Settings')
    settings: Settings
}

// ❌ Плохо - Settings не будет сериализован корректно
class Settings { }
```

### 3. Используйте Типы TypeScript

```typescript
// ✅ Хорошо - типобезопасно
@define('app.User')
class User {
    @string name: string
    @number age: number
}

// ❌ Плохо - теряется типобезопасность
class User {
    @string name
    @number age
}
```

### 4. Избегайте Циклических Ссылок (пока)

```typescript
// ⚠️ Будьте осторожны
@define('app.User')
class User {
    @object(User) friend // Циклическая ссылка
}

// Используйте ID вместо этого:
class User {
    @number friendId
}
```

## Отладка

### Проверить, Определена ли Сущность

```typescript
import local from '@sky-modules/core/define/local'

function isDefined(name: string): boolean {
    return local.defines[name] != null
}

console.log(isDefined('app.User')) // true/false
```

### Список Всех Определений

```typescript
import local from '@sky-modules/core/define/local'

Object.keys(local.defines).forEach(name => {
    const def = local.defines[name]
    console.log(`${name} (${def.value[local.typeSymbol]})`)
})
```

### Инспекция Метаданных Сущности

```typescript
const user = new User()

console.log(user.constructor[local.uidSymbol])    // 'app.User'
console.log(user.constructor[local.idSymbol])     // 1
console.log(user.constructor[local.nameSymbol])   // 'User'
console.log(user.constructor[local.typeSymbol])   // 'class'
```

## Общие Паттерны

### Паттерн Singleton

```typescript
@define('app.GameState')
class GameState {
    private static instance: GameState

    static getInstance(): GameState {
        if (!this.instance) {
            this.instance = new GameState()
        }
        return this.instance
    }
}
```

### Паттерн Factory

```typescript
@define('app.EntityFactory')
class EntityFactory {
    create(type: string): Entity {
        const EntityClass = local.defines[`app.entities.${type}`]?.value
        if (!EntityClass) {
            throw new Error(`Неизвестный тип сущности: ${type}`)
        }
        return new EntityClass()
    }
}
```

### Паттерн Mixin

```typescript
@define('app.mixins.Movable')
class Movable {
    @number x = 0
    @number y = 0

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }
}

@define('app.Player')
@mixin(Movable)
class Player {
    @string name
}
```

## Ограничения

1. **Нет циклических схем** (пока) - Используйте ID для ссылок на родительские объекты
2. **Symbol свойства** не сериализуются
3. **Функции в данных** не сериализуются (используйте декоратор `@func`)
4. **Цепочка прототипов** должна быть определена

## Руководство по Миграции

### От Обычных Классов

```typescript
// До
class User {
    name: string = ''
    age: number = 0
}

// После
@define('app.User')
class User {
    @string name = ''
    @number age = 0
}
```

### От JSON Сериализации

```typescript
// До
const json = JSON.stringify(user)
const parsed = JSON.parse(json) // Простой объект!

// После
const json = save(user)
const restored = load(json) // Экземпляр User!
```

## Производительность

- **Поиск в реестре**: O(1) константное время
- **Сериализация**: O(n) где n — количество свойств
- **Потребление памяти**: ~100 байт на определенный класс
- **Сетевые накладные расходы**: ~20-50 байт для метаданных класса

## См. Также

- Система схем (`types.ts`) - Определения типов
- Реактивность (`reactivePropertyDescriptors.ts`) - Реактивные свойства
- Совместное использование (`share.ts`) - Сетевая синхронизация
