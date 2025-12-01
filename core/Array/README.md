# Array Extensions

This module extends the native JavaScript Array prototype with additional utility methods.

## Methods

### `last(): T`

Returns the last element of the array.

**Returns:** The last element of the array, or `undefined` if the array is empty.

**Example:**
```typescript
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.last()) // 5

const empty: number[] = []
console.log(empty.last()) // undefined
```

### `remove(element: T): boolean`

Removes the first occurrence of the specified element from the array.

**Parameters:**
- `element: T` - The element to remove from the array

**Returns:** `true` if the element was found and removed, `false` otherwise.

**Example:**
```typescript
const fruits = ['apple', 'banana', 'apple', 'orange']
console.log(fruits.remove('banana')) // true
console.log(fruits) // ['apple', 'apple', 'orange']

console.log(fruits.remove('grape')) // false
console.log(fruits) // ['apple', 'apple', 'orange'] (unchanged)
```

### `shuffle(): this`

Shuffles the array in place using the Fisher-Yates algorithm.

**Returns:** The same array instance (for method chaining).

**Example:**
```typescript
const numbers = [1, 2, 3, 4, 5]
numbers.shuffle()
console.log(numbers) // [3, 1, 5, 2, 4] (random order)
```

### `toShuffled(): Array\<T\>`

Creates a new shuffled copy of the array without modifying the original.

**Returns:** A new array with the same elements in random order.

**Example:**
```typescript
const original = [1, 2, 3, 4, 5]
const shuffled = original.toShuffled()
console.log(original) // [1, 2, 3, 4, 5] (unchanged)
console.log(shuffled) // [3, 1, 5, 2, 4] (random order)
```

## Implementation Details

All methods are implemented using `Object.defineProperty` with:
- `enumerable: false` - won't appear in `for...in` or `Object.keys()`
- `writable: true` - can be overridden if needed
- `configurable: true` - can be deleted or reconfigured

Each method checks if it already exists before defining it.

## Usage

Import all extensions:

```typescript
import '@sky-modules/core/Array'
```

Or import individual methods:

```typescript
import '@sky-modules/core/Array/Array+last'
import '@sky-modules/core/Array/Array+remove'
import '@sky-modules/core/Array/Array+shuffle'
import '@sky-modules/core/Array/Array+toShuffled'
```