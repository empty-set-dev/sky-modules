# Events

Константы кнопок мыши для обработки событий.

## Установка

```typescript
import { MouseButton } from '@sky-modules/core/events'
```

## API

### MouseButton

Перечисление констант кнопок мыши.

```typescript
enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}
```

**Значения:**
- `LEFT` - Левая кнопка мыши (значение: 0)
- `MIDDLE` - Средняя/прокрутка (значение: 1)
- `RIGHT` - Правая кнопка мыши (значение: 2)

## Примеры использования

### Определение нажатой кнопки мыши

```typescript
import { MouseButton } from '@sky-modules/core/events'

document.addEventListener('mousedown', (event) => {
  if (event.button === MouseButton.LEFT) {
    console.log('Нажата левая кнопка')
  } else if (event.button === MouseButton.RIGHT) {
    console.log('Нажата правая кнопка')
  }
})
```

### Проверка кнопки в обработчике клика

```typescript
function handleMouseDown(event) {
  switch (event.button) {
    case MouseButton.LEFT:
      console.log('Основное действие')
      break
    case MouseButton.MIDDLE:
      console.log('Средняя кнопка')
      break
    case MouseButton.RIGHT:
      console.log('Контекстное меню')
      break
  }
}
```

### Предотвращение стандартных действий

```typescript
document.addEventListener('mousedown', (event) => {
  if (event.button === MouseButton.RIGHT) {
    event.preventDefault()
  }
})
```

## Примечания

- Значения совпадают с нативными значениями MouseEvent.button браузера
- Обычно используется в событиях mousedown, mouseup и click
- Правый клик обычно открывает контекстное меню, если не предотвращено
