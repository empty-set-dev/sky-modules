# Спецификация Системы Canvas JSX

## Обзор

Canvas JSX — это декларативная система рендеринга, которая приносит синтаксис JSX в HTML5 Canvas. Она сочетает мощь реактивности SolidJS с рендерингом на canvas для высокопроизводительной 2D-графики.

**Версия:** 1.0
**Последнее обновление:** 2025-11-29

## Архитектура

### Основные Компоненты

```
canvas/
├── core/                       # Основные классы рендеринга
│   ├── CanvasRenderer.ts      # Главный рендерер (844 строки)
│   ├── Scene.ts               # Корень графа сцены
│   ├── Mesh.ts                # Отрисовываемый объект
│   ├── Group.ts               # Контейнер объектов
│   ├── renderers/             # Специализированные рендереры
│   │   ├── ScrollbarRenderer.ts
│   │   └── ScrollbarConfig.ts
│   └── styles/                # Управление стилями
│       └── StyleManager.ts
├── jsx/                        # JSX система
│   ├── jsx.tsx                # Основная JSX реализация (962 строки)
│   ├── box/                   # Box компонент (CSS-подобные контейнеры)
│   └── utils/                 # JSX утилиты
│       ├── AnimationLoop.ts
│       ├── ObjectManager.ts
│       ├── GeometryMaterialManager.ts
│       ├── ScrollManager.ts
│       └── JSXPerformanceProfiler.ts
├── geometries/                 # Определения фигур
│   ├── RectGeometry.ts
│   ├── CircleGeometry.ts
│   ├── TextGeometry.ts
│   └── ...
├── materials/                  # Стили отрисовки
│   ├── BasicMaterial.ts
│   ├── GradientMaterial.ts
│   ├── PatternMaterial.ts
│   └── ...
└── rendering/                  # CSS рендеринг
    └── renderCSSToCanvas.ts
```

## Принципы Дизайна

### 1. Декларативный API

Canvas JSX использует синтаксис JSX для декларативного рендеринга на canvas:

```tsx
<Canvas size={() => [800, 600]}>
  <Scene background="#000">
    <Mesh position={[100, 100]}>
      <RectGeometry width={50} height={50} />
      <BasicMaterial color="#ff0000" />
    </Mesh>
  </Scene>
</Canvas>
```

### 2. Реактивная Система

Работает на основе SolidJS для тонкогранулярной реактивности:

```tsx
const [x, setX] = createSignal(0)

<Mesh position={[x(), 100]} />
// Автоматически перерисовывается при изменении x()
```

### 3. Композиция Компонентов

Поддержка переиспользуемых компонентов:

```tsx
function Button(props) {
  return (
    <Box styles={{ padding: '10px', background: '#333' }}>
      <Text text={props.label} color="#fff" />
    </Box>
  )
}
```

### 4. Оптимизация Производительности

- **Кеширование Объектов**: Переиспользование объектов между рендерами
- **Пакетные Обновления**: Группировка обновлений сигналов
- **Порядок Рендеринга**: Оптимизация вызовов отрисовки
- **Очистка**: Автоматическое удаление неиспользуемых объектов

## Основные Классы

### CanvasRenderer

Главный класс рендеринга canvas с текучим API.

**Ответственности:**
- Инициализация canvas и обработка изменения размера
- Операции рисования (фигуры, пути, текст)
- Делегирование управления стилями
- Делегирование рендеринга скроллбаров
- Профилирование производительности

**Ключевые Методы:**
```typescript
class CanvasRenderer {
  constructor(params: CanvasRendererParameters)
  render(scene: Scene): void
  clear(): this
  beginPath(): this
  rect(x, y, width, height): this
  fill(): this
  stroke(): this
  // ... 50+ методов рисования
}
```

### Scene

Корень графа сцены, содержит все отрисовываемые объекты.

```typescript
class Scene extends Object3D {
  background?: string | CanvasGradient | CanvasPattern
  children: Array<Mesh | Group>
  add(child: Mesh | Group): void
  remove(child: Mesh | Group): void
}
```

### Mesh

Отрисовываемый объект, комбинирующий геометрию и материал.

```typescript
class Mesh extends Object3D {
  geometry: Geometry
  material: Material
  position: Vector2
  rotation: number
  scale: Vector2
  visible: boolean
}
```

### Group

Контейнер для организации нескольких объектов.

```typescript
class Group extends Object3D {
  children: Array<Mesh | Group>
  add(child: Mesh | Group): void
  remove(child: Mesh | Group): void
}
```

## Система JSX

### Модель Компонентов

Canvas JSX поддерживает три типа компонентов:

#### 1. Примитивные Компоненты
Встроенные JSX элементы:
- `<Canvas>` - Корневой canvas элемент
- `<Scene>` - Корень графа сцены
- `<Mesh>` - Отрисовываемый объект
- `<Group>` - Контейнер объектов
- `<Box>` - CSS-подобный контейнер

#### 2. Компоненты Геометрии
Определения фигур:
- `<RectGeometry>`
- `<CircleGeometry>`
- `<TextGeometry>`
- `<PathGeometry>`
- `<PolylineGeometry>`
- `<SplineGeometry>`

#### 3. Компоненты Материалов
Стили рисования:
- `<BasicMaterial>`
- `<StrokeMaterial>`
- `<GradientMaterial>`
- `<StrokeGradientMaterial>`
- `<PatternMaterial>`

### Жизненный Цикл

```
1. Парсинг JSX → Вызовы createElement()
2. Создание Компонента → createMesh()
3. Кеширование Объекта → ObjectManager.cache()
4. Порядок Рендеринга → ObjectManager.sortSceneChildren()
5. Рендеринг Кадра → AnimationLoop.animate()
6. Коллбеки Обновления → Выполнение обновлений для каждого объекта
7. Очистка → ObjectManager.cleanupUnusedObjects()
```

### Система Анимации

**AnimationLoop** управляет циклом рендеринга:

```typescript
const loop = new AnimationLoop(canvas, scene, () => objects)

// Обновления для каждого объекта
loop.addUpdateCallback('cube', (obj, time, delta) => {
  obj.rotation += delta
})

loop.start()
```

**Возможности:**
- Автоматический расчет time/delta
- Пакетные реактивные обновления
- Коллбеки для каждого объекта
- Пользовательские коллбеки кадров

### Управление Объектами

**ObjectManager** обрабатывает жизненный цикл объектов:

```typescript
const manager = new ObjectManager(scene)

// Пометить как используемый
manager.markKeyUsed('box-1', 0)

// Закешировать для переиспользования
manager.cache('box-1', mesh)

// Очистить неиспользуемые
manager.cleanupUnusedObjects(callbacks)
```

**Преимущества:**
- Уменьшает выделение объектов
- Предотвращает утечки памяти
- Сохраняет порядок рендеринга
- Улучшает производительность

### Фабрика Геометрии/Материалов

**GeometryMaterialManager** создает экземпляры из JSX:

```typescript
const manager = new GeometryMaterialManager()

// Создать из JSX элемента
const geometry = manager.createGeometryOrMaterial({
  type: 'RectGeometry',
  props: { width: 100, height: 50 }
})

// Обновить существующий экземпляр
manager.updateGeometryOrMaterial(element, mesh)
```

### Система Прокрутки

**ScrollManager** обрабатывает пользовательское взаимодействие:

```typescript
const scrollManager = new ScrollManager(canvas.domElement, scene)

// Автоматическая прокрутка колесом мыши
// Автоматическое перетаскивание скроллбара

// Получить границы для рендеринга
const bounds = scrollManager.getScrollbarThumbBounds(box)

// Очистка
scrollManager.dispose()
```

**ScrollbarRenderer** отрисовывает скроллбары:

```typescript
const renderer = new ScrollbarRenderer(context, {
  width: 12,
  margin: 2,
  trackColor: 'rgba(0, 0, 0, 0.1)',
  thumbColor: 'rgba(0, 0, 0, 0.3)'
})

renderer.render({ object: mesh, x, y, pixelRatio })
```

## Компонент Box

Специальный компонент, предоставляющий CSS-подобную верстку на canvas.

### Возможности

- Flexbox верстка (через Yoga)
- Поддержка CSS свойств
- Прокрутка при переполнении
- Рендеринг границ
- Стили фона
- Интеграция с Panda CSS

### Использование

```tsx
<Box
  styles={{
    width: '200px',
    height: '300px',
    padding: '10px',
    background: 'linear-gradient(to bottom, #f00, #00f)',
    border: '2px solid #fff',
    borderRadius: '8px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  }}
>
  {/* Дочерние элементы с автоматической версткой */}
</Box>
```

### Движок Верстки

Использует **Yoga** для расчетов flexbox:
1. Парсинг CSS свойств
2. Построение дерева Yoga узлов
3. Расчет верстки
4. Позиционирование дочерних элементов
5. Рендеринг на canvas

### Реализация Прокрутки

**Обработка Переполнения:**
- `overflow: 'auto'` - Скроллбар при необходимости
- `overflow: 'scroll'` - Всегда показывать скроллбар
- `overflow: 'hidden'` - Обрезать содержимое

**Скроллбар:**
- Дизайн в форме таблетки
- Настраиваемые цвета
- Поддержка колеса мыши
- Перетаскивание для прокрутки
- Попиксельно точный рендеринг

## Система Стилей

### StyleManager

Текучий API для стилей canvas с автоматическим масштабированием по pixel ratio:

```typescript
styleManager
  .setFillStyle('#ff0000')
  .setLineWidth(2)
  .withShadow(5, 'rgba(0,0,0,0.3)')
  .setGlobalAlpha(0.8)
```

**Авто-масштабирование:**
Все размеры масштабируются на `devicePixelRatio`:
```typescript
setLineWidth(2)  // → context.lineWidth = 2 * pixelRatio
```

### CSS-в-Canvas

**renderCSSToCanvas** конвертирует CSS в вызовы canvas:

```typescript
renderCSSToCanvas(context, {
  background: 'linear-gradient(to right, red, blue)',
  border: '2px solid #fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
})
```

Поддерживает:
- Линейные/радиальные градиенты
- Границы с радиусом
- Тени блока
- Цвета фона
- Паттерны заливки

## Производительность

### Стратегии Оптимизации

1. **Пулинг Объектов**
   - Переиспользование экземпляров Mesh/Group
   - Предотвращение сборки мусора

2. **Пакетные Обновления**
   - Использование batch() из SolidJS
   - Группировка обновлений сигналов

3. **Порядок Рендеринга**
   - Сортировка по z-index один раз
   - Избегание пересортировки

4. **Отслеживание Изменений**
   - Обновление только измененных объектов
   - Пропуск неизмененных рендеров

5. **Оптимизация Canvas**
   - Минимизация изменений состояния
   - Пакетные операции рисования
   - Использование кеширования путей

### Профилирование

**JSXPerformanceProfiler** отслеживает метрики:

```typescript
const profiler = new JSXPerformanceProfiler()

profiler.startFrame()
// ... рендеринг ...
profiler.endFrame()

const metrics = profiler.getMetrics()
console.log(metrics.averageFPS)
```

## Точки Интеграции

### SolidJS

Canvas JSX построен на примитивах SolidJS:
- `createSignal` - Реактивное состояние
- `createEffect` - Побочные эффекты
- `batch` - Пакетные обновления
- `untrack` - Выход из реактивности

### Yoga Layout

Flexbox верстка через Yoga:
- Создание узлов
- Применение стилей
- Расчет верстки
- Извлечение позиций

### Panda CSS

Интеграция системы дизайна:
- Рецепты стилей
- CSS переменные
- Система токенов
- Поддержка тем

## Точки Расширения

### Пользовательские Геометрии

```typescript
class CustomGeometry extends Geometry {
  render(context: CanvasRenderingContext2D): void {
    // Пользовательская логика рисования
  }
}
```

### Пользовательские Материалы

```typescript
class CustomMaterial extends Material {
  apply(context: CanvasRenderingContext2D): void {
    // Пользовательское применение стилей
  }
}
```

### Пользовательские Компоненты

```typescript
function CustomComponent(props) {
  return (
    <Mesh>
      <CustomGeometry {...props} />
      <CustomMaterial color={props.color} />
    </Mesh>
  )
}
```

## Стратегия Тестирования

### Модульные Тесты
- Отдельные методы классов
- Утилитарные функции
- Расчеты геометрии

### Интеграционные Тесты
- Рендеринг компонентов
- Движок верстки
- Поведение прокрутки
- Обработка событий

### Визуальные Тесты
- Сравнение скриншотов
- Валидация вывода canvas
- Кросс-браузерное тестирование

## Будущие Улучшения

### Запланированные Возможности
- WebGL бекенд для 3D
- GPU-ускоренные фильтры
- Продвинутая верстка текста
- Таймлайн анимации
- Распознавание жестов
- Поддержка касаний

### Цели Производительности
- 60 FPS для 1000+ объектов
- < 16мс время кадра
- < 100МБ использование памяти
- Поддержка ленивой загрузки

## Связанная Документация

- [Canvas JSX Utils README](./utils/README.md)
- [Canvas Core Renderers README](../core/renderers/README.md)
- [Canvas Core Styles README](../core/styles/README.md)
- [Mitosis Framework Generators](../../cli/mitosis/framework-generators/README.md)

## Глоссарий

- **Canvas**: HTML5 поверхность для 2D рисования
- **Scene Graph**: Древовидная структура отрисовываемых объектов
- **Mesh**: Комбинация геометрии и материала
- **Geometry**: Определение фигуры (что рисовать)
- **Material**: Определение стиля (как рисовать)
- **SolidJS**: Реактивная JavaScript библиотека
- **Yoga**: Движок flexbox верстки
- **Panda CSS**: Фреймворк системы дизайна
