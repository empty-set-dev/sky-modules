# @sky-modules/jsx

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  JSX utility module
</div>

<div style="margin-bottom: 2em;">
  📚 <a href="../">← Back to All Modules</a>
</div>


Универсальный JSX runtime для разработки компонентов независимо от фреймворка. Этот пакет предоставляет кастомную реализацию JSX, которая позволяет писать универсальные компоненты, работающие в разных JavaScript фреймворках.

## Возможности

- 🌐 **Универсальные компоненты**: Пишите один раз, используйте везде
- 🔧 **Кастомный JSX Runtime**: Легковесная реализация JSX без зависимости от React
- 📦 **Поддержка TypeScript**: Полная типизация с кастомными JSX типами
- ⚡ **Независимость от фреймворка**: Работает с любым фреймворком, поддерживающим кастомный JSX
- 🎯 **UC тип**: Специальный тип Universal Component для максимальной совместимости

## Установка

```bash
npm install universal-jsx-component
```

## Использование

### Базовый JSX компонент

```tsx
/** @jsxImportSource universal-jsx-component */

export default function MyComponent(): UC {
    return <div>Привет, Универсальный JSX!</div>
}
```

### Глобальные типы

Пакет предоставляет глобальные типы для универсальных компонентов:

```typescript
// UC тип доступен глобально
type UC = JSX.Node

// JSX namespace расширен
namespace JSX {
    type Node = string | Element | Element[]

    interface Element {
        type: string | Function
        key: string
        props: Record<string, unknown>
        children?: Node
    }
}
```

## Справочник API

### jsx(type, props)

Основная функция JSX runtime для продакшн сборок.

```typescript
import { jsx } from 'universal-jsx-component/jsx-runtime'

const element = jsx('div', {
    className: 'container',
    children: 'Привет, мир'
})
```

**Параметры:**
- `type` - Тип элемента (строка или функция)
- `props` - Свойства элемента включая children

**Возвращает:** `JSX.Element`

### jsxDEV(type, props)

Версия JSX runtime для разработки с дополнительными возможностями отладки.

```typescript
import { jsxDEV } from 'universal-jsx-component/jsx-dev-runtime'

const element = jsxDEV('div', {
    className: 'container',
    children: 'Привет, мир'
})
```

### Fragment

Реализация JSX Fragment для группировки элементов.

```tsx
/** @jsxImportSource universal-jsx-component */

export default function MyComponent(): UC {
    return (
        <>
            <div>Первый элемент</div>
            <div>Второй элемент</div>
        </>
    )
}
```

## Структура элементов

JSX элементы преобразуются в следующую структуру:

```typescript
interface JSX.Element {
    type: string | Function    // Тип элемента
    props: Record<string, unknown>  // Свойства (исключая children)
    children: JSX.Element[]    // Массив дочерних элементов
}
```

## Примеры

### Простой компонент

```tsx
/** @jsxImportSource universal-jsx-component */

export default function Button({ text, onClick }: {
    text: string
    onClick?: () => void
}): UC {
    return <button onClick={onClick}>{text}</button>
}
```

### Компонент с дочерними элементами

```tsx
/** @jsxImportSource universal-jsx-component */

export default function Card({ children }: { children: UC }): UC {
    return (
        <div className="card">
            <div className="card-body">
                {children}
            </div>
        </div>
    )
}
```

### Использование Fragment

```tsx
/** @jsxImportSource universal-jsx-component */

export default function List({ items }: { items: string[] }): UC {
    return (
        <>
            {items.map(item => (
                <div key={item}>{item}</div>
            ))}
        </>
    )
}
```

## Интеграция с фреймворками

### С React

```tsx
// React компонент использующий универсальный JSX
import UniversalComponent from './UniversalComponent'

function ReactApp() {
    return (
        <div>
            <UniversalComponent />
        </div>
    )
}
```

### С любым кастомным рендерером

```typescript
import { jsx } from 'universal-jsx-component/jsx-runtime'

// Кастомный рендерер для JSX элементов
function render(element: JSX.Element): string {
    if (typeof element.type === 'string') {
        const attrs = Object.entries(element.props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ')

        const children = element.children?.map(render).join('') || ''

        return `<${element.type} ${attrs}>${children}</${element.type}>`
    }

    return ''
}
```

## Разработка vs Продакшн

Пакет включает runtime как для разработки, так и для продакшна:

- **jsx-runtime.ts**: Продакшн runtime (меньше, оптимизирован)
- **jsx-dev-runtime.ts**: Runtime для разработки (включает Fragment и возможности отладки)

TypeScript автоматически выбирает подходящий runtime на основе конфигурации сборки.

## Типизация

Все компоненты, использующие `universal-jsx-component`, должны возвращать тип `UC`:

```tsx
/** @jsxImportSource universal-jsx-component */

// ✅ Правильно
export default function GoodComponent(): UC {
    return <div>Контент</div>
}

// ❌ Избегайте - небезопасно по типам
export default function BadComponent() {
    return <div>Контент</div>
}
```

## Лицензия

MIT License - смотрите файл LICENSE для подробностей.