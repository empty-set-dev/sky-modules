# Define Measures

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  defineMeasures utility module
</div>

Определение пользовательских единиц измерения с методами преобразования на прототипе Number.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { defineMeasures } from '@sky-modules/core'
```

## Установка

```typescript
import defineMeasures from '@sky-modules/core/defineMeasures'
```

## API

### defineMeasures(name, measures)

Определить набор единиц измерения с автоматическими методами преобразования.

```typescript
defineMeasures<T extends string, K extends string>(
  name: T,
  measures: [K, number][]
): void
```

**Параметры:**
- `name` - Название системы измерения (используется в сообщениях об ошибках)
- `measures` - Массив кортежей `[unitName, conversionFactor]`. Единица с коэффициентом `1` является базовой

**Поведение:**
- Создает методы-геттеры `as<Unit>` на Number.prototype для преобразования
- Создает методы-геттеры `in<Unit>` на Number.prototype для обратного преобразования
- Выбрасывает ошибку, если базовая единица (коэффициент 1) не определена
- Выбрасывает ошибку при несоответствии единиц измерения

**Возвращает:** void

## Примеры использования

### Определение единиц времени

```typescript
defineMeasures('Time', [
  ['Nanoseconds', 0.000000001],
  ['Milliseconds', 0.001],
  ['Seconds', 1],              // Базовая единица
  ['Minutes', 60],
  ['Hours', 3600],
])

const duration = (5).seconds
console.log(duration.inMilliseconds)  // 5000
console.log(duration.inMinutes)       // 0.083...
```

### Определение единиц длины

```typescript
defineMeasures('Length', [
  ['Millimeters', 0.001],
  ['Meters', 1],               // Базовая единица
  ['Kilometers', 1000],
])

const distance = (100).meters
console.log(distance.inKilometers)   // 0.1
console.log(distance.inMillimeters)  // 100000
```

### Безопасное преобразование типов

```typescript
const time1 = (1).seconds
const time2 = (1).minutes

// Преобразуем обе величины в секунды перед сложением
const total = (time1.inSeconds + time2.inSeconds).seconds
console.log(total.inSeconds)  // 61
```

## Примечания

- Базовая единица (коэффициент 1) обязательна
- Смешивание единиц из разных систем измерения приводит к ошибке
- Коэффициенты преобразования являются мультипликативными от базовой единицы
