# Расширения Map

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Map utility module
</div>

Типобезопасный Map.has() с автоматическим сужением типа для Map.get().


## Installation

```bash
npm install @sky-modules/core
```

## Установка

```typescript
import '@sky-modules/core/Map'
```

## API

### Map.prototype.has(key)

Проверяет наличие ключа с сужением типа.

```typescript
has<P extends K>(key: P): this is { get(key: P): V } & this
```

**Параметры:**
- `key` - Ключ для проверки

**Возвращает:** `true`, если ключ существует, `false` в противном случае

**Эффект типизации:** После того как `has(key)` возвращает `true`, TypeScript знает, что `get(key)` возвращает `V` (а не `V | undefined`)

## Использование

### До расширения

```typescript
const map = new Map<string, User>()

if (map.has('user123')) {
  const user = map.get('user123') // Тип: User | undefined
  if (user) {
    console.log(user.name)
  }
}
```

### После расширения

```typescript
const map = new Map<string, User>()

if (map.has('user123')) {
  const user = map.get('user123') // Тип: User
  console.log(user.name) // Проверка не нужна
}
```

## Пример

```typescript
const cache = new Map<string, Data>()

function getData(key: string): Data {
  if (cache.has(key)) {
    return cache.get(key) // Тип: Data (не Data | undefined)
  }
  throw new Error('Not found')
}
```
