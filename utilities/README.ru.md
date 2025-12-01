# utilities

Утилиты для работы со временем, измерения производительности, 3D-трансформаций координат и переменных окружения.

## Установка

```bash
npm install @sky-modules/utilities
```

## Возможности

- **Timer** - Отслеживание времени с дельтой, интервалами, таймаутами и точным ожиданием
- **milliseconds** - Константы временных единиц (секунда, минута, час, день, неделя в мс)
- **measurePerformance** - Бенчмаркинг и сравнение производительности кода
- **getCameraMouseProjection** - 3D-пикинг мышью для камер Three.js
- **getEnvVariable** - Типобезопасный доступ к переменным окружения
- **transformWindowCoordinates** - Преобразование координат окна в NDC для WebGL

## Использование

### Классы таймеров

Множество вариантов таймеров для разных случаев использования:

```typescript
import Timer, { TimeoutTimer, IntervalTimer, WaitTimer } from '@sky-modules/utilities/Timer'

// Базовый таймер - измерение прошедшего времени
const timer = new Timer('My Operation')
// ... выполнение работы ...
timer.log() // Выводит: "My Operation: 1.23s"

// Получение дельты времени программно
const dt = timer.deltaTime()
console.log(`Elapsed: ${dt.inSeconds}s`)

// Таймер с таймаутом - проверка истечения времени
const timeout = new TimeoutTimer()
if (timeout.timeout((5).seconds)) {
  console.log('5 секунд прошло!')
}

// Интервальный таймер - срабатывание через регулярные интервалы
const interval = new IntervalTimer()
if (interval.interval((100).milliseconds)) {
  console.log('Интервал 100мс сработал!')
}

// Таймер ожидания - точные асинхронные задержки с компенсацией
const wait = new WaitTimer()
await wait.wait((1).second)
```

**Управление таймерами:**

```typescript
// Включение/отключение таймеров по метке
Timer.off('Performance')  // Отключить все таймеры 'Performance'
Timer.on('Performance')   // Включить снова

// Иерархические метки
const timer = new Timer('App: Network: Fetch')
timer.log('users')  // Выводит: "App: Network: Fetch: users: 0.15s"

// Логирование только если все родительские метки включены
Timer.off('App: Network')
timer.log('users')  // Нет вывода (Network отключен)
```

### Временные константы

```typescript
import { secondMs, minuteMs, hourMs, dayMs, weekMs } from '@sky-modules/utilities/times/milliseconds'

console.log(secondMs)  // 1000
console.log(minuteMs)  // 60000
console.log(hourMs)    // 3600000
console.log(dayMs)     // 86400000
console.log(weekMs)    // 604800000

// Использование с методами расширения Time
const delay = (5 * secondMs).milliseconds
const timeout = (2 * minuteMs).milliseconds
```

### Измерение производительности

Сравнение нескольких вариантов кода:

```typescript
import measurePerformance from '@sky-modules/utilities/measurePerformance'

const data = Array.from({ length: 1000 }, (_, i) => i)

measurePerformance(1000, 5, [
  ['Array.push', () => {
    const arr: number[] = []
    data.forEach(x => arr.push(x))
  }],
  ['Spread operator', () => {
    const arr = [...data]
  }],
  ['Array.from', () => {
    const arr = Array.from(data)
  }]
])
// Вывод:
// Cycle 1
// Array.push: 45ms
// Spread operator: 12ms
// Array.from: 15ms
// ...
// Final averages:
// Array.push: 43ms
// Spread operator: 11ms
// Array.from: 14ms
```

### 3D-пикинг мышью

Проецирование координат мыши в 3D-пространство:

```typescript
import getCameraMouseProjection from '@sky-modules/utilities/getCameraMouseProjection'
import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'
import Vector2 from '@sky-modules/math/Vector2'

window.addEventListener('click', (e) => {
  // Преобразование координат окна в NDC
  const mouse = new Vector2(e.clientX, e.clientY)
  const ndc = transformWindowCoordinates(mouse)

  // Проецирование в 3D-мир (плоскость z=0)
  const worldPos = getCameraMouseProjection(camera, ndc)

  console.log(`Clicked at: ${worldPos.x}, ${worldPos.y}, ${worldPos.z}`)

  // Размещение объекта в позиции клика
  object.position.copy(worldPos)
})
```

### Преобразование координат

Преобразование экранных координат в NDC:

```typescript
import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'
import Vector2 from '@sky-modules/math/Vector2'

window.addEventListener('mousemove', (e) => {
  const windowCoords = new Vector2(e.clientX, e.clientY)
  const ndc = transformWindowCoordinates(windowCoords)

  console.log(`NDC: (${ndc.x}, ${ndc.y})`)
  // Центр экрана: (0, 0)
  // Левый верхний угол: (-1, 1)
  // Правый нижний угол: (1, -1)
})
```

### Переменные окружения

Типобезопасный доступ к переменным окружения:

```typescript
import getEnvVariable from '@sky-modules/utilities/getEnvVariable'

try {
  const apiKey = getEnvVariable('API_KEY')
  const databaseUrl = getEnvVariable('DATABASE_URL')
  const port = parseInt(getEnvVariable('PORT'))

  console.log(`Connecting to: ${databaseUrl}`)
  initializeServer(port)
} catch (error) {
  console.error('Missing required environment variable')
  process.exit(1)
}
```

## API

### Timer

**Базовый класс:** `TimerBase`

**Статические методы:**
- `Timer.on(label)` - Включить таймер по метке
- `Timer.off(label)` - Отключить таймер по метке

**Конструктор:** `new Timer(label?)`

**Методы:**
- `reset(): this` - Сбросить таймер на текущее время
- `deltaTime(): Time` - Получить и обновить прошедшее время
- `log(label?)` - Логировать прошедшее время с опциональной подметкой
- `trace(label?)` - Трассировать прошедшее время со стеком вызовов
- `isOn(label?): boolean` - Проверить, включен ли таймер

### TimeoutTimer

Расширяет Timer проверкой таймаута.

**Методы:**
- `timeout(time: Time): boolean` - Возвращает true, если таймаут истек

### IntervalTimer

Расширяет Timer срабатыванием интервалов.

**Методы:**
- `interval(time: Time, params?): boolean` - Возвращает true при срабатывании интервала
- `reset(): this` - Сбрасывает таймер и состояние интервала

**Параметры:**
- `skipFirstTime?: boolean` - Не срабатывать при первом вызове

### WaitTimer

Расширяет Timer точным асинхронным ожиданием.

**Конструктор:** `new WaitTimer(label?, previousTimer?)`

**Методы:**
- `wait(time: Time): Promise<void>` - Ожидание с компенсацией времени выполнения

### measurePerformance

**Функция:** `measurePerformance(times, cycles, variations)`

**Параметры:**
- `times: number` - Итерации на цикл
- `cycles: number` - Количество циклов
- `variations: [name, callback][]` - Код для бенчмаркинга

### getCameraMouseProjection

**Функция:** `getCameraMouseProjection(camera, mouse): Vector3`

**Параметры:**
- `camera: Three.Camera` - Камера Three.js
- `mouse: Vector2` - Нормализованные координаты мыши (из transformWindowCoordinates)

**Возвращает:** 3D-позицию на плоскости z=0

### transformWindowCoordinates

**Функция:** `transformWindowCoordinates(mouse): Vector2`

**Параметры:**
- `mouse: Vector2` - Координаты окна в пикселях

**Возвращает:** Нормализованные координаты устройства (от -1 до 1)

### getEnvVariable

**Функция:** `getEnvVariable(name): string`

**Параметры:**
- `name: string` - Имя переменной окружения

**Возвращает:** Значение переменной

**Выбрасывает:** Ошибку, если переменная не определена

## Файлы

### Timer/Timer.ts

**Назначение:** Измерение и отслеживание времени

**Основные экспорты:**
- `Timer` - Базовый класс таймера
- `TimerBase` - Базовый класс для всех таймеров
- `TimeoutTimer` - Проверка таймаута
- `IntervalTimer` - Срабатывание интервалов
- `WaitTimer` - Точное асинхронное ожидание

### times/milliseconds/milliseconds.ts

**Назначение:** Константы временных единиц

**Основные экспорты:**
- `secondMs` - 1000мс
- `minuteMs` - 60000мс
- `hourMs` - 3600000мс
- `dayMs` - 86400000мс
- `weekMs` - 604800000мс

### measurePerformance.ts

**Назначение:** Бенчмаркинг производительности

**Основные экспорты:**
- `measurePerformance()` - Функция бенчмаркинга

### getCameraMouseProjection.ts

**Назначение:** 3D-пикинг мышью

**Основные экспорты:**
- `getCameraMouseProjection()` - Пересечение луча с плоскостью

### transformWindowCoordinates.ts

**Назначение:** Преобразование систем координат

**Основные экспорты:**
- `transformWindowCoordinates()` - Преобразование из координат окна в NDC

### getEnvVariable.ts

**Назначение:** Доступ к переменным окружения

**Основные экспорты:**
- `getEnvVariable()` - Безопасное получение переменных окружения

## Связанные модули

- [@sky-modules/math/Vector2](../math/Vector2/) - 2D-векторы для координат
- [@sky-modules/math/Vector3](../math/Vector3/) - 3D-векторы для проекций
- [@sky-modules/core/Console](../core/Console/) - Цветной вывод в консоль
- [@sky-modules/core/idle](../core/idle/) - Утилиты асинхронных задержек

## Заметки по реализации

### Реализация Timer

- Использует `Date.now()` для отслеживания времени
- Иерархическая система меток с разделителями двоеточиями
- Статические элементы управления включением/отключением
- Дельта времени автоматически продвигает внутренний таймер
- Метки опциональны, но рекомендуются для отладки

### Компенсация WaitTimer

- Отслеживает дополнительное время выполнения сверх ожидаемого интервала
- Компенсирует, уменьшая длительность следующего ожидания
- Предотвращает дрейф в долго работающих циклах
- Ограничен длительностью интервала, чтобы избежать отрицательного ожидания

### Вывод measurePerformance

- Запускает каждый вариант последовательно
- Логирует времена отдельных циклов
- Вычисляет и логирует средние значения
- Использует `Date.now()` для точности в миллисекундах
- Вывод через Console.log для цветного форматирования

### Системы координат

**Координаты окна:**
- Начало: левый верхний угол
- X: от 0 до window.innerWidth
- Y: от 0 до window.innerHeight

**NDC (Нормализованные координаты устройства):**
- Начало: центр
- X: от -1 (слева) до 1 (справа)
- Y: от -1 (снизу) до 1 (сверху)

**3D-мир:**
- Определяется проекцией камеры
- getCameraMouseProjection находит пересечение с плоскостью z=0

### Переменные окружения

- Читает из `process.env`
- Выбрасывает ошибку при отсутствии переменных (fail-fast)
- Нет значений по умолчанию (явное лучше)
- Тип всегда string (парсить по необходимости)

## Лучшие практики

### Использование таймеров

1. **Используйте метки везде** - Упрощает отладку
2. **Используйте иерархические метки** - Включение/отключение по категории
3. **Выбирайте правильный таймер** - Timeout, Interval или Wait
4. **Отключайте в продакшене** - Используйте Timer.off() для критичного к производительности кода
5. **Логируйте умеренно** - Слишком много логов замедляют выполнение

### Измерение производительности

1. **Разогрев** - Запустите один раз перед измерением для прогрева JIT
2. **Множество циклов** - Усредняйте по многим циклам для точности
3. **Реалистичные данные** - Используйте данные продакшн-размера
4. **Изолируйте код** - Минимизируйте настройку/очистку в коллбэках
5. **Сравнивайте альтернативы** - Тестируйте несколько подходов

### 3D-пикинг

1. **Сначала трансформируйте** - Всегда используйте transformWindowCoordinates перед проекцией
2. **Проверяйте тип камеры** - Работает с перспективной и ортографической
3. **Предположение о Z-плоскости** - getCameraMouseProjection предполагает z=0
4. **Raycasting** - Для сложных мешей используйте Three.js Raycaster вместо этого
5. **Производительность** - Кешируйте вычисления для событий mousemove

### Переменные окружения

1. **Валидация рано** - Вызывайте getEnvVariable при запуске
2. **Преобразование типов** - Парсите числа/булевы значения по необходимости
3. **Обработка ошибок** - Ловите и обрабатывайте отсутствующие переменные изящно
4. **Значения по умолчанию** - Используйте оператор || для опциональных переменных
5. **Безопасность** - Никогда не логируйте чувствительные переменные окружения

## Примеры

### Счетчик FPS

```typescript
import { IntervalTimer } from '@sky-modules/utilities/Timer'

class FPSCounter {
  private frames = 0
  private fpsTimer = new IntervalTimer('FPS')

  update() {
    this.frames++

    if (this.fpsTimer.interval((1).second)) {
      console.log(`FPS: ${this.frames}`)
      this.frames = 0
    }
  }
}
```

### Точный игровой цикл

```typescript
import { WaitTimer } from '@sky-modules/utilities/Timer'

class GameLoop {
  private timer = new WaitTimer('GameLoop')

  async run() {
    const targetFPS = 60
    const frameTime = (1000 / targetFPS).milliseconds

    while (true) {
      this.update()
      this.render()

      await this.timer.wait(frameTime)
      // Автоматически компенсирует время update/render
    }
  }
}
```

### Интерактивная 3D-сцена

```typescript
import getCameraMouseProjection from '@sky-modules/utilities/getCameraMouseProjection'
import transformWindowCoordinates from '@sky-modules/utilities/transformWindowCoordinates'

class InteractiveScene {
  private camera: Three.Camera
  private cursor: Three.Mesh

  constructor(camera: Three.Camera) {
    this.camera = camera

    window.addEventListener('mousemove', (e) => {
      const mouse = new Vector2(e.clientX, e.clientY)
      const ndc = transformWindowCoordinates(mouse)
      const worldPos = getCameraMouseProjection(this.camera, ndc)

      // Обновление позиции курсора
      this.cursor.position.copy(worldPos)
    })

    window.addEventListener('click', (e) => {
      const mouse = new Vector2(e.clientX, e.clientY)
      const ndc = transformWindowCoordinates(mouse)
      const worldPos = getCameraMouseProjection(this.camera, ndc)

      // Создание объекта в позиции клика
      this.spawnObject(worldPos)
    })
  }

  spawnObject(position: Vector3) {
    const obj = new Three.Mesh(geometry, material)
    obj.position.copy(position)
    this.scene.add(obj)
  }
}
```

### Загрузчик конфигурации

```typescript
import getEnvVariable from '@sky-modules/utilities/getEnvVariable'

interface AppConfig {
  port: number
  host: string
  databaseUrl: string
  apiKey: string
  environment: 'development' | 'production'
  debug: boolean
}

function loadConfig(): AppConfig {
  return {
    port: parseInt(getEnvVariable('PORT')),
    host: getEnvVariable('HOST'),
    databaseUrl: getEnvVariable('DATABASE_URL'),
    apiKey: getEnvVariable('API_KEY'),
    environment: getEnvVariable('NODE_ENV') as AppConfig['environment'],
    debug: getEnvVariable('DEBUG') === 'true'
  }
}

// Использование
try {
  const config = loadConfig()
  console.log(`Starting server on ${config.host}:${config.port}`)
  startServer(config)
} catch (error) {
  console.error('Configuration error:', error.message)
  console.error('Please check your .env file')
  process.exit(1)
}
```
