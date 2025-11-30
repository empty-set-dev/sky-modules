# justTry

Выполняет функцию и возвращает результат или `undefined` при ошибке.

## Установка

```typescript
import justTry from '@sky-modules/core/justTry'
```

## API

### justTry(fn)

Выполняет функцию с автоматической подавлением ошибок.

```typescript
justTry<T>(fn: () => T): Promise<undefined | T>
```

**Параметры:**
- `fn` - Функция для выполнения (может быть async)

**Возвращает:** Promise, разрешающийся в результат функции или `undefined` если произошла ошибка

## Использование

### Парсинг с fallback

```typescript
const data = await justTry(() => JSON.parse(jsonString))
if (data === undefined) {
  console.log('Невалидный JSON, используем значения по умолчанию')
}
```

### Безопасные API запросы

```typescript
const user = await justTry(async () => {
  return await fetch('/api/user').then(r => r.json())
})

if (user === undefined) {
  console.log('Не удалось загрузить пользователя')
}
```

### Graceful Degradation

```typescript
const location = await justTry(() => {
  return navigator.geolocation.getCurrentPosition()
})

const fallbackLocation = location ?? { lat: 0, lng: 0 }
```
