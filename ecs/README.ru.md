# Модуль ECS Physics

3D физика для entity-component-system архитектуры.

## Установка

```bash
npm install @sky-modules/ecs
```

## Возможности

- **Компонент Physics3**: Отслеживание позиции, скорости, ускорения
- **Система Physics3System**: Автоматическая симуляция физики каждый кадр
- **Поддержка трения**: Константное и процентное трение
- **Интеграция с Vector3**: Использует `@sky-modules/math/Vector3` для 3D математики
- **Delta Time**: Физика независимая от частоты кадров

## Быстрый старт

```typescript
import '@sky-modules/ecs/Physics3'

// Создание сущности с физикой
const entity = new Entity()
entity.physics3.position.set(0, 0, 0)
entity.physics3.velocity.set(1, 0, 0)
entity.physics3.acceleration.set(0, 0, -9.8) // Гравитация

// Установка трения
entity.physics3.friction = (5).asMetersPerSecond
entity.physics3.linearFriction = (1).asPercentsPerMillisecond
```

## Справочник API

### Компонент Physics3

Компонент для 3D физической симуляции на сущностях.

#### Свойства

- **position**: `Vector3` - Текущая позиция в 3D пространстве
- **velocity**: `Vector3` - Вектор скорости (единицы в секунду)
- **acceleration**: `Vector3` - Вектор ускорения (единицы в секунду в квадрате)
- **friction**: `MetersPerSecond` - Константная сила трения противодействующая движению
- **linearFriction**: `PercentsPerMillisecond` - Процентное трение (0-100%)

### Система Physics3System

Система обновляющая все сущности с компонентом `physics3`.

#### Процесс обновления

Каждый кадр система:
1. Применяет ускорение к скорости: `velocity += acceleration * dt`
2. Применяет скорость к позиции: `position += velocity * dt`
3. Применяет константное трение (останавливает при малой скорости)
4. Применяет линейное трение (экспоненциальный спад)

#### Поведение трения

**Константное трение** (`friction`):
- Противодействует направлению движения
- Останавливает объект когда скорость становится слишком малой
- Единицы: метры в секунду

**Линейное трение** (`linearFriction`):
- Процентное уменьшение скорости
- Применяется экспоненциально: `velocity *= (1 - friction/100)^(dt*1000)`
- Единицы: процент в миллисекунду

## Примеры

### Базовое движение

```typescript
import '@sky-modules/ecs/Physics3'

const entity = new Entity()

// Установка начальной позиции и скорости
entity.physics3.position.set(0, 0, 0)
entity.physics3.velocity.set(5, 0, 0)

// Физическая система обновляется автоматически
// После 1 секунды: position = (5, 0, 0)
```

### Симуляция гравитации

```typescript
const entity = new Entity()
entity.physics3.position.set(0, 0, 10)
entity.physics3.acceleration.set(0, 0, -9.8) // Гравитация Земли

// Объект падает с постоянным ускорением
```

### Пример с трением

```typescript
const entity = new Entity()
entity.physics3.velocity.set(10, 0, 0)

// Константное трение - линейное замедление
entity.physics3.friction = (2).asMetersPerSecond

// Линейное трение - экспоненциальное замедление (1% в мс)
entity.physics3.linearFriction = (1).asPercentsPerMillisecond
```

### Комбинированная физика

```typescript
const player = new Entity()

// Начальное состояние
player.physics3.position.set(0, 0, 0)
player.physics3.velocity.set(0, 0, 0)

// Применение сил
function applyPlayerInput(direction: Vector3, force: number) {
    player.physics3.acceleration
        .copy(direction)
        .normalize()
        .multiplyScalar(force)
}

// Трение земли
player.physics3.friction = (10).asMetersPerSecond
player.physics3.linearFriction = (0.5).asPercentsPerMillisecond

// Гравитация в воздухе
if (!isGrounded) {
    player.physics3.acceleration.z = -9.8
}
```

## Интеграция

### С ECS из features/

Этот модуль использует ECS систему из `@sky-modules/features/ecs`:

```typescript
import '@sky-modules/features/ecs/global' // Обязательно
import '@sky-modules/ecs/Physics3'

// Компонент и система регистрируются автоматически
```

### Расширение типов

Модуль расширяет глобальные типы:

```typescript
declare global {
    interface Entity {
        physics3: Physics3
    }

    interface Systems {
        Physics3System: Physics3System
    }
}
```

## Связанные модули

- **[@sky-modules/math/Vector3](../math/Vector3)** - 3D векторная математика
- **[@sky-modules/features/ecs](../features/ecs)** - Entity-component-system
- **[@sky-modules/utilities/Time](../utilities/Time)** - Единицы времени

## Заметки о производительности

- Физические обновления выполняются каждый кадр через system update
- Операции с Vector3 создают временные объекты (рассмотрите оптимизацию для большого количества сущностей)
- Delta time обеспечивает консистентную физику независимо от частоты кадров

## Лицензия

MIT
