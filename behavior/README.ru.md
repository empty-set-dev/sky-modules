# behavior

Примитивы реактивного программирования для анимационных циклов, поведений и конечных автоматов.

## Установка

```bash
npm install @sky-modules/behavior
```

## Возможности

- **FrameLoop** - Синхронизированное управление анимационными кадрами с requestAnimationFrame
- **motion** - Примитивы анимации из библиотеки Motion
- **useMachine** - Интеграция конечных автоматов для Mitosis компонентов (robot3)
- **Behavior** - Система реактивного поведения с поддержкой пространств имён

## Использование

### Анимационный цикл кадров

Класс `FrameLoop` предоставляет централизованное управление анимационным циклом с автоматическим контролем жизненного цикла:

```typescript
import { frameLoop, onFrame } from '@sky-modules/behavior'

// Подписка на обновления кадров
const unsubscribe = onFrame((deltaTime, totalTime) => {
  console.log(`Дельта: ${deltaTime}с, Всего: ${totalTime}с`)
  updateAnimation(deltaTime)
})

// Очистка по завершении
unsubscribe()
```

**Возможности:**
- Автоматический запуск/остановка на основе подписчиков
- Точное время дельты и общее время выполнения
- Обработка ошибок для коллбэков
- Глобальный экземпляр-одиночка

**Продвинутое использование:**

```typescript
import FrameLoop from '@sky-modules/behavior/FrameLoop'

// Создание пользовательского экземпляра цикла
const customLoop = new FrameLoop()

customLoop.subscribe((dt, total) => {
  // Пользовательская логика анимации
})

customLoop.start()  // Ручное управление
customLoop.stop()
```

### Конечные автоматы с useMachine

Кросс-фреймворковый хук для конечных автоматов используя robot3:

```typescript
import { useMachine } from '@sky-modules/behavior/useMachine'
import { createMachine, state, transition } from 'robot3'

const toggleMachine = createMachine({
  inactive: state(
    transition('toggle', 'active')
  ),
  active: state(
    transition('toggle', 'inactive')
  )
})

function ToggleComponent() {
  const [service, send] = useMachine(toggleMachine)

  return (
    <button onClick={() => send('toggle')}>
      {service.machine.current}
    </button>
  )
}
```

**Пример сложного автомата:**

```typescript
const trafficLightMachine = createMachine({
  red: state(
    transition('next', 'green')
  ),
  green: state(
    transition('next', 'yellow')
  ),
  yellow: state(
    transition('next', 'red')
  )
})

function TrafficLight() {
  const [service, send] = useMachine(trafficLightMachine)

  useEffect(() => {
    const timer = setInterval(() => send('next'), 3000)
    return () => clearInterval(timer)
  }, [])

  return <div className={`light ${service.machine.current}`} />
}
```

### Библиотека Motion

Модуль behavior реэкспортирует библиотеку Motion для примитивов анимации:

```typescript
import { motion } from '@sky-modules/behavior'

// Использование утилит анимации Motion
// (Документация зависит от API библиотеки Motion)
```

### Пространство имён Behavior

TypeScript namespace для паттернов реактивного поведения:

```typescript
import '@sky-modules/behavior/Behavior/global'

// Доступ к глобальному пространству имён Behavior
// Предоставляет интерфейс SlotRootProps для контроллеров поведения
```

## API

### FrameLoop

**Класс:** `FrameLoop`

Менеджер анимационного цикла, синхронизированный с requestAnimationFrame.

**Методы:**
- `start(): void` - Запускает анимационный цикл
- `stop(): void` - Останавливает анимационный цикл
- `subscribe(callback: (deltaTime, totalTime) => void): () => void` - Добавляет коллбэк, возвращает функцию отписки
- `unsubscribe(callback): void` - Удаляет коллбэк

**Экземпляр:**
- `frameLoop` - Глобальный экземпляр-одиночка

**Функция:**
- `onFrame(callback): () => void` - Удобная функция, обёртывающая frameLoop.subscribe()
- `onFrame.unsubscribe(callback): void` - Прямой метод отписки

### useMachine

**Функция:** `useMachine<T>(machine: Machine<T>): [Service<T>, SendFunction]`

Mitosis хук для конечных автоматов robot3.

**Возвращает:**
- `[0]` - Текущий сервис автомата (содержит состояние)
- `[1]` - Функция отправки для диспетчеризации событий

**Компилируется в:**
- React, Vue, Solid, Svelte, Qwik, Angular

## Файлы

### FrameLoop.ts

**Назначение:** Управление циклом анимационных кадров

**Основные экспорты:**
- `FrameLoop` - Класс управления анимационными коллбэками
- `frameLoop` - Глобальный экземпляр-одиночка
- `onFrame()` - Подписка на обновления кадров

### motion.ts

**Назначение:** Реэкспорт библиотеки Motion

**Основные экспорты:**
- `* from 'motion'` - Все экспорты библиотеки Motion

### useMachine/useMachine.lite.ts

**Назначение:** Хук для конечных автоматов в Mitosis компонентах

**Основные экспорты:**
- `useMachine()` - Хук для интеграции robot3

### Behavior/Behavior.namespace.ts

**Назначение:** TypeScript namespace для паттернов поведения

**Основные экспорты:**
- `Behavior` namespace - Глобальное пространство имён с интерфейсом SlotRootProps

## Связанные модули

- [@sky-modules/features/effect](../features/effect/) - Система эффектов для реактивного поведения
- [@sky-modules/helpers/Loop](../helpers/Loop/) - Асинхронные циклы с интервалами
- [@sky-modules/utilities/Timer](../utilities/Timer/) - Утилиты измерения времени

## Примечания по реализации

### Тайминг кадров

- Время дельты вычисляется в секундах (конвертировано из миллисекунд)
- Общее время отслеживает прошедшее время с начала цикла
- Использует `performance.now()` для высокоточного тайминга
- Цикл останавливается автоматически когда не остаётся подписчиков

### Интеграция конечных автоматов

- Работает с конечными автоматами robot3
- Автоматически перерисовывается при изменении состояния через Mitosis useState
- Типобезопасная диспетчеризация событий с TypeScript generics
- Поддерживает все возможности robot3 (guard, immediate transitions и т.д.)

### Соображения производительности

- FrameLoop использует Set для управления коллбэками за O(1)
- Обработка ошибок предотвращает остановку цикла при падении одного коллбэка
- Коллбэки выполняются синхронно в порядке подписки
- Рассмотрите дебаунсинг дорогих операций в коллбэках кадров

### Лучшие практики

1. **Всегда отписывайтесь** - Предотвращайте утечки памяти вызовом функции отписки
2. **Минимизируйте работу в кадре** - Держите коллбэки лёгкими для плавных 60fps
3. **Используйте delta time** - Масштабируйте анимации по deltaTime для независимости от частоты кадров
4. **Автоматы для UI** - Используйте useMachine для сложных состояний компонентов
5. **Паттерн одиночки** - Используйте глобальный `frameLoop` для анимаций всего приложения

### Паттерн Globalify

Несколько экспортов используют паттерн globalify:
- `Behavior` namespace становится глобально доступным
- Обеспечивает консистентный API во всём фреймворке
- Импортируйте глобальные варианты через пути `/global`

## Примеры

### Игровой цикл

```typescript
import { onFrame } from '@sky-modules/behavior'
import { Effect, EffectTree } from '@sky-modules/features/effect'

class Game {
  readonly effect: Effect
  private entities: Entity[] = []

  constructor(root: EffectTree) {
    this.effect = new Effect(root, this)

    // Цикл обновления игры
    onFrame((dt, total) => {
      this.update(dt)
      this.render()
    })
  }

  update(dt: number) {
    this.entities.forEach(entity => entity.update(dt))
  }

  render() {
    this.entities.forEach(entity => entity.render())
  }
}
```

### Многошаговый мастер

```typescript
import { useMachine } from '@sky-modules/behavior/useMachine'
import { createMachine, state, transition, guard } from 'robot3'

const wizardMachine = createMachine({
  personal: state(
    transition('next', 'contact',
      guard((ctx) => validatePersonalInfo(ctx))
    )
  ),
  contact: state(
    transition('next', 'review'),
    transition('back', 'personal')
  ),
  review: state(
    transition('submit', 'complete'),
    transition('back', 'contact')
  ),
  complete: state()
})

function WizardForm() {
  const [service, send] = useMachine(wizardMachine)
  const currentStep = service.machine.current

  return (
    <div>
      {currentStep === 'personal' && <PersonalInfoStep />}
      {currentStep === 'contact' && <ContactInfoStep />}
      {currentStep === 'review' && <ReviewStep />}
      {currentStep === 'complete' && <SuccessMessage />}

      <button onClick={() => send('back')}>Назад</button>
      <button onClick={() => send('next')}>Далее</button>
    </div>
  )
}
```

### Контроллер анимации

```typescript
import { frameLoop } from '@sky-modules/behavior'

class AnimationController {
  private animations = new Map<string, Animation>()
  private unsubscribe: (() => void) | null = null

  start() {
    this.unsubscribe = frameLoop.subscribe((dt) => {
      this.animations.forEach(anim => anim.update(dt))
    })
  }

  stop() {
    this.unsubscribe?.()
    this.unsubscribe = null
  }

  addAnimation(name: string, animation: Animation) {
    this.animations.set(name, animation)
  }

  removeAnimation(name: string) {
    this.animations.delete(name)
  }
}
```
