# canClone

Проверяет, может ли объект быть клонирован с помощью `structuredClone`.

## Установка

```typescript
import canClone from '@sky-modules/core/canClone'
```

## API

### canClone(object)

Проверяет совместимость объекта с `structuredClone`.

```typescript
canClone(object: unknown): boolean
```

**Параметры:**
- `object` - Объект для проверки клонируемости

**Возвращает:** `true` если объект может быть клонирован, `false` иначе

## Использование

### Базовая проверка

```typescript
canClone({ name: 'John' }) // true
canClone([1, 2, 3]) // true
canClone(new Map()) // false (Map не может быть клонирован)
canClone(() => {}) // false (функции не могут быть клонированы)
```

### Условное клонирование

```typescript
const original = { data: [1, 2, 3] }

if (canClone(original)) {
  const cloned = structuredClone(original)
  cloned.data.push(4)
  console.log(original.data) // [1, 2, 3]
  console.log(cloned.data)   // [1, 2, 3, 4]
}
```

### Безопасная сериализация

```typescript
function saveToStorage(obj: unknown) {
  if (canClone(obj)) {
    localStorage.setItem('data', JSON.stringify(obj))
  } else {
    console.warn('Объект не может быть безопасно клонирован')
  }
}
```
