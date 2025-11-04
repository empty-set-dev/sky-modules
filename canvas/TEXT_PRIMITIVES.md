# Text and Primitive Type Support in Canvas JSX

Canvas JSX теперь поддерживает рендеринг примитивных типов данных (строки, числа, boolean) прямо в JSX, как в React!

## Возможности

### 1. Автоматический рендеринг текста

Вы можете использовать строки, числа и boolean значения прямо в JSX:

```jsx
<Scene>
    <Mesh position={[50, 50]}>
        {"Hello World"}
    </Mesh>
    <Mesh position={[50, 100]}>
        {42}
    </Mesh>
    <Mesh position={[50, 150]}>
        {true}
    </Mesh>
</Scene>
```

### 2. TextGeometry компонент

Для более точного контроля над текстом используйте `TextGeometry`:

```jsx
<Mesh position={[50, 50]}>
    <TextGeometry
        text="Hello World"
        fontSize={32}
        fontFamily="Arial"
        fontWeight="bold"
        fontStyle="italic"
        textAlign="center"
        textBaseline="middle"
    />
    <BasicMaterial color="#4A90E2" />
</Mesh>
```

### 3. Реактивный текст с Solid.js

Текст автоматически обновляется при изменении сигналов:

```jsx
import { createSignal } from 'solid-js'

const [count, setCount] = createSignal(0)

renderer.render(() => (
    <Scene>
        <Mesh position={[50, 50]}>
            <TextGeometry text={`Count: ${count()}`} fontSize={32} />
            <BasicMaterial color="#333" />
        </Mesh>
    </Scene>
))

setInterval(() => setCount(c => c + 1), 1000)
```

### 4. Смешанный контент

Комбинируйте примитивы с геометрией и компонентами:

```jsx
<Scene>
    <Mesh position={[50, 50]}>
        <RectGeometry width={200} height={60} />
        <BasicMaterial color="#4A90E2" />
    </Mesh>
    <Mesh position={[60, 65]}>
        {"Score: "}
    </Mesh>
    <Mesh position={[120, 65]}>
        {9000}
    </Mesh>
</Scene>
```

## TextGeometry Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | `""` | Текст для отображения |
| `x` | `number` | `0` | Смещение по X |
| `y` | `number` | `0` | Смещение по Y |
| `fontSize` | `number` | `16` | Размер шрифта в пикселях |
| `fontFamily` | `string` | `"sans-serif"` | Семейство шрифтов |
| `fontWeight` | `string \| number` | `"normal"` | Жирность шрифта |
| `fontStyle` | `string` | `"normal"` | Стиль шрифта (normal, italic, oblique) |
| `textAlign` | `CanvasTextAlign` | `"left"` | Выравнивание текста |
| `textBaseline` | `CanvasTextBaseline` | `"top"` | Базовая линия текста |
| `maxWidth` | `number` | `undefined` | Максимальная ширина текста |

## Примеры использования

### Базовый текст
```jsx
<Mesh position={[50, 50]}>{"Hello!"}</Mesh>
```

### Число
```jsx
<Mesh position={[50, 50]}>{Math.PI}</Mesh>
```

### Boolean
```jsx
<Mesh position={[50, 50]}>{true}</Mesh>
```

### С кастомным стилем
```jsx
<Mesh position={[50, 50]}>
    <TextGeometry
        text="Custom Text"
        fontSize={48}
        fontWeight="bold"
        fontFamily="Georgia"
    />
    <BasicMaterial color="#E74C3C" />
</Mesh>
```

### Функции, возвращающие примитивы
```jsx
<Mesh position={[50, 50]}>
    {() => "Dynamic text"}
</Mesh>
```

## Материалы для текста

TextGeometry работает с любым материалом, который поддерживает заливку:

- `BasicMaterial` - базовая заливка цветом
- `GradientMaterial` - градиентная заливка
- `PatternMaterial` - заливка паттерном

## Примечания

1. При автоматическом рендеринге примитивов (без явного TextGeometry) используются дефолтные значения:
   - fontSize: 16px
   - fontFamily: sans-serif
   - color: #000000 (черный)

2. Boolean значения конвертируются в строки "true" и "false"

3. Null и undefined игнорируются (не рендерятся)

4. Текст рендерится с помощью `ctx.fillText()`, поэтому учитывайте особенности Canvas API

## Файлы

- `canvas/geometries/TextGeometry.ts` - класс геометрии текста
- `canvas/jsx.tsx` - обновлен для поддержки примитивов
- `canvas/jsx.primitives.spec.ts` - тесты
- `canvas/jsx.primitives.example.ts` - примеры использования
- `canvas/jsx.text-primitives.demo.html` - визуальная демонстрация
