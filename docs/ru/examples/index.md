# Примеры использования

Изучите практические примеры использования Sky Modules в реальных проектах.

## Быстрые примеры

### Работа с массивами

```typescript
import '@sky-modules/core/Array'

// Получение последнего элемента
const users = ['Анна', 'Борис', 'Виктор']
const lastUser = users.last() // 'Виктор'

// Удаление элемента
const fruits = ['яблоко', 'банан', 'апельсин']
fruits.remove('банан') // true
console.log(fruits) // ['яблоко', 'апельсин']

// Перемешивание массива
const numbers = [1, 2, 3, 4, 5]
numbers.shuffle()
console.log(numbers) // [3, 1, 5, 2, 4] (случайный порядок)

// Создание перемешанной копии
const original = [1, 2, 3]
const shuffled = original.toShuffled()
// original остается [1, 2, 3]
// shuffled содержит случайный порядок
```

### Слияние объектов конфигурации

```typescript
import { mergeNamespace } from '@sky-modules/core'

// API с конфигурацией
const api = {
    get: (url: string) => fetch(url),
    post: (url: string, data: any) => fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

// Добавляем настройки
mergeNamespace(api, {
    get: {
        timeout: 5000,
        retries: 3,
        cache: true
    },
    post: {
        timeout: 10000,
        retries: 1
    }
})

// Теперь можно использовать как функции и как объекты
const response = await api.get('/users')
const timeout = api.get.timeout // 5000
const shouldCache = api.get.cache // true
```

## Практические сценарии

### 1. Система конфигурации приложения

```typescript
import { mergeNamespace } from '@sky-modules/core'

interface DatabaseConfig {
    host: string
    port: number
    pool?: { min: number; max: number }
}

interface AppConfig {
    database: () => DatabaseConfig
    redis: () => RedisConfig
    api: () => ApiConfig
}

const config: AppConfig = {
    database: () => ({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432')
    }),
    redis: () => ({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }),
    api: () => ({
        port: parseInt(process.env.API_PORT || '3000'),
        cors: true
    })
}

// Расширяем конфигурацию
mergeNamespace(config, {
    database: {
        pool: { min: 2, max: 10 },
        ssl: process.env.NODE_ENV === 'production'
    },
    redis: {
        ttl: 3600,
        keyPrefix: 'app:'
    },
    api: {
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // requests per window
        }
    }
})

// Использование
const dbConfig = config.database() // Вызов функции
const poolSize = config.database.pool.max // 10 - доступ к свойству
const useSSL = config.database.ssl // true/false
```

### 2. Система плагинов для логирования

```typescript
import { mergeNamespace } from '@sky-modules/core'

class Logger {
    info(message: string) {
        console.log(`[INFO] ${message}`)
    }

    error(message: string) {
        console.error(`[ERROR] ${message}`)
    }

    debug(message: string) {
        console.debug(`[DEBUG] ${message}`)
    }
}

const logger = new Logger()

// Добавляем метаданные и настройки
mergeNamespace(logger, {
    info: {
        level: 'info',
        color: 'blue',
        timestamp: true
    },
    error: {
        level: 'error',
        color: 'red',
        timestamp: true,
        stackTrace: true
    },
    debug: {
        level: 'debug',
        color: 'gray',
        enabled: process.env.NODE_ENV === 'development'
    }
})

// Использование с проверкой настроек
if (logger.debug.enabled) {
    logger.debug('Debugging information')
}

// Проверка уровня логирования
if (logger.error.stackTrace) {
    // Добавить stack trace к ошибке
}
```

### 3. Утилиты для работы с данными

```typescript
import '@sky-modules/core/Array'
import { mergeNamespace } from '@sky-modules/core'

// Обработка списка пользователей
interface User {
    id: number
    name: string
    role: string
    lastActive: Date
}

const users: User[] = [
    { id: 1, name: 'Анна', role: 'admin', lastActive: new Date('2024-01-15') },
    { id: 2, name: 'Борис', role: 'user', lastActive: new Date('2024-01-14') },
    { id: 3, name: 'Виктор', role: 'moderator', lastActive: new Date('2024-01-16') }
]

// Получить последнего активного пользователя
const lastActiveUser = users
    .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
    .first() // Можно добавить метод first() аналогично last()

// Удалить пользователя по роли
const admins = users.filter(u => u.role === 'admin')
const regularUsers = users.filter(u => u.role === 'user')

// Перемешать для случайного выбора
const randomizedUsers = users.toShuffled()

// Создать утилиты для работы с пользователями
const userUtils = {
    findById: (id: number) => users.find(u => u.id === id),
    findByRole: (role: string) => users.filter(u => u.role === role),
    isActive: (user: User) => {
        const daysSinceActive = (Date.now() - user.lastActive.getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceActive <= 7
    }
}

// Добавить настройки
mergeNamespace(userUtils, {
    findById: {
        cache: new Map(),
        ttl: 300000 // 5 minutes
    },
    findByRole: {
        allowedRoles: ['admin', 'user', 'moderator'],
        caseSensitive: false
    },
    isActive: {
        activeThresholdDays: 7,
        includeWeekends: true
    }
})

// Использование с кешированием
const cachedUser = userUtils.findById(1)
if (userUtils.findById.cache.has(1)) {
    // Использовать кеш
}
```

### 4. Конфигурация тестовой среды

```typescript
import '@sky-modules/core/Array'
import { mergeNamespace } from '@sky-modules/core'

// Тестовые данные
const testData = {
    users: [
        { id: 1, name: 'Test User 1' },
        { id: 2, name: 'Test User 2' },
        { id: 3, name: 'Test User 3' }
    ],
    posts: [
        { id: 1, title: 'Test Post 1', userId: 1 },
        { id: 2, title: 'Test Post 2', userId: 2 }
    ]
}

// Утилиты для тестирования
const testUtils = {
    createUser: (data: Partial<User>) => ({
        id: Date.now(),
        name: 'Test User',
        ...data
    }),
    createPost: (data: Partial<Post>) => ({
        id: Date.now(),
        title: 'Test Post',
        ...data
    }),
    cleanup: () => {
        testData.users.length = 0
        testData.posts.length = 0
    }
}

// Добавить конфигурацию тестов
mergeNamespace(testUtils, {
    createUser: {
        autoIncrement: true,
        defaultRole: 'user',
        generateName: () => `User_${Math.random().toString(36).substr(2, 9)}`
    },
    createPost: {
        autoIncrement: true,
        defaultStatus: 'draft',
        generateTitle: () => `Post_${Math.random().toString(36).substr(2, 9)}`
    },
    cleanup: {
        confirmBeforeCleanup: process.env.NODE_ENV === 'production',
        backupBeforeCleanup: true
    }
})

// Использование в тестах
describe('User Management', () => {
    beforeEach(() => {
        if (testUtils.cleanup.backupBeforeCleanup) {
            // Сделать бэкап данных
        }
        testUtils.cleanup()
    })

    it('should create user with auto-generated name', () => {
        const user = testUtils.createUser({})

        if (testUtils.createUser.autoIncrement) {
            expect(user.id).toBeGreaterThan(0)
        }

        const generatedName = testUtils.createUser.generateName()
        expect(generatedName).toMatch(/^User_[a-z0-9]+$/)
    })
})
```

### 5. Обработка форм с валидацией

```typescript
import '@sky-modules/core/Array'
import { mergeNamespace } from '@sky-modules/core'

interface FormField {
    name: string
    value: any
    error?: string
}

// Система валидации
const validators = {
    required: (value: any) => value !== null && value !== undefined && value !== '',
    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value: string, min: number) => value.length >= min,
    maxLength: (value: string, max: number) => value.length <= max
}

// Добавить конфигурацию для валидаторов
mergeNamespace(validators, {
    required: {
        message: 'Поле обязательно для заполнения',
        allowEmptyStrings: false
    },
    email: {
        message: 'Некорректный формат email',
        allowInternational: true
    },
    minLength: {
        message: (min: number) => `Минимальная длина: ${min} символов`,
        trimWhitespace: true
    },
    maxLength: {
        message: (max: number) => `Максимальная длина: ${max} символов`,
        truncateOnExceed: false
    }
})

// Использование
const formFields: FormField[] = [
    { name: 'email', value: 'user@example.com' },
    { name: 'password', value: '123' },
    { name: 'name', value: '' }
]

// Валидация
formFields.forEach(field => {
    switch (field.name) {
        case 'email':
            if (!validators.required(field.value)) {
                field.error = validators.required.message
            } else if (!validators.email(field.value)) {
                field.error = validators.email.message
            }
            break

        case 'password':
            if (!validators.minLength(field.value, 8)) {
                field.error = validators.minLength.message(8)
            }
            break

        case 'name':
            if (!validators.required(field.value) && !validators.required.allowEmptyStrings) {
                field.error = validators.required.message
            }
            break
    }
})

// Получить все ошибки
const errors = formFields
    .filter(field => field.error)
    .map(field => ({ field: field.name, error: field.error }))

console.log('Validation errors:', errors)
```

## Интеграция с популярными библиотеками

### React + Sky Modules

```typescript
import React, { useState, useEffect } from 'react'
import '@sky-modules/core/Array'
import { mergeNamespace } from '@sky-modules/core'

// Кастомный хук для списков
function useList<T>(initialItems: T[] = []) {
    const [items, setItems] = useState<T[]>(initialItems)

    const listUtils = {
        add: (item: T) => setItems(prev => [...prev, item]),
        remove: (item: T) => setItems(prev => {
            const newList = [...prev]
            newList.remove(item)
            return newList
        }),
        shuffle: () => setItems(prev => [...prev].shuffle()),
        getLast: () => items.last()
    }

    return { items, ...listUtils }
}

// Компонент списка пользователей
export function UserList() {
    const { items: users, add, remove, shuffle, getLast } = useList<User>()

    return (
        <div>
            <button onClick={() => add({ id: Date.now(), name: 'New User' })}>
                Добавить пользователя
            </button>
            <button onClick={shuffle}>Перемешать</button>

            <div>Последний пользователь: {getLast()?.name}</div>

            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name}
                        <button onClick={() => remove(user)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
```

### Express.js + Sky Modules

```typescript
import express from 'express'
import { mergeNamespace } from '@sky-modules/core'

const app = express()

// Создать конфигурируемые middleware
const middleware = {
    cors: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.header('Access-Control-Allow-Origin', '*')
        next()
    },
    rateLimit: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Базовая логика rate limiting
        next()
    },
    auth: (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // Базовая проверка авторизации
        next()
    }
}

// Добавить конфигурацию
mergeNamespace(middleware, {
    cors: {
        allowedOrigins: ['https://myapp.com'],
        allowCredentials: true,
        maxAge: 86400
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 100,
        message: 'Слишком много запросов'
    },
    auth: {
        secretKey: process.env.JWT_SECRET,
        expiresIn: '24h',
        skipPaths: ['/health', '/login']
    }
})

// Использование middleware с настройками
app.use((req, res, next) => {
    if (middleware.auth.skipPaths.includes(req.path)) {
        return next()
    }
    middleware.auth(req, res, next)
})

app.use(middleware.cors)
app.use(middleware.rateLimit)
```

Это лишь несколько примеров того, как Sky Modules может упростить ваш код и сделать его более гибким. Каждый модуль предоставляет мощные возможности при сохранении простоты использования!

## Следующие шаги

- [Изучите документацию модулей](/ru/modules/)
- [Попробуйте в песочнице](/ru/playground/)
- [Посмотрите исходный код на GitHub](https://github.com/empty-set-dev/sky-modules)