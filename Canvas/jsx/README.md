# Pure JSX Canvas API

**Чистый JSX рендер без React зависимостей!** 🎨

Полноценная 2D Canvas библиотека с собственной реактивной системой и JSX поддержкой.

## ✨ Ключевые особенности

- 🚀 **Без React** - собственная реактивная система (signals)
- 🎯 **100% JSX** - полная поддержка JSX синтаксиса
- ⚡ **Реактивность** - автоматические обновления при изменении данных
- 🎪 **Анимации** - встроенные spring и tween анимации
- 🎨 **Three.js API** - знакомый API для 2D Canvas

## 🚀 Быстрый старт

```tsx
/** @jsx jsx */
import { jsx, render, signal, spring } from '@sky-modules/Canvas/jsx'

const position = signal([100, 100])
const scale = spring(1)

const App = (
  <canvas size={() => [800, 600]}>
    <scene background="#1a1a1a">
      <mesh position={position()} scale={[scale(), scale()]}>
        <circle radius={50} />
        <fill color="#ff6b6b" />
      </mesh>
    </scene>
  </canvas>
)

render(App, document.body)
```

## 🎯 Основные концепции

### Signals - Реактивные значения
```tsx
const count = signal(0)
const doubled = computed(() => count() * 2)

effect(() => {
  console.log('Count changed:', count())
})

count.set(5) // автоматически обновит все зависимости
```

### Spring анимации
```tsx
const target = signal(100)
const animated = spring(target, {
  tension: 200,
  friction: 20
})

// Плавно анимирует к новому значению
target.set(300)
```

### Tween анимации
```tsx
const [value, controls] = tween(0, 100, {
  duration: 1000,
  easing: easing.easeInOut
})

controls.start()
```

## 🎨 JSX Элементы

### Canvas
```tsx
<canvas
  size={() => [800, 600]}
  pixelRatio={2}
  onMouseMove={(e) => handleMouse(e)}
>
  {/* содержимое */}
</canvas>
```

### Scene
```tsx
<scene background="#1a1a1a">
  {/* объекты */}
</scene>
```

### Mesh
```tsx
<mesh
  position={[x, y]}
  rotation={angle}
  scale={[sx, sy]}
  onClick={handleClick}
>
  <circle radius={50} />
  <fill color="#ff6b6b" />
</mesh>
```

### Группы
```tsx
<group position={[400, 300]} rotation={angle}>
  <mesh position={[0, 0]}>...</mesh>
  <mesh position={[100, 0]}>...</mesh>
</group>
```

## 🔧 Геометрия

```tsx
{/* Прямоугольник */}
<rect width={100} height={50} />

{/* Круг */}
<circle radius={25} />

{/* Эллипс */}
<ellipse radiusX={50} radiusY={25} />
```

## 🎨 Материалы

```tsx
{/* Заливка */}
<fill color="#ff6b6b" opacity={0.8} />

{/* Обводка */}
<stroke color="#000" lineWidth={2} />

{/* Градиент */}
<gradient
  type="linear"
  x0={0} y0={0} x1={100} y1={0}
  stops={[
    { offset: 0, color: '#ff6b6b' },
    { offset: 1, color: '#4ecdc4' }
  ]}
/>
```

## 🎪 Примеры

Полные рабочие примеры смотри в `examples.tsx`:

1. **BasicExample** - простой рендер
2. **InteractiveExample** - интерактивность с мышью
3. **GroupAnimationExample** - групповые анимации
4. **TweenExample** - сложные переходы
5. **PhysicsExample** - физическая симуляция
6. **CompositionExample** - композиция компонентов

## 🔥 Преимущества

- ✅ **Легковесность** - никаких тяжелых зависимостей
- ✅ **Производительность** - оптимизированный рендеринг
- ✅ **Простота** - знакомый JSX синтаксис
- ✅ **Гибкость** - полный контроль над рендерингом
- ✅ **Типизация** - полная поддержка TypeScript

Идеально для создания интерактивной 2D графики! 🚀