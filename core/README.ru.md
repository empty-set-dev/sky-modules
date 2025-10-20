# @sky-modules/core

**Распределенная Реактивная Среда Выполнения** - мощный TypeScript фреймворк для создания real-time распределенных приложений с автоматической синхронизацией состояния.

## 🌟 Что такое Sky Core?

Sky Core - это не просто библиотека утилит, это полноценная система выполнения, которая объединяет:

- **Реактивное Программирование** (как MobX) - автоматическое отслеживание зависимостей
- **Сетевую Синхронизацию** (как Colyseus) - эффективное распределение состояния
- **Систему Схем** (как Zod) - типизированные структуры данных с реактивностью
- **Сериализацию** - сохранение экземпляров классов через сеть/диск

Всё в одном бесшовном фреймворке с **нулевой конфигурацией**.

## 🎯 Применение

Идеально для создания:

- 🎮 **Многопользовательских игр** - синхронизация состояния игроков в реальном времени
- 📝 **Коллаборативных редакторов** - как Figma, Google Docs
- 💬 **Real-time чатов** - с присутствием и состоянием
- 📊 **Живых дашбордов** - автоматические обновления
- 🔄 **Offline-first приложений** - с автоматической синхронизацией
- 🌐 **Распределенных систем** - разделение состояния между серверами

## 🚀 Быстрый старт

```typescript
import '@sky-modules/core/define'

// Определяем разделяемый класс
@define('app.User')
class User {
    @string name
    @number x = 0
    @number y = 0

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }
}

// Создаем экземпляр
const user = new User()
user.name = 'Аня'

// Делимся им по сети
share(user, (updates, pretty) => {
    // Отправляем обновления другим клиентам
    websocket.send(updates)

    console.log('Изменилось:', pretty.set)
    // Изменилось: [['app.User', 123, { x: 10, y: 20 }]]
})

// Изменения отслеживаются автоматически
user.move(10, 20) // Обновления отправлены автоматически!
```

## 🏗️ Архитектура

Sky Core предоставляет три уровня реактивности:

### 1. Локальная Реактивность (как MobX)

Автоматическое отслеживание зависимостей и повторное выполнение:

```typescript
@define('app.Counter')
class Counter {
    @number count = 0

    increment() {
        this.count++
    }
}

const counter = new Counter()

// Автоматически отслеживает зависимости
reaction(() => {
    console.log('Счетчик:', counter.count)
})

counter.increment() // Консоль: "Счетчик: 1"
counter.increment() // Консоль: "Счетчик: 2"
```

### 2. Сетевая Синхронизация

Эффективное распределение состояния по сети:

```typescript
// Сервер
const gameState = new GameState()

share(gameState, (updates) => {
    // Рассылаем только изменения (не все состояние!)
    clients.forEach(client => {
        client.send(updates)
    })
})

// Клиент
websocket.on('message', (updates) => {
    // Применяем обновления от сервера
    apply(localGameState, updates)
})
```

**Обновления оптимизированы:**
```typescript
// Вместо отправки всего объекта (100+ КБ):
{ player: { x: 100, y: 200, health: 80, ... } }

// Отправляем только изменения (< 1 КБ):
[[UPDATE_TYPE.SET, [[playerId, [[0, 100], [1, 200]]]]]]
```

### 3. Персистентность

Сериализация объектов с метаданными классов:

```typescript
// Сохраняем на диск/в базу
const json = save(user)
// {
//   __class: 'app.User',
//   __id: 123,
//   name: 'Аня',
//   x: 10,
//   y: 20
// }

// Загружаем с диска/из базы
const restored = load(json)
// Автоматически восстанавливает экземпляр класса User!
restored instanceof User // true
restored.move(5, 5) // Работает!
```

## 📦 Основные модули

### Публичное API

- **Array** - Полезные расширения массивов (`last()`, `remove()`, `shuffle()`)
- **bind** - Декоратор автоматической привязки методов
- **mergeNamespace** - Слияние пространств имен объектов
- **not** - Типобезопасные проверки null/undefined

### Система Выполнения

- **define** - Реестр классов для сериализации
- **plain/schema** - Типизированные реактивные структуры данных
- **share/observe** - Сетевая синхронизация
- **reaction** - Отслеживание зависимостей
- **hooks** - Система middleware для событий
- **EventEmitter** - Типобезопасные события
- **globalify** - Управление глобальным пространством имен

## 🎮 Пример: Многопользовательская Игра

```typescript
@define('game.Player')
class Player {
    @string name
    @number x = 0
    @number y = 0
    @number health = 100

    move(dx: number, dy: number) {
        this.x += dx
        this.y += dy
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount)
    }
}

@define('game.GameState')
class GameState {
    @array(Player) players = []

    addPlayer(name: string): Player {
        const player = new Player()
        player.name = name
        this.players.push(player)
        return player
    }
}

// Сервер
const game = new GameState()

share(game, (updates, pretty) => {
    // Рассылаем всем клиентам
    io.emit('game:update', updates)

    // Логируем для отладки
    console.log('Игра обновлена:', pretty)
})

// Клиент присоединяется
const player = game.addPlayer('Аня')
// Автоматически синхронизировано со всеми клиентами!

// Игрок двигается
player.move(10, 20)
// Отправляются только данные о движении, не весь объект игрока
```

## 📝 Пример: Real-time Коллаборация

```typescript
@define('doc.TextDocument')
class TextDocument {
    @string title = ''
    @string content = ''
    @array(User) collaborators = []

    updateContent(newContent: string) {
        this.content = newContent
    }
}

// Делимся документом
const doc = new TextDocument()
doc.title = 'Мой Документ'

share(doc, (updates) => {
    // Отправляем всем соавторам
    doc.collaborators.forEach(user => {
        sendToUser(user, updates)
    })
})

// Пользователь печатает
doc.updateContent('Привет, мир!')
// Только изменение контента отправляется другим пользователям
```

## 🔧 Система Схем

Определение типизированных, реактивных структур данных:

```typescript
// Простые типы
@string name
@number age
@boolean active

// Опциональные типы
@optional.string nickname
@optional.number score

// Nullable типы
@nullable.string avatar

// Объекты
@object(Address) address
@array(Friend) friends

// Функции
@func onUpdate
```

Кастомные схемы:

```typescript
const AddressSchema = {
    street: string,
    city: string,
    country: string
}

@define('app.User')
class User {
    @string name
    @object(AddressSchema) address
}

// Типобезопасно!
const user = new User()
user.address = {
    street: 'Тверская 1',
    city: 'Москва',
    country: 'Россия'
}
```

## 🔍 Как это работает

### Система Define

Каждый класс/функция регистрируется в глобальном реестре:

```typescript
@define('app.MyClass')
class MyClass { }

// Внутри сохраняется:
{
    'app.MyClass': {
        name: 'app.MyClass',
        value: MyClass,
        [idSymbol]: 1,
        [uidSymbol]: 'app.MyClass',
        [typeSymbol]: 'class'
    }
}
```

Это позволяет:
- Сериализацию с метаданными классов
- Hot module replacement
- Сетевую синхронизацию
- Отладку и интроспекцию

### Реактивные Свойства

Когда вы используете декораторы `@string`, `@number`, они создают геттеры/сеттеры которые:

1. Отслеживают чтения (для `reaction()`)
2. Отслеживают записи (для `share()`)
3. Батчат обновления эффективно
4. Наблюдают за вложенными объектами

```typescript
// Это:
@number count

// Становится:
get count() {
    // Отслеживаем зависимость если внутри reaction()
    return this._count
}
set count(value) {
    // Уведомляем слушателей share()
    // Ставим обновление в очередь для сети
    this._count = value
}
```

### Протокол Обновлений

Изменения кодируются эффективно:

```typescript
UpdateOfShared.Type.SET: [
    objectId,           // Какой объект изменился
    [
        [propertyIndex, newValue],  // Какие свойства изменились
        [propertyIndex, newValue],
    ]
]
```

Пример:
```typescript
// Изменение: player.x = 100, player.y = 200
// Закодировано как:
[UPDATE_TYPE.SET, [[playerId, [[0, 100], [1, 200]]]]]
// ~20 байт вместо ~100+ байт
```

## 🎓 Лучшие Практики

### 1. Всегда используйте @define для разделяемых классов

```typescript
// ✅ Хорошо
@define('app.User')
class User { }

// ❌ Плохо - невозможно сериализовать
class User { }
```

### 2. Используйте типизированные декораторы

```typescript
// ✅ Хорошо - типобезопасно и реактивно
@string name
@number age

// ❌ Плохо - нет реактивности
name: string = ''
age: number = 0
```

### 3. Батчите обновления когда возможно

```typescript
// ✅ Хорошо - одно обновление
function movePlayer(dx: number, dy: number) {
    player.x += dx
    player.y += dy
} // Одно сетевое обновление

// ❌ Плохо - два обновления
player.x += dx  // Сетевое обновление
player.y += dy  // Еще одно сетевое обновление
```

### 4. Используйте пространства имен для организации

```typescript
@define('game.entities.Player')
@define('game.entities.Enemy')
@define('game.systems.Physics')
```

## 📚 Справка по API

Смотрите документацию отдельных модулей:

- [Array](./Array/Array.ru.md) - Расширения массивов
- [bind](./bind/bind.ru.md) - Декоратор привязки методов
- [mergeNamespace](./mergeNamespace/mergeNamespace.ru.md) - Слияние пространств имен
- [not](./not/not.ru.md) - Утилиты для null/undefined

## 🔜 Дорожная карта

- [ ] DevTools расширение для Chrome
- [ ] Интеграция с React hooks
- [ ] Разрешение конфликтов для offline sync
- [ ] Оптимистичные обновления
- [ ] Time-travel отладка
- [ ] Инструменты профилирования производительности

## 📄 Лицензия

MIT

## 🤝 Вклад в проект

Мы приветствуем вклад! Пожалуйста, смотрите наши правила для контрибьюторов.

---

**Сделано с ❤️ для создания real-time, распределенных приложений**
