# Модуль Features

Высокоуровневые архитектурные паттерны и системы для построения сложных приложений с реактивным управлением состоянием, управлением жизненным циклом на основе эффектов и архитектурой Entity-Component-System.

## Установка

```bash
npm install @sky-modules/features
```

## Обзор

Модуль features предоставляет три взаимодополняющие подсистемы:

- **ECS (Entity-Component-System)** - Архитектура, ориентированная на данные, для разработки игр и сложных симуляций
- **Система эффектов** - Иерархическое управление жизненным циклом и зависимостями с автоматической очисткой
- **Реактивная система** - Управление наблюдаемым состоянием с автоматическим отслеживанием изменений

## Быстрый старт

### ECS (Entity-Component-System)

Создавайте игровые сущности с компонуемыми компонентами и системами поведения:

```typescript
import '@sky-modules/features/ecs/global'

// Определяем компоненты
class PositionComponent extends Component {
    x: number = 0
    y: number = 0
}

class VelocityComponent extends Component {
    x: number = 0
    y: number = 0
}

defineComponent('position', PositionComponent)
defineComponent('velocity', VelocityComponent)

// Определяем систему
class MovementSystem extends System {
    static components = ['position', 'velocity']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            entity.position.x += entity.velocity.x * ev.dt
            entity.position.y += entity.velocity.y * ev.dt
        })
    }
}

defineSystem('movement', MovementSystem)

// Создаем мир
const effectTree = new EffectTree().registerUpdateEvents({})
const systems = new Systems(effectTree)
effectTree.addContext(systems)
effectTree.commit()

// Создаем сущность
const player = new Entity(effectTree)
player.position.x = 100
player.velocity.x = 50  // Движется на 50 единиц в секунду
```

### Система эффектов

Управляйте иерархическими жизненными циклами с автоматической очисткой:

```typescript
import { Effect, EffectTree } from '@sky-modules/features/effect'

// Создаем корневое дерево эффектов
const root = new EffectTree()

// Создаем дочерний эффект с очисткой
const effect = new Effect(() => {
    console.log('Эффект инициализирован')

    const interval = setInterval(() => {
        console.log('Работает...')
    }, 1000)

    // Возвращаем функцию очистки
    return () => {
        clearInterval(interval)
        console.log('Эффект очищен')
    }
}, root)

// Удаляем эффект (очистка выполняется автоматически)
await effect.dispose()
```

### Реактивная система

Отслеживайте изменения состояния с реактивными свойствами:

```typescript
import { reactive, observe } from '@sky-modules/features/reactive'

class Counter {
    @reactive
    count: number = 0
}

const counter = new Counter()

observe(counter, (event) => {
    console.log('Состояние изменилось:', event.type)
})

counter.count++ // Вызывает событие изменения
```

## Подсистемы

### [ECS (Entity-Component-System)](./ecs/README.ru.md)

Архитектурный паттерн, ориентированный на данные, идеально подходящий для игр и симуляций. Сущности - это контейнеры для компонентов (данных), а системы (логика) работают с сущностями, имеющими определенные комбинации компонентов.

**Ключевые возможности:**
- Автоматическая регистрация сущность-система на основе компонентов
- Ленивая инициализация компонентов
- Динамическое добавление/удаление компонентов
- Хуки жизненного цикла системы (onAddEntity, onRemoveEntity)
- Интеграция с системой эффектов для управления жизненным циклом

**Примеры использования:**
- Разработка игр
- Физические симуляции
- Управление сложным состоянием UI
- Приложения, управляемые данными

### [Система эффектов](./effect/README.ru.md)

Иерархическое управление эффектами с автоматическим отслеживанием зависимостей и очисткой. Эффекты образуют деревья, где удаление родителя автоматически очищает всех потомков.

**Ключевые возможности:**
- Иерархии родитель-потомок для эффектов
- Внедрение и распространение контекста
- Автоматическая очистка при удалении
- Отслеживание зависимостей
- Хуки жизненного цикла, управляемые событиями

**Примеры использования:**
- Управление ресурсами
- Очистка обработчиков событий
- Координация асинхронных операций
- Жизненные циклы вложенных компонентов
- Управление анимацией

### Реактивная система

Управление наблюдаемым состоянием, которое автоматически отслеживает изменения свойств и уведомляет наблюдателей.

**Ключевые возможности:**
- Реактивные свойства на основе декораторов
- Наблюдение за событиями изменения
- Сериализация/десериализация состояния
- Вычисляемые реактивные значения

**Примеры использования:**
- Синхронизация состояния UI
- Привязка данных
- Системы отмены/повтора
- Сохранение состояния

## Интеграция

Эти подсистемы работают вместе без проблем:

```typescript
import '@sky-modules/features/ecs/global'
import { EffectTree } from '@sky-modules/features/effect'

// Система эффектов обеспечивает управление жизненным циклом для ECS
const effectTree = new EffectTree()
    .registerUpdateEvents({})

// Контекст систем интегрирован с эффектами
const systems = new Systems(effectTree)
effectTree.addContext(systems)
effectTree.commit()

// Сущности автоматически участвуют в жизненном цикле эффектов
const entity = new Entity(effectTree)

// При удалении entity.effect она автоматически удаляется из всех систем
entity.effect.dispose()
```

## Архитектурные паттерны

### Компонентная архитектура (ECS)

Разделяйте данные (компоненты) от поведения (системы):

```typescript
// Данные
class HealthComponent extends Component {
    current: number = 100
    max: number = 100
}

// Поведение
class HealthSystem extends System {
    static components = ['health']

    update(ev: Sky.UpdateEvent): void {
        this.entities.forEach(entity => {
            if (entity.health.current <= 0) {
                entity.effect.dispose() // Сущность умирает
            }
        })
    }
}
```

### Иерархическое управление жизненным циклом (Effect)

Создавайте вложенные структуры с автоматической очисткой:

```typescript
const scene = new Effect(effectTree)

// Дочерние эффекты удаляются при удалении родителя
const camera = new Effect(scene)
const lights = new Effect(scene)

// Удаляем всю иерархию сцены
scene.dispose() // Автоматически удаляет camera и lights
```

### Распространение контекста (Effect)

Делитесь контекстом вниз по дереву эффектов:

```typescript
class GameConfig {
    static context = true
    difficulty: 'easy' | 'normal' | 'hard' = 'normal'
}

const config = new GameConfig()
effectTree.addContext(config)

// Все дочерние эффекты могут получить доступ к контексту
const entity = new Entity(effectTree)
entity.effect.context(GameConfig) // Возвращает экземпляр config
```

## Производительность

- **ECS**: O(n) итерация по сущностям в системах, дружественное к кешу размещение данных
- **Система эффектов**: Отложенные операции через commit() для пакетной обработки
- **Реактивная система**: Ленивые вычисления, минимальные накладные расходы при отсутствии наблюдателей

## Связанные модули

- `@sky-modules/core` - Основные утилиты, используемые повсюду
- `@sky-modules/math` - Векторные и математические утилиты для разработки игр
- `@sky-modules/platform` - Определение платформы и абстракции

## Поддержка TypeScript

Полная поддержка TypeScript с generic типами:

```typescript
// Типобезопасный доступ к компонентам
const entity = new Entity(effectTree)
const position: PositionComponent = entity.position

// Типобезопасные зависимости эффектов
const effect = new Effect<MyContext>([parent, MyContext])
```

## Документация

- [Руководство по ECS](./ecs/README.ru.md) - Подробное руководство по архитектуре ECS
- [Руководство по системе эффектов](./effect/README.ru.md) - Жизненный цикл эффектов и паттерны
- Документация API доступна через JSDoc в исходных файлах

## Лицензия

MIT
