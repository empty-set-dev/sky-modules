# Canvas

Система 2D рендеринга для рисования фигур, текста и сложной графики с HTML5 Canvas API.

## Возможности

- **Высокоуровневый API рисования** - Упрощенные методы для обычных операций рисования
- **Поддержка pixel ratio** - Автоматическое масштабирование для дисплеев высокого разрешения
- **Рендеринг граф сцены** - Иерархическое управление объектами
- **Система материалов** - Различные стили рендеринга (заливка, обводка, градиент, паттерн)
- **Система геометрии** - Переиспользуемые определения фигур
- **Поддержка JSX** - Декларативная композиция сцены
- **Система трансформаций** - Позиция, поворот, масштаб с мировыми координатами
- **Утилитарные функции** - Расширенные возможности рисования (шестиугольники, измерение текста)

## Базовое использование

```typescript
import Canvas, { Scene, Mesh, RectGeometry, BasicMaterial } from '@sky-modules/Canvas'

// Создание canvas
const canvas = new Canvas({
    size: () => [800, 600],
    pixelRatio: window.devicePixelRatio
})

// Создание сцены
const scene = new Scene()
scene.setBackground('#f0f0f0')

// Создание прямоугольника
const geometry = new RectGeometry(100, 50, 0, 0)
const material = new BasicMaterial({ color: '#ff0000' })
const mesh = new Mesh(geometry, material)

mesh.position.set(400, 300)
scene.add(mesh)

// Рендеринг
canvas.render(scene)
```

## Canvas API

### Конструктор

```typescript
new Canvas(parameters: CanvasParameters)
```

**Параметры:**
- `size(): [number, number]` - Функция, возвращающая размеры canvas
- `canvas?: HTMLCanvasElement` - Опциональный существующий элемент canvas
- `pixelRatio?: number` - Коэффициент пикселей для дисплеев высокого разрешения (по умолчанию: `window.devicePixelRatio`)

### Методы рисования

#### Операции с путями
- `beginPath()` - Начать новый путь
- `closePath()` - Закрыть текущий путь
- `moveTo(x, y)` - Переместиться к координатам
- `lineTo(x, y)` - Нарисовать линию к координатам
- `arcTo(x1, y1, x2, y2, radius)` - Нарисовать дугу между точками
- `arc(x, y, radius, startAngle, endAngle, counterclockwise?)` - Нарисовать круговую дугу
- `ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise?)` - Нарисовать эллиптическую дугу
- `quadraticCurveTo(cpx, cpy, x, y)` - Нарисовать квадратичную кривую
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Нарисовать кубическую кривую Безье
- `rect(x, y, width, height)` - Добавить прямоугольник к пути

#### Заливка и обводка
- `fill()` - Залить текущий путь
- `stroke()` - Обвести текущий путь
- `clip()` - Использовать текущий путь как область обрезки

#### Прямоугольники
- `fillRect(x, y, width, height)` - Залить прямоугольник
- `strokeRect(x, y, width, height)` - Обвести прямоугольник
- `clearRect(x, y, width, height)` - Очистить область прямоугольника

#### Текст
- `fillText(text, x, y, maxWidth?)` - Залить текст
- `strokeText(text, x, y, maxWidth?)` - Обвести текст
- `measureText(text)` - Измерить размеры текста

#### Трансформации
- `save()` - Сохранить текущее состояние
- `restore()` - Восстановить сохраненное состояние
- `scale(x, y)` - Трансформация масштабирования
- `rotate(angle)` - Трансформация поворота
- `translate(x, y)` - Трансформация смещения
- `transform(a, b, c, d, e, f)` - Применить матрицу трансформации
- `setTransform(a, b, c, d, e, f)` - Установить матрицу трансформации
- `resetTransform()` - Сбросить к единичной матрице

#### Стилизация
- `setFillStyle(style)` - Установить цвет/градиент/паттерн заливки
- `setStrokeStyle(style)` - Установить цвет/градиент/паттерн обводки
- `setLineWidth(width)` - Установить ширину линии
- `setLineCap(cap)` - Установить стиль окончания линии
- `setLineJoin(join)` - Установить стиль соединения линий
- `setMiterLimit(limit)` - Установить лимит скоса
- `setLineDash(segments)` - Установить паттерн пунктирной линии
- `setLineDashOffset(offset)` - Установить смещение пунктирной линии
- `setFont(font)` - Установить шрифт текста
- `setTextAlign(align)` - Установить выравнивание текста
- `setTextBaseline(baseline)` - Установить базовую линию текста
- `setGlobalAlpha(alpha)` - Установить глобальную прозрачность
- `setGlobalCompositeOperation(operation)` - Установить режим смешивания

#### Тени
- `setShadowBlur(blur)` - Установить размытие тени
- `setShadowColor(color)` - Установить цвет тени
- `setShadowOffsetX(offset)` - Установить смещение тени по X
- `setShadowOffsetY(offset)` - Установить смещение тени по Y

#### Рендеринг сцены
- `render(scene)` - Отрендерить граф сцены
- `clear()` - Очистить весь canvas
- `onResize()` - Обновить размер canvas

## Утилитарные функции

### drawHexagon

Рисование шестиугольников или сегментов шестиугольника:

```typescript
canvas.drawHexagon({
    x: 100,
    y: 100,
    radius: 50,
    angle: 0,           // Опциональный поворот
    sides: [0, 1, 2],   // Опционально: только определенные стороны
    color: '#ff0000',   // Опциональный цвет заливки
    strokeColor: '#000', // Опциональный цвет обводки
    strokeWidth: 2      // Опциональная ширина обводки
})
```

### measureText

Продвинутое измерение текста со стилизацией:

```typescript
const metrics = canvas.measureText({
    text: 'Привет Мир',
    font: '16px Arial',
    textAlign: 'center',    // Опционально
    textBaseline: 'middle'  // Опционально
})
```

## Граф сцены

### Scene

Корневой контейнер для рендерируемых объектов:

```typescript
const scene = new Scene()
scene.setBackground('#ffffff')
scene.add(mesh)
scene.remove(mesh)
```

### Object2D

Базовый класс для всех рендерируемых объектов:

```typescript
object.position.set(x, y)
object.rotation = angle
object.scale.set(sx, sy)
object.visible = true
object.add(child)
object.remove(child)
object.traverse(callback)
```

### Mesh

Объединяет геометрию и материал для рендеринга:

```typescript
const mesh = new Mesh(geometry, material)
mesh.position.set(100, 100)
mesh.render(ctx, pixelRatio)
```

### Group

Контейнер для организации объектов:

```typescript
const group = new Group()
group.add(mesh1)
group.add(mesh2)
group.position.set(50, 50) // Влияет на всех потомков
```

## Система геометрии

### RectGeometry

```typescript
new RectGeometry(width, height, x?, y?)
```

### CircleGeometry

```typescript
new CircleGeometry(radius, x?, y?, startAngle?, endAngle?, counterclockwise?)
```

### EllipseGeometry

```typescript
new EllipseGeometry(radiusX, radiusY, x?, y?, rotation?, startAngle?, endAngle?, counterclockwise?)
```

### PathGeometry

```typescript
const path = new PathGeometry()
path.moveTo(0, 0)
path.lineTo(100, 100)
path.quadraticCurveTo(150, 50, 200, 100)
path.closePath()
```

## Система материалов

### BasicMaterial

Заливка сплошным цветом:

```typescript
new BasicMaterial({
    color: '#ff0000',
    opacity: 0.8
})
```

### StrokeMaterial

Рендеринг контура:

```typescript
new StrokeMaterial({
    color: '#000000',
    lineWidth: 2,
    lineCap: 'round',
    lineJoin: 'round',
    lineDash: [5, 5],
    lineDashOffset: 0,
    opacity: 1.0
})
```

### GradientMaterial

Градиентная заливка:

```typescript
const gradient = ctx.createLinearGradient(0, 0, 100, 100)
gradient.addColorStop(0, '#ff0000')
gradient.addColorStop(1, '#0000ff')

new GradientMaterial({
    gradient,
    opacity: 1.0
})
```

### PatternMaterial

Заливка паттерном:

```typescript
const pattern = ctx.createPattern(image, 'repeat')

new PatternMaterial({
    pattern,
    opacity: 1.0
})
```

## Поддержка JSX

Декларативная композиция сцены:

```typescript
import { CanvasJSXRenderer } from '@sky-modules/Canvas'

const renderer = new CanvasJSXRenderer({
    container: document.body
})

renderer.render(
    <scene background="#f0f0f0">
        <mesh position={[400, 300]} rotation={Math.PI / 4}>
            <rectGeometry width={100} height={50} />
            <basicMaterial color="#ff0000" />
        </mesh>

        <group position={[200, 200]}>
            <mesh>
                <circleGeometry radius={25} />
                <strokeMaterial color="#0000ff" lineWidth={3} />
            </mesh>
        </group>
    </scene>
)
```

## Обработка Pixel Ratio

Все значения координат автоматически масштабируются на коэффициент пикселей:

```typescript
const canvas = new Canvas({
    size: () => [400, 300],
    pixelRatio: 2  // 2x масштабирование для retina дисплеев
})

// Рисование в (100, 100) фактически нарисует в (200, 200) на canvas
canvas.fillRect(100, 100, 50, 50)
```

## Советы по производительности

1. **Группировка операций** - Группируйте множественные вызовы рисования между save/restore
2. **Переиспользование объектов** - Клонируйте геометрии и материалы вместо создания новых
3. **Отсечение видимости** - Устанавливайте `visible: false` для объектов вне экрана
4. **Оптимизация трансформаций** - Избегайте ненужных трансформаций
5. **Кэширование материалов** - Переиспользуйте материалы с одинаковыми свойствами

## Поддержка браузеров

- Современные браузеры с поддержкой HTML5 Canvas
- Окружение ES2015+
- TypeScript 4.0+

## Связанное

- [Geometry](./Geometry.md) - Определения фигур
- [Material](./Material.md) - Стили рендеринга
- [Object2D](./Object2D.md) - Система трансформаций