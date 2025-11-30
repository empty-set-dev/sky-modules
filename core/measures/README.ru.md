# Measures

Предопределенные единицы измерения с автоматическими методами преобразования для общих измерений.

## Установка

```typescript
import '@sky-modules/core/measures'
```

## API

Доступные системы измерения с методами преобразования на прототипе Number:

### Time

Преобразование между единицами времени (наносекунды до недель).

```typescript
declare global {
  interface Number {
    asNanoseconds: Time
    asMilliseconds: Time
    asDeciseconds: Time
    asSeconds: Time
    asMinutes: Time
    asHours: Time
    asDays: Time
    asWeeks: Time
  }
  interface Time extends Number {
    inNanoseconds: number
    inMilliseconds: number
    inDeciseconds: number
    inSeconds: number
    inMinutes: number
    inHours: number
    inDays: number
    inWeeks: number
  }
}
```

### Length

Преобразование между единицами длины (нанометры до километров).

```typescript
declare global {
  interface Number {
    asNanometers: Length
    asMillimeters: Length
    asDecimeters: Length
    asMeters: Length
    asKilometers: Length
  }
  interface Length extends Number {
    inNanometers: number
    inMillimeters: number
    inDecimeters: number
    inMeters: number
    inKilometers: number
  }
}
```

### Weight

Преобразование между единицами веса.

### Percents

Преобразование между единицами процентов.

### Единицы скорости

- KilometersPerHour
- MetersPerSecond

### Угловая скорость

- PercentsPerSecond
- PercentsPerMillisecond

## Примеры использования

### Преобразование времени

```typescript
import '@sky-modules/core/measures'

// Преобразовать секунды в миллисекунды
const duration = (5).asSeconds
console.log(duration.inMilliseconds)  // 5000

// Преобразовать часы в минуты
const workDay = (8).asHours
console.log(workDay.inMinutes)        // 480

// Добавить разные единицы
const total = (1).asMinutes.inSeconds + (30).asSeconds.inSeconds
console.log(total)  // 90
```

### Преобразование длины

```typescript
// Преобразовать метры в километры
const distance = (1000).asMeters
console.log(distance.inKilometers)    // 1

// Преобразовать миллиметры в дециметры
const width = (50).asMillimeters
console.log(width.inDecimeters)       // 0.5
```

### Преобразование скорости

```typescript
// Преобразовать километры в час в метры в секунду
const speed = (100).asKilometersPerHour
// Преобразовать при необходимости...

// Или работать непосредственно с мерами скорости
```

### Комбинированные операции

```typescript
// Расчет времени
const msPerFrame = (1000 / 60).asMilliseconds  // 60 FPS
console.log(msPerFrame.inSeconds)              // ~0.0167

// Расчет длины
const boardSize = (200).asDecimeters  // 20 дм = 2 м
const boardSizeMeters = boardSize.inMeters     // 2

// Расчет процентов
const progress = (50).asPercent
console.log(progress)                          // 50
```

## Доступные измерения

| Модуль | Базовая единица | Доступные преобразования |
|--------|-----------------|------------------------|
| Time | Seconds | ns, ms, deciseconds, s, min, h, days, weeks |
| Length | Meters | nm, mm, dm, m, km |
| Weight | Kilograms | (см. реализацию) |
| Percents | Percent | (см. реализацию) |
| KilometersPerHour | - | км/ч в м/с преобразования |
| MetersPerSecond | - | м/с в км/ч преобразования |

## Примечания

- Все модули измерений импортируются автоматически при импорте measures
- Базовые единицы используют коэффициент 1 для преобразований
- Безопасность типов обеспечена - смешивание несовместимых единиц выбрасывает ошибку
- Методы преобразования возвращают объекты Number с метаданными измерения
- Полезно для читаемых, безопасных по типам физических и анимационных расчетов
