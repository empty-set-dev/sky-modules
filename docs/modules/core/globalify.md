# globalify

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  globalify utility module
</div>


<!--- This globalify.ru was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Cli](..%2F..%2Fcli%2FREADME.md)   
**[Standard](..%2F..%2Fcore%2FREADME.md)**   
* [Array](..%2F..%2Fcore%2FArray%2FREADME.md)
* [bind](..%2F..%2Fcore%2Fbind%2FREADME.md)
* [Class](..%2F..%2Fcore%2FClass%2FREADME.md)
* [EventEmitter](..%2F..%2Fcore%2FEventEmitter%2FREADME.md)
* [fetch](..%2F..%2Fcore%2Ffetch%2FREADME.md)
* **[globalify](..%2F..%2Fcore%2Fglobalify%2FREADME.md)**
* **[globalify.ru](..%2F..%2Fcore%2Fglobalify%2FREADME.md)**
* [idle](..%2F..%2Fcore%2Fidle%2FREADME.md)
* [Math](..%2F..%2Fcore%2FMath%2FREADME.md)
* [measures](..%2F..%2Fcore%2Fmeasures%2FREADME.md)
* [Object](..%2F..%2Fcore%2FObject%2FREADME.md)
* [Promise](..%2F..%2Fcore%2FPromise%2FREADME.md)
  
[Utilities](..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2Fecs%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   
[components](..%2F..%2Freact%2Fcomponents%2FREADME.md)   
[cameras](..%2F..%2FThree%2Fcameras%2FREADME.md)   


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { globalify } from '@sky-modules/core'
```

## [Standard](..%2F..%2Fcore%2FREADME.md): [globalify](..%2F..%2Fcore%2Fglobalify%2FREADME.md): globalify.ru [(Source)](..%2F..%2Fcore%2Fglobalify%2F)
  
  
# Globalify

Утилита для добавления модулей и функций в глобальную область видимости.

## Основное использование

```typescript
import globalify from 'sky/core/globalify'

// Добавить модуль в глобальную область
namespace MyModule {
    export function hello() {
        return 'Hello World!'
    }

    export const VERSION = '1.0.0'
}

globalify(MyModule)

// Теперь доступно глобально
hello() // 'Hello World!'
VERSION // '1.0.0'

```

## Создание пространств имён

```typescript
// Создание вложенных пространств имён
namespace MyLibrary {
    namespace Utils {
        export function formatDate(date: Date): string {
            return date.toISOString()
        }

        export function randomId(): string {
            return Math.random().toString(36).substring(7)
        }
    }
}

globalify.namespace('app.utils', MyLibrary.Utils)

// Теперь доступно как app.utils.formatDate() и app.utils.randomId()
app.utils.formatDate(new Date())
app.utils.randomId()

```

## Декларация типов для глобальных переменных

Для правильной типизации добавь декларации в глобальную область:

```typescript
import globalify from 'sky/core/globalify'

namespace MyAPI {
    export function request(url: string): Promise<Response> {
        return fetch(url)
    }

    export class ApiError extends Error {
        constructor(message: string, public status: number) {
            super(message)
        }
    }
}

// Добавляем в глобальную область
globalify(MyAPI)

// Декларация типов для TypeScript
declare global {
    const request: typeof MyAPI.request
    const ApiError: typeof MyAPI.ApiError
}

```

## API

### `globalify(module)`

Добавляет все экспорты модуля в глобальную область видимости.

**Параметры:**

* `module: Record<PropertyKey, unknown>` \- объект с экспортами для глобализации

### `globalify.namespace(namespace, module)`

Создаёт вложенное пространство имён и добавляет модуль туда.

**Параметры:**

* `namespace: string` \- путь пространства имён (разделённый точками)
* `module: Record<PropertyKey, unknown>` \- объект с экспортами

**Пример:**

```typescript
// Создаёт глобально доступный объект app.ui.components
globalify.namespace('app.ui.components', {
    Button: MyButton,
    Input: MyInput
})

```

## Внутренняя реализация

Модуль использует `mergeNamespace` для безопасного слияния объектов. Реализация создает вложенные объекты для пространств имён и сливает предоставленный модуль в соответствующую область.