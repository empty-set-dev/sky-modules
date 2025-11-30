# Расширения Object

Утилита глубокой заморозки для неизменяемых деревьев объектов.

## Установка

```typescript
import '@sky-modules/core/Object'
```

## API

### Object.freezeDeep(object)

Рекурсивно замораживает объект и все его вложенные свойства.

```typescript
Object.freezeDeep<T extends Record<string, unknown>>(object: T): Readonly<T>
```

**Параметры:**
- `object` - Объект или массив для глубокой заморозки

**Возвращает:** Замороженный объект (та же ссылка)

### Object.isFreezable(value)

Проверяет, можно ли заморозить значение.

```typescript
Object.isFreezable(value: unknown): value is Record<string, unknown>
```

**Параметры:**
- `value` - Значение для проверки

**Возвращает:** `true`, если значение является объектом или функцией

### Object.isDeeplyFrozen(object)

Проверяет, был ли объект глубоко заморожен.

```typescript
Object.isDeeplyFrozen(object: Object): boolean
```

**Параметры:**
- `object` - Объект для проверки

**Возвращает:** `true`, если объект был заморожен через `freezeDeep()`

## Использование

```typescript
const config = {
  api: {
    url: 'https://api.example.com',
    timeout: 5000
  }
}

Object.freezeDeep(config)

// Все модификации не работают
config.api.url = 'changed'      // Без эффекта
config.api.timeout = 10000      // Без эффекта
```

## Глубокая vs поверхностная заморозка

```typescript
const obj = {
  a: 1,
  nested: { b: 2 }
}

// Поверхностная заморозка
Object.freeze(obj)
obj.a = 10              // Без эффекта
obj.nested.b = 20       // ИЗМЕНЕНО!

// Глубокая заморозка
Object.freezeDeep(obj)
obj.a = 10              // Без эффекта
obj.nested.b = 20       // Без эффекта
```

## Когда использовать

Подходит для:
- Конфигурации приложения
- Константы и перечисления
- Неизменяемые справочные данные

Избегать для:
- Больших динамических наборов данных
- Часто изменяющихся данных
