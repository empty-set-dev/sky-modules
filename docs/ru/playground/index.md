# Песочница

Интерактивная песочница для экспериментов с Sky Modules.

## Онлайн редакторы

### 🥇 TypeScript Playground (Рекомендуется)
Официальная песочница Microsoft — лучший выбор для TypeScript:

<div style="margin: 2em 0;">
  <a href="https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgVwM4FMCuAjAMgQQCcoIcKYByUEMYvI2nAugLYCGoAvjAOYB2UMAG0ANHAAeXLAEooAC0w1UY8ADQwA9KfwBhOAhT1CgDJhCi8EEI+YAaGAHoAmHAHJQAM1i8AIgDEYFAUAJRwEBSIALKyUAAOcFAAhqYAokaGuuYKlraBDjbhEZFAA" target="_blank" style="
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #007ACC 0%, #0099CC 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    margin: 8px 4px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(0, 122, 204, 0.3);
  " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 122, 204, 0.4)'" onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 15px rgba(0, 122, 204, 0.3)'">
    🚀 TypeScript Playground
  </a>
</div>

**Преимущества:** ✅ Полная поддержка TS ✅ Делиться ссылками ✅ Встроенные типы ✅ npm пакеты

### 🥈 StackBlitz (Самая быстрая)
Мгновенная полноценная IDE в браузере:

<div style="margin: 2em 0;">
  <a href="https://stackblitz.com/fork/typescript?file=index.ts&terminal=dev" target="_blank" style="
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    margin: 8px 4px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
  " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(25, 118, 210, 0.4)'" onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 15px rgba(25, 118, 210, 0.3)'">
    ⚡ StackBlitz
  </a>
</div>

**Преимущества:** ✅ Мгновенная загрузка ✅ Полноценная IDE ✅ npm пакеты ✅ GitHub интеграция

### 🥉 CodeSandbox (Лучше для фреймворков)
Отличный выбор для React/Vue/Angular проектов:

<div style="margin: 2em 0;">
  <a href="https://codesandbox.io/s/typescript-playground-export-8o2ez" target="_blank" style="
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #40C9FF 0%, #E81CFF 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    margin: 8px 4px;
    transition: all 0.2s ease;
    box-shadow: 0 4px 15px rgba(64, 201, 255, 0.3);
  " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(64, 201, 255, 0.4)'" onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 15px rgba(64, 201, 255, 0.3)'">
    📦 CodeSandbox
  </a>
</div>

**Преимущества:** ✅ Шаблоны фреймворков ✅ Горячая перезагрузка ✅ Экосистема ✅ Коллаборация

## Быстрые примеры

Скопируйте эти примеры в любую онлайн среду для экспериментов:

### Пример 1: Расширения массива

```typescript
// Подключаем расширения массива
import '@sky-modules/core/Array'

// Создаем тестовые данные
const numbers = [1, 2, 3, 4, 5]
const fruits = ['яблоко', 'банан', 'апельсин', 'груша']

// Тестируем методы
console.log('🔄 Исходный массив:', numbers)
console.log('🎯 Последний элемент:', numbers.last())

// Перемешиваем
const shuffled = numbers.toShuffled()
console.log('🎲 Перемешанная копия:', shuffled)
console.log('✅ Оригинал не изменился:', numbers)

// Удаляем элемент
const removed = fruits.remove('банан')
console.log('🗑️ Удален элемент:', removed)
console.log('📝 Обновленный список:', fruits)

// Перемешиваем на месте
fruits.shuffle()
console.log('🔀 Перемешанный список:', fruits)
```

### Пример 2: Слияние пространств имен

```typescript
import { mergeNamespace } from '@sky-modules/core'

// Создаем API с функциями
const api = {
    users: {
        get: (id: number) => `Пользователь ${id}`,
        create: (data: any) => `Создан пользователь: ${JSON.stringify(data)}`
    },
    posts: {
        get: (id: number) => `Пост ${id}`,
        create: (data: any) => `Создан пост: ${JSON.stringify(data)}`
    }
}

// Добавляем конфигурацию
mergeNamespace(api, {
    users: {
        get: {
            cache: true,
            timeout: 5000
        },
        create: {
            validation: true,
            requireAuth: true
        }
    },
    posts: {
        get: {
            cache: false,
            includeComments: true
        },
        create: {
            autoPublish: false,
            maxLength: 280
        }
    }
})

// Тестируем
console.log('👤 Получить пользователя:', api.users.get(1))
console.log('⚙️ Настройки кеша:', api.users.get.cache)
console.log('📝 Создать пост:', api.posts.create({ title: 'Hello!' }))
console.log('📏 Макс. длина поста:', api.posts.create.maxLength)
```

### Пример 3: Система конфигурации

```typescript
import { mergeNamespace } from '@sky-modules/core'

// Базовая конфигурация приложения
const config = {
    database: () => ({
        host: 'localhost',
        port: 5432,
        name: 'myapp'
    }),
    redis: () => ({
        host: 'localhost',
        port: 6379
    }),
    api: () => ({
        port: 3000,
        host: '0.0.0.0'
    })
}

// Расширяем настройками окружения
mergeNamespace(config, {
    database: {
        pool: { min: 2, max: 10 },
        ssl: false,
        timeout: 30000
    },
    redis: {
        ttl: 3600,
        keyPrefix: 'app:',
        retries: 3
    },
    api: {
        cors: true,
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 100
        },
        compression: true
    }
})

// Использование
console.log('🗄️ База данных:', config.database())
console.log('🏊‍♂️ Размер пула:', config.database.pool)
console.log('⚡ Redis TTL:', config.redis.ttl)
console.log('🌐 API порт:', config.api().port)
console.log('🚦 Rate limit:', config.api.rateLimit.max)
```

### Пример 4: Система плагинов

```typescript
import { mergeNamespace } from '@sky-modules/core'
import '@sky-modules/core/Array'

// Базовый логгер
class Logger {
    logs: string[] = []

    info(message: string) {
        const log = `[INFO] ${new Date().toISOString()} ${message}`
        this.logs.push(log)
        console.log(log)
    }

    error(message: string) {
        const log = `[ERROR] ${new Date().toISOString()} ${message}`
        this.logs.push(log)
        console.error(log)
    }

    getLast() {
        return this.logs.last()
    }
}

const logger = new Logger()

// Добавляем конфигурацию и метаданные
mergeNamespace(logger, {
    info: {
        level: 'info',
        color: '#2196F3',
        emoji: 'ℹ️',
        enabled: true
    },
    error: {
        level: 'error',
        color: '#F44336',
        emoji: '❌',
        stackTrace: true
    },
    getLast: {
        format: 'json',
        includeTimestamp: true
    }
})

// Тестируем
logger.info('Приложение запущено')
logger.error('Произошла ошибка')

console.log('📊 Настройки info:', {
    level: logger.info.level,
    emoji: logger.info.emoji,
    enabled: logger.info.enabled
})

console.log('🔍 Последний лог:', logger.getLast())
console.log('📝 Всего логов:', logger.logs.length)
```

## Интерактивные демо

### Демо 1: Работа с массивами данных

Попробуйте этот код с разными данными:

```typescript
import '@sky-modules/core/Array'

// Массив пользователей
const users = [
    { id: 1, name: 'Анна', role: 'admin' },
    { id: 2, name: 'Борис', role: 'user' },
    { id: 3, name: 'Виктор', role: 'moderator' },
    { id: 4, name: 'Галина', role: 'user' }
]

// Экспериментируйте с методами:
console.log('Последний пользователь:', users.last())

// Удалите конкретного пользователя
const userToRemove = users.find(u => u.name === 'Борис')
if (userToRemove) {
    users.remove(userToRemove)
    console.log('После удаления:', users)
}

// Перемешайте для случайного выбора
const randomOrder = users.toShuffled()
console.log('В случайном порядке:', randomOrder)

// Попробуйте с другими данными:
// - Список задач
// - Массив чисел
// - Строки или объекты
```

### Демо 2: Гибкая конфигурация

```typescript
import { mergeNamespace } from '@sky-modules/core'

// Создайте свою систему настроек
const myApp = {
    theme: () => 'light',
    language: () => 'ru',
    features: {
        notifications: () => true,
        analytics: () => false
    }
}

// Добавьте пользовательские настройки
mergeNamespace(myApp, {
    theme: {
        primary: '#2196F3',
        secondary: '#FF5722',
        dark: false
    },
    language: {
        fallback: 'en',
        autoDetect: true
    },
    features: {
        notifications: {
            sound: true,
            desktop: true,
            email: false
        },
        analytics: {
            provider: 'google',
            anonymize: true
        }
    }
})

// Теперь у вас есть и функции, и настройки!
console.log('Текущая тема:', myApp.theme())
console.log('Основной цвет:', myApp.theme.primary)
console.log('Язык:', myApp.language())
console.log('Автоопределение языка:', myApp.language.autoDetect)
```

## Полезные ссылки

- 📚 [Документация модулей](/ru/modules/)
- 🎯 [Практические примеры](/ru/playground/)
- 🚀 [Руководство по началу работы](/ru/guide/getting-started)
- 💻 [Исходный код на GitHub](https://github.com/empty-set-dev/sky-modules)

## Поделитесь своими экспериментами!

Создали что-то интересное? Поделитесь в GitHub Issues или создайте Pull Request с новыми примерами!