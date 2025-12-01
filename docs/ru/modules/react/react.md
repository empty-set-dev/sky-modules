# React Адаптер

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  React utility module
</div>

Платформенные компоненты и утилиты React для Sky Modules.

## Обзор

React-адаптер предоставляет React-специфичные реализации и утилиты для создания универсальных приложений с Sky Modules. Включает компоненты, хуки и лаунчеры приложений, оптимизированные для React-приложений.

## Установка

```bash
npm install @sky-modules/react react react-dom
```

## Возможности

- **Компонент Box** - React-реализация универсального компонента Box
- **Универсальный лаунчер приложения** - Запуск React-приложений с маршрутизацией
- **Интеграция с Vike** - Серверный рендеринг с Vike
- **Типобезопасность** - Полная поддержка TypeScript

## Компоненты

### Box

React-реализация универсального компонента Box с CSS-in-JS стилизацией.

```tsx
import { Box } from '@sky-modules/react'

function MyComponent() {
  return (
    <Box
      styles={{
        padding: '20px',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}
    >
      Содержимое здесь
    </Box>
  )
}
```

## Универсальный лаунчер приложения

### UniversalReactAppLauncher

Запуск React-приложений с автоматической настройкой маршрутизации.

```tsx
import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'
import '@sky-modules/react/UniversalReactAppLauncher.global'

function App({ screen }) {
  return (
    <div className="app">
      <nav>Навигация</nav>
      <main>{screen}</main>
    </div>
  )
}

// Запуск приложения
new UniversalReactAppLauncher(App)
```

**Возможности:**
- Автоматическая настройка `<BrowserRouter>`
- Маршрутизация экранов с `react-router-dom`
- Типобезопасный импорт экранов
- Монтирование корневого элемента

**Требования:**
- `<div id="root"></div>` в HTML
- Модуль `~screens/index` с маршрутами
- Модуль `~project/App`

## Интеграция с Vike

Поддержка серверного рендеринга через Vike.

```tsx
import '@sky-modules/react/vike'
```

Смотрите [документацию vike](./vike/README.md) для деталей.

## Паттерны использования

### Базовое приложение

```tsx
// main.tsx
import '@sky-modules/platform/web'
import UniversalReactAppLauncher from '@sky-modules/react/UniversalReactAppLauncher'
import App from './App'

new UniversalReactAppLauncher(App)
```

```tsx
// App.tsx
import type { FC, ReactNode } from 'react'

const App: FC<{ screen: ReactNode }> = ({ screen }) => {
  return (
    <div className="app-layout">
      <header>Мое приложение</header>
      <main>{screen}</main>
      <footer>Подвал</footer>
    </div>
  )
}

export default App
```

### С маршрутизацией

```tsx
// screens/index.ts
import { RouteObject } from 'react-router-dom'
import Home from './Home'
import About from './About'

const screens: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> }
]

export default screens
```

## Пиринговые зависимости

- `react` ^18.0.0
- `react-dom` ^18.0.0
- `react-router-dom` ^6.0.0 (при использовании UniversalReactAppLauncher)

## Архитектура

React-адаптер разработан для:
- Предоставления React-специфичных реализаций универсальных компонентов
- Запуска приложений с минимальным шаблонным кодом
- Интеграции с экосистемой Sky Modules
- Поддержки как CSR, так и SSR рабочих процессов

## Связанные модули

- [@sky-modules/universal](../universal/) - Универсальные компоненты (фреймворк-агностичные)
- [@sky-modules/platform](../platform/) - Определение платформы и утилиты
- [@sky-modules/design](../design/) - Компоненты дизайн-системы

## Примеры

Смотрите директорию [playground](../../playground/) для полных примеров.
