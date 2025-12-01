# ECS (Entity-Component-System)

Архитектурный паттерн, ориентированный на данные, для создания масштабируемых игр и симуляций. Разделяет данные (Components) от поведения (Systems) для оптимальной производительности и гибкости.

## Обзор

Entity-Component-System (ECS) - это архитектурный паттерн, в котором:

- **Entities** - уникальные идентификаторы, группирующие компоненты вместе
- **Components** - чистые контейнеры данных без логики
- **Systems** - содержат логику, работающую с сущностями, имеющими определенные комбинации компонентов

Это разделение позволяет:
- Высокую производительность через дружественную к кешу итерацию по данным
- Гибкую композицию без глубоких иерархий наследования
- Легкое добавление/удаление функционала во время выполнения
- Четкое разделение ответственности

## Установка

```bash
npm install @sky-modules/features
```

Импортируйте глобальные классы ECS:

```typescript
import '@sky-modules/features/ecs/global'
```

## Основные концепции

### Entity

Контейнер для компонентов. Сущности сами по себе не имеют поведения - они просто хранят компоненты.

```typescript
class Entity {
    readonly effect: Effect

    constructor(dep: EffectDep)
    has(name: string): boolean
    delete(name: string): this
}
```

**Ключевые возможности:**
- Ленивая инициализация компонентов (создаются при первом обращении)
- Автоматическая регистрация в системах при добавлении компонентов
- Автоматическая отмена регистрации при удалении компонентов
- Интеграция с системой эффектов для управления жизненным циклом

### Component

Чистый контейнер данных, прикрепленный к сущности.

```typescript
class Component {
    entity: Entity

    constructor(entity: Entity)
}
```

**Рекомендации по дизайну:**
- Компоненты должны содержать только данные, никакого поведения
- Делайте компоненты небольшими и сфокусированными
- Компоненты могут ссылаться на свою сущность

### System

Логика, работающая с сущностями, имеющими определенные комбинации компонентов.

```typescript
abstract class System {
    entities: Entity[] = []
    static components: string[] = []  // Требуемые компоненты

    run(dt: number): void
    update?(ev: Sky.UpdateEvent): void
    onAddEntity?(entity: Entity): void
    onRemoveEntity?(entity: Entity): void
}
```

**Жизненный цикл системы:**
- Системы автоматически получают сущности, соответствующие их требованиям к компонентам
- `onAddEntity` вызывается, когда сущность получает все требуемые компоненты
- `onRemoveEntity` вызывается, когда сущность теряет требуемый компонент
- `update` вызывается каждый кадр оркестратором систем

### Systems Orchestrator

Управляет всеми системами и координирует регистрацию сущность-система.

```typescript
class Systems {
    static context = true
    readonly effect: Effect

    constructor(dep: EffectDep)
}
```

## Полный пример: Простая игра

Вот полный пример, показывающий работу сущностей, компонентов и систем вместе:

```typescript
import '@sky-modules/features/ecs/global'
import { EffectTree } from '@sky-modules/features/effect'

// ===== Компоненты (Данные) =====

class PositionComponent extends Component {
    x: number = 0
    y: number = 0
}

class VelocityComponent extends Component {
    x: number = 0
    y: number = 0
}

class SpriteComponent extends Component {
    texture: string = ''
    width: number = 32
    height: number = 32
}

class HealthComponent extends Component {
    current: number = 100
    max: number = 100
}

class PlayerComponent extends Component {
    score: number = 0
}

// Регистрируем компоненты
defineComponent('position', PositionComponent)
defineComponent('velocity', VelocityComponent)
defineComponent('sprite', SpriteComponent)
defineComponent('health', HealthComponent)
defineComponent('player', PlayerComponent)

// ===== Системы (Поведение) =====

// Система движения - обновляет позиции на основе скорости
class MovementSystem extends System {
    static components = ['position', 'velocity']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            entity.position.x += entity.velocity.x * ev.dt
            entity.position.y += entity.velocity.y * ev.dt
        })
    }
}

// Система рендеринга - отрисовывает спрайты в позициях
class RenderSystem extends System {
    static components = ['position', 'sprite']

    onAddEntity(entity: Entity): void {
        console.log(`Загружаем текстуру: ${entity.sprite.texture}`)
    }

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            // Рисуем спрайт в позиции сущности
            console.log(`Рисуем ${entity.sprite.texture} в (${entity.position.x}, ${entity.position.y})`)
        })
    }

    onRemoveEntity(entity: Entity): void {
        console.log(`Выгружаем текстуру: ${entity.sprite.texture}`)
    }
}

// Система здоровья - обрабатывает смерть сущности
class HealthSystem extends System {
    static components = ['health']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            if (entity.health.current <= 0) {
                console.log('Сущность умерла!')
                entity.effect.dispose()
            }
        })
    }
}

// Система ввода игрока - работает только с сущностями игрока
class PlayerInputSystem extends System {
    static components = ['player', 'velocity']

    protected onGlobalKeyDown(ev: { code: string }): void {
        // Находим сущность игрока
        const player = this.entities[0]
        if (!player) return

        const speed = 200
        switch (ev.code) {
            case 'ArrowLeft':
                player.velocity.x = -speed
                break
            case 'ArrowRight':
                player.velocity.x = speed
                break
            case 'ArrowUp':
                player.velocity.y = -speed
                break
            case 'ArrowDown':
                player.velocity.y = speed
                break
        }
    }

    protected onGlobalKeyUp(ev: { code: string }): void {
        const player = this.entities[0]
        if (!player) return

        switch (ev.code) {
            case 'ArrowLeft':
            case 'ArrowRight':
                player.velocity.x = 0
                break
            case 'ArrowUp':
            case 'ArrowDown':
                player.velocity.y = 0
                break
        }
    }
}

// Регистрируем системы
defineSystem('movement', MovementSystem)
defineSystem('render', RenderSystem)
defineSystem('health', HealthSystem)
defineSystem('playerInput', PlayerInputSystem)

// ===== Настройка игры =====

// Создаем дерево эффектов с циклом обновления
const effectTree = new EffectTree()
    .registerUpdateEvents({})
    .registerEmitKeyboardEvents()

// Создаем и регистрируем системы
const systems = new Systems(effectTree)
effectTree.addContext(systems)
effectTree.commit()

// ===== Создаем сущности =====

// Сущность игрока
const player = new Entity(effectTree)
player.position.x = 400
player.position.y = 300
player.velocity.x = 0
player.velocity.y = 0
player.sprite.texture = 'player.png'
player.health.current = 100
player.player.score = 0
// Игрок теперь в: MovementSystem, RenderSystem, HealthSystem, PlayerInputSystem

// Сущность врага
const enemy = new Entity(effectTree)
enemy.position.x = 100
enemy.position.y = 100
enemy.velocity.x = 50
enemy.velocity.y = 50
enemy.sprite.texture = 'enemy.png'
enemy.health.current = 50
// Враг теперь в: MovementSystem, RenderSystem, HealthSystem

// Статическое украшение (без здоровья, без скорости)
const tree = new Entity(effectTree)
tree.position.x = 200
tree.position.y = 200
tree.sprite.texture = 'tree.png'
// Дерево только в: RenderSystem
```

## Динамическая манипуляция компонентами

Компоненты можно добавлять и удалять во время выполнения с автоматической регистрацией в системах:

```typescript
const entity = new Entity(effectTree)

// Изначально только позиция
entity.position.x = 100
// Сущность зарегистрирована в системах, требующих только 'position'

// Добавляем компонент скорости
entity.velocity.x = 50
// Сущность теперь также зарегистрирована в MovementSystem (['position', 'velocity'])

// Удаляем скорость
entity.delete('velocity')
// Сущность удалена из MovementSystem, но остается в системах только с позицией

// Проверяем наличие компонентов
if (entity.has('health')) {
    entity.health.current -= 10
}
```

## Хуки жизненного цикла системы

Системы могут реагировать на добавление и удаление сущностей:

```typescript
class ResourceSystem extends System {
    static components = ['sprite', 'position']

    private resources = new Map<Entity, WebGLTexture>()

    onAddEntity(entity: Entity): void {
        // Загружаем ресурсы при добавлении сущности
        const texture = loadTexture(entity.sprite.texture)
        this.resources.set(entity, texture)
        console.log(`Загружена текстура для сущности`)
    }

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            const texture = this.resources.get(entity)
            // Рендерим с загруженной текстурой
        })
    }

    onRemoveEntity(entity: Entity): void {
        // Очищаем ресурсы при удалении сущности
        const texture = this.resources.get(entity)
        if (texture) {
            disposeTexture(texture)
            this.resources.delete(entity)
        }
        console.log(`Выгружена текстура для сущности`)
    }
}
```

## Лучшие практики

### Дизайн компонентов

**Правильно:**
```typescript
// Маленькие, сфокусированные компоненты
class PositionComponent extends Component {
    x: number = 0
    y: number = 0
}

class HealthComponent extends Component {
    current: number = 100
    max: number = 100
}
```

**Неправильно:**
```typescript
// Большие, монолитные компоненты
class GameObjectComponent extends Component {
    x: number = 0
    y: number = 0
    health: number = 100
    velocity: number = 0
    sprite: string = ''
    // ... слишком много данных в одном компоненте
}
```

### Дизайн систем

**Правильно:**
```typescript
// Системы работают со специфичными комбинациями компонентов
class PhysicsSystem extends System {
    static components = ['position', 'velocity', 'collider']

    update(ev: Sky.UpdateEvent): void {
        // Сфокусированная физическая логика
    }
}
```

**Неправильно:**
```typescript
// Системы не должны проверять опциональные компоненты
class BadSystem extends System {
    static components = ['position']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            // Проверка компонентов отменяет цель
            if (entity.has('velocity')) {
                // Должна быть отдельная система
            }
        })
    }
}
```

## Интеграция с системой эффектов

ECS полностью интегрирован с системой эффектов:

```typescript
// Жизненный цикл сущности привязан к эффекту
const entity = new Entity(effectTree)
entity.position.x = 100

// Удаляем сущность (автоматически удаляется из всех систем)
entity.effect.dispose()

// Сущности, осведомленные о контексте
effectTree.addContext(gameConfig)
effectTree.commit()

const entity2 = new Entity(effectTree)
entity2.effect.context(GameConfig) // Доступ к общему контексту
```

## Когда использовать ECS

**Хорошие варианты использования:**
- Игры с множеством похожих объектов (враги, пули, частицы)
- Симуляции с разнообразными типами сущностей
- Системы, требующие высокопроизводительной итерации
- Проекты, выигрывающие от композиции во время выполнения

**Рассмотрите альтернативы, когда:**
- Мало сущностей со сложным, уникальным поведением
- Глубокие иерархии объектов являются естественным решением
- Производительность не критична
- Команда не знакома с паттернами ECS

## Связанная документация

- [Система эффектов](../effect/README.ru.md) - Управление жизненным циклом для сущностей
- [Обзор функций](../README.ru.md) - Все подсистемы функций
- Документация API в исходных файлах через JSDoc

## Дополнительное чтение

- [Data-Oriented Design](https://www.dataorienteddesign.com/dodbook/)
- [ECS Back and Forth](https://skypjack.github.io/2019-02-14-ecs-baf-part-1/)
- [Understanding Component-Entity-Systems](https://www.gamedev.net/articles/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/)
