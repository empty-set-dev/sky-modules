# Canvas Module - 2D Graphics Library

Полнофункциональная 2D графическая библиотека в стиле Three.js с двумя JSX API.

## 🎨 Структура модуля

### Core API (основные классы)
- **Canvas** - рендерер (аналог WebGLRenderer)
- **Scene** - сцена для объектов
- **Object2D** - базовый класс объектов (аналог Object3D)
- **Mesh** - объекты с геометрией и материалом
- **Group** - группировка объектов
- **Matrix3** - 2D трансформации
- **Quaternion** - продвинутые повороты
- **Raycaster** - пересечения и клики

### Геометрия
- **RectGeometry** - прямоугольники
- **CircleGeometry** - круги
- **EllipseGeometry** - эллипсы
- **PathGeometry** - кастомные пути

### Материалы
- **BasicMaterial** - заливка цветом
- **StrokeMaterial** - обводка
- **FillStrokeMaterial** - заливка + обводка
- **GradientMaterial** - градиенты
- **PatternMaterial** - паттерны

## 🚀 Два JSX API

### 1. React JSX API (`Canvas/JSX`)
Для React приложений с полной интеграцией:

```tsx
import { Canvas, Scene, Mesh, useFrame, useSpring } from '@sky-modules/Canvas/JSX'

const App = () => (
  <Canvas dep={dep} size={() => [800, 600]}>
    <Scene background="#000">
      <AnimatedMesh />
    </Scene>
  </Canvas>
)
```

### 2. Pure JSX API (`Canvas/PureJSX`)
**Без React зависимостей!** Собственная реактивная система:

```tsx
import { render, Canvas, Scene, Mesh, createSignal } from '@sky-modules/Canvas/PureJSX'

const counter = createSignal(0)

const app = (
  <Canvas dep={dep} size={() => [800, 600]}>
    <Scene background="#000">
      <Mesh position={[counter.value * 10, 100]} />
    </Scene>
  </Canvas>
)

render(app, document.body)
```

## ✨ Возможности

### Анимации
```tsx
// React version
const [scale] = useSpring(hovered ? 1.2 : 1)

// Pure JSX version
const scale = createSpring(target, { tension: 200 })
```

### Интерактивность
```tsx
<Mesh
  onClick={handleClick}
  onPointerMove={handleHover}
  position={[x, y]}
  rotation={rotation}
/>
```

### Трансформации
```tsx
// Все методы Three.js
mesh.translateX(10)
mesh.rotateZ(Math.PI/4)
mesh.lookAt(mouseX, mouseY)
mesh.setScale(2, 2)
```

### Матрицы и продвинутые трансформации
```tsx
const matrix = new Matrix3().makeRotation(angle)
mesh.applyMatrix3(matrix)

mesh.quaternion.setFromRotationZ(angle)
mesh.updateMatrixWorld()
```

### Raycasting
```tsx
const raycaster = new Raycaster()
const intersects = raycaster.intersectObjects([mesh])
```

## 🎯 Использование

### Core API (без JSX)
```tsx
const canvas = new Canvas(dep, { size: () => [800, 600] })
const scene = new Scene(dep)
const mesh = new Mesh(dep, geometry, material)

scene.add(mesh)
canvas.render(scene)
```

### React JSX
```tsx
import { Canvas, Scene, Mesh } from '@sky-modules/Canvas/JSX'

<Canvas dep={dep}>
  <Scene>
    <Mesh geometry={geometry} material={material} />
  </Scene>
</Canvas>
```

### Pure JSX (без React)
```tsx
import { render, Canvas } from '@sky-modules/Canvas/PureJSX'

render(
  <Canvas dep={dep}>
    <Scene>
      <Mesh />
    </Scene>
  </Canvas>,
  container
)
```

## 🌟 Преимущества

- ✅ **100% совместимость с Three.js API**
- ✅ **Два JSX варианта** - с React и без
- ✅ **Полная типизация TypeScript**
- ✅ **Матрицы и quaternion поддержка**
- ✅ **Встроенные анимации** (spring, tween)
- ✅ **Raycasting и события**
- ✅ **Иерархия объектов**
- ✅ **Pixel-perfect рендеринг**

Универсальное решение для 2D Canvas графики! 🎨