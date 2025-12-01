# Система эффектов

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  effect utility module
</div>

Иерархическая система управления жизненным циклом и зависимостями с автоматической очисткой. Создавайте сложные структуры приложений, где удаление родителя автоматически очищает всех потомков.

## Обзор

Система эффектов предоставляет:

- **Иерархические эффекты** - Отношения родитель-потомок с автоматическим распространением очистки
- **Внедрение контекста** - Внедрение зависимостей, которое распространяется вниз по дереву эффектов
- **Отслеживание зависимостей** - Отслеживание отношений между эффектами для скоординированного удаления
- **Управляемый событиями жизненный цикл** - Подключение к событиям жизненного цикла эффектов во всем дереве
- **Автоматическая очистка** - Функции очистки выполняются автоматически в правильном порядке

Это позволяет создавать сложные вложенные структуры (UI компоненты, игровые объекты, менеджеры ресурсов) с уверенностью, что очистка произойдет корректно.

## Установка

```bash
npm install @sky-modules/features
```

```typescript
import { Effect, EffectTree, EffectDep } from '@sky-modules/features/effect'
```

## Основные концепции

### EffectTree

Корень иерархии эффектов. Только EffectTree может существовать без родителя.

```typescript
class EffectTree extends EffectBase {
    // Отслеживание состояния ввода
    isLeftMousePressed: boolean
    isMiddleMousePressed: boolean
    isRightMousePressed: boolean
    isPressed: Record<string, boolean>
    gamepadStates: Record<number, Gamepad>

    // Методы настройки
    registerUpdateEvents(options): this
    registerMouseEvents(options): this
    registerEmitKeyboardEvents(before?, after?): this
    registerGamepadEvents(options?): this
    registerRenderEvents(options): this
    registerEmitWindowResize(options): this

    // Координация жизненного цикла
    commit(): void
}
```

**Ключевые возможности:**
- Служит корневой зависимостью для всех дочерних эффектов
- Управляет глобальным состоянием ввода (мышь, клавиатура, геймпад)
- Координирует циклы обновления/рендеринга через зарегистрированные события
- Группирует структурные изменения через commit()

### Effect

Узел в дереве эффектов с опциональным колбэком очистки.

```typescript
class Effect extends EffectBase {
    readonly root: EffectTree

    constructor(dep: EffectDep, host?: object)
    constructor(
        callback: () => () => Promise<void> | void,
        dep: EffectDep,
        host?: object
    )

    addParent(parent: EffectBase): this
    removeParent(parent: EffectBase): this
    isChildOf(parent: EffectBase): boolean

    addDep(dep: EffectDep): this
    removeDep(dep: EffectDep): this

    context<T>(Context: ContextConstructor): T | undefined
    addContext(context: object): this
}
```

**Ключевые возможности:**
- Может иметь несколько родителей (множественное владение)
- Опциональный колбэк возвращает функцию очистки
- Доступ к контекстам от родительских эффектов
- Автоматическое удаление при удалении последнего родителя

### EffectDep

Тип, определяющий допустимые зависимости эффектов:

```typescript
type EffectDep = EffectBase | [EffectBase, ContextConstructor]
```

Зависимости могут быть:
- Простым родительским эффектом
- Зависимостью с учетом контекста `[parent, ContextClass]`

### ContextConstructor

Тип для классов, которые могут использоваться как контексты:

```typescript
type ContextConstructor = {
    new (...args: any[]): any
    context: true
}
```

Классы должны иметь `static context = true` для возможности внедрения.

## Быстрый старт

### Базовый эффект с очисткой

```typescript
import { EffectTree, Effect } from '@sky-modules/features/effect'

// Создаем корень
const root = new EffectTree()

// Эффект с очисткой
const effect = new Effect(() => {
    console.log('Эффект запущен')

    const timer = setInterval(() => {
        console.log('Тик')
    }, 1000)

    // Возвращаем функцию очистки
    return () => {
        clearInterval(timer)
        console.log('Эффект очищен')
    }
}, root)

// Удаляем (очистка выполняется автоматически)
await effect.dispose()
// Вывод:
// Эффект запущен
// Тик
// Тик
// Эффект очищен
```

### Иерархия родитель-потомок

```typescript
const root = new EffectTree()

// Родительский эффект
const parent = new Effect(() => {
    console.log('Родитель инициализирован')
    return () => console.log('Родитель удален')
}, root)

// Дочерние эффекты
const child1 = new Effect(() => {
    console.log('Потомок 1 инициализирован')
    return () => console.log('Потомок 1 удален')
}, parent)

const child2 = new Effect(() => {
    console.log('Потомок 2 инициализирован')
    return () => console.log('Потомок 2 удален')
}, parent)

// Удаляем родителя (потомки удаляются автоматически)
await parent.dispose()
// Вывод:
// Потомок 1 удален
// Потомок 2 удален
// Родитель удален
```

## Внедрение контекста

Делитесь состоянием вниз по дереву эффектов:

```typescript
// Определяем класс контекста
class AppConfig {
    static context = true
    apiUrl: string = 'https://api.example.com'
    debugMode: boolean = false
}

class UserSession {
    static context = true
    userId: string = ''
    token: string = ''
}

// Создаем корень и добавляем контексты
const root = new EffectTree()
root.addContext(new AppConfig())
root.addContext(new UserSession())
root.commit()

// Доступ к контексту в эффектах
const apiClient = new Effect(root, {
    onAppConfigContext(config: AppConfig) {
        console.log(`API URL: ${config.apiUrl}`)
    },

    onUserSessionContext(session: UserSession) {
        console.log(`Пользователь: ${session.userId}`)
    }
})

// Или прямой доступ
const effect = new Effect(root)
const config = effect.context(AppConfig)
console.log(config?.apiUrl)
```

## Эффект с объектом-хозяином

Эффекты могут пересылать события жизненного цикла объекту-хозяину:

```typescript
class Component {
    effect: Effect

    constructor(parent: EffectDep) {
        // Передаем `this` как хозяина
        this.effect = new Effect(parent, this)
    }

    // Хуки жизненного цикла
    onUpdate(ev: Sky.UpdateEvent): void {
        console.log(`Обновление: ${ev.dt}`)
    }

    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log(`Мышь: ${ev.x}, ${ev.y}`)
    }
}

const root = new EffectTree().registerUpdateEvents({})
const component = new Component(root)
// Компонент получает события обновления и мыши
```

## Зависимости с учетом контекста

Создавайте эффекты, зависящие от определенных контекстов:

```typescript
class DatabaseContext {
    static context = true
    connection: Connection
}

const root = new EffectTree()
const db = new DatabaseContext()
root.addContext(db)
root.commit()

// Эффект зависит от контекста базы данных
const query = new Effect([root, DatabaseContext], {
    onDatabaseContextContext(db: DatabaseContext) {
        console.log('База данных доступна')

        // Настройка, требующая базу данных
        const subscription = db.connection.subscribe(data => {
            console.log('Данные:', data)
        })

        // Возвращаем очистку
        return () => {
            subscription.unsubscribe()
        }
    }
})
```

## Полный пример: Игровая сцена

```typescript
import { EffectTree, Effect } from '@sky-modules/features/effect'

// Контексты
class GameConfig {
    static context = true
    gravity: number = 9.8
    soundEnabled: boolean = true
}

class AssetManager {
    static context = true
    private assets = new Map<string, any>()

    load(name: string, asset: any): void {
        this.assets.set(name, asset)
    }

    get(name: string): any {
        return this.assets.get(name)
    }
}

// Создаем корневое дерево эффектов
const root = new EffectTree()
    .registerUpdateEvents({})
    .registerMouseEvents({})

// Добавляем контексты
const config = new GameConfig()
const assets = new AssetManager()
root.addContext(config)
root.addContext(assets)
root.commit()

// Эффект сцены
const scene = new Effect(() => {
    console.log('Сцена загружена')
    return () => console.log('Сцена выгружена')
}, root)

// Эффект камеры (потомок сцены)
class Camera {
    effect: Effect
    x: number = 0
    y: number = 0

    constructor(parent: EffectDep) {
        this.effect = new Effect(() => {
            console.log('Камера создана')
            return () => console.log('Камера уничтожена')
        }, parent, this)
    }

    onUpdate(ev: Sky.UpdateEvent): void {
        // Логика обновления камеры
    }
}

const camera = new Camera(scene)

// Эффект игрока (потомок сцены, использует контекст)
class Player {
    effect: Effect
    sprite: any

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    onAssetManagerContext(assets: AssetManager): void {
        // Загружаем спрайт игрока
        this.sprite = assets.get('player')
        console.log('Спрайт игрока загружен')
    }

    onGameConfigContext(config: GameConfig): void {
        console.log(`Гравитация: ${config.gravity}`)
    }

    onUpdate(ev: Sky.UpdateEvent): void {
        // Логика обновления игрока
    }

    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log(`Игрок видит клик в ${ev.x}, ${ev.y}`)
    }
}

const player = new Player(scene)

// Эффект врага (потомок сцены)
const enemy = new Effect(() => {
    console.log('Враг появился')

    const ai = setInterval(() => {
        console.log('ИИ врага думает...')
    }, 1000)

    return () => {
        clearInterval(ai)
        console.log('Враг уничтожен')
    }
}, scene)

// Удаляем всю сцену (очищает все)
await scene.dispose()
// Вывод:
// Враг уничтожен
// Спрайт игрока выгружен
// Камера уничтожена
// Сцена выгружена
```

## Отложенные операции с commit()

Структурные изменения (добавление/удаление родителей, зависимостей, контекстов) откладываются до commit():

```typescript
const root = new EffectTree()

const parent = new Effect(root)
const child = new Effect(parent)

// Ставим в очередь добавление контекста
root.addContext(new MyContext())
// Контекст еще не доступен

// Обрабатываем все операции в очереди
root.commit()
// Теперь контекст доступен во всех эффектах
```

**Почему отложенные?**
- Группировка операций для эффективности
- Гарантия согласованного состояния во время обновлений
- Предотвращение проблем от изменения структуры в процессе обновления

## Несколько родителей

Эффекты могут иметь несколько родителей (множественное владение):

```typescript
const root = new EffectTree()

const system1 = new Effect(root)
const system2 = new Effect(root)

// Эффект принадлежит обеим системам
const shared = new Effect(system1)
shared.addParent(system2)
root.commit()

// Удаляем одного родителя - эффект продолжает существовать
await system1.dispose()
console.log(shared.disposed) // false

// Удаляем последнего родителя - эффект удален
await system2.dispose()
console.log(shared.disposed) // true
```

## Хуки жизненного цикла

Эффекты могут реализовывать хуки жизненного цикла через объекты-хозяева:

```typescript
class GameObject {
    effect: Effect

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    // Вызывается, когда контекст становится доступным
    onMyContextContext(ctx: MyContext): Destructor | void {
        console.log('Контекст доступен')
        return () => console.log('Контекст удален')
    }

    // Цикл обновления
    onUpdate(ev: Sky.UpdateEvent): void {
        console.log('Обновление')
    }

    // Кадр анимации
    onAnimationFrame(ev: Sky.UpdateEvent): void {
        console.log('Рендеринг')
    }

    // События мыши
    onGlobalMouseDown(ev: { x: number, y: number }): void {
        console.log('Мышь нажата')
    }

    onGlobalMouseMove(ev: { x: number, y: number }): void {
        console.log('Мышь движется')
    }

    // События клавиатуры
    onGlobalKeyDown(ev: { code: string }): void {
        console.log('Клавиша нажата:', ev.code)
    }

    // События геймпада
    onGamepadButtonDown(ev: { gamepadIndex: number, buttonIndex: number }): void {
        console.log('Кнопка нажата')
    }
}
```

## Лучшие практики

### Используйте эффекты для управления ресурсами

```typescript
class ImageLoader {
    effect: Effect
    private image?: HTMLImageElement

    constructor(parent: EffectDep, url: string) {
        this.effect = new Effect(() => {
            // Получаем ресурс
            this.image = new Image()
            this.image.src = url

            // Возвращаем очистку
            return () => {
                this.image = undefined
                console.log('Изображение выгружено')
            }
        }, parent, this)
    }
}
```

### Контекст для внедрения зависимостей

```typescript
// Вместо ручной передачи зависимостей
class BadComponent {
    constructor(
        parent: EffectDep,
        api: ApiClient,
        config: Config,
        assets: AssetManager
    ) {
        // Слишком много параметров
    }
}

// Используйте внедрение контекста
class GoodComponent {
    effect: Effect

    constructor(parent: EffectDep) {
        this.effect = new Effect(parent, this)
    }

    onApiClientContext(api: ApiClient): void {
        // Используем api
    }

    onConfigContext(config: Config): void {
        // Используем config
    }

    onAssetManagerContext(assets: AssetManager): void {
        // Используем assets
    }
}
```

## Интеграция с ECS

Эффекты обеспечивают работу системы ECS:

```typescript
import '@sky-modules/features/ecs/global'
import { EffectTree } from '@sky-modules/features/effect'

const root = new EffectTree().registerUpdateEvents({})

// Системы используют дерево эффектов
const systems = new Systems(root)
root.addContext(systems)
root.commit()

// Сущности - это эффекты
const entity = new Entity(root)
entity.effect.dispose() // Удалить сущность из всех систем
```

## Связанная документация

- [Система ECS](../ecs/README.ru.md) - Использует Effect для жизненного цикла сущностей
- [Обзор функций](../README.ru.md) - Все подсистемы функций
- Документация API в исходных файлах через JSDoc

## Дополнительное чтение

- [React Effect Hook](https://react.dev/reference/react/useEffect) - Похожий паттерн очистки
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection) - Вдохновение для паттерна контекста
- [Observer Pattern](https://refactoring.guru/design-patterns/observer) - Основа системы событий
