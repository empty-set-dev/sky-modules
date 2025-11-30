# Globalify

Добавление модулей в глобальную область видимости с опциональной поддержкой namespace и валидацией безопасности.

## Установка

```typescript
import globalify from '@sky-modules/core/globalify'
```

## API

### globalify(module)

Добавить свойства модуля непосредственно в глобальную область.

```typescript
globalify(module: Record<PropertyKey, unknown>): void
```

**Параметры:**
- `module` - Объект со свойствами для добавления в глобальную область

**Поведение:**
- Объединяет свойства модуля в глобальный объект
- Валидирует ключи для предотвращения загрязнения прототипа
- Выбрасывает PrototypePollutionError для опасных ключей

**Возвращает:** void

### globalify.namespace(ns, module)

Добавить свойства модуля в вложенный namespace в глобальной области.

```typescript
globalify.namespace(ns: string, module: Record<PropertyKey, unknown>): void
```

**Параметры:**
- `ns` - Путь namespace с разделителем точка (например, 'app.utils')
- `module` - Объект со свойствами для добавления в namespace

**Поведение:**
- Создает вложенный путь namespace при необходимости
- Валидирует все ключи namespace для безопасности
- Объединяет свойства модуля в целевой namespace
- Выбрасывает InvalidScopeError если область видимости namespace невалидна

**Возвращает:** void

## Примеры использования

### Добавление в глобальную область

```typescript
import globalify from '@sky-modules/core/globalify'

globalify({
  MyClass: class MyClass { },
  myFunction: () => console.log('Hello'),
  myValue: 42,
})

// Теперь доступны как:
console.log(MyClass)
console.log(myFunction())
console.log(myValue)
```

### Добавление в вложенный namespace

```typescript
globalify.namespace('app.services', {
  logger: {
    log: (msg) => console.log(msg),
    error: (msg) => console.error(msg),
  },
  cache: new Map(),
})

// Теперь доступны как:
app.services.logger.log('test')
app.services.cache.set('key', 'value')
```

### Несколько namespace'ов

```typescript
globalify.namespace('app.config', {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
})

globalify.namespace('app.state', {
  user: null,
  isLoading: false,
})

// Доступ:
console.log(app.config.apiUrl)
console.log(app.state.user)
```

## Безопасность

Модуль предотвращает загрязнение прототипа:
- Отклоняет опасные ключи: `__proto__`, `constructor`, `prototype`
- Валидирует что области видимости namespace являются объектами или функциями
- Выбрасывает ошибки безопасности для невалидных операций

```typescript
// Выбрасывает PrototypePollutionError
globalify({
  __proto__: malicious,
})

// Выбрасывает InvalidScopeError
globalify.namespace('undefined.path', {
  key: 'value',
})
```

## Примечания

- Безопасная альтернатива eval() для динамических глобалей
- Валидирует все ключи для безопасности
- Сохраняет существующие структуры namespace
- Ключи не перечисляются в исходном модуле
