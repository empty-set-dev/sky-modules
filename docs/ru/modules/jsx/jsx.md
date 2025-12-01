# jsx

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Jsx utility module
</div>

Универсальная среда выполнения JSX, обеспечивающая кроссфреймворковую разработку компонентов с реактивностью Solid.js.

## Установка

```bash
npm install sky-jsx
```

## Возможности

- **Универсальная среда выполнения JSX** - Платформо-независимый JSX, работающий с любым рендерером
- **Реактивность Solid.js** - Полный доступ к реактивным примитивам Solid.js (createSignal, createEffect и др.)
- **Кроссфреймворковая поддержка** - Работает с Canvas, Three.js, нативным UI или пользовательскими рендерерами
- **Пользовательский рендерер** - Построен на универсальном API рендерера Solid.js
- **Интеграция с Mitosis** - Хук useController для управления внешним состоянием
- **Нулевая зависимость от DOM** - Создает JSX объекты, а не DOM узлы
- **Поддержка TypeScript** - Полные определения типов

## Использование

### Базовый реактивный компонент

```typescript
import { createSignal } from 'sky-jsx/jsx-universal'

function Counter() {
    const [count, setCount] = createSignal(0)

    return (
        <div>
            <text>Счет: {count()}</text>
            <button onClick={() => setCount(count() + 1)}>
                Увеличить
            </button>
        </div>
    )
}
```

### С рендерером Canvas

```typescript
import { createSignal, createEffect } from 'sky-jsx/jsx-universal'
import { CanvasRenderer } from '@sky-modules/canvas'

function AnimatedCircle() {
    const [radius, setRadius] = createSignal(50)

    createEffect(() => {
        console.log('Радиус изменился:', radius())
    })

    return (
        <circle
            x={200}
            y={200}
            radius={radius()}
            fill="red"
            onClick={() => setRadius(radius() + 10)}
        />
    )
}

const renderer = new CanvasRenderer()
renderer.render(<AnimatedCircle />)
```

### Управление реактивным состоянием

```typescript
import {
    createSignal,
    createEffect,
    createMemo,
    batch
} from 'sky-jsx/jsx-universal'

function TodoList() {
    const [todos, setTodos] = createSignal([])
    const [filter, setFilter] = createSignal('all')

    // Вычисляемое значение
    const filteredTodos = createMemo(() => {
        const list = todos()
        const f = filter()

        if (f === 'completed') return list.filter(t => t.done)
        if (f === 'active') return list.filter(t => !t.done)
        return list
    })

    // Эффект выполняется при изменении зависимостей
    createEffect(() => {
        console.log('Отфильтрованные задачи:', filteredTodos().length)
    })

    const addTodo = (text) => {
        // Группировка множественных обновлений
        batch(() => {
            setTodos([...todos(), { text, done: false }])
            setFilter('all')
        })
    }

    return (
        <div>
            {filteredTodos().map(todo => (
                <div>{todo.text}</div>
            ))}
        </div>
    )
}
```

### Использование хука useController

```typescript
import useController from 'sky-jsx/useController'
import { onMount } from '@builder.io/mitosis'

// Контроллер с паттерном onChange/dispose
class CanvasController {
    width = 800
    height = 600

    private listeners = []

    onChange(callback) {
        this.listeners.push(callback)
    }

    resize(width, height) {
        this.width = width
        this.height = height
        this.listeners.forEach(fn => fn())
    }

    dispose() {
        this.listeners = []
    }
}

// Использование в Mitosis компоненте
function CanvasComponent() {
    const [controller, setController] = useController()

    onMount(() => {
        const ctrl = new CanvasController()
        setController(ctrl)

        window.addEventListener('resize', () => {
            ctrl.resize(window.innerWidth, window.innerHeight)
        })
    })

    return (
        <div>
            Canvas: {controller?.width} x {controller?.height}
        </div>
    )
}
```

### Context API

```typescript
import { createContext, useContext } from 'sky-jsx/jsx-universal'

const ThemeContext = createContext('light')

function ThemedComponent() {
    const theme = useContext(ThemeContext)

    return (
        <div>
            Текущая тема: {theme}
        </div>
    )
}

function App() {
    return (
        <ThemeContext.Provider value="dark">
            <ThemedComponent />
        </ThemeContext.Provider>
    )
}
```

### Классовые компоненты

```typescript
import JSX from 'sky-jsx'

class MyComponent implements JSX.Component {
    props: { name: string }

    constructor(props: { name: string }) {
        this.props = props
    }

    render(): JSX.Element {
        return <div>Привет {this.props.name}</div>
    }
}

// Классовые компоненты поддерживаются jsx-universal рендерером
<MyComponent name="Мир" />
```

## API

### jsx-universal.ts

Основной модуль универсального рендерера на основе Solid.js.

**Экспорты:**
- `render` - Рендер JSX в контейнер
- `createComponent` - Создание экземпляров компонентов
- `createElement` - Создание JSX элементов
- `createSignal` - Реактивное состояние
- `createEffect` - Побочные эффекты
- `createMemo` - Вычисляемые значения
- `createRoot` - Корневая область реактивности
- `onMount` - Жизненный цикл монтирования
- `onCleanup` - Жизненный цикл очистки
- `batch` - Группировка обновлений
- `untrack` - Отключение реактивности
- `on` - Явные зависимости
- `createContext` - Провайдер/потребитель контекста
- `useContext` - Доступ к контексту
- `Fragment` - Фрагмент элемент

**Возможности:**
- Пользовательский рендерер Solid.js, создающий JSX объекты вместо DOM
- Обрабатывает функциональные и классовые компоненты
- Сохраняет реактивность через функции-геттеры
- Совместим с любым последующим рендерером

### JSX.ts

Определения типов и реэкспорты примитивов Solid.js.

**Экспорты:**
- Все реактивные примитивы Solid.js из `solid-js`
- Определения типов JSX

**Типы:**
- `JSX.FC<P>` - Тип функционального компонента
- `JSX.ComponentClass<P>` - Тип классового компонента
- `JSX.Component<P>` - Интерфейс экземпляра компонента
- `JSX.Node` - Допустимые дочерние элементы JSX
- `JSX.Element` - Объект JSX элемента
- `JSX.Return` - Тип возврата компонента

### jsx-runtime.ts

Среда выполнения трансформации JSX для продакшена.

**Экспорты:**
- `jsx(type, props)` - Создание JSX элемента
- `Fragment` - Тип элемента Fragment

**Использование:**
Настройте TypeScript для использования этой среды выполнения:
```json
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "sky-jsx"
    }
}
```

### jsx-dev-runtime.ts

Среда выполнения трансформации JSX для разработки.

**Экспорты:**
- `jsxDEV(type, props)` - Создание JSX элемента с информацией для разработки
- `Fragment` - Тип элемента Fragment

**Использование:**
Автоматически используется в режиме разработки при настройке `jsxImportSource`.

### useController

Mitosis хук для управления жизненным циклом контроллера.

**Интерфейс:**
```typescript
interface Controller {
    onChange(callback: () => void): void
    dispose(): void | PromiseLike<void>
}

function useController<T extends Controller>(): [
    controller: T | null,
    setController: (controller: T) => void
]
```

**Возможности:**
- Автоматически регистрирует колбэк изменений при монтировании
- Автоматически освобождает контроллер при размонтировании
- Инициирует повторный рендер компонента при изменении контроллера
- Совместим с любым контроллером, реализующим интерфейс

**Пример:**
```typescript
import useController, { Controller } from 'sky-jsx/useController'

class MyController implements Controller {
    private changeCallbacks = []

    onChange(callback: () => void) {
        this.changeCallbacks.push(callback)
    }

    notifyChange() {
        this.changeCallbacks.forEach(cb => cb())
    }

    dispose() {
        this.changeCallbacks = []
    }
}

function Component() {
    const [ctrl, setCtrl] = useController<MyController>()

    onMount(() => {
        setCtrl(new MyController())
    })

    return <div>Контроллер: {ctrl ? 'готов' : 'не готов'}</div>
}
```

## Файлы

### jsx-universal.ts
**Назначение:** Пользовательский универсальный рендерер Solid.js
**Основные экспорты:**
- `createComponent` - Создание экземпляров компонентов
- `render`, `effect`, `memo` - Утилиты рендеринга
- `createElement`, `createTextNode` - Создание элементов
- `insertNode`, `removeNode` - DOM-подобные операции
- Все реактивные примитивы Solid.js

**Возможности:**
- Создает JSX объекты вместо DOM узлов
- Различает классовые и функциональные компоненты
- Сохраняет реактивные геттеры от babel-preset-solid
- Предоставляет минимальный DOM-подобный API для рендерера Solid.js

### JSX.ts
**Назначение:** Определения типов и реэкспорты Solid.js
**Экспорты:**
- Пространство имен JSX с типами компонентов
- Все экспорты Solid.js для реактивных примитивов

### jsx-runtime.ts
**Назначение:** Трансформация JSX для продакшена
**Экспорты:**
- Функция `jsx()` для создания JSX элементов
- `Fragment` для поддержки фрагментов

### jsx-dev-runtime.ts
**Назначение:** Трансформация JSX для разработки
**Экспорты:**
- Функция `jsxDEV()` с функциями разработки
- `Fragment` для поддержки фрагментов

### useController/useController.lite.ts
**Назначение:** Mitosis хук для управления контроллером
**Экспорты:**
- Хук `useController<T>()`
- Интерфейс `Controller`

**Возможности:**
- Автоматическая регистрация onChange
- Автоматическое освобождение
- Инициация повторного рендера компонента
- Совместимость с компиляцией Mitosis

## Связанные модули

- [@sky-modules/canvas](/canvas) - 2D рендерер canvas, использующий эту JSX среду выполнения
- [@sky-modules/three](/three) - 3D рендерер Three.js
- [@sky-modules/react](/react) - Утилиты интеграции с React

## Примечания по реализации

### Почему Solid.js?

Solid.js был выбран для универсальной JSX среды выполнения потому что:

1. **Истинная реактивность** - Детальная реактивность без виртуального DOM
2. **API универсального рендерера** - Встроенная поддержка пользовательских рендеров
3. **Оптимизации времени компиляции** - babel-preset-solid оборачивает реактивные пропы в геттеры
4. **Малый размер** - Минимальные накладные расходы среды выполнения
5. **Знакомый API** - Похож на React хуки
6. **Поддержка TypeScript** - Отличные определения типов

### Архитектура

```
Синтаксис JSX
    ↓ (Трансформация Babel/TypeScript)
Вызовы jsx() / jsxDEV()
    ↓ (Создание JSX объектов)
{type, props, children}
    ↓ (Универсальный рендерер Solid.js)
Операции пользовательского рендерера
    ↓ (Canvas/Three/Пользовательский рендерер)
Фактический рендеринг
```

### Модель реактивности

Solid.js использует модель детальной реактивности:

1. **Сигналы** - Реактивное состояние (`createSignal`)
2. **Эффекты** - Побочные эффекты, выполняющиеся при изменении зависимостей (`createEffect`)
3. **Мемо** - Кэшированные вычисляемые значения (`createMemo`)
4. **Отслеживание** - Автоматическое отслеживание зависимостей
5. **Группировка** - Группировка обновлений для минимизации повторных рендеров

```typescript
const [count, setCount] = createSignal(0)

// Эффект автоматически отслеживает использование count()
createEffect(() => {
    console.log('Счет:', count())
})

// Мемо автоматически отслеживает и кэширует результат
const doubled = createMemo(() => count() * 2)

// Обновление запускает эффект и мемо
setCount(5) // Выводит: "Счет: 5", doubled() === 10
```

### Интеграция рендерера

Для использования этой JSX среды выполнения с пользовательским рендерером:

1. **Принимайте JSX элементы** - Ваш рендерер получает объекты `{type, props, children}`
2. **Обрабатывайте реактивные пропы** - Пропы могут быть функциями-геттерами, вызывайте их для получения значений
3. **Отслеживайте изменения** - Используйте эффекты Solid.js для повторного рендера при изменениях
4. **Создавайте элементы** - Конвертируйте JSX элементы в ваш целевой формат

Пример:
```typescript
class CustomRenderer {
    render(element: JSX.Element) {
        const { type, props } = element

        // Пропы могут быть реактивными геттерами
        const getValue = (prop) => {
            return typeof prop === 'function' ? prop() : prop
        }

        // Используйте эффект для отслеживания изменений
        createEffect(() => {
            const x = getValue(props.x)
            const y = getValue(props.y)
            // Рендер с текущими значениями
            this.drawElement(type, x, y)
        })
    }
}
```

### Классовые vs функциональные компоненты

Рендерер различает классовые и функциональные компоненты:

```typescript
// Функциональный компонент - вызывается напрямую
function Func(props) {
    return <div>{props.name}</div>
}

// Классовый компонент - создается экземпляр с 'new'
class Class {
    constructor(props) {
        this.props = props
    }
    render() {
        return <div>{this.props.name}</div>
    }
}

// Рендерер обрабатывает оба:
// Func(props) vs new Class(props)
```

### Паттерн useController

Хук useController реализует общий паттерн для внешнего состояния:

1. **Контроллер** - Внешний объект с состоянием (Canvas, сцена Three.js и др.)
2. **onChange** - Уведомление при изменении состояния контроллера
3. **dispose** - Очистка при размонтировании компонента
4. **Повторный рендер компонента** - Инициация обновления UI при изменении

Этот паттерн связывает императивные контроллеры с реактивными UI компонентами.

### Лучшие практики

```typescript
// Хорошо - использование сигналов для реактивного состояния
const [count, setCount] = createSignal(0)

// Плохо - обычные переменные не реактивны
let count = 0

// Хорошо - использование createMemo для вычисляемых значений
const doubled = createMemo(() => count() * 2)

// Плохо - пересчет при каждом доступе
const doubled = () => count() * 2

// Хорошо - группировка связанных обновлений
batch(() => {
    setCount(5)
    setName('Алиса')
    setEnabled(true)
})

// Плохо - множественные отдельные обновления
setCount(5)
setName('Алиса')
setEnabled(true)

// Хорошо - использование untrack для предотвращения зависимостей
createEffect(() => {
    console.log('Счет:', count())
    // untrack предотвращает отслеживание other()
    console.log('Другое:', untrack(other))
})

// Хорошо - явные зависимости с on()
createEffect(on(count, () => {
    console.log('Счет изменился')
}))
```

### Советы по производительности

1. **Используйте createMemo** - Кэшируйте дорогие вычисления
2. **Группируйте обновления** - Группируйте изменения состояния для уменьшения эффектов
3. **Используйте on()** - Делайте зависимости эффектов явными
4. **Избегайте ненужных эффектов** - Используйте производное состояние с мемо вместо этого
5. **Используйте untrack когда уместно** - Предотвращайте нежелательное отслеживание зависимостей

### Ограничения

1. **Нет автоматического DOM рендеринга** - Требуется пользовательский рендерер
2. **Специфика Solid.js** - Привязан к модели реактивности Solid.js
3. **Необходим Babel пресет** - Для оптимальной реактивности нужен babel-preset-solid
4. **Кривая обучения** - Отличается от ментальной модели React
