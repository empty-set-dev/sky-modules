# Console

Улучшенная консоль с цветным выводом и семантическими методами логирования.

## Установка

```typescript
import Console from '@sky-modules/core/Console'
```

## API

### Console.log(...args)

Стандартный лог с иконкой информации.

```typescript
Console.log(...args: any[]): void
```

**Параметры:**
- `args` - Значения для логирования

### Console.info(...args)

Информационное сообщение с фиолетовым цветом и иконкой.

```typescript
Console.info(...args: any[]): void
```

**Параметры:**
- `args` - Значения для логирования

### Console.success(...args)

Сообщение об успехе с зелёным цветом и галочкой.

```typescript
Console.success(...args: any[]): void
```

**Параметры:**
- `args` - Значения для логирования

### Console.debug(...args)

Отладочное сообщение с серым цветом и иконкой.

```typescript
Console.debug(...args: any[]): void
```

**Параметры:**
- `args` - Значения для логирования

### Console.warn(...args)

Предупреждение с жёлтым цветом и иконкой.

```typescript
Console.warn(...args: any[]): void
```

**Параметры:**
- `args` - Значения для логирования

### Console.error(...args)

Сообщение об ошибке с красным цветом и иконкой.

```typescript
Console.error(...args: any[]): void
```

**Параметры:**
- `args` - Значения для логирования

## Использование

### Базовое логирование

```typescript
Console.log('Application started')
Console.info('Configuration loaded')
Console.success('Database connected')
Console.debug('Processing request', { id: 123 })
Console.warn('Deprecated API used')
Console.error('Failed to connect', error)
```

### Сервер vs Клиент

```typescript
// Сервер (Node.js): ANSI цветовые коды
// Клиент (Браузер): CSS стили цвета
Console.success('Работает везде!')
```
