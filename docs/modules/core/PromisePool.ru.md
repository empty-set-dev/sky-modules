# PromisePool

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  PromisePool utility module
</div>

Конкурентное выполнение промисов с настраиваемым лимитом параллелизма.


## Installation

```bash
npm install @sky-modules/core
```

## Обзор

PromisePool управляет конкурентным выполнением асинхронных задач с настраиваемым максимальным лимитом параллелизма. Ставит задачи в очередь когда лимит достигнут и автоматически выполняет задачи из очереди когда слоты освобождаются.

**Ключевые возможности:**
- Настраиваемый лимит параллелизма
- Автоматическая постановка задач в очередь
- Ожидание завершения всех задач
- Типобезопасные аргументы задач
- Нулевые зависимости

**Сценарии использования:**
- Ограничение скорости API запросов
- Контроль конкурентных файловых операций
- Управление пулами подключений БД
- Предотвращение истощения ресурсов
- Пакетная обработка с контролем параллелизма

## Установка

```typescript
import PromisePool from '@sky-modules/core/PromisePool'
```

## Базовое использование

### Создание пула

```typescript
// Пул по умолчанию (макс 10 конкурентных задач)
const pool = new PromisePool()

// Пользовательский лимит параллелизма
const limitedPool = new PromisePool(3)  // Макс 3 конкурентных задачи
```

### Запуск задач

```typescript
const pool = new PromisePool(5)

// Определить async задачу
const fetchData = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

// Запустить задачу в пуле
await pool.run(fetchData, 'https://api.example.com/data')
```

### Множество конкурентных задач

```typescript
const pool = new PromisePool(3)

const urls = [
  'https://api.example.com/users',
  'https://api.example.com/posts',
  'https://api.example.com/comments'
]

// Запустить все задачи (макс 3 конкурентных)
await Promise.all(
  urls.map(url => pool.run(fetchData, url))
)
```

### Ожидание завершения

```typescript
const pool = new PromisePool(2)

// Запустить несколько задач
pool.run(task1, arg1)
pool.run(task2, arg2)
pool.run(task3, arg3)

// Дождаться завершения всех задач
await pool.wait()

console.log('Все задачи завершены')
```

## Справочник API

### Конструктор

```typescript
constructor(maxCount?: number)
```

Создает новый PromisePool с указанным лимитом параллелизма.

**Параметры:**
- `maxCount` - Максимум конкурентных задач (по умолчанию: 10)

**Пример:**
```typescript
const pool = new PromisePool(5)  // Макс 5 конкурентных
```

### Методы

#### `run\<A\>(task, ...args)`

Выполнить задачу в пуле.

```typescript
async run<A extends unknown[]>(
  task: PromisePool.Task<A>,
  ...args: A
): Promise<void>
```

**Параметры:**
- `task` - Async функция для выполнения
- `args` - Аргументы для передачи в задачу

**Возвращает:** Promise который разрешается когда задача завершается

**Поведение:**
- Если в пуле есть свободные слоты: выполняется немедленно
- Если пул полон: ставит задачу в очередь пока слот не освободится
- Задачи выполняются в порядке их постановки в очередь

**Пример:**
```typescript
await pool.run(async (id, name) => {
  await saveUser(id, name)
}, 123, 'Иван')
```

#### `wait()`

Дождаться завершения всех выполняющихся задач.

```typescript
async wait(): Promise<void>
```

**Возвращает:** Promise который разрешается когда все задачи завершаются

**Пример:**
```typescript
// Запустить и забыть задачи
pool.run(task1)
pool.run(task2)
pool.run(task3)

// Дождаться завершения всех
await pool.wait()
```

### Типы

#### `PromisePool.Task\<T\>`

Тип для async функций задач.

```typescript
type Task<T extends unknown[]> = (...args: T) => Promise<void>
```

**Пример:**
```typescript
const task: PromisePool.Task<[number, string]> = async (id, name) => {
  // Реализация задачи
}
```

## Примеры

### Ограничение скорости API запросов

```typescript
const pool = new PromisePool(3)  // Макс 3 конкурентных запроса

const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Загрузить пользователей с ограничением скорости
const users = await Promise.all(
  userIds.map(async (id) => {
    let userData: User

    await pool.run(async () => {
      const response = await fetch(`/api/users/${id}`)
      userData = await response.json()
    })

    return userData!
  })
)

console.log(`Загружено ${users.length} пользователей`)
```

### Обработка файлов

```typescript
const pool = new PromisePool(5)  // Макс 5 конкурентных файловых операций

const files = [
  'file1.txt',
  'file2.txt',
  'file3.txt',
  // ... много файлов
]

// Обработать файлы конкурентно
for (const file of files) {
  pool.run(async () => {
    const content = await fs.readFile(file, 'utf-8')
    const processed = processContent(content)
    await fs.writeFile(`output/${file}`, processed)
  })
}

// Дождаться обработки всех файлов
await pool.wait()

console.log('Все файлы обработаны')
```

### Операции с БД

```typescript
const pool = new PromisePool(10)  // Макс 10 конкурентных операций БД

interface UserData {
  id: number
  name: string
  email: string
}

const usersData: UserData[] = [
  /* ... большой набор данных ... */
]

// Вставить пользователей с контролем параллелизма
await Promise.all(
  usersData.map(user =>
    pool.run(async (data: UserData) => {
      await db.insert('users', data)
    }, user)
  )
)

console.log(`Вставлено ${usersData.length} пользователей`)
```

### Пакетная обработка

```typescript
const pool = new PromisePool(3)

const items = Array.from({ length: 100 }, (_, i) => i)

// Обработать пакетами по 3
for (const item of items) {
  await pool.run(async (id: number) => {
    await processItem(id)
    console.log(`Обработан элемент ${id}`)
  }, item)
}
```

### Веб-скрапинг

```typescript
const pool = new PromisePool(2)  // Вежливый скрапинг: макс 2 конкурентных

const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  // ... много URL
]

const results: string[] = []

await Promise.all(
  urls.map(async (url) => {
    let content: string

    await pool.run(async () => {
      const response = await fetch(url)
      content = await response.text()
    })

    results.push(content!)
  })
)
```

### Обработка изображений

```typescript
const pool = new PromisePool(4)  // Макс 4 конкурентных операции с изображениями

const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', /* ... */]

await Promise.all(
  images.map(imagePath =>
    pool.run(async () => {
      const image = await loadImage(imagePath)
      const resized = await resize(image, 800, 600)
      const optimized = await optimize(resized)
      await save(optimized, `output/${imagePath}`)
    })
  )
)

console.log('Все изображения обработаны')
```

## Продвинутые паттерны

### Приоритет задач (вручную)

```typescript
const highPriorityPool = new PromisePool(5)
const lowPriorityPool = new PromisePool(2)

// Высокоприоритетные задачи
await highPriorityPool.run(criticalTask)

// Низкоприоритетные задачи
await lowPriorityPool.run(backgroundTask)
```

### Обработка ошибок

```typescript
const pool = new PromisePool(3)

const tasks = [task1, task2, task3, task4, task5]

const results = await Promise.allSettled(
  tasks.map(task =>
    pool.run(async () => {
      try {
        await task()
      } catch (error) {
        console.error('Задача провалилась:', error)
        throw error
      }
    })
  )
)

const succeeded = results.filter(r => r.status === 'fulfilled').length
const failed = results.filter(r => r.status === 'rejected').length

console.log(`Успешно: ${succeeded}, Провалено: ${failed}`)
```

### Отслеживание прогресса

```typescript
const pool = new PromisePool(5)

let completed = 0
const total = items.length

for (const item of items) {
  pool.run(async () => {
    await processItem(item)
    completed++
    console.log(`Прогресс: ${completed}/${total}`)
  })
}

await pool.wait()
```

### Логика повторных попыток

```typescript
const pool = new PromisePool(3)

async function runWithRetry<T>(
  task: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      let result: T

      await pool.run(async () => {
        result = await task()
      })

      return result!
    } catch (error) {
      lastError = error as Error
      console.log(`Попытка ${attempt} провалилась, повтор...`)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  throw lastError!
}

// Использование
await runWithRetry(async () => {
  return await fetchData('/api/unreliable')
})
```

### Пулинг ресурсов

```typescript
class DatabasePool {
  private connectionPool: PromisePool

  constructor(maxConnections: number) {
    this.connectionPool = new PromisePool(maxConnections)
  }

  async query<T>(sql: string, params: unknown[]): Promise<T> {
    let result: T

    await this.connectionPool.run(async () => {
      const connection = await getConnection()
      try {
        result = await connection.execute(sql, params)
      } finally {
        await connection.release()
      }
    })

    return result!
  }

  async close() {
    await this.connectionPool.wait()
  }
}

const db = new DatabasePool(10)

// Все запросы соблюдают лимит подключений
const users = await db.query('SELECT * FROM users', [])
const posts = await db.query('SELECT * FROM posts', [])
```

## Соображения производительности

### Выбор лимита параллелизма

```typescript
// Слишком низко: недоиспользует ресурсы
const slow = new PromisePool(1)

// Слишком высоко: может истощить ресурсы
const risky = new PromisePool(1000)

// Сбалансировано: на основе возможностей системы
const balanced = new PromisePool(
  navigator.hardwareConcurrency || 4
)
```

### Использование памяти

```typescript
// Осторожно с большими наборами данных
const pool = new PromisePool(10)

// Плохо: создает все промисы сразу
await Promise.all(
  hugeArray.map(item => pool.run(processItem, item))
)

// Лучше: обрабатывать частями
for (let i = 0; i < hugeArray.length; i += 100) {
  const chunk = hugeArray.slice(i, i + 100)
  await Promise.all(
    chunk.map(item => pool.run(processItem, item))
  )
}
```

### Гранулярность задач

```typescript
// Слишком мелкие: накладные расходы от очередей
const pool = new PromisePool(10)
for (let i = 0; i < 10000; i++) {
  await pool.run(async () => { /* крошечная задача */ })
}

// Лучше: группировать маленькие задачи
const pool = new PromisePool(10)
const batchSize = 100
for (let i = 0; i < 10000; i += batchSize) {
  await pool.run(async () => {
    for (let j = i; j < i + batchSize; j++) {
      // обработать элемент
    }
  })
}
```

## Лучшие практики

### 1. Выбирайте подходящий параллелизм

```typescript
// Для I/O-bound задач (сеть, диск)
const ioPool = new PromisePool(20)  // Высокий параллелизм OK

// Для CPU-bound задач
const cpuPool = new PromisePool(
  navigator.hardwareConcurrency || 4
)
```

### 2. Правильно обрабатывайте ошибки

```typescript
await pool.run(async () => {
  try {
    await riskyOperation()
  } catch (error) {
    // Обработать ошибку, не дать упасть пулу
    logger.error('Задача провалилась:', error)
  }
})
```

### 3. Очищайте ресурсы

```typescript
await pool.run(async () => {
  const resource = await acquire()
  try {
    await useResource(resource)
  } finally {
    await release(resource)  // Всегда очищать
  }
})
```

### 4. Используйте wait() для запуска-и-забыть

```typescript
// Запустить задачи без блокировки
pool.run(task1)
pool.run(task2)
pool.run(task3)

// Сделать другую работу...

// Дождаться когда готовы
await pool.wait()
```

### 5. Мониторьте производительность

```typescript
const pool = new PromisePool(5)
const startTime = Date.now()
let tasksCompleted = 0

for (const item of items) {
  pool.run(async () => {
    await processItem(item)
    tasksCompleted++

    if (tasksCompleted % 100 === 0) {
      const elapsed = (Date.now() - startTime) / 1000
      const rate = tasksCompleted / elapsed
      console.log(`Скорость: ${rate.toFixed(2)} задач/сек`)
    }
  })
}

await pool.wait()
```

## Сравнение с альтернативами

### vs Promise.all()

```typescript
// Promise.all: неограниченный параллелизм
await Promise.all(tasks.map(t => t()))

// PromisePool: контролируемый параллелизм
const pool = new PromisePool(5)
await Promise.all(tasks.map(t => pool.run(t)))
```

### vs p-limit

```typescript
// p-limit
import pLimit from 'p-limit'
const limit = pLimit(5)
await Promise.all(tasks.map(t => limit(t)))

// PromisePool (похожий API)
const pool = new PromisePool(5)
await Promise.all(tasks.map(t => pool.run(t)))
```

## Тестирование

```typescript
import { describe, it, expect, vi } from 'vitest'
import PromisePool from '@sky-modules/core/PromisePool'

describe('PromisePool', () => {
  it('должен ограничивать параллелизм', async () => {
    const pool = new PromisePool(2)
    let concurrent = 0
    let maxConcurrent = 0

    const task = async () => {
      concurrent++
      maxConcurrent = Math.max(maxConcurrent, concurrent)
      await new Promise(resolve => setTimeout(resolve, 50))
      concurrent--
    }

    await Promise.all([
      pool.run(task),
      pool.run(task),
      pool.run(task),
      pool.run(task)
    ])

    expect(maxConcurrent).toBeLessThanOrEqual(2)
  })
})
```

## Связанные модули

- [core/EventEmitter](../EventEmitter/) - Событийно-ориентированное программирование
- [core/async](../async/) - Async утилиты
- [core/idle](../idle/) - Idle callbacks

## Примеры

См. [PromisePool.spec.ts](./PromisePool.spec.ts) для полных примеров использования и тестовых кейсов.
