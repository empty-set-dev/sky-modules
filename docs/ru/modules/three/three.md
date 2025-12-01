# three

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Three utility module
</div>

<PlaygroundLink id="three" label="Открыть Three Playground" />


Модуль 3D рендеринга Three.js с поддержкой JSX для декларативного создания сцен.

## Установка

```bash
npm install @sky-modules/three
```

## Возможности

- **Синтаксис JSX** - Декларативное создание сцен Three.js с React-подобным JSX
- **ThreeJSXRenderer** - Полноценный рендерер с циклом анимации и управлением
- **Автоматическая настройка WebGL** - Не требуется ручная конфигурация рендерера
- **Управление мышью** - Встроенное орбитальное управление камерой
- **Цикл анимации** - Автоматическое управление requestAnimationFrame
- **Колбэки обновления** - Хуки обновления для каждого объекта для анимаций
- **Поддержка теней** - Встроенная конфигурация карт теней
- **Адаптивность** - Автоматическая обработка изменения размера окна

## Использование

### Базовая сцена

```typescript
import { ThreeJSXRenderer } from '@sky-modules/three/jsx'

const renderer = new ThreeJSXRenderer()

renderer.render(
    <scene background={0x111111}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={0x00ff00} />
        </mesh>
    </scene>
)
```

### Анимированные объекты

```typescript
renderer.render(
    <scene>
        <mesh
            position={[0, 0, 0]}
            onUpdate={(mesh, time, delta) => {
                // time: прошедшее время в секундах
                // delta: время с последнего кадра
                mesh.rotation.x = time
                mesh.rotation.y = time * 0.5
            }}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={0xff0000} />
        </mesh>
    </scene>
)
```

### Пользовательская камера

```typescript
renderer.render(
    <>
        <camera
            position={[10, 10, 10]}
            fov={60}
            lookAt={[0, 0, 0]}
        />
        <scene>
            {/* содержимое сцены */}
        </scene>
    </>
)
```

### Сложная сцена

```typescript
renderer.render(
    <scene background={0x222222} fog={{ color: 0x222222, near: 10, far: 50 }}>
        {/* Освещение */}
        <ambientLight color={0x404040} intensity={0.5} />
        <directionalLight
            position={[5, 10, 5]}
            intensity={1}
            castShadow={true}
        />
        <pointLight
            position={[-5, 5, -5]}
            color={0xff0000}
            intensity={0.5}
            distance={20}
            decay={2}
        />

        {/* Объекты */}
        <group position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
            <mesh position={[-2, 0, 0]} castShadow={true}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial
                    color={0x00ff00}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>

            <mesh position={[2, 0, 0]} castShadow={true}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshPhysicalMaterial
                    color={0x0000ff}
                    transmission={0.9}
                    thickness={1}
                    roughness={0.1}
                />
            </mesh>
        </group>

        {/* Плоскость земли */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color={0x808080} />
        </mesh>

        {/* Сетка */}
        <gridHelper />
    </scene>
)
```

### Линии и фигуры

```typescript
renderer.render(
    <scene>
        {/* Простая линия */}
        <line
            points={[
                [0, 0, 0],
                [1, 1, 0],
                [2, 0, 0]
            ]}
            color={0xff0000}
            linewidth={2}
        />

        {/* Замкнутая линия */}
        <lineLoop
            points={[
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]}
            color={0x00ff00}
        />

        {/* Сегменты линий */}
        <lineSegments
            points={[
                [0, 0, 0], [1, 1, 1],
                [2, 0, 0], [3, 1, 1]
            ]}
            color={0x0000ff}
        />
    </scene>
)
```

### Управление жизненным циклом

```typescript
const renderer = new ThreeJSXRenderer(document.getElementById('container'))

// Рендеринг автоматический, но можно контролировать цикл анимации
renderer.stop()  // Остановить рендеринг
renderer.start() // Возобновить рендеринг

// Очистка при завершении работы
renderer.dispose() // Остановить анимацию, очистить сцену, освободить WebGL ресурсы
```

## API

### ThreeJSXRenderer

Основной класс рендерера для JSX-сцен Three.js.

**Конструктор:**
```typescript
new ThreeJSXRenderer(container?: HTMLElement)
```
- `container` - HTML элемент для монтирования canvas (по умолчанию: document.body)

**Свойства:**
- `scene: Three.Scene` - Сцена Three.js
- `camera: Three.PerspectiveCamera` - Камера
- `renderer: Three.WebGLRenderer` - WebGL рендерер
- `clock: Three.Clock` - Часы для синхронизации анимации

**Методы:**

#### `render(element: JSX.Element | JSX.Element[])`
Рендерит JSX элементы в сцену Three.js.

```typescript
renderer.render(<scene>...</scene>)
```

#### `start()`
Запускает цикл анимации. Вызывается автоматически в конструкторе.

#### `stop()`
Останавливает цикл анимации для экономии CPU/GPU ресурсов.

#### `dispose()`
Очищает все ресурсы (сцену, рендерер, обработчики событий).

### JSX Элементы

#### `<scene>`
Корневой контейнер сцены.

**Свойства:**
- `background?: string | number` - Цвет фона сцены
- `fog?: { color?: string | number; near?: number; far?: number }` - Туман сцены

#### `<camera>`
Конфигурация камеры.

**Свойства:**
- `position?: [number, number, number]` - Позиция камеры
- `rotation?: [number, number, number]` - Вращение камеры
- `fov?: number` - Поле зрения
- `aspect?: number` - Соотношение сторон
- `near?: number` - Ближняя плоскость отсечения
- `far?: number` - Дальняя плоскость отсечения
- `lookAt?: [number, number, number]` - Точка, на которую смотреть

#### `<mesh>`
3D объект mesh.

**Свойства:**
- `position?: [number, number, number]` - Позиция объекта
- `rotation?: [number, number, number]` - Вращение объекта (в радианах)
- `scale?: [number, number, number]` - Масштаб объекта
- `castShadow?: boolean` - Отбрасывать тени
- `receiveShadow?: boolean` - Принимать тени
- `visible?: boolean` - Видимость
- `userData?: any` - Пользовательские данные
- `onUpdate?: (mesh: Three.Mesh, time: number, delta: number) => void` - Колбэк анимации

**Дочерние элементы:** Должны включать одну геометрию и один материал

#### `<group>`
Группировка объектов.

**Свойства:**
- `position?: [number, number, number]`
- `rotation?: [number, number, number]`
- `scale?: [number, number, number]`
- `visible?: boolean`

#### Освещение

**`<ambientLight>`**
- `color?: string | number` - Цвет света (по умолчанию: 0xffffff)
- `intensity?: number` - Интенсивность света (по умолчанию: 1)

**`<directionalLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `castShadow?: boolean` - Включить отбрасывание теней

**`<pointLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `distance?: number` - Максимальное расстояние света (0 = бесконечно)
- `decay?: number` - Скорость затухания света (по умолчанию: 2)

**`<spotLight>`**
- `color?: string | number`
- `intensity?: number`
- `position?: [number, number, number]`
- `target?: [number, number, number]` - Точка освещения
- `angle?: number` - Угол конуса света (по умолчанию: PI/3)
- `penumbra?: number` - Мягкость края света (0-1)
- `decay?: number`
- `distance?: number`

#### Геометрия

Все геометрии используют проп `args` для аргументов конструктора.

**`<boxGeometry>`**
- `args?: [width?, height?, depth?, widthSegments?, heightSegments?, depthSegments?]`

**`<sphereGeometry>`**
- `args?: [radius?, widthSegments?, heightSegments?, phiStart?, phiLength?, thetaStart?, thetaLength?]`

**`<cylinderGeometry>`**
- `args?: [radiusTop?, radiusBottom?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]`

**`<planeGeometry>`**
- `args?: [width?, height?, widthSegments?, heightSegments?]`

**`<coneGeometry>`**
- `args?: [radius?, height?, radialSegments?, heightSegments?, openEnded?, thetaStart?, thetaLength?]`

**`<torusGeometry>`**
- `args?: [radius?, tube?, radialSegments?, tubularSegments?, arc?]`

#### Материалы

**`<meshBasicMaterial>`**
Неосвещенный материал.
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `side?: Three.Side`

**`<meshStandardMaterial>`**
Физически корректный материал (PBR).
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `metalness?: number` (0-1)
- `roughness?: number` (0-1)
- `emissive?: string | number`
- `emissiveIntensity?: number`
- `side?: Three.Side`

**`<meshPhongMaterial>`**
Глянцевый материал с зеркальными бликами.
- `color?: string | number`
- `opacity?: number`
- `transparent?: boolean`
- `wireframe?: boolean`
- `shininess?: number`
- `specular?: string | number`
- `side?: Three.Side`

**`<meshPhysicalMaterial>`**
Продвинутый PBR материал.
- Все свойства `meshStandardMaterial`, плюс:
- `clearcoat?: number` - Слой лака (0-1)
- `clearcoatRoughness?: number`
- `transmission?: number` - Прозрачность (0-1)
- `thickness?: number` - Толщина преломления
- `ior?: number` - Индекс преломления

#### Линии

**`<line>`** - Соединенные сегменты линий
**`<lineLoop>`** - Замкнутая линия
**`<lineSegments>`** - Несоединенные сегменты линий

**Свойства:**
- `points?: Array<[number, number, number]>` - Вершины линии
- `color?: string | number`
- `linewidth?: number` (примечание: может не работать на всех платформах)

#### Вспомогательные элементы

**`<gridHelper>`**
Рендерит сетку на земле (10x10 по умолчанию).

## Файлы

### jsx.tsx

**Назначение:** Основная реализация ThreeJSXRenderer
**Основные экспорты:**
- `ThreeJSXRenderer` - Основной класс рендерера

**Возможности:**
- Определения типов JSX элементов в глобальном пространстве имен
- Полный рендеринг сцены из JSX
- Цикл анимации с колбэками обновления
- Орбитальное управление мышью (перетаскивание для вращения, прокрутка для масштабирования)
- Автоматическая очистка ресурсов
- Поддержка карт теней
- Обработка изменения размера окна

**Архитектура:**
Рендерер следует паттерну виртуального DOM:
1. JSX элементы трансформируются в объекты с `type`, `props`, `children`
2. `render()` очищает предыдущую сцену и обрабатывает новые элементы
3. Элементы конвертируются в объекты Three.js и добавляются в граф сцены
4. Цикл анимации вызывает колбэки обновления и рендерит каждый кадр
5. `dispose()` очищает геометрии, материалы и рендерер

## Связанные модули

- [@sky-modules/math](/math) - Утилиты векторной и матричной математики
- [@sky-modules/canvas](/canvas) - 2D рендеринг canvas
- [@sky-modules/jsx](/jsx) - Универсальная среда выполнения JSX

## Примечания по реализации

### Управление

Встроенное управление мышью обеспечивает базовую функциональность орбитальной камеры:
- **Левая кнопка мыши + перетаскивание** - Вращение камеры вокруг начала координат
- **Колесико мыши** - Приближение/отдаление (масштабирование расстояния камеры)

Камера всегда смотрит на начало координат (0, 0, 0) по умолчанию.

### Производительность

Рендерер использует несколько оптимизаций:
- **Автоматическая очистка** - Геометрии и материалы освобождаются при очистке сцены
- **Колбэки обновления** - Только объекты с `onUpdate` отслеживаются
- **Единый цикл анимации** - Все обновления происходят в одном requestAnimationFrame
- **Кэширование карт теней** - Карты теней настраиваются один раз при инициализации

### Ограничения

1. **Пока нет поддержки текстур** - Материалы поддерживают только цвета, не текстурные карты
2. **Фиксированный размер карты теней** - 2048x2048, не настраивается
3. **Простое управление** - Нет затухания, панорамирования или продвинутых орбитальных функций
4. **Нет постобработки** - Нет блума, SSAO или других эффектов
5. **Статический JSX** - Нет автоматической реактивности, нужно снова вызывать `render()` для изменений

### Будущие улучшения

Возможные улучшения:
- Загрузка и управление текстурами
- Кастомная система управления
- Эффекты постобработки
- Поддержка инстансированного рендеринга
- Реактивный JSX с автоматическими обновлениями
- Прогресс загрузки и обработка ошибок
- Поддержка множественных сцен
- Поддержка VR/AR

### Лучшие практики

```typescript
// Хорошо - переиспользование рендерера
const renderer = new ThreeJSXRenderer()
function updateScene() {
    renderer.render(<scene>...</scene>)
}

// Плохо - создание нового рендерера каждый раз
function updateScene() {
    const renderer = new ThreeJSXRenderer() // Утечка памяти!
    renderer.render(<scene>...</scene>)
}

// Хорошо - использование onUpdate для анимаций
<mesh onUpdate={(mesh, time) => {
    mesh.rotation.y = time
}}>

// Плохо - мутирование объектов вне рендерера
const mesh = new Three.Mesh()
setInterval(() => {
    mesh.rotation.y += 0.01 // Не будет работать с JSX рендерером
}, 16)

// Хорошо - очистка при завершении
useEffect(() => {
    const renderer = new ThreeJSXRenderer()
    return () => renderer.dispose()
}, [])

// Плохо - забыть очистить
const renderer = new ThreeJSXRenderer()
// компонент размонтируется - утечка памяти!
```
