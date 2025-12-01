# DesignSystem

Кросс-фреймворк провайдер дизайн-системы для управления брендингом и стилизацией.

## Установка

```bash
npm install @sky-modules/design
```

## Возможности

- **Поддержка мультибрендинга** с переключением в runtime
- **Переключение светлой/темной** темы
- **Настройка цветовой палитры**
- **Совместим с разными фреймворками** (React, Vue, Solid, Svelte, Qwik, Angular)
- **Нулевой runtime** overhead (компиляция Mitosis)
- **Автоматические DOM атрибуты** для таргетинга в CSS

## Использование

### Базовая настройка

```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider
    brand="sky"
    initialTheme="light"
    initialPalette="default"
>
    <App />
</DesignSystemProvider>
```

Провайдер автоматически устанавливает `data-*` атрибуты на `document.body`:
- `data-brand="sky"`
- `data-theme="light"`
- `data-palette="default"`

### Доступ к контексту дизайн-системы

```tsx
import { useDesignSystem } from '@sky-modules/design/DesignSystem'

function ThemeToggle() {
    const { theme, toggleTheme } = useDesignSystem()

    return (
        <button onClick={toggleTheme}>
            Текущая тема: {theme}
        </button>
    )
}
```

### Смена бренда

```tsx
function BrandSwitcher() {
    const { brand, changeBrand } = useDesignSystem()

    return (
        <select value={brand} onChange={(e) => changeBrand(e.target.value)}>
            <option value="sky">Sky</option>
            <option value="custom">Custom</option>
        </select>
    )
}
```

### Смена палитры

```tsx
function PaletteSwitcher() {
    const { palette, changePalette } = useDesignSystem()

    return (
        <select value={palette} onChange={(e) => changePalette(e.target.value)}>
            <option value="default">По умолчанию</option>
            <option value="high-contrast">Высокий контраст</option>
            <option value="colorblind">Безопасно для дальтоников</option>
        </select>
    )
}
```

## API

### Пропсы DesignSystemProvider

```typescript
interface DesignSystemProviderProps {
    children?: Mitosis.Children
    brand?: string                              // Название бренда (устанавливает атрибут data-brand)
    initialTheme?: 'light' | 'dark' | 'auto'   // Начальная цветовая тема
    initialPalette?: string                     // Начальная цветовая палитра
}
```

### Хук useDesignSystem

Возвращает контекст дизайн-системы со следующими свойствами:

```typescript
interface DesignSystemContextType {
    // Текущее состояние
    brand?: string
    theme?: 'light' | 'dark' | 'auto'
    palette?: string

    // Действия
    changeBrand: (brand: string) => void
    toggleTheme: () => void
    changePalette: (palette: string) => void

    // Расширенные возможности (TypeScript интерфейсы, реализация в процессе)
    accessibility?: {
        reducedMotion: boolean
        highContrast: boolean
        focusRing: {
            width: string
            style: string
            color: string
            offset: string
        }
    }

    i18n?: {
        direction: 'ltr' | 'rtl'
        locale: string
        timezone: string
        currency: string
        numberFormat: {
            decimal: string
            thousands: string
        }
        dateFormat: {
            short: string
            medium: string
            long: string
            full: string
        }
    }

    content?: {
        tone: 'formal' | 'casual' | 'friendly' | 'professional' | 'playful'
        voice: 'active' | 'passive'
        microcopy: {
            loading: string
            empty: string
            error: string
            success: string
            retry: string
            cancel: string
            confirm: string
            save: string
            delete: string
            // ... и другие
        }
    }
}
```

> **Примечание**: В данный момент реализованы функции `brand`, `theme`, `palette` и соответствующие действия. Расширенные возможности (`accessibility`, `i18n`, `content`) определены в TypeScript интерфейсах для будущей реализации.

## HTML атрибуты

Провайдер автоматически управляет атрибутами на `document.body`:

**Устанавливаются при монтировании:**
- `data-brand` - Текущее название бренда
- `data-theme` - Текущая тема (light/dark/auto)
- `data-palette` - Текущая цветовая палитра

**Удаляются при размонтировании:**
Все `data-*` атрибуты очищаются когда провайдер размонтируется.

## Интеграция с CSS

Используйте data атрибуты в ваших таблицах стилей:

```css
/* Стили для конкретного бренда */
[data-brand="sky"] {
    --primary-color: #0066cc;
}

[data-brand="custom"] {
    --primary-color: #ff6b6b;
}

/* Стили для темы */
[data-theme="dark"] {
    background: #000;
    color: #fff;
}

[data-theme="light"] {
    background: #fff;
    color: #000;
}

/* Стили для палитры */
[data-palette="high-contrast"] {
    --text-color: #000;
    --bg-color: #fff;
    font-weight: 600;
}

/* Комбинированный таргетинг */
[data-brand="sky"][data-theme="dark"] {
    --primary-color: #3399ff;
}
```

## Примеры

### Мультибрендовое приложение

```tsx
<DesignSystemProvider brand="summer">
    <App />
</DesignSystemProvider>

// Вывод в DOM:
// <body data-brand="summer" data-theme="light">
```

### Компонент с учетом темы

```tsx
function Card() {
    const { theme } = useDesignSystem()

    return (
        <Box
            backgroundColor={theme === 'dark' ? 'gray.900' : 'white'}
            color={theme === 'dark' ? 'white' : 'gray.900'}
        >
            Карточка с учетом темы
        </Box>
    )
}
```

### Динамическая смена бренда

```tsx
function BrandPicker() {
    const { changeBrand } = useDesignSystem()
    const brands = ['sky', 'ocean', 'forest', 'sunset']

    return (
        <div>
            {brands.map(brand => (
                <button key={brand} onClick={() => changeBrand(brand)}>
                    {brand}
                </button>
            ))}
        </div>
    )
}
```

## Использование в разных фреймворках

DesignSystem построен на Mitosis и работает одинаково во всех фреймворках:

**React:**
```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>
```

**Vue:**
```vue
<script setup>
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'
</script>

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>
```

**Solid:**
```tsx
import { DesignSystemProvider } from '@sky-modules/design/DesignSystem'

<DesignSystemProvider brand="sky">
    <App />
</DesignSystemProvider>
```

Один и тот же API, одинаковое поведение—скомпилировано для каждого фреймворка через Mitosis.

## Связанные модули

- **Brand** - Типобезопасные определения токенов бренда
- **Box** - Универсальный стилизованный компонент с поддержкой тем
- **Layout** - Платформо-независимое вычисление раскладки

## Заметки о реализации

- Построен на **Mitosis** для универсальной поддержки фреймворков
- Использует **`useStore`** для реактивного управления состоянием
- **`setContext`** делает состояние доступным для дочерних компонентов
- **DOM атрибуты** обеспечивают темизацию через CSS
- **Нулевой runtime** - компилируется в нативный код фреймворка
- Исходный код: `DesignSystemProvider.lite.tsx:11`
