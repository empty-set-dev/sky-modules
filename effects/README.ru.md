# Модуль Effects

DOM эффекты, контроллеры ввода и утилитарные миксины для интерактивных приложений.

## Установка

```bash
npm install @sky-modules/effects
```

## Возможности

- **Контроллеры ввода**: WASD, мышь, камера, скроллинг по краям экрана
- **DOM эффекты**: Таймауты, интервалы, слушатели событий с автоочисткой
- **Умные утилиты**: Управление pointer lock, полноэкранным режимом
- **Миксины**: Паттерны для включения/выключения и контроля видимости
- **Жизненный цикл Effect**: Автоматическая очистка ресурсов при disposal

## Быстрый старт

```typescript
import WasdController2D from '@sky-modules/effects/controllers/WasdController2D'

const controller = new WasdController2D([effect], {
    force: () => playerSpeed,
    onChange: () => console.log('Ввод изменился')
})

const acceleration = controller.acceleration // Нормализованный 2D вектор
```

## Контроллеры

### WasdController2D

Клавиатурный контроллер для 2D движения с клавишами WASD.

```typescript
const wasd = new WasdController2D([effect], {
    force: () => 100,              // Множитель силы
    direction: () => cameraAngle,  // Смещение направления (радианы)
    onChange: () => updatePlayer()
})

// Получить нормализованный вектор ускорения
const accel = wasd.acceleration
player.velocity.add(accel.multiplyScalar(deltaTime))
```

### MouseController

Отслеживает позицию мыши в нормализованных координатах устройства (-1 до 1) для 3D приложений.

```typescript
const mouse = new MouseController([effect], {
    onUpdate: () => console.log('Мышь переместилась')
})

// Получить нормализованную позицию мыши
console.log(mouse.mouse) // Vector2(-1 до 1, -1 до 1)

// Проецировать в 3D мировое пространство
const worldPos = mouse.getCameraProjectionXY({
    camera: perspectiveCamera,
    z: 0 // Проецировать на плоскость z=0
})
```

### ThirdPersonCameraController

Орбитальный контроллер камеры для вида от третьего лица с управлением мышью.

```typescript
const camera = new ThirdPersonCameraController([effect], {
    camera: perspectiveCamera,
    getTarget: () => player.position,
    distance: () => 10,
    z: () => 2, // Смотреть на 2 единицы выше цели
    minAngle: () => -Math.PI / 4,
    maxAngle: () => Math.PI / 3,
    hasPointerLock: true
})

// Камера автоматически следует за целью и реагирует на мышь
```

### ScreenMoveController2D

Скроллинг по краям экрана для 2D камеры (в стиле RTS).

```typescript
const camera = new Vector2()
const edgeScroll = new ScreenMoveController2D([effect], { camera })

// Камера скроллится когда мышь у края
edgeScroll.enabled = true // Включить/выключить
```

## Умные утилиты

### SmartPointerLock

Автоматическое управление pointer lock с поддержкой повторной блокировки.

```typescript
const smartLock = new SmartPointerLock([effect])

// Пользователь кликает -> запрос pointer lock
// Пользователь нажимает ESC -> разблокировка, ожидание 2с для повторной блокировки
console.log(smartLock.isLocked) // Текущее состояние
```

### Timeout

Таймаут на основе Effect с автоочисткой.

```typescript
new Timeout([effect], () => {
    console.log('Выполнено через 1 секунду')
}, (1).seconds)
```

## DOM эффекты

Стандартные DOM эффекты с автоочисткой через систему Effect.

### Глобальные эффекты

```typescript
import '@sky-modules/effects/dom/standard-effects'

// Слушатель событий окна
new WindowEventListener('keydown', (ev) => {
    console.log('Нажата клавиша:', ev.key)
}, [effect])

// Слушатель событий документа
new DocumentEventListener('click', () => {
    console.log('Клик по документу')
}, [effect])

// Кадр анимации
new AnimationFrame(() => {
    console.log('Следующий кадр')
}, [effect])

// Непрерывные кадры анимации
new AnimationFrames(() => {
    render() // Вызывается каждый кадр
}, [effect])

// Интервал
new Interval(() => {
    console.log('Каждую секунду')
}, (1).seconds, [effect])

// Pointer lock
const pointerLock = new PointerLock([effect])
await pointerLock.whenLocked

// Полноэкранный режим
const fullscreen = new Fullscreen([effect])
await fullscreen.whenRequested
```

### Property эффект

Назначить значение с автоочисткой:

```typescript
await property(
    myObject,    // Значение для назначения
    target,      // Целевой объект
    'key',       // Ключ свойства
    [effect]     // Зависимость эффекта
)
```

### Array эффект

Добавить в массив с автоудалением:

```typescript
const items = []
inArray(item, items, [effect])
// Элемент удаляется при disposal эффекта
```

## Миксины

### EnabledMixin

Добавить функциональность включения/выключения к любому классу.

```typescript
import EnabledMixin from '@sky-modules/effects/mixins/EnabledMixin'

@mixin(EnabledMixin)
class MyController {
    readonly effect: Effect

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)
        EnabledMixin.super(this)
    }

    protected onUpdate(ev: Sky.UpdateEvent) {
        // Вызывается только когда включено
    }
}

const controller = new MyController([effect])
controller.enabled = false // Отключить обработку событий
```

### VisibilityMixin

Фильтровать события на основе видимости (для рендерабельных объектов).

```typescript
import { VisibilityMixin } from '@sky-modules/effects/mixins/VisibilityMixin'

@mixin(VisibilityMixin)
class MyRenderable {
    readonly effect: Effect

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)
        VisibilityMixin.super(this)
    }

    protected onRender() {
        // Вызывается только когда видимо
    }

    protected onUpdate(ev: Sky.UpdateEvent) {
        // Всегда вызывается (события update не фильтруются)
    }
}

const renderable = new MyRenderable([effect])
renderable.visible = false // Скрыть (пропустить события render)
```

## Примеры

### Полный игровой ввод

```typescript
import WasdController2D from '@sky-modules/effects/controllers/WasdController2D'
import MouseController from '@sky-modules/effects/controllers/MouseController'
import SmartPointerLock from '@sky-modules/effects/SmartPointerLock'

class GameInput {
    readonly effect: Effect
    wasd: WasdController2D
    mouse: MouseController
    pointerLock: SmartPointerLock

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        this.wasd = new WasdController2D([this.effect])
        this.mouse = new MouseController([this.effect])
        this.pointerLock = new SmartPointerLock([this.effect])
    }

    protected onUpdate(ev: Sky.UpdateEvent) {
        if (this.pointerLock.isLocked) {
            const movement = this.wasd.acceleration
            player.velocity.add(movement.multiplyScalar(ev.dt))
        }
    }
}
```

### Управление камерой RTS

```typescript
import ScreenMoveController2D from '@sky-modules/effects/controllers/ScreenMoveController2D'
import MouseController from '@sky-modules/effects/controllers/MouseController'

class RTSCamera {
    readonly effect: Effect
    position = new Vector2()
    edgeScroll: ScreenMoveController2D
    mouse: MouseController

    constructor(dep: EffectDep) {
        this.effect = new Effect(dep, this)

        this.edgeScroll = new ScreenMoveController2D([this.effect], {
            camera: this.position
        })

        this.mouse = new MouseController([this.effect])
    }

    getWorldPosition(): Vector2 {
        return this.mouse.getCameraProjectionXY({
            camera: orthographicCamera,
            z: 0
        })
    }
}
```

## Заметки об интеграции

### Система Effect

Все контроллеры и утилиты используют систему Effect из `@sky-modules/features/effect` для управления жизненным циклом.

### Автоматическая очистка

Когда эффект disposed, все связанные ресурсы автоматически очищаются:
- Слушатели событий удалены
- Таймауты/интервалы очищены
- Pointer lock освобожден
- Полноэкранный режим завершен

### Требования к контексту

Некоторые контроллеры требуют специфических контекстов:
- **MouseController**: Требует контекст `Sky.Renderer`
- **ThirdPersonCameraController**: Использует pointer lock если доступен

## Связанные модули

- **[@sky-modules/features/effect](../features/effect)** - Система эффектов
- **[@sky-modules/math/Vector2](../math/Vector2)** - 2D векторы
- **[@sky-modules/math/Vector3](../math/Vector3)** - 3D векторы
- **[@sky-modules/utilities/Time](../utilities/Time)** - Единицы времени

## Лицензия

MIT
