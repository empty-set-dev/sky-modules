# Canvas Materials

Определения стилей рисования для Canvas рендеринга. Материалы определяют **как** рисовать формы на canvas.

## Обзор

Материалы - это классы, которые определяют стили рисования для геометрий. Они реализуют методы `apply` и `render`, которые настраивают canvas context и выполняют операции рисования. Материалы комбинируются с Geometries в Mesh для рендеринга.

**Ключевые концепции:**
- Material определяет **стиль** (как рисовать)
- Geometry определяет **форму** (что рисовать)
- Mesh комбинирует оба для рендеринга
- Все размеры автоматически масштабируются по `devicePixelRatio`

## Базовый класс

### Material

**Файл:** `Material.ts`

Абстрактный базовый класс для всех материалов с общими свойствами стилизации.

**Общие свойства:**
- `color: string` - Базовый цвет (CSS строка цвета)
- `opacity: number` - Глобальная прозрачность (0-1, по умолчанию: 1)
- `lineWidth: number` - Толщина линии (по умолчанию: 1)
- `lineCap: CanvasLineCap` - Стиль концов линии (по умолчанию: 'butt')
- `lineJoin: CanvasLineJoin` - Стиль соединений линии (по умолчанию: 'miter')
- `lineDash: number[]` - Паттерн пунктира (по умолчанию: [])
- `lineDashOffset: number` - Смещение пунктира (по умолчанию: 0)
- `shadowBlur: number` - Радиус размытия тени (по умолчанию: 0)
- `shadowColor: string` - Цвет тени (по умолчанию: 'transparent')
- `shadowOffsetX: number` - X смещение тени (по умолчанию: 0)
- `shadowOffsetY: number` - Y смещение тени (по умолчанию: 0)
- `globalCompositeOperation: GlobalCompositeOperation` - Режим композиции (по умолчанию: 'source-over')

**Методы:**
```typescript
abstract class Material {
  constructor(parameters: MaterialParameters)
  apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void
  abstract render(ctx: CanvasRenderingContext2D): void
}
```

**Требования к реализации:**
- Расширить базовый класс `Material`
- Переопределить метод `apply` для установки fillStyle/strokeStyle
- Переопределить метод `render` для выполнения операций fill/stroke
- Реализовать метод `clone` для копирования
- Автоматически масштабировать размеры по `pixelRatio`

## Встроенные материалы

### BasicMaterial

**Файл:** `BasicMaterial.ts`

Материал заливки сплошным цветом.

**Использование:**
```typescript
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

// Простая заливка
const material = new BasicMaterial({ color: '#ff0000' })

// С прозрачностью
const transparent = new BasicMaterial({
  color: '#ff0000',
  opacity: 0.5
})

// С тенью
const shadowed = new BasicMaterial({
  color: '#0000ff',
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowOffsetX: 5,
  shadowOffsetY: 5
})
```

**JSX:**
```tsx
<Mesh>
  <CircleGeometry radius={50} />
  <BasicMaterial color="#ff0000" opacity={0.8} />
</Mesh>
```

**Свойства:**
- Все базовые свойства Material
- Использует `color` для заливки

**Возможности:**
- Заливка сплошным цветом
- Поддержка рендеринга текста (через TextGeometry)
- Перенос слов для текста с maxWidth

**Значения по умолчанию:**
```typescript
{
  color: '#ffffff',
  opacity: 1
}
```

### StrokeMaterial

**Файл:** `StrokeMaterial.ts`

Материал обводки/контура.

**Использование:**
```typescript
import { StrokeMaterial } from '@sky-modules/canvas/materials/StrokeMaterial'

// Простая обводка
const material = new StrokeMaterial({
  color: '#000000',
  lineWidth: 2
})

// Пунктирная линия
const dashed = new StrokeMaterial({
  color: '#ff0000',
  lineWidth: 3,
  lineDash: [10, 5]
})

// Скругленные углы
const rounded = new StrokeMaterial({
  color: '#00ff00',
  lineWidth: 4,
  lineCap: 'round',
  lineJoin: 'round'
})
```

**JSX:**
```tsx
<Mesh>
  <RectGeometry width={100} height={50} />
  <StrokeMaterial
    color="#000000"
    lineWidth={2}
    lineCap="round"
  />
</Mesh>
```

**Свойства:**
- Все базовые свойства Material
- Использует `color` для обводки
- `lineWidth` контролирует толщину
- `lineCap`: 'butt' | 'round' | 'square'
- `lineJoin`: 'miter' | 'round' | 'bevel'
- `lineDash`: Массив длин штрихов/пробелов

**Стили концов линии:**
```typescript
// Плоские концы
lineCap: 'butt'

// Скругленные концы
lineCap: 'round'

// Квадратные концы (выступают за линию)
lineCap: 'square'
```

**Стили соединений линии:**
```typescript
// Острые углы
lineJoin: 'miter'

// Скругленные углы
lineJoin: 'round'

// Срезанные углы
lineJoin: 'bevel'
```

**Значения по умолчанию:**
```typescript
{
  color: '#000000',  // Черная обводка
  lineWidth: 1,
  lineCap: 'butt',
  lineJoin: 'miter'
}
```

### GradientMaterial

**Файл:** `GradientMaterial.ts`

Материал заливки градиентом используя CanvasGradient.

**Использование:**
```typescript
import { GradientMaterial } from '@sky-modules/canvas/materials/GradientMaterial'
import CanvasRenderer from '@sky-modules/canvas/core/CanvasRenderer'

const canvas = new CanvasRenderer()

// Линейный градиент
const linearGradient = canvas.createLinearGradient(0, 0, 100, 0)
linearGradient.addColorStop(0, '#ff0000')
linearGradient.addColorStop(1, '#0000ff')

const material = new GradientMaterial({ gradient: linearGradient })

// Радиальный градиент
const radialGradient = canvas.createRadialGradient(50, 50, 0, 50, 50, 50)
radialGradient.addColorStop(0, '#ffffff')
radialGradient.addColorStop(1, '#000000')

const radial = new GradientMaterial({ gradient: radialGradient })

// Конический градиент
const conicGradient = canvas.createConicGradient(0, 50, 50)
conicGradient.addColorStop(0, '#ff0000')
conicGradient.addColorStop(0.33, '#00ff00')
conicGradient.addColorStop(0.67, '#0000ff')
conicGradient.addColorStop(1, '#ff0000')

const conic = new GradientMaterial({ gradient: conicGradient })
```

**JSX:**
```tsx
function GradientCircle({ canvas }) {
  const gradient = canvas.createLinearGradient(0, 0, 100, 0)
  gradient.addColorStop(0, '#ff0000')
  gradient.addColorStop(1, '#0000ff')

  return (
    <Mesh>
      <CircleGeometry radius={50} />
      <GradientMaterial gradient={gradient} />
    </Mesh>
  )
}
```

**Свойства:**
- Все базовые свойства Material
- `gradient: CanvasGradient` - Обязательный объект градиента

**Типы градиентов:**
- **Линейный**: `createLinearGradient(x0, y0, x1, y1)`
- **Радиальный**: `createRadialGradient(x0, y0, r0, x1, y1, r1)`
- **Конический**: `createConicGradient(angle, x, y)`

**Создание градиентов:**
```typescript
// Получить canvas renderer
const canvas = new CanvasRenderer()

// Линейный градиент (слева направо)
const linear = canvas.createLinearGradient(0, 0, 100, 0)
linear.addColorStop(0, 'red')
linear.addColorStop(0.5, 'yellow')
linear.addColorStop(1, 'green')

// Радиальный градиент (от центра наружу)
const radial = canvas.createRadialGradient(50, 50, 0, 50, 50, 50)
radial.addColorStop(0, 'white')
radial.addColorStop(1, 'black')

// Конический градиент (вращающийся оттенок)
const conic = canvas.createConicGradient(0, 50, 50)
for (let i = 0; i <= 1; i += 0.1) {
  const hue = i * 360
  conic.addColorStop(i, `hsl(${hue}, 100%, 50%)`)
}
```

### StrokeGradientMaterial

**Файл:** `StrokeGradientMaterial.ts`

Материал градиентной обводки/контура.

**Использование:**
```typescript
import { StrokeGradientMaterial } from '@sky-modules/canvas/materials/StrokeGradientMaterial'

const gradient = canvas.createLinearGradient(0, 0, 100, 0)
gradient.addColorStop(0, '#ff0000')
gradient.addColorStop(1, '#0000ff')

const material = new StrokeGradientMaterial({
  gradient,
  lineWidth: 4
})
```

**JSX:**
```tsx
function GradientOutline({ canvas }) {
  const gradient = canvas.createLinearGradient(0, 0, 100, 100)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1, 'blue')

  return (
    <Mesh>
      <RectGeometry width={100} height={100} />
      <StrokeGradientMaterial
        gradient={gradient}
        lineWidth={3}
      />
    </Mesh>
  )
}
```

**Свойства:**
- Все базовые свойства Material
- `gradient: CanvasGradient` - Обязательный объект градиента
- Использует градиент для цвета обводки

### FillStrokeMaterial

**Файл:** `FillStrokeMaterial.ts`

Комбинированный материал заливки и обводки.

**Использование:**
```typescript
import { FillStrokeMaterial } from '@sky-modules/canvas/materials/FillStrokeMaterial'

// Заливка и обводка одним цветом
const material = new FillStrokeMaterial({
  color: '#ff0000',
  lineWidth: 2
})

// Разные цвета заливки и обводки
const outlined = new FillStrokeMaterial({
  color: '#ffff00',        // Цвет заливки
  strokeColor: '#000000',  // Цвет обводки
  lineWidth: 3
})
```

**JSX:**
```tsx
<Mesh>
  <CircleGeometry radius={50} />
  <FillStrokeMaterial
    color="#ffff00"
    strokeColor="#000000"
    lineWidth={2}
  />
</Mesh>
```

**Свойства:**
- Все базовые свойства Material
- `color` - Цвет заливки
- `strokeColor` - Цвет обводки (по умолчанию равен `color`)

**Возможности:**
- Заливает и обводит одним материалом
- Разные цвета для заливки и обводки
- Все свойства обводки (lineWidth, lineCap и т.д.)

### PatternMaterial

**Файл:** `PatternMaterial.ts`

Материал заливки повторяющимся паттерном.

**Использование:**
```typescript
import { PatternMaterial } from '@sky-modules/canvas/materials/PatternMaterial'

// Из изображения
const image = new Image()
image.src = '/texture.png'
await image.decode()

const pattern = PatternMaterial.fromImage(image, 'repeat', {
  scale: 0.5,
  rotation: Math.PI / 4,
  offsetX: 10,
  offsetY: 10
})

// Из canvas паттерна
const ctx = document.createElement('canvas').getContext('2d')!
const canvasPattern = ctx.createPattern(image, 'repeat')!

const material = new PatternMaterial({
  pattern: canvasPattern,
  scale: 1,
  rotation: 0
})
```

**JSX:**
```tsx
function TexturedMesh() {
  const [image, setImage] = createSignal<HTMLImageElement>()

  onMount(async () => {
    const img = new Image()
    img.src = '/texture.png'
    await img.decode()
    setImage(img)
  })

  return (
    <Show when={image()}>
      <Mesh>
        <RectGeometry width={200} height={200} />
        <PatternMaterial
          image={image()!}
          repetition="repeat"
          scale={0.5}
        />
      </Mesh>
    </Show>
  )
}
```

**Свойства:**
- Все базовые свойства Material
- `pattern: CanvasPattern` - Объект canvas паттерна
- `image?: CanvasImageSource` - Изображение для создания паттерна
- `repetition?: PatternRepetition` - 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
- `scale: number` - Масштаб паттерна (по умолчанию: 1)
- `rotation: number` - Поворот паттерна в радианах (по умолчанию: 0)
- `offsetX: number` - Горизонтальное смещение (по умолчанию: 0)
- `offsetY: number` - Вертикальное смещение (по умолчанию: 0)

**Статические методы:**
```typescript
// Создать из изображения с опциями
PatternMaterial.fromImage(
  image: CanvasImageSource,
  repetition?: PatternRepetition,
  options?: PatternMaterialParameters
): PatternMaterial
```

**Режимы повторения:**
```typescript
// Повторять в обоих направлениях
repetition: 'repeat'

// Повторять только горизонтально
repetition: 'repeat-x'

// Повторять только вертикально
repetition: 'repeat-y'

// Без повторения
repetition: 'no-repeat'
```

**Возможности трансформации:**
```typescript
const pattern = PatternMaterial.fromImage(image, 'repeat', {
  scale: 0.5,           // Половинный размер
  rotation: Math.PI / 4, // 45 градусов
  offsetX: 20,          // Сдвинуть вправо на 20px
  offsetY: 10           // Сдвинуть вниз на 10px
})
```

**Производительность:**
- Матрица трансформации кешируется
- Пересчитывается только при изменении свойств трансформации
- Эффективно для анимированных паттернов

## Общие свойства

Все материалы разделяют эти свойства из базового класса `Material`:

### Цвет и прозрачность

```typescript
// Сплошной цвет
{ color: '#ff0000' }

// RGB
{ color: 'rgb(255, 0, 0)' }

// RGBA
{ color: 'rgba(255, 0, 0, 0.5)' }

// HSL
{ color: 'hsl(0, 100%, 50%)' }

// Именованные цвета
{ color: 'red' }

// Прозрачность (0-1)
{ opacity: 0.5 }
```

### Свойства линии

```typescript
{
  lineWidth: 2,
  lineCap: 'round',    // 'butt' | 'round' | 'square'
  lineJoin: 'round',   // 'miter' | 'round' | 'bevel'
  lineDash: [10, 5],   // Длины штрихов и пробелов
  lineDashOffset: 0    // Смещение для анимированных штрихов
}
```

### Свойства тени

```typescript
{
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowOffsetX: 5,
  shadowOffsetY: 5
}
```

### Операции композиции

```typescript
{
  globalCompositeOperation: 'source-over'
}
```

**Распространенные режимы композиции:**
- `'source-over'` - Нормальный (по умолчанию)
- `'multiply'` - Умножение
- `'screen'` - Осветление
- `'overlay'` - Перекрытие
- `'darken'` - Затемнение
- `'lighten'` - Осветление
- `'color-dodge'` - Осветление основы
- `'color-burn'` - Затемнение основы
- `'hard-light'` - Жесткий свет
- `'soft-light'` - Мягкий свет
- `'difference'` - Разница
- `'exclusion'` - Исключение
- `'hue'` - Оттенок
- `'saturation'` - Насыщенность
- `'color'` - Цвет
- `'luminosity'` - Яркость

## Общие паттерны

### Комбинация с геометриями

Материалы всегда используются с Geometries в Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'
import { CircleGeometry } from '@sky-modules/canvas/geometries/CircleGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const mesh = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)
```

### Реактивные обновления

В Canvas JSX свойства материала могут быть реактивными:

```tsx
import { createSignal } from 'solid-js'

function App() {
  const [color, setColor] = createSignal('#ff0000')

  return (
    <Mesh>
      <CircleGeometry radius={50} />
      <BasicMaterial color={color()} />
    </Mesh>
  )
}
```

### Клонирование материалов

Все материалы поддерживают клонирование:

```typescript
const original = new BasicMaterial({ color: '#ff0000', opacity: 0.5 })
const cloned = original.clone()

// Изменить клон без влияния на оригинал
cloned.opacity = 1.0
```

### Анимированные штрихи

Анимируйте пунктирные линии обновляя `lineDashOffset`:

```tsx
function AnimatedDash() {
  const [offset, setOffset] = createSignal(0)

  setInterval(() => {
    setOffset(o => (o + 1) % 20)
  }, 50)

  return (
    <Mesh>
      <RectGeometry width={200} height={100} />
      <StrokeMaterial
        color="#000000"
        lineWidth={2}
        lineDash={[10, 10]}
        lineDashOffset={offset()}
      />
    </Mesh>
  )
}
```

## Масштабирование Pixel Ratio

Размеры материала автоматически масштабируются по `devicePixelRatio`:

```typescript
// Код пользователя (логические пиксели)
const material = new StrokeMaterial({
  lineWidth: 2,
  shadowBlur: 5,
  lineDash: [10, 5]
})

// Внутренний apply (физические пиксели на 2x дисплее)
// ctx.lineWidth = 2 * 2 = 4
// ctx.shadowBlur = 5 * 2 = 10
// ctx.setLineDash([10 * 2, 5 * 2]) = [20, 10]
```

**Что масштабируется:**
- `lineWidth`
- Сегменты `lineDash`
- `lineDashOffset`
- `shadowBlur`
- `shadowOffsetX`
- `shadowOffsetY`

**Что не масштабируется:**
- Цвета
- Прозрачность
- Стили концов/соединений линии
- Операции композиции
- Градиенты
- Паттерны (трансформируются отдельно)

## Создание пользовательских материалов

Расширьте базовый класс `Material`:

```typescript
import { Material, MaterialParameters } from '@sky-modules/canvas/materials/Material'

export interface CustomMaterialParameters extends MaterialParameters {
  customProperty?: number
}

export class CustomMaterial extends Material {
  customProperty: number

  constructor(parameters: CustomMaterialParameters = {}) {
    super(parameters)
    this.customProperty = parameters.customProperty ?? 100
  }

  apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
    super.apply(ctx, pixelRatio)
    // Установить fillStyle/strokeStyle
    ctx.fillStyle = this.color
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Выполнить fill/stroke
    ctx.fill()
  }

  clone(): CustomMaterial {
    return new CustomMaterial({
      customProperty: this.customProperty,
      color: this.color,
      opacity: this.opacity,
      // ... копировать все базовые свойства
    })
  }
}
```

**Рекомендации:**
1. Расширить базовый класс `Material`
2. Добавить типизированный интерфейс свойств расширяющий `MaterialParameters`
3. Вызвать `super(parameters)` в конструкторе
4. Переопределить `apply` для установки fillStyle/strokeStyle
5. Переопределить `render` для выполнения fill/stroke
6. Вызвать `super.apply(ctx, pixelRatio)` для применения базовых свойств
7. Реализовать метод `clone` копирующий все свойства
8. Экспортировать и интерфейс, и класс

## Советы по производительности

### Переиспользование материалов

Материалы могут использоваться совместно несколькими mesh'ами:

```typescript
const material = new BasicMaterial({ color: '#ff0000' })

const mesh1 = new Mesh(geometry1, material)
const mesh2 = new Mesh(geometry2, material)
// Оба используют один экземпляр материала
```

### Условная установка свойств

Базовый класс Material устанавливает только свойства, отличающиеся от значений по умолчанию:

```typescript
// Быстро - shadowBlur не устанавливается
const simple = new BasicMaterial({ color: '#ff0000' })

// Медленнее - устанавливает свойства тени
const shadowed = new BasicMaterial({
  color: '#ff0000',
  shadowBlur: 10,
  shadowColor: 'rgba(0, 0, 0, 0.5)'
})
```

### Кеширование градиентов

Создавайте градиенты один раз и переиспользуйте:

```typescript
// Хорошо - создано один раз
const gradient = canvas.createLinearGradient(0, 0, 100, 0)
gradient.addColorStop(0, 'red')
gradient.addColorStop(1, 'blue')

const material = new GradientMaterial({ gradient })

// Плохо - создает новый градиент каждый кадр
function render() {
  const gradient = canvas.createLinearGradient(0, 0, 100, 0)
  gradient.addColorStop(0, 'red')
  gradient.addColorStop(1, 'blue')
  mesh.material = new GradientMaterial({ gradient })
}
```

### Кеширование трансформации паттерна

PatternMaterial кеширует матрицу трансформации:

```typescript
const pattern = PatternMaterial.fromImage(image, 'repeat', {
  scale: 0.5,
  rotation: 0
})

// Первый apply - создает матрицу
pattern.apply(ctx, pixelRatio)

// Второй apply - использует закешированную матрицу (та же трансформация)
pattern.apply(ctx, pixelRatio)

// Третий apply - пересчитывает (трансформация изменилась)
pattern.scale = 1.0
pattern.apply(ctx, pixelRatio)
```

## Точки интеграции

### Canvas JSX

Материалы - это JSX компоненты:

```tsx
<BasicMaterial color="#ff0000" />
<StrokeMaterial color="#000000" lineWidth={2} />
<GradientMaterial gradient={gradient} />
```

### Геометрии

Материалы работают с любой Geometry:

```typescript
// Один материал, разные геометрии
const material = new BasicMaterial({ color: '#ff0000' })

const circle = new Mesh(new CircleGeometry({ radius: 50 }), material)
const rect = new Mesh(new RectGeometry({ width: 100, height: 50 }), material)
const star = new Mesh(PolylineGeometry.createStar(0, 0, 50, 25, 5), material)
```

### Mesh

Материалы всегда рендерятся через Mesh:

```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'

const mesh = new Mesh(geometry, material)
mesh.setPosition(100, 100)
scene.add(mesh)
```

## Связанная документация

- [Canvas Core README](../core/README.md) - Основные классы рендеринга
- [Canvas Geometries README](../geometries/README.md) - Классы геометрий
- [Canvas JSX README](../jsx/README.md) - JSX система

## Примеры

### Базовые формы

```typescript
// Сплошная заливка
const filled = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)

// Контур
const outlined = new Mesh(
  new RectGeometry({ width: 100, height: 50 }),
  new StrokeMaterial({ color: '#000000', lineWidth: 2 })
)

// Заливка и обводка
const both = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new FillStrokeMaterial({
    color: '#ffff00',
    strokeColor: '#000000',
    lineWidth: 3
  })
)
```

### Градиенты

```typescript
const canvas = new CanvasRenderer()

// Радужный градиент
const rainbow = canvas.createLinearGradient(0, 0, 200, 0)
rainbow.addColorStop(0, 'red')
rainbow.addColorStop(0.2, 'orange')
rainbow.addColorStop(0.4, 'yellow')
rainbow.addColorStop(0.6, 'green')
rainbow.addColorStop(0.8, 'blue')
rainbow.addColorStop(1, 'purple')

const mesh = new Mesh(
  new RectGeometry({ width: 200, height: 100 }),
  new GradientMaterial({ gradient: rainbow })
)

// Радиальное свечение
const glow = canvas.createRadialGradient(0, 0, 0, 0, 0, 50)
glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
glow.addColorStop(1, 'rgba(255, 255, 255, 0)')

const glowMesh = new Mesh(
  new CircleGeometry({ radius: 50 }),
  new GradientMaterial({ gradient: glow })
)
```

### Паттерны

```typescript
// Загрузить текстуру
const texture = new Image()
texture.src = '/brick.png'
await texture.decode()

// Создать паттерн
const brick = PatternMaterial.fromImage(texture, 'repeat', {
  scale: 0.5
})

const wall = new Mesh(
  new RectGeometry({ width: 400, height: 300 }),
  brick
)

// Анимированный паттерн
function animatePattern() {
  brick.rotation += 0.01
  brick.offsetX += 0.5
  requestAnimationFrame(animatePattern)
}
animatePattern()
```

### Продвинутая стилизация

```typescript
// Неоновое свечение
const neon = new BasicMaterial({
  color: '#00ffff',
  shadowBlur: 20,
  shadowColor: '#00ffff',
  globalCompositeOperation: 'lighter'
})

// Анимированный пунктирный контур
const animated = new StrokeMaterial({
  color: '#ff0000',
  lineWidth: 3,
  lineDash: [15, 10],
  lineDashOffset: 0
})

setInterval(() => {
  animated.lineDashOffset = (animated.lineDashOffset + 1) % 25
}, 50)
```

### Стилизация текста

```tsx
<Mesh>
  <TextGeometry
    text="Привет Мир"
    fontSize={48}
    fontWeight="bold"
    textAlign="center"
  />
  <BasicMaterial
    color="#ffffff"
    shadowBlur={5}
    shadowColor="rgba(0, 0, 0, 0.8)"
    shadowOffsetY={2}
  />
</Mesh>
```
