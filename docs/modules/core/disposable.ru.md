# disposable

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  disposable utility module
</div>

Расширения для управления освобождаемыми ресурсами с автоматической очисткой.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import '@sky-modules/core/disposable'
```

## API

### DisposableStack.use(funcReturnsDisposable, ...args)

Добавляет освобождаемый ресурс, созданный функцией, в стек.

```typescript
interface DisposableStack {
  use<T, C extends (...args: A) => T & Disposable, A extends unknown[]>(
    funcReturnsDisposable: C,
    ...args: A
  ): { disposable: ReturnType<C> }
}
```

**Параметры:**
- `funcReturnsDisposable` - Функция, которая возвращает освобождаемый объект
- `args` - Аргументы для передачи в функцию

**Возвращает:** Объект со свойством `disposable` содержащим созданный ресурс

### AsyncDisposableStack.use(funcReturnsAsyncDisposable, ...args)

Добавляет асинхронный освобождаемый ресурс, созданный функцией, в стек.

```typescript
interface AsyncDisposableStack {
  use<T, C extends (...args: A) => T & AsyncDisposable, A extends unknown[]>(
    funcReturnsAsyncDisposable: C,
    ...args: A
  ): { disposable: ReturnType<C> }
}
```

**Параметры:**
- `funcReturnsAsyncDisposable` - Функция, которая возвращает асинхронный освобождаемый объект
- `args` - Аргументы для передачи в функцию

**Возвращает:** Объект со свойством `disposable` содержащим созданный ресурс

## Использование

### Синхронные ресурсы

```typescript
using stack = new DisposableStack()

class FileHandle {
  [Symbol.dispose]() {
    console.log('Файл закрыт')
  }
}

const { disposable: file } = stack.use(() => new FileHandle())
// Используем файл...
// Файл автоматически закрывается при выходе из блока
```

### Асинхронные ресурсы

```typescript
await using stack = new AsyncDisposableStack()

class DatabaseConnection {
  async [Symbol.asyncDispose]() {
    console.log('Соединение закрыто')
  }
}

const { disposable: db } = stack.use(() => new DatabaseConnection())
// Используем бд...
// Соединение автоматически закрывается при выходе из блока
```

### Несколько ресурсов

```typescript
using stack = new DisposableStack()

const { disposable: file1 } = stack.use(() => openFile('file1.txt'))
const { disposable: file2 } = stack.use(() => openFile('file2.txt'))

// Оба файла автоматически закрываются в обратном порядке
```
