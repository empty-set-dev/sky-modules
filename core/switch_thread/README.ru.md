# Switch Thread

Передача управления циклу событий, чтобы позволить другим задачам выполняться.

## Установка

```typescript
import switchThread from '@sky-modules/core/switch_thread'
```

## API

### switchThread()

Передать управление циклу событий.

```typescript
switchThread(): Promise<void>
```

**Возвращает:** Promise который разрешается в следующей итерации цикла событий

**Поведение:**
- Возвращает разрешенный Promise для отложения выполнения
- Позволяет браузеру обработать ожидающие события и задачи
- Полезно для предотвращения блокировки UI при длительных операциях

## Примеры использования

### Разбиение длительных задач

```typescript
import switchThread from '@sky-modules/core/switch_thread'

async function processLargeDataset(items) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i])

    // Каждые 100 элементов, передать управление циклу событий
    if (i % 100 === 0) {
      await switchThread()
    }
  }
}
```

### Предотвращение замораживания UI

```typescript
async function computeExpensiveValue() {
  // Выполнить некоторую работу
  const result1 = expensiveComputation1()

  // Передать управление для обновления UI
  await switchThread()

  // Продолжить работу
  const result2 = expensiveComputation2()

  return combine(result1, result2)
}
```

### Асинхронный итератор с выходом

```typescript
async function* processItems(items) {
  for (const item of items) {
    yield processItem(item)
    await switchThread()
  }
}
```

### Пакетная обработка

```typescript
async function batchProcess(items, batchSize = 10) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    processBatch(batch)

    if (i + batchSize < items.length) {
      await switchThread()
    }
  }
}
```

## Соображения производительности

- Используйте для CPU-интенсивных операций на больших наборах данных
- Помогает поддерживать отзывчивый UI в React/Vue/etc
- Минимальные накладные расходы - просто разрешает Promise
- Может значительно улучшить воспринимаемую производительность

## Связанное

- Полезно с `fire()` и `task()` из async утилит
- Работает с любым async/await паттерном
- Совместимо с Promise-based кодом

## Примечания

- Текущая реализация использует `Promise.resolve()`
- Возвращается немедленно, но планирует выполнение в следующем tick
- Не блокирует - другие microtasks все еще могут выполниться первыми
- Необходим для поддержания отзывчивости UI на 60fps
