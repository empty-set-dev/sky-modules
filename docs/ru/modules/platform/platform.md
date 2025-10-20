# Модуль Platform

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Platform utility module
</div>

Утилиты для определения платформы и конфигурации кросс-платформенных приложений.


## Installation

```bash
npm install @sky-modules/core
```

## Возможности

- **Определение платформы** - Определение среды выполнения (Node.js, Web, Universal)
- **Определение архитектуры** - Идентификация архитектуры процессора (arm64, x64, arm)
- **Определение ОС** - Определение операционной системы (Mac OS, Windows, Linux, iOS, Android)
- **Определение стороны** - Проверка выполнения кода на сервере или клиенте
- **Universal Router** - Файловый роутинг с ленивой загрузкой и обработкой 404

## Константы платформы

Глобальные константы доступные во всем приложении:

```typescript
// Доступны глобально
const ARCH: 'unknown' | 'arm' | 'arm64' | 'x64' | 'web'
const PLATFORM: 'unknown' | 'node' | 'mobile' | 'desktop' | 'web'
const OS: 'unknown' | 'iOS' | 'Android' | 'Mac OS' | 'Windows' | 'Linux' | 'web'
const APP_PLATFORM_TARGET: 'unknown' | 'node' | 'web' | 'universal'
```

### Использование

```typescript
import '@sky-modules/platform'

console.log(PLATFORM) // 'node', 'web', 'mobile', 'desktop'
console.log(ARCH) // 'arm64', 'x64', 'arm', 'web'
console.log(OS) // 'Mac OS', 'Windows', 'Linux', 'web'
console.log(APP_PLATFORM_TARGET) // 'node', 'web', 'universal'
```

## Определение стороны

Определение выполнения кода на сервере или клиенте:

```typescript
import { runsOnSide, runsOnServerSide, runsOnClientSide } from '@sky-modules/platform'

if (runsOnServerSide) {
    // Серверный код
    console.log('Выполняется на сервере')
}

if (runsOnClientSide) {
    // Клиентский код
    console.log('Выполняется в браузере')
}
```

## Universal Router

Файловый роутинг для универсальных приложений с поддержкой ленивой загрузки.

### Базовое использование

```typescript
import { UniversalRouter, createRoutesFromScreens } from '@sky-modules/platform/universal/router'

// Импорт всех компонентов экранов
const screens = import.meta.glob('./screens/**/*.tsx', { eager: true })

// Создание маршрутов из файлов экранов
const routes = createRoutesFromScreens(screens)

// Создание экземпляра роутера
const router = new UniversalRouter(routes)

// Подписка на изменения маршрута
router.subscribe(match => {
    if (match) {
        console.log('Текущий маршрут:', match.path)
        console.log('Параметры маршрута:', match.params)
        console.log('Загружается:', match.isLoading)
        // Отрисовка match.Component
    }
})

// Программная навигация
router.navigate('/users/123')

// Очистка ресурсов
router.destroy()
```

### С обработкой 404 и загрузкой

```typescript
import NotFound from './screens/NotFound'
import Loading from './screens/Loading'

const router = new UniversalRouter(routes, {
    notFound: NotFound,
    loading: Loading
})
```

### Ленивая загрузка

```typescript
// screens/users/[id].tsx - Динамический импорт
export default async () => {
    const Component = await import('./HeavyComponent')
    return Component.default
}

// Или с import.meta.glob
const screens = import.meta.glob('./screens/**/*.tsx') // Без опции eager

const routes = createRoutesFromScreens(screens)
```

Роутер автоматически определяет ленивые компоненты, проверяя возвращает ли вызов компонента Promise. При загрузке ленивого компонента:
- Если передан компонент `loading`, он будет показан немедленно
- `RouteMatch` будет иметь `isLoading: true`
- После загрузки компонент кэшируется и `isLoading` становится `false`

### Файловый роутинг

Структура файлов соответствует маршрутам:

```
screens/
  index.tsx          → /
  about.tsx          → /about
  users/
    index.tsx        → /users
    [id].tsx         → /users/:id
  posts/
    [slug].tsx       → /posts/:slug
```

### Параметры маршрута

```typescript
router.subscribe(match => {
    if (match) {
        // Для маршрута /users/:id
        const userId = match.params.id
        console.log('ID пользователя:', userId)
    }
})
```

## Платформо-специфичные реализации

### Node.js

```typescript
import '@sky-modules/platform/node'

// Включает цветной вывод в консоль
// Устанавливает PLATFORM = 'desktop'
// Определяет архитектуру и ОС
```

### Web

```typescript
import '@sky-modules/platform/web'

// Устанавливает PLATFORM = 'web'
// Устанавливает APP_PLATFORM_TARGET = 'web'
```

### Universal

```typescript
import '@sky-modules/platform/universal'

// Определяет Tauri, React Native или Web
// Устанавливает APP_PLATFORM_TARGET = 'universal'
```

## Детали реализации

Все константы платформы определены как неперечисляемые глобальные свойства через `Object.assign(global, ...)`.

Каждая реализация проверяет инициализацию констант перед их перезаписью, что позволяет правильно наслаивать платформо-специфичный код.
