# Canvas Geometries

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  geometries utility module
</div>

<PlaygroundLink id="canvas" label="Открыть Canvas Playground" />


Определения форм для Canvas рендеринга. Геометрии определяют **что** рисовать на canvas.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { geometries } from '@sky-modules/core'
```

## Обзор

Геометрии - это классы, которые определяют формы для рендеринга. Они реализуют метод `draw`, который добавляет пути в canvas context. Геометрии комбинируются с Materials в Mesh для рендеринга.

**Ключевые концепции:**
- Geometry определяет **форму** (что рисовать)
- Material определяет **стиль** (как рисовать)
- Mesh комбинирует оба для рендеринга
- Все координаты автоматически масштабируются по `devicePixelRatio`

## Базовый класс

### Geometry

**Файл:** `Geometry.ts`

Абстрактный базовый класс для всех геометрий.

**Интерфейс:**
```typescript
abstract class Geometry {
  abstract draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void
}
```

**Требования к реализации:**
- Должен реализовывать метод `draw`
- Добавлять пути в canvas context (НЕ делать fill/stroke)
- Масштабировать все координаты по `pixelRatio`
- Поддерживать клонирование

## Встроенные геометрии

### RectGeometry

**Файл:** `RectGeometry.ts`

Геометрия прямоугольной формы.

**Свойства:**
- `width: number` - Ширина прямоугольника
- `height: number` - Высота прямоугольника
- `x: number` - Смещение X от начала координат (по умолчанию: 0)
- `y: number` - Смещение Y от начала координат (по умолчанию: 0)

**Использование:**
```typescript
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'

// Базовый прямоугольник
const rect = new RectGeometry({ width: 100, height: 50 })

// Прямоугольник со смещением
const rect2 = new RectGeometry({
  width: 100,
  height: 50,
  x: -50,  // Центрировать горизонтально
  y: -25   // Центрировать вертикально
})
```

**JSX:**
```tsx
<Mesh position={[200, 100]}>
  <RectGeometry width={100} height={50} />
  <BasicMaterial color="#ff0000" />
</Mesh>
```

**Значения по умолчанию:**
```typescript
{
  width: 1,
  height: 1,
  x: 0,
  y: 0
}
```

### CircleGeometry

**Файл:** `CircleGeometry.ts`

Геометрия круга или дуги.

**Свойства:**
- `radius: number` - Радиус круга
- `x: number` - Смещение X от начала координат (по умолчанию: 0)
- `y: number` - Смещение Y от начала координат (по умолчанию: 0)
- `startAngle: number` - Начальный угол в радианах (по умолчанию: 0)
- `endAngle: number` - Конечный угол в радианах (по умолчанию: 2π)
- `counterclockwise: boolean` - Направление рисования (по умолчанию: false)

**Использование:**
```typescript
import { CircleGeometry } from '@sky-modules/canvas/geometries/CircleGeometry'

// Полный круг
const circle = new CircleGeometry({ radius: 50 })

// Полукруг (дуга)
const arc = new CircleGeometry({
  radius: 50,
  startAngle: 0,
  endAngle: Math.PI
})

// Pac-Man
const pacman = new CircleGeometry({
  radius: 50,
  startAngle: Math.PI * 0.25,
  endAngle: Math.PI * 1.75
})
```

**JSX:**
```tsx
<Mesh position={[200, 100]}>
  <CircleGeometry radius={50} />
  <BasicMaterial color="#00ff00" />
</Mesh>
```

### EllipseGeometry

**Файл:** `EllipseGeometry.ts`

Геометрия эллиптической формы.

**Свойства:**
- `radiusX: number` - Горизонтальный радиус
- `radiusY: number` - Вертикальный радиус
- `x: number` - Смещение X (по умолчанию: 0)
- `y: number` - Смещение Y (по умолчанию: 0)
- `rotation: number` - Поворот в радианах (по умолчанию: 0)
- `startAngle: number` - Начальный угол (по умолчанию: 0)
- `endAngle: number` - Конечный угол (по умолчанию: 2π)
- `counterclockwise: boolean` - Направление рисования (по умолчанию: false)

**Использование:**
```typescript
import { EllipseGeometry } from '@sky-modules/canvas/geometries/EllipseGeometry'

// Горизонтальный эллипс
const ellipse = new EllipseGeometry({
  radiusX: 100,
  radiusY: 50
})

// Повернутый эллипс
const rotated = new EllipseGeometry({
  radiusX: 100,
  radiusY: 50,
  rotation: Math.PI / 4
})
```

### TextGeometry

**Файл:** `TextGeometry.ts`

Геометрия рендеринга текста.

**Свойства:**
- `text: string` - Содержимое текста
- `x: number` - X позиция (по умолчанию: 0)
- `y: number` - Y позиция (по умолчанию: 0)
- `font: string` - Полная строка шрифта
- `fontSize: number` - Размер шрифта в пикселях (по умолчанию: 16)
- `fontFamily: string` - Семейство шрифтов (по умолчанию: 'sans-serif')
- `fontWeight: string | number` - Толщина шрифта (по умолчанию: 'normal')
- `fontStyle: string` - Стиль шрифта (по умолчанию: 'normal')
- `textAlign: CanvasTextAlign` - Горизонтальное выравнивание (по умолчанию: 'left')
- `textBaseline: CanvasTextBaseline` - Вертикальное выравнивание (по умолчанию: 'top')
- `maxWidth?: number` - Максимальная ширина текста (опционально)

**Использование:**
```typescript
import { TextGeometry } from '@sky-modules/canvas/geometries/TextGeometry'

// Базовый текст
const text = new TextGeometry({
  text: 'Привет Мир',
  fontSize: 24
})

// Стилизованный текст
const styled = new TextGeometry({
  text: 'Стилизованный текст',
  fontSize: 32,
  fontFamily: 'Arial',
  fontWeight: 'bold',
  fontStyle: 'italic',
  textAlign: 'center'
})
```

**JSX:**
```tsx
<Mesh position={[100, 100]}>
  <TextGeometry
    text="Привет Мир"
    fontSize={24}
    fontWeight="bold"
  />
  <BasicMaterial color="#ffffff" />
</Mesh>
```

**Выравнивание текста:**
```typescript
// Горизонтальное: 'left' | 'right' | 'center' | 'start' | 'end'
// Вертикальное: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom'

const centered = new TextGeometry({
  text: 'Центрированный',
  textAlign: 'center',
  textBaseline: 'middle'
})
```

### PathGeometry

**Файл:** `PathGeometry.ts`

Пользовательская геометрия пути с fluent API для построения сложных форм.

**Возможности:**
- Fluent API для построения пути
- Поддержка всех операций canvas path
- Цепочки методов

**Команды пути:**
- `moveTo(x, y)` - Переместить перо в позицию
- `lineTo(x, y)` - Нарисовать линию до позиции
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Кубическая кривая Безье
- `quadraticCurveTo(cpx, cpy, x, y)` - Квадратичная кривая
- `arcTo(x1, y1, x2, y2, radius)` - Дуга между точками
- `arc(x, y, radius, start, end, ccw?)` - Дуга
- `closePath()` - Закрыть текущий путь

**Использование:**
```typescript
import { PathGeometry } from '@sky-modules/canvas/geometries/PathGeometry'

// Пользовательская форма
const path = new PathGeometry()
  .moveTo(50, 0)
  .lineTo(100, 50)
  .lineTo(50, 100)
  .lineTo(0, 50)
  .closePath()

// Кривая Безье
const curve = new PathGeometry()
  .moveTo(0, 0)
  .bezierCurveTo(25, -50, 75, 50, 100, 0)

// Форма сердца
const heart = new PathGeometry()
  .moveTo(50, 30)
  .bezierCurveTo(50, 20, 40, 5, 25, 5)
  .bezierCurveTo(10, 5, 0, 15, 0, 30)
  .bezierCurveTo(0, 45, 10, 55, 25, 65)
  .lineTo(50, 85)
  .lineTo(75, 65)
  .bezierCurveTo(90, 55, 100, 45, 100, 30)
  .bezierCurveTo(100, 15, 90, 5, 75, 5)
  .bezierCurveTo(60, 5, 50, 20, 50, 30)
  .closePath()
```

### PolylineGeometry

**Файл:** `PolylineGeometry.ts`

Геометрия многоточечной линии или полигона.

**Свойства:**
- `points: Point[]` - Массив точек {x, y}
- `closed: boolean` - Замыкать ли путь (по умолчанию: true)

**Методы:**
- `addPoint(x, y)` - Добавить одну точку
- `addPoints(...points)` - Добавить несколько точек
- `setPoints(points)` - Заменить все точки
- `setClosed(closed)` - Установить состояние замыкания

**Статические фабричные методы:**
- `createRegularPolygon(centerX, centerY, radius, sides, rotation?)` - Правильный многоугольник
- `createTriangle(x1, y1, x2, y2, x3, y3)` - Треугольник
- `createStar(centerX, centerY, outerRadius, innerRadius, points?, rotation?)` - Звезда
- `createPath(points)` - Открытый путь
- `createLine(x1, y1, x2, y2)` - Простая линия
- `createPolyline(points)` - Открытая ломаная
- `createPolygon(points)` - Замкнутый полигон

**Использование:**
```typescript
import { PolylineGeometry } from '@sky-modules/canvas/geometries/PolylineGeometry'

// Пользовательский полигон
const polygon = new PolylineGeometry({
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 50 },
    { x: 0, y: 50 }
  ],
  closed: true
})

// Правильный пятиугольник
const pentagon = PolylineGeometry.createRegularPolygon(0, 0, 50, 5)

// Звезда
const star = PolylineGeometry.createStar(0, 0, 50, 25, 5)

// Треугольник
const triangle = PolylineGeometry.createTriangle(0, 0, 100, 0, 50, 100)

// Линия
const simpleLine = PolylineGeometry.createLine(0, 0, 100, 100)
```

**JSX:**
```tsx
<Mesh>
  <PolylineGeometry
    points={[
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 50, y: 100 }
    ]}
    closed={true}
  />
  <StrokeMaterial color="#ffff00" lineWidth={2} />
</Mesh>
```

**Fluent API:**
```typescript
const custom = new PolylineGeometry()
  .addPoint(0, 0)
  .addPoint(100, 0)
  .addPoint(100, 100)
  .addPoint(0, 100)
  .setClosed(true)
```

### SplineGeometry

**Файл:** `SplineGeometry.ts`

Плавная кривая через точки используя сплайны Catmull-Rom.

**Свойства:**
- `points: Point[]` - Контрольные точки
- `tension: number` - Натяжение кривой (0-1, по умолчанию: 0.5)
- `closed: boolean` - Замыкать ли кривую (по умолчанию: false)

**Использование:**
```typescript
import { SplineGeometry } from '@sky-modules/canvas/geometries/SplineGeometry'

// Плавная кривая
const spline = new SplineGeometry({
  points: [
    { x: 0, y: 50 },
    { x: 50, y: 0 },
    { x: 100, y: 50 },
    { x: 150, y: 100 }
  ],
  tension: 0.5
})

// Замкнутый сплайн
const closedSpline = new SplineGeometry({
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 100 },
    { x: 0, y: 100 }
  ],
  closed: true,
  tension: 0.3
})
```

**JSX:**
```tsx
<Mesh>
  <SplineGeometry
    points={[
      { x: 0, y: 0 },
      { x: 50, y: -50 },
      { x: 100, y: 0 },
      { x: 150, y: 50 }
    ]}
    tension={0.5}
  />
  <StrokeMaterial color="#00ffff" lineWidth={2} />
</Mesh>
```

**Параметр Tension:**
- `0` - Острые углы (как PolylineGeometry)
- `0.5` - Натуральная плавная кривая (по умолчанию)
- `1` - Очень плавная, выходит за точки

## Общие паттерны

### Центрирование геометрий

Используйте свойства `x` и `y` для центрирования форм вокруг их начала координат:

```typescript
// Прямоугольник центрированный в позиции mesh
const centered = new RectGeometry({
  width: 100,
  height: 50,
  x: -50,  // Половина ширины
  y: -25   // Половина высоты
})

// Круг уже центрирован
const circle = new CircleGeometry({ radius: 50 })
```

### Комбинация с материалами

Геометрии всегда используются с Materials в Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const mesh = new Mesh(
  new RectGeometry({ width: 100, height: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)
```

### Реактивные обновления

В Canvas JSX свойства геометрии могут быть реактивными:

```tsx
import { createSignal } from 'solid-js'

function App() {
  const [radius, setRadius] = createSignal(50)

  return (
    <Mesh>
      <CircleGeometry radius={radius()} />
      <BasicMaterial color="#ff0000" />
    </Mesh>
  )
}
```

### Клонирование геометрий

Все геометрии поддерживают клонирование:

```typescript
const original = new RectGeometry({ width: 100, height: 50 })
const cloned = original.clone()

// Изменить клон без влияния на оригинал
cloned.width = 200
```

## Масштабирование Pixel Ratio

Все координаты геометрии автоматически масштабируются по `devicePixelRatio` для четкого рендеринга на high-DPI дисплеях:

```typescript
// Код пользователя (логические пиксели)
const rect = new RectGeometry({ width: 100, height: 50 })

// Внутренний draw (физические пиксели на 2x дисплее)
// ctx.rect(0 * 2, 0 * 2, 100 * 2, 50 * 2)
```

**Что масштабируется:**
- Все позиционные координаты (x, y)
- Все значения размеров (width, height, radius)
- Все контрольные точки кривых

**Что не масштабируется:**
- Углы (радианы)
- Булевы флаги
- Строковые значения

## Создание пользовательских геометрий

Расширьте базовый класс `Geometry`:

```typescript
import { Geometry } from '@sky-modules/canvas/geometries/Geometry'

export interface CustomGeometryProps {
  size?: number
}

export class CustomGeometry extends Geometry {
  public size: number

  constructor(props: CustomGeometryProps = {}) {
    super()
    this.size = props.size ?? 100
  }

  draw(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
    // Нарисовать пользовательскую форму
    const s = this.size * pixelRatio

    ctx.moveTo(0, 0)
    ctx.lineTo(s, 0)
    ctx.lineTo(s / 2, s)
    ctx.closePath()
  }

  clone(): CustomGeometry {
    return new CustomGeometry({ size: this.size })
  }
}
```

**Рекомендации:**
1. Расширить базовый класс `Geometry`
2. Добавить типизированный интерфейс свойств
3. Инициализировать все свойства в конструкторе со значениями по умолчанию
4. Реализовать метод `draw`
5. Масштабировать все координаты по `pixelRatio`
6. НЕ вызывать `fill()` или `stroke()` в `draw`
7. Реализовать метод `clone()`
8. Экспортировать и интерфейс, и класс

## Советы по производительности

### Переиспользование геометрий

Геометрии могут использоваться совместно несколькими mesh'ами:

```typescript
const geometry = new RectGeometry({ width: 100, height: 50 })

const mesh1 = new Mesh(geometry, material1)
const mesh2 = new Mesh(geometry, material2)
// Оба используют один экземпляр геометрии
```

### Статичные vs динамичные

Для статичных форм создавайте геометрию один раз:

```typescript
// Хорошо - создано один раз
const geometry = new CircleGeometry({ radius: 50 })

function render() {
  mesh.geometry = geometry
}
```

```typescript
// Плохо - создает новый экземпляр каждый кадр
function render() {
  mesh.geometry = new CircleGeometry({ radius: 50 })
}
```

### Сложность путей

Более простые пути рендерятся быстрее:

```typescript
// Быстро
const simple = new RectGeometry({ width: 100, height: 50 })

// Медленнее
const complex = new PolylineGeometry({
  points: Array.from({ length: 1000 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.1) * 50
  }))
})
```

## Точки интеграции

### Canvas JSX

Геометрии - это JSX компоненты:

```tsx
<CircleGeometry radius={50} />
<RectGeometry width={100} height={50} />
<TextGeometry text="Привет" fontSize={24} />
```

### Materials

Геометрии работают с любым Material:

```typescript
// Одна геометрия, разные материалы
const geometry = new CircleGeometry({ radius: 50 })

const filled = new Mesh(geometry, new BasicMaterial({ color: '#ff0000' }))
const outlined = new Mesh(geometry, new StrokeMaterial({ color: '#00ff00', lineWidth: 2 }))
const gradient = new Mesh(geometry, new GradientMaterial({ /* ... */ }))
```

### Mesh

Геометрии всегда рендерятся через Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'

const mesh = new Mesh(geometry, material)
mesh.setPosition(100, 100)
scene.add(mesh)
```

## Связанная документация

- [Canvas Core README](../core/README.md) - Основные классы рендеринга
- [Canvas Materials](../materials/) - Классы материалов
- [Canvas JSX README](../jsx/README.md) - JSX система

## Примеры

### Базовые формы

```typescript
// Прямоугольник
const rect = new RectGeometry({ width: 100, height: 50 })

// Круг
const circle = new CircleGeometry({ radius: 50 })

// Треугольник используя PolylineGeometry
const triangle = PolylineGeometry.createTriangle(0, 0, 100, 0, 50, 100)

// Звезда
const star = PolylineGeometry.createStar(0, 0, 50, 25, 5)
```

### Сложные формы

```typescript
// Пользовательский путь
const arrow = new PathGeometry()
  .moveTo(0, 20)
  .lineTo(60, 20)
  .lineTo(60, 0)
  .lineTo(100, 30)
  .lineTo(60, 60)
  .lineTo(60, 40)
  .lineTo(0, 40)
  .closePath()

// Плавная кривая
const wave = new SplineGeometry({
  points: Array.from({ length: 10 }, (_, i) => ({
    x: i * 20,
    y: Math.sin(i * 0.5) * 30
  })),
  tension: 0.5
})
```

### Рендеринг текста

```typescript
// Простой текст
const text = new TextGeometry({
  text: 'Привет Мир',
  fontSize: 32
})

// Многострочный (использовать несколько экземпляров TextGeometry)
const line1 = new TextGeometry({
  text: 'Строка 1',
  fontSize: 24,
  y: 0
})

const line2 = new TextGeometry({
  text: 'Строка 2',
  fontSize: 24,
  y: 30
})
```

### Анимированные формы

```tsx
import { createSignal } from 'solid-js'

function AnimatedCircle() {
  const [radius, setRadius] = createSignal(50)

  setInterval(() => {
    setRadius(r => r + Math.sin(Date.now() / 1000) * 2)
  }, 16)

  return (
    <Mesh>
      <CircleGeometry radius={radius()} />
      <BasicMaterial color="#ff0000" />
    </Mesh>
  )
}
```
