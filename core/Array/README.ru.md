# Расширения Array

Этот модуль расширяет прототип встроенного JavaScript Array дополнительными утилитарными методами.

## Методы

### `last(): T`

Возвращает последний элемент массива.

**Возвращает:** Последний элемент массива, или `undefined` если массив пустой.

**Пример:**
```typescript
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.last()) // 5

const empty: number[] = []
console.log(empty.last()) // undefined
```

### `remove(element: T): boolean`

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

### `shuffle(): this`

Перемешивает массив на месте используя алгоритм Фишера-Йетса.

**Возвращает:** Тот же экземпляр массива (для цепочки методов).

**Пример:**
```typescript
const numbers = [1, 2, 3, 4, 5]
numbers.shuffle()
console.log(numbers) // [3, 1, 5, 2, 4] (случайный порядок)
```

### `toShuffled(): Array\<T\>`

Создает новую перемешанную копию массива без изменения оригинала.

**Возвращает:** Новый массив с теми же элементами в случайном порядке.

**Пример:**
```typescript
const original = [1, 2, 3, 4, 5]
const shuffled = original.toShuffled()
console.log(original) // [1, 2, 3, 4, 5] (без изменений)
console.log(shuffled) // [3, 1, 5, 2, 4] (случайный порядок)
```

## Детали реализации

Все методы реализованы через `Object.defineProperty`:
- `enumerable: false` - не появятся в `for...in` или `Object.keys()`
- `writable: true` - могут быть переопределены
- `configurable: true` - могут быть удалены или реконфигурированы

Каждый метод проверяет свое существование перед определением.

## Использование

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