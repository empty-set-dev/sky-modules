# Расширения Math

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Math utility module
</div>

Дополнительные методы Math для частых операций.


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import '@sky-modules/core/Math'
```

## API

### Math.minmax(value, min, max)

Ограничивает значение между минимумом и максимумом.

```typescript
Math.minmax(value: number, min: number, max: number): number
```

**Параметры:**
- `value` - Значение для ограничения
- `min` - Минимальная граница
- `max` - Максимальная граница

**Возвращает:** Ограниченное значение между min и max

### Math.randomBetween(from, to)

Генерирует случайное число между двумя значениями.

```typescript
Math.randomBetween(from: number, to: number): number
```

**Параметры:**
- `from` - Нижняя граница (по умолчанию 0)
- `to` - Верхняя граница (по умолчанию 1)

**Возвращает:** Случайное дробное число между from и to

### Math.roundedRandomBetween(from, to)

Генерирует случайное целое число между двумя значениями.

```typescript
Math.roundedRandomBetween(from: number, to: number): number
```

**Параметры:**
- `from` - Нижняя граница (по умолчанию 0)
- `to` - Верхняя граница (по умолчанию 0)

**Возвращает:** Случайное целое число между from и to (включительно)

## Использование

### Ограничение значений

```typescript
Math.minmax(150, 0, 100)    // 100
Math.minmax(-10, 0, 100)    // 0
Math.minmax(50, 0, 100)     // 50
```

### Случайные числа

```typescript
// Дробное между 0 и 1
Math.randomBetween()        // 0.7234...

// Дробное между 10 и 20
Math.randomBetween(10, 20)  // 15.432...

// Целое между 1 и 6 (кубик)
Math.roundedRandomBetween(1, 6)  // 4
```

### Ограниченная анимация

```typescript
const velocity = Math.minmax(speed, -maxSpeed, maxSpeed)
const opacity = Math.minmax(value, 0, 1)
```
