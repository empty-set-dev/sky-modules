# Assert

Утилиты проверки инвариантов во время выполнения.

## Установка

```typescript
import { assert, AssertionError } from '@sky-modules/core/assert'
```

## API

### assert(expression, message)

Проверяет, что выражение истинно.

```typescript
assert(expression: unknown, message: string): void
```

**Параметры:**
- `expression` - Выражение для проверки (должно быть истинным)
- `message` - Сообщение об ошибке при провале проверки

**Выбрасывает:** `AssertionError`, если выражение ложно

### AssertionError

Пользовательский класс ошибки для проваленных проверок.

```typescript
class AssertionError extends Error
```

## Использование

```typescript
function divide(a: number, b: number): number {
  assert(b !== 0, 'Divisor cannot be zero')
  return a / b
}

divide(10, 2)  // OK
divide(10, 0)  // AssertionError: assertion failed: Divisor cannot be zero
```

## Примеры

### Предусловия

```typescript
function withdraw(amount: number) {
  assert(amount > 0, 'Amount must be positive')
  assert(amount <= balance, 'Insufficient funds')
  balance -= amount
}
```

### Валидация массива

```typescript
function processItems(items: unknown) {
  assert(Array.isArray(items), 'Items must be an array')
  assert(items.length > 0, 'Items cannot be empty')
  items.forEach(processItem)
}
```

### Инварианты

```typescript
class BankAccount {
  private balance = 0

  deposit(amount: number) {
    this.balance += amount
    assert(this.balance >= 0, 'Balance invariant violated')
  }
}
```

## Когда использовать

Подходит для:
- Инварианты, которые никогда не должны нарушаться
- Предусловия при входе в функцию
- Обнаружение багов на этапе разработки

Не подходит для:
- Валидации пользовательского ввода
- Ожидаемых ошибок
- Управления потоком выполнения
