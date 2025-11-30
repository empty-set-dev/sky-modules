# repeat

Выполняет callback несколько раз с поддержкой итераций.

## Установка

```typescript
import repeat from '@sky-modules/core/repeat'
```

## API

### repeat(count, callback, ...args)

Повторяет функцию callback указанное количество раз с поддержкой async callbacks.

```typescript
repeat<A extends unknown[]>(
  count: number,
  callback: (iteration: number, ...args: A) => void | Promise<void>,
  ...args: A
): Promise<void>
```

**Параметры:**
- `count` - Количество повторений
- `callback` - Функция для выполнения (получает индекс итерации и опциональные аргументы)
- `args` - Дополнительные аргументы для передачи в callback

**Возвращает:** Promise, разрешающийся когда все итерации завершены

## Использование

### Простой цикл

```typescript
await repeat(5, (i) => {
  console.log(`Итерация ${i}`)
})
// Output: Итерация 0, 1, 2, 3, 4
```

### Асинхронные операции

```typescript
await repeat(3, async (i) => {
  const data = await fetchData(i)
  await saveToDatabase(data)
})
```

### С дополнительными аргументами

```typescript
await repeat(4, (i, prefix, suffix) => {
  console.log(`${prefix}${i}${suffix}`)
}, 'Элемент: ', '!')
// Output: Элемент: 0!, Элемент: 1!, Элемент: 2!, Элемент: 3!
```
