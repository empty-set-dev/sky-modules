# helpers

Общие вспомогательные утилиты для имен классов, циклов, управления ассетами и интернационализации.

## Установка

```bash
npm install @sky-modules/helpers
```

## Возможности

- **cn** - Конструктор условных имен классов с поддержкой CSS-модулей
- **Loop** - Асинхронный интервальный цикл с жизненным циклом на основе эффектов
- **Sky.AssetsManager** - Загрузка и управление текстурами Three.js
- **renderLocaleTemplateString** - Интерполяция React-компонентов для i18n-шаблонов

## Использование

### Конструктор имен классов (cn)

Создание условных имен классов с опциональным маппингом CSS-модулей:

```typescript
import cn from '@sky-modules/helpers/cn'

// Базовое использование
const cx = cn()
const className = cx('btn', isActive && 'active', { disabled: isDisabled })
// Результат: "btn active" (если isActive=true, isDisabled=false)

// Синтаксис шаблонных литералов
const className = cx`
  base-class
  ${isActive && 'active'}
  ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
`

// С CSS-модулями
import styles from './Button.module.css'
const cx = cn(styles)
const className = cx('@button', isActive && '@active')
// префикс '@' разрешается в styles.button и styles.active
```

**Возможности:**
- Как clsx, но с поддержкой шаблонных литералов
- Интеграция с CSS-модулями через префикс @
- Автоматическая нормализация пробелов
- Типобезопасность с TypeScript

### Асинхронный цикл

Создание повторяющихся операций с автоматической очисткой:

```typescript
import Loop from '@sky-modules/helpers/Loop'
import { Effect, EffectTree } from '@sky-modules/features/effect'

const root = new EffectTree()
const effect = new Effect(root)

// Запуск каждые 100мс
new Loop((100).milliseconds, (dt) => {
  console.log(`Loop tick, delta: ${dt.inMilliseconds}ms`)
  performTask()
}, effect)

// Цикл автоматически останавливается при удалении эффекта
effect.dispose()
```

**Случаи использования:**
- Игровые циклы обновления
- Серверный опрос
- Периодическая синхронизация данных
- Последовательность анимаций

### Менеджер ассетов

Загрузка и управление текстурами Three.js:

```typescript
import { Sky } from '@sky-modules/helpers'

const assets = new Sky.AssetsManager()

// Загрузка текстур
await assets.loadTexture('logo')
await assets.loadTexture('floor', { wrapX: true, wrapY: true, factor: 2 })

// Использование текстур
const texture = assets.getTexture('logo')
material.map = texture

// Мониторинг прогресса
console.log(`Loading: ${(assets.progress * 100).toFixed(0)}%`)
```

**Возможности:**
- Автоматическое отслеживание прогресса
- Конфигурация обертывания текстур
- Факторы масштабирования
- Обработка ошибок
- Кеширование

### Шаблонные строки локали

Рендеринг i18n-строк с интерполяцией React-компонентов:

```typescript
import renderLocaleTemplateString from '@sky-modules/helpers/renderLocaleTemplateString'

const Bold: FC<PropsWithChildren> = ({ children }) => <strong>{children}</strong>
const Link: FC<PropsWithChildren> = ({ children }) => <a href="#">{children}</a>

const template = "Click <[link]>here</> to learn <[bold]>more</>"

const result = renderLocaleTemplateString(template, {
  link: Link,
  bold: Bold
})
// Рендерит: Click <a href="#">here</a> to learn <strong>more</strong>
```

## API

### cn(styles?)

Создает функцию-конструктор имен классов.

**Параметры:**
- `styles?: Record<string, string>` - Опциональный маппинг CSS-модулей

**Возвращает:** `Cx` - Функция конструктора имен классов

**Экспорты:**
- `cn(styles)` - Функция для создания конструктора
- `cx` - Экземпляр конструктора по умолчанию (без CSS-модулей)

### Loop

**Конструктор:** `Loop(interval: Time, callback: (dt: Time) => void, dep: EffectDep)`

**Параметры:**
- `interval` - Время между итерациями
- `callback` - Функция, вызываемая каждую итерацию с дельтой времени
- `dep` - Зависимость эффекта для управления жизненным циклом

**Свойства:**
- `effect: Effect` - Эффект, управляющий циклом
- `looping?: Async` - Promise, представляющий работающий цикл

### Sky.AssetsManager

**Конструктор:** `new Sky.AssetsManager()`

**Методы:**
- `loadTexture(name, params?): Promise<Texture | void>` - Загружает текстуру из /images/{name}.png
- `getTexture(name): Texture` - Получает загруженную текстуру
- `getTextureParameters(name): TextureParameters` - Получает метаданные текстуры

**Свойства:**
- `textureLoader: TextureLoader` - Экземпляр загрузчика Three.js
- `progress: number` - Прогресс загрузки (от 0 до 1)

**Интерфейсы:**
- `TextureParameters` - Метаданные текстуры (texture, factor, wrapX, wrapY)
- `LoadTextureParameters` - Опции загрузки (factor, wrapX, wrapY)

### renderLocaleTemplateString

**Функция:** `renderLocaleTemplateString(string: string, args: Record<string, FC>): ReactNode`

**Параметры:**
- `string` - Шаблон с плейсхолдерами `<[key]>content</>`
- `args` - Маппинг ключей на React-компоненты

**Возвращает:** Массив React-узлов

## Файлы

### cn/cn.ts

**Назначение:** Конструктор условных имен классов

**Основные экспорты:**
- `cn(styles?)` - Создает конструктор имен классов
- `cx` - Экземпляр конструктора по умолчанию
- `Cx` - Тип функции конструктора

### Loop/Loop.ts

**Назначение:** Асинхронный интервальный цикл

**Основные экспорты:**
- `Loop` - Класс цикла с жизненным циклом на основе эффектов

### Sky.AssetsManager.ts

**Назначение:** Управление текстурами Three.js

**Основные экспорты:**
- `Sky.AssetsManager` - Класс менеджера ассетов
- `Sky.AssetsManager.TextureParameters` - Интерфейс метаданных текстуры
- `Sky.AssetsManager.LoadTextureParameters` - Интерфейс опций загрузки

### renderLocaleTemplateString.tsx

**Назначение:** Рендеринг i18n-шаблонов с React-компонентами

**Основные экспорты:**
- `renderLocaleTemplateString()` - Функция рендеринга шаблонов

### getStore.ts

**Назначение:** Помощник доступа к хранилищу (закомментирован, сейчас не используется)

## Связанные модули

- [@sky-modules/features/effect](../features/effect/) - Система эффектов для жизненного цикла Loop
- [@sky-modules/utilities/Time](../utilities/Time/) - Типы времени для интервалов Loop
- [@sky-modules/utilities/Timer](../utilities/Timer/) - Утилиты таймера, используемые Loop
- [@sky-modules/core/type-guards](../core/type-guards/) - Защитники типов для cn()

## Заметки по реализации

### Реализация cn()

- Использует clsx для основной логики имен классов
- Поддержка шаблонных литералов через защитник типа `isTemplateStringsArray()`
- CSS-модули разрешаются через поиск с префиксом @
- Пробелы нормализуются регулярным выражением
- Выбрасывает ошибку, если класс CSS-модуля не найден

### Реализация Loop

- Построен поверх системы Effect для автоматической очистки
- Использует WaitTimer для точной синхронизации интервалов
- Компенсирует задержки времени выполнения
- Паттерн async/await для управления циклом
- Останавливается немедленно при удалении родительского эффекта

### Реализация AssetsManager

- Отслеживает прогресс загрузки нескольких текстур
- Использует Three.TextureLoader внутренне
- Хранит текстуры в приватной карте по имени
- Прогресс вычисляется как среднее всех загрузчиков
- Ошибки логируются в консоль, не выбрасываются

### Реализация renderLocaleTemplateString

- Парсит шаблон с сопоставлением регулярными выражениями
- Сортирует плейсхолдеры по позиции в строке
- Рендерит компоненты с dangerouslySetInnerHTML для HTML-контента
- Автоматически создает React-ключи
- Обрабатывает вложенные компоненты

## Лучшие практики

### Использование cn()

1. **Создавайте однажды** - Инициализируйте конструктор один раз на компонент/модуль
2. **CSS-модули** - Используйте префикс @ для типобезопасных ссылок на классы
3. **Шаблонные литералы** - Используйте для сложной условной логики
4. **Комбинируйте с clsx** - Уже включен, не нужно импортировать отдельно

### Использование Loop

1. **Зависимость эффекта** - Всегда передавайте эффект для правильной очистки
2. **Async-коллбэки** - Коллбэки могут быть async, цикл ожидает завершения
3. **Дельта времени** - Используйте предоставленную дельту для логики, независимой от частоты кадров
4. **Отмена** - Цикл останавливается при удалении родительского эффекта

### Использование AssetsManager

1. **Предварительная загрузка** - Загружайте все текстуры перед рендерингом
2. **Отслеживание прогресса** - Мониторьте свойство progress для экранов загрузки
3. **Обработка ошибок** - Проверяйте консоль на ошибки загрузки
4. **Обертывание** - Настраивайте обертывание для повторяющихся текстур

### Использование renderLocaleTemplateString

1. **Безопасность HTML** - Будьте осторожны с dangerouslySetInnerHTML
2. **Ключи компонентов** - Использует ключи плейсхолдеров для React-согласования
3. **Сортировка** - Компоненты рендерятся в порядке появления
4. **Вложенные плейсхолдеры** - Не поддерживаются, упростите структуру

## Примеры

### Стилизованная кнопка с cn()

```typescript
import cn from '@sky-modules/helpers/cn'
import styles from './Button.module.css'

const cx = cn(styles)

interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  active?: boolean
}

function Button({ variant, size, disabled, active }: ButtonProps) {
  const className = cx(
    '@button',
    `@${variant}`,
    `@${size}`,
    active && '@active',
    { '@disabled': disabled }
  )

  return <button className={className}>Click me</button>
}
```

### Игровой цикл обновления

```typescript
import Loop from '@sky-modules/helpers/Loop'

class GameController {
  readonly effect: Effect
  private entities: Entity[] = []

  constructor(dep: EffectDep) {
    this.effect = new Effect(dep, this)

    // Обновление 60 раз в секунду
    new Loop((1/60).seconds, (dt) => {
      this.updatePhysics(dt)
      this.updateEntities(dt)
      this.checkCollisions()
    }, this.effect)
  }

  updatePhysics(dt: Time) {
    this.entities.forEach(e => e.physics.update(dt.inSeconds))
  }

  updateEntities(dt: Time) {
    this.entities.forEach(e => e.update(dt))
  }

  checkCollisions() {
    // Логика обнаружения столкновений
  }
}
```

### Экран загрузки текстур

```typescript
import { Sky } from '@sky-modules/helpers'

async function loadGameAssets() {
  const assets = new Sky.AssetsManager()

  const textures = [
    'player',
    'enemy',
    'background',
    'tiles'
  ]

  // Начало загрузки
  const promises = textures.map(name =>
    assets.loadTexture(name, { wrapX: true, wrapY: true })
  )

  // Мониторинг прогресса
  const interval = setInterval(() => {
    updateLoadingBar(assets.progress)

    if (assets.progress === 1) {
      clearInterval(interval)
      startGame()
    }
  }, 100)

  await Promise.all(promises)
}
```

### Интернационализированный текст со ссылками

```typescript
import renderLocaleTemplateString from '@sky-modules/helpers/renderLocaleTemplateString'

const Strong: FC<PropsWithChildren> = ({ children }) => (
  <strong className="highlight">{children}</strong>
)

const ExternalLink: FC<PropsWithChildren> = ({ children }) => (
  <a href="https://example.com" target="_blank" rel="noopener">
    {children}
  </a>
)

function WelcomeMessage({ t }: { t: (key: string) => string }) {
  const template = t('welcome.message')
  // template = "Welcome! <[strong]>New users</> can <[link]>read the guide</>"

  const rendered = renderLocaleTemplateString(template, {
    strong: Strong,
    link: ExternalLink
  })

  return <div className="welcome">{rendered}</div>
}
```
