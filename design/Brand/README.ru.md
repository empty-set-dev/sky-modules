# Brand

Система мультибрендовой тематизации для токенов дизайна и стилизации компонентов.

## Установка

```bash
npm install @sky-modules/design
```

## Возможности

- Поддержка нескольких брендовых тем
- Динамическое переключение тем
- Брендовые цветовые палитры
- Типобезопасная конфигурация брендов
- Runtime и build-time тематизация

## Использование

### Настройка брендов

```typescript
import { Brand } from '@sky-modules/design'

Brand.configure({
    default: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        warning: '#ffc107',
        error: '#dc3545'
    },
    darkMode: {
        primary: '#0056b3',
        secondary: '#5a6268',
        success: '#1e7e34',
        warning: '#d39e00',
        error: '#bd2130'
    }
})
```

### Переключение брендовой темы

```typescript
// Переключение на темную тему
Brand.setActive('darkMode')

// Возврат к стандартной
Brand.setActive('default')
```

### Использование брендовых цветов

```tsx
import { Box } from '@sky-modules/design'

<Box backgroundColor="brand.primary" color="brand.text">
    Брендовый контент
</Box>
```

## API

### Brand.configure(brands)

Настройка доступных брендовых тем.

**Параметры:**
- `brands` - Объект с конфигурациями брендов

```typescript
interface BrandConfig {
    [brandName: string]: {
        primary?: string
        secondary?: string
        success?: string
        warning?: string
        error?: string
        [key: string]: string | undefined
    }
}
```

### Brand.setActive(name)

Установка активной брендовой темы.

**Параметры:**
- `name` - Название бренда для активации

### Brand.getActive()

Получение названия текущего активного бренда.

**Возвращает:** `string` - Название активного бренда

### Brand.getColors(name?)

Получение цветов для конкретного бренда или активного бренда.

**Параметры:**
- `name` - Опциональное название бренда (по умолчанию активный бренд)

**Возвращает:** Конфигурация цветов бренда

## Примеры

### E-commerce мультибренд

```typescript
Brand.configure({
    summer: {
        primary: '#ff6b6b',
        secondary: '#ffd93d',
        background: '#fffef7'
    },
    winter: {
        primary: '#4ecdc4',
        secondary: '#95e1d3',
        background: '#f8f9fa'
    },
    autumn: {
        primary: '#d97706',
        secondary: '#f59e0b',
        background: '#fffbeb'
    }
})

// Сезонное переключение темы
const season = getCurrentSeason()
Brand.setActive(season)
```

### White-Label приложение

```typescript
// Настройка для разных клиентов
Brand.configure({
    clientA: {
        primary: '#1e40af',
        logo: 'https://client-a.com/logo.png'
    },
    clientB: {
        primary: '#dc2626',
        logo: 'https://client-b.com/logo.png'
    }
})

// Установка на основе поддомена
const client = getClientFromSubdomain()
Brand.setActive(client)
```
