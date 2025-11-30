# Class

Псевдоним типа для функций-конструкторов.

## Установка

```typescript
import type Class from '@sky-modules/core/Class'
```

## API

### Class<T>

Тип, представляющий функцию-конструктор.

```typescript
type Class<T extends new (...args: any[]) => any = new (...args: any[]) => any> = T
```

**Параметры типа:**
- `T` - Тип функции-конструктора (по умолчанию общий конструктор)

## Использование

### Аннотация типа

```typescript
function createInstance<T>(ClassRef: Class<new () => T>): T {
  return new ClassRef()
}

class User {
  name = 'John'
}

const user = createInstance(User)
```

### Ограничения дженериков

```typescript
function extend<T extends Class>(Base: T) {
  return class extends Base {
    extended = true
  }
}
```

### Внедрение зависимостей

```typescript
class Container {
  register<T>(token: symbol, ClassRef: Class<new () => T>): void {
    // Регистрация класса для DI
  }

  resolve<T>(token: symbol): T {
    // Разрешение и создание экземпляра
  }
}
```
