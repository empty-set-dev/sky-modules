# Canvas Core

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  core utility module
</div>

<PlaygroundLink id="canvas" label="Открыть Canvas Playground" />


Основные классы рендеринга для Canvas системы. Предоставляет базовый граф сцены, движок рендеринга и объектные примитивы.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { core } from '@sky-modules/core'
```

## Обзор

Canvas Core реализует архитектуру графа сцены аналогичную Three.js, но оптимизированную для 2D canvas рендеринга. Предоставляет:

- **Граф сцены**: Иерархическая организация отрисовываемых объектов
- **Система трансформаций**: Позиция, поворот, масштаб с мировыми трансформациями
- **Движок рендеринга**: Высокопроизводительный canvas рендеринг с поддержкой pixel ratio
- **Объектная модель**: Базовые классы для всех рендерируемых сущностей

## Основные классы

### Object2D

**Файл:** `Object2D.ts`

Базовый класс для всех объектов в графе сцены. Предоставляет свойства трансформации, управление иерархией и вычисление мировых трансформаций.

**Возможности:**
- Трансформации позиции, поворота, масштаба с fluent API
- Иерархия родитель-потомок с автоматическим распространением трансформаций
- Кеширование мировых трансформаций для производительности
- Матричные трансформации (совместимый с Three.js API)
- Методы обхода графа сцены
- Поиск объектов по id/name

**Использование:**
```typescript
const obj = new Object2D()
obj
  .setPosition(100, 50)
  .setRotation(Math.PI / 4)
  .setScale(2, 2)
  .setVisible(true)

// Иерархия
parent.add(child)
parent.remove(child)

// Обход
obj.traverse(child => console.log(child.name))
obj.traverseVisible(child => { /* только видимые */ })

// Мировые трансформации
const worldPos = obj.getWorldPosition()
const localPoint = obj.worldToLocal(new Vector2(100, 100))
```

**Свойства:**
- `position: Vector2` - Локальная позиция
- `rotation: number` - Поворот в радианах
- `scale: Vector2` - Локальный масштаб
- `visible: boolean` - Флаг видимости
- `children: Object2D[]` - Дочерние объекты
- `parent: Object2D | null` - Родительский объект
- `id?: string` - Уникальный идентификатор
- `name?: string` - Имя объекта

**Методы трансформации:**
- `setPosition(x, y)` - Установить позицию
- `setRotation(angle)` - Установить поворот
- `setScale(x, y)` - Установить масштаб
- `translateX(distance)` / `translateY(distance)` - Сдвинуть вдоль оси
- `rotateZ(angle)` - Повернуть вокруг оси Z
- `lookAt(x, y)` - Направить на позицию

**Методы иерархии:**
- `add(object)` - Добавить потомка
- `remove(object)` - Удалить потомка
- `traverse(callback)` - Обойти всех потомков
- `traverseVisible(callback)` - Обойти только видимых потомков
- `traverseAncestors(callback)` - Обойти предков вверх

**Методы мировых трансформаций:**
- `getWorldTransform()` - Получить закешированную мировую трансформацию
- `getWorldPosition()` - Получить мировую позицию
- `getWorldRotation()` - Получить мировой поворот
- `getWorldScale()` - Получить мировой масштаб
- `localToWorld(point)` - Преобразовать точку из локальных в мировые координаты
- `worldToLocal(point)` - Преобразовать точку из мировых в локальные координаты

**Методы матриц (совместимые с Three.js):**
- `updateMatrix()` - Обновить локальную матрицу
- `updateMatrixWorld(force)` - Обновить мировую матрицу рекурсивно
- `applyMatrix3(matrix)` - Применить матричную трансформацию

**Методы поиска:**
- `getObjectById(id)` - Найти объект по id
- `getObjectByName(name)` - Найти объект по имени

### Scene

**Файл:** `Scene.ts`

Корень графа сцены. Расширяет `Object2D` поддержкой фона.

**Возможности:**
- Корневой контейнер графа сцены
- Поддержка цвета/градиента/паттерна фона
- Все возможности иерархии Object2D

**Использование:**
```typescript
const scene = new Scene()
scene.setBackground('#000000')

// Добавить объекты в сцену
scene.add(mesh)
scene.add(group)
```

**Свойства:**
- Все свойства Object2D
- `background?: string | CanvasGradient | CanvasPattern` - Фон сцены

**Методы:**
- Все методы Object2D
- `setBackground(style)` - Установить стиль фона
- `clone()` - Глубокое клонирование сцены

### Mesh

**Файл:** `Mesh.ts`

Отрисовываемый объект, комбинирующий геометрию и материал. Основная рендерируемая сущность.

**Возможности:**
- Композиция Геометрия + Материал
- Поддержка CSS Box компонента (flexbox лэйауты)
- Поддержка overflow scrolling
- Отслеживание размеров контента
- Кастомная логика рендеринга

**Использование:**
```typescript
import Mesh from '@sky-modules/canvas/core/Mesh'
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const mesh = new Mesh(
  new RectGeometry({ width: 100, height: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)

mesh.setPosition(200, 100)
scene.add(mesh)
```

**Свойства:**
- Все свойства Object2D
- `geometry: Geometry` - Определение формы
- `material: Material` - Стиль отрисовки
- `isMesh: boolean` - Идентификатор типа (всегда true)

**Свойства Box компонента** (устанавливаются Box компонентом):
- `_boxStyles?: CSSProperties` - CSS стили для Box рендеринга
- `_isBox?: boolean` - Флаг Box компонента
- `_boxWidth?: number` - Вычисленная ширина box
- `_boxHeight?: number` - Вычисленная высота box
- `_contentHeight?: number` - Полная высота контента (для скроллинга)
- `_scrollX: number` - Горизонтальное смещение скролла
- `_scrollY: number` - Вертикальное смещение скролла

**Методы:**
- Все методы Object2D
- `render(context, pixelRatio)` - Отрисовать на canvas
- `raycast(raycaster, intersects)` - Тестирование пересечения луча
- `clone()` - Клонировать mesh (поверхностное копирование geometry/material)

**Рендеринг:**
Метод `render` обрабатывает два режима рендеринга:
1. **Стандартный Mesh**: Применяет материал, рисует геометрию, рендерит с материалом
2. **Box компонент**: Использует `renderCSSToCanvas` для CSS-подобного рендеринга с flexbox

### Group

**Файл:** `Group.ts`

Контейнер для организации множества объектов. Полезен для группировки связанных mesh'ей.

**Возможности:**
- Трансформация группы объектов вместе
- Организация иерархии сцены
- Все возможности иерархии Object2D
- Поддержка глубокого клонирования

**Использование:**
```typescript
const group = new Group()
group.add(mesh1)
group.add(mesh2)
group.setPosition(100, 100)

scene.add(group)

// Оба mesh'а двигаются вместе с группой
group.translateX(50)
```

**Свойства:**
- Все свойства Object2D
- `isGroup: boolean` - Идентификатор типа (всегда true)

**Методы:**
- Все методы Object2D
- `clone()` - Глубокое клонирование группы со всеми потомками

### CanvasRenderer

**Файл:** `CanvasRenderer.ts` (844 строки)

Основной движок рендеринга. Предоставляет fluent API для операций рисования на canvas с автоматическим масштабированием по pixel ratio.

**Возможности:**
- Инициализация canvas и обработка resize
- Fluent API для рисования (цепочки методов)
- Автоматическое масштабирование devicePixelRatio
- Делегирование управления стилями StyleManager
- Делегирование рендеринга скроллбаров ScrollbarRenderer
- Интеграция профилирования производительности
- Рендеринг графа сцены

**Использование:**
```typescript
import CanvasRenderer from '@sky-modules/canvas/core/CanvasRenderer'
import Scene from '@sky-modules/canvas/core/Scene'

const canvas = new CanvasRenderer({
  canvas: document.getElementById('canvas'),
  pixelRatio: window.devicePixelRatio
})

const scene = new Scene()
scene.setBackground('#000000')

// Цикл рендеринга
function animate() {
  canvas.clear()
  canvas.render(scene)
  requestAnimationFrame(animate)
}
animate()
```

**Параметры конструктора:**
```typescript
interface CanvasRendererParameters {
  canvas?: HTMLCanvasElement  // Canvas элемент (создает новый если не указан)
  pixelRatio?: number        // Pixel ratio (по умолчанию devicePixelRatio)
}
```

**Основные свойства:**
- `canvas: HTMLCanvasElement` - DOM canvas элемент
- `drawContext: CanvasRenderingContext2D` - 2D контекст рендеринга
- `pixelRatio: number` - Device pixel ratio

**Методы рендеринга:**
- `clear()` - Очистить canvas
- `render(scene)` - Отрисовать граф сцены
- `onResize()` - Обработать resize canvas

**Примитивы рисования:**
- `beginPath()` - Начать новый путь
- `closePath()` - Закрыть текущий путь
- `moveTo(x, y)` - Переместить перо в позицию
- `lineTo(x, y)` - Нарисовать линию до позиции
- `rect(x, y, w, h)` - Нарисовать прямоугольный путь
- `arc(x, y, r, start, end)` - Нарисовать дугу
- `ellipse(x, y, rx, ry, rot, start, end)` - Нарисовать эллипс
- `quadraticCurveTo(cpx, cpy, x, y)` - Квадратичная кривая
- `bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` - Кривая Безье
- `fill()` - Залить текущий путь
- `stroke()` - Обвести текущий путь
- `clip()` - Обрезать по текущему пути

**Методы текста:**
- `fillText(text, x, y, maxWidth?)` - Нарисовать залитый текст
- `strokeText(text, x, y, maxWidth?)` - Нарисовать обведенный текст
- `measureText(text)` - Измерить размеры текста
- `setFont(font)` - Установить стиль шрифта
- `setTextAlign(align)` - Установить выравнивание текста
- `setTextBaseline(baseline)` - Установить базовую линию текста

**Методы трансформаций:**
- `save()` - Сохранить состояние canvas
- `restore()` - Восстановить состояние canvas
- `translate(x, y)` - Сдвинуть систему координат
- `rotate(angle)` - Повернуть систему координат
- `scale(x, y)` - Масштабировать систему координат
- `resetTransform()` - Сбросить матрицу трансформации
- `setTransform(a, b, c, d, e, f)` - Установить матрицу трансформации

**Методы стилей** (делегируются StyleManager):
- `setFillStyle(style)` - Установить цвет/градиент/паттерн заливки
- `setStrokeStyle(style)` - Установить цвет/градиент/паттерн обводки
- `setLineWidth(width)` - Установить ширину линии (автомасштабируется по pixelRatio)
- `setLineCap(cap)` - Установить стиль концов линии
- `setLineJoin(join)` - Установить стиль соединений линии
- `setMiterLimit(limit)` - Установить miter limit
- `setLineDash(segments)` - Установить паттерн пунктира (автомасштабируется по pixelRatio)
- `setLineDashOffset(offset)` - Установить смещение пунктира (автомасштабируется по pixelRatio)
- `setGlobalAlpha(alpha)` - Установить глобальную прозрачность
- `setGlobalCompositeOperation(op)` - Установить операцию композиции
- `setShadowBlur(blur)` - Установить размытие тени (автомасштабируется по pixelRatio)
- `setShadowColor(color)` - Установить цвет тени
- `setShadowOffsetX(offset)` - Установить X смещение тени (автомасштабируется по pixelRatio)
- `setShadowOffsetY(offset)` - Установить Y смещение тени (автомасштабируется по pixelRatio)

**Методы градиентов/паттернов:**
- `createLinearGradient(x0, y0, x1, y1)` - Создать линейный градиент
- `createRadialGradient(x0, y0, r0, x1, y1, r1)` - Создать радиальный градиент
- `createConicGradient(angle, x, y)` - Создать конический градиент
- `createPattern(image, repetition)` - Создать паттерн

**Методы изображений:**
- `drawImage(image, ...args)` - Нарисовать изображение на canvas

**Манипуляция пикселями:**
- `getImageData(x, y, w, h)` - Получить данные пикселей
- `putImageData(imageData, x, y)` - Поместить данные пикселей
- `createImageData(w, h)` - Создать новые данные пикселей

## Специализированные модули

### StyleManager

**Файл:** `styles/StyleManager.ts`

Централизованное управление стилями canvas context с автоматическим масштабированием pixel ratio.

**Возможности:**
- Fluent API для операций со стилями
- Автоматическое масштабирование размеров по pixel ratio
- Сокращение избыточных изменений состояния стилей
- Поддержка цепочек методов

**Использование:**
```typescript
import { StyleManager } from '@sky-modules/canvas/core/styles/StyleManager'

const styleManager = new StyleManager(context, pixelRatio)

styleManager
  .setFillStyle('#ff0000')
  .setLineWidth(2)
  .setGlobalAlpha(0.8)
  .withShadow(5, 'rgba(0,0,0,0.3)')
```

См. [styles/README.md](./styles/README.md) для полной документации.

### ScrollbarRenderer

**Файл:** `renderers/ScrollbarRenderer.ts`

Рендерит скроллбары для overflow контейнеров.

**Возможности:**
- Дизайн скроллбара в форме таблетки
- Настраиваемый внешний вид
- Автоматический размер бегунка
- Пиксель-перфектный рендеринг

**Использование:**
```typescript
import { ScrollbarRenderer } from '@sky-modules/canvas/core/renderers/ScrollbarRenderer'

const scrollbarRenderer = new ScrollbarRenderer(context)

scrollbarRenderer.render({
  object: mesh,
  x: meshX,
  y: meshY,
  pixelRatio: window.devicePixelRatio
})
```

См. [renderers/README.md](./renderers/README.md) для полной документации.

## Архитектурные принципы

### Граф сцены

Canvas Core использует иерархический граф сцены аналогичный Three.js:

```
Scene (корень)
├── Mesh (geometry + material)
├── Group
│   ├── Mesh
│   └── Mesh
└── Mesh
```

**Преимущества:**
- Интуитивная организация объектов
- Автоматическое распространение трансформаций
- Простое управление объектами
- Эффективный обход

### Система трансформаций

Трансформации иерархические и кешируются для производительности:

1. **Локальная трансформация**: позиция/поворот/масштаб объекта
2. **Мировая трансформация**: Накопленная трансформация от корня до объекта
3. **Кеширование**: Мировые трансформации кешируются и инвалидируются при изменении
4. **Поддержка матриц**: Совместимые с Three.js операции с матрицами

### Композиция вместо наследования

Объекты составлены из:
- **Geometry**: Что рисовать (форма)
- **Material**: Как рисовать (стиль)
- **Transform**: Где рисовать (позиция/поворот/масштаб)

Это позволяет гибкие комбинации без глубоких иерархий наследования.

### Масштабирование Pixel Ratio

Все операции с размерами автоматически масштабируются по `devicePixelRatio` для четкого рендеринга на high-DPI дисплеях:

```typescript
// Код пользователя (логические пиксели)
renderer.setLineWidth(2)
renderer.rect(10, 10, 100, 50)

// Внутри (физические пиксели)
context.lineWidth = 2 * pixelRatio
context.rect(10 * pixelRatio, 10 * pixelRatio, 100 * pixelRatio, 50 * pixelRatio)
```

## Оптимизации производительности

### Кеширование мировых трансформаций

Object2D кеширует мировые трансформации чтобы избежать перевычисления:

```typescript
// Первый вызов - вычисляет и кеширует
const transform1 = obj.getWorldTransform()

// Второй вызов - возвращает закешированное (если не инвалидировано)
const transform2 = obj.getWorldTransform()
```

Кеш инвалидируется когда:
- Меняется локальная трансформация объекта
- Меняется мировая трансформация родителя

### Переиспользование объектов

Система Canvas JSX переиспользует экземпляры Mesh/Group между рендерами для минимизации выделений памяти (см. [../jsx/utils/ObjectManager.ts](../jsx/utils/ObjectManager.ts)).

### Отсечение рендеринга

Невидимые объекты пропускаются при рендеринге:

```typescript
obj.setVisible(false)
// obj и все потомки не будут отрисованы
```

Используйте `traverseVisible()` для обхода только видимых.

## Точки интеграции

### Canvas JSX

Canvas Core - основа для Canvas JSX:

```tsx
<Scene background="#000">
  <Mesh position={[100, 100]}>
    <RectGeometry width={50} height={50} />
    <BasicMaterial color="#ff0000" />
  </Mesh>
</Scene>
```

Компилируется в:
```typescript
const scene = new Scene().setBackground('#000')
const mesh = new Mesh(
  new RectGeometry({ width: 50, height: 50 }),
  new BasicMaterial({ color: '#ff0000' })
)
mesh.setPosition(100, 100)
scene.add(mesh)
```

### Геометрии и материалы

Canvas Core предоставляет базу для систем геометрий и материалов:

- **Геометрии**: Определяют формы (см. [../geometries/](../geometries/))
- **Материалы**: Определяют стили рисования (см. [../materials/](../materials/))

### CSS рендеринг

Mesh поддерживает CSS-подобный рендеринг для Box компонентов:

```typescript
mesh._isBox = true
mesh._boxStyles = {
  width: '200px',
  height: '100px',
  background: 'linear-gradient(to right, red, blue)',
  border: '2px solid white',
  borderRadius: '8px'
}
```

## Точки расширения

### Кастомные типы объектов

Расширяйте Object2D для кастомных типов объектов:

```typescript
class Sprite extends Object2D {
  texture: Texture

  constructor(texture: Texture) {
    super()
    this.texture = texture
  }

  render(context: CanvasRenderingContext2D) {
    // Кастомный рендеринг
  }
}
```

### Кастомный рендеринг

Переопределите метод `render` в Mesh для кастомного рендеринга:

```typescript
class CustomMesh extends Mesh {
  render(ctx: CanvasRenderingContext2D, pixelRatio: number) {
    // Кастомная логика рендеринга
    super.render(ctx, pixelRatio)
  }
}
```

## Type Guards

Используйте свойства типов для идентификации типов объектов:

```typescript
if (obj.isMesh) {
  // obj это Mesh
}

if (obj.isGroup) {
  // obj это Group
}
```

## Связанная документация

- [Canvas JSX README](../jsx/README.md) - Система Canvas JSX
- [Canvas JSX Utils README](../jsx/utils/README.md) - Утилитные модули JSX
- [Renderers README](./renderers/README.md) - Специализированные рендереры
- [Styles README](./styles/README.md) - Управление стилями
- [Geometries](../geometries/) - Классы геометрий
- [Materials](../materials/) - Классы материалов

## Примеры

### Базовая настройка сцены

```typescript
import CanvasRenderer from '@sky-modules/canvas/core/CanvasRenderer'
import Scene from '@sky-modules/canvas/core/Scene'
import Mesh from '@sky-modules/canvas/core/Mesh'
import { RectGeometry } from '@sky-modules/canvas/geometries/RectGeometry'
import { BasicMaterial } from '@sky-modules/canvas/materials/BasicMaterial'

const canvas = new CanvasRenderer({
  canvas: document.getElementById('canvas')
})

const scene = new Scene()
scene.setBackground('#1a1a1a')

const rect = new Mesh(
  new RectGeometry({ width: 100, height: 100 }),
  new BasicMaterial({ color: '#ff0000' })
)
rect.setPosition(200, 150)

scene.add(rect)

function animate() {
  canvas.clear()
  rect.rotateZ(0.01)
  canvas.render(scene)
  requestAnimationFrame(animate)
}
animate()
```

### Иерархические трансформации

```typescript
const parent = new Group()
parent.setPosition(400, 300)

const child1 = new Mesh(geometry1, material1)
child1.setPosition(50, 0) // 50 пикселей вправо от родителя

const child2 = new Mesh(geometry2, material2)
child2.setPosition(-50, 0) // 50 пикселей влево от родителя

parent.add(child1)
parent.add(child2)
scene.add(parent)

// Поворот родителя поворачивает обоих потомков вокруг позиции родителя
parent.rotateZ(0.01)
```

### Запросы мировых трансформаций

```typescript
const mesh = new Mesh(geometry, material)
mesh.setPosition(100, 100)

const group = new Group()
group.setPosition(50, 50)
group.setRotation(Math.PI / 4)
group.add(mesh)

// Локальная позиция: (100, 100)
console.log(mesh.position)

// Мировая позиция: (50, 50) + повернутая (100, 100)
console.log(mesh.getWorldPosition())

// Преобразовать мировую точку в локальные координаты
const localPoint = mesh.worldToLocal(new Vector2(200, 200))
```

### Обход сцены

```typescript
// Найти все mesh'и в сцене
const meshes = []
scene.traverse(obj => {
  if (obj.isMesh) {
    meshes.push(obj)
  }
})

// Найти объект по имени
const player = scene.getObjectByName('player')

// Обновить все видимые объекты
scene.traverseVisible(obj => {
  if (obj.isMesh) {
    obj.rotateZ(0.01)
  }
})
```
