# Расширения Array

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Array utility module
</div>

Этот модуль расширяет прототип встроенного JavaScript Array дополнительными утилитарными методами.


## Installation

```bash
npm install @sky-modules/core
```

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

### `toShuffled(): this`

Создает новую перемешанную копию массива без изменения оригинала.

**Возвращает:** Новый массив с теми же элементами в случайном порядке.

**Пример:**
```typescript
const original = [1, 2, 3, 4, 5]
const shuffled = original.toShuffled()
console.log(original) // [1, 2, 3, 4, 5] (без изменений)
console.log(shuffled) // [3, 1, 5, 2, 4] (случайный порядок)
```

## Типобезопасность

Все методы правильно типизированы и работают с обобщенными массивами:

```typescript
const strings: string[] = ['а', 'б', 'в']
const lastString: string = strings.last() // Тип: string

const numbers: number[] = [1, 2, 3]
const removed: boolean = numbers.remove(2) // Тип: boolean
```

## Неперечисляемые свойства

Все добавленные методы помечены как неперечисляемые, что означает, что они не появятся при итерации по свойствам массива или при использовании `Object.keys()`.

## Использование

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