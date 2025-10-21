# bind

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  bind utility module
</div>

TypeScript декоратор для автоматической привязки методов к экземплярам класса.


## Installation

```bash
npm install @sky-modules/core
```

## Возможности

- Автоматическая привязка контекста `this`
- Работает как декоратор свойств
- Ленивая инициализация
- Эффективное использование памяти (использует Symbol ключи)

## API

### `bind`

TypeScript декоратор, который автоматически привязывает методы класса к их экземпляру.

#### Сигнатура декоратора

```typescript
function bind<T extends Function>(
    target: object,
    propertyKey: number | string | symbol,
    descriptor?: TypedPropertyDescriptor<T>
): PropertyDescriptor
```

## Использование

Импортируйте декоратор:

```typescript
import { bind } from '@sky-modules/core/bind'
```

Или используйте глобально:

```typescript
import '@sky-modules/core/bind/global'
```

### Базовый пример

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

### С обработчиками событий

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

### С колбэками

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

## Детали реализации

- Использует `Symbol()` для приватного хранения во избежание конфликтов имен свойств
- Ленивая привязка при первом обращении для лучшей производительности
- Возвращает настраиваемый property descriptor (может быть переопределен)
- Привязанная функция кешируется после первого обращения

## Поддержка TypeScript

Декоратор работает с опцией `experimentalDecorators` в `tsconfig.json`:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

## Преимущества

1. **Без ручной привязки**: Не нужно привязывать в конструкторе или использовать стрелочные функции
2. **Эффективное использование памяти**: Только одна привязанная функция на экземпляр
3. **Типобезопасность**: Полная поддержка TypeScript
4. **Дружественность к фреймворкам**: Работает с любым фреймворком, использующим колбэки

## Альтернативы

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
