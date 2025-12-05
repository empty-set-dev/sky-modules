# Начало работы

Добро пожаловать в Sky Modules - универсальный TypeScript фреймворк для создания кроссплатформенных приложений с модульной архитектурой.

## Быстрый старт

### Установка

Установите Sky Modules из npm:

```bash
npm install @sky-modules/core
```

### Базовое использование

Импортируйте нужные модули:

```typescript
import '@sky-modules/core/Array'
import { mergeNamespace } from '@sky-modules/core'

// Используйте расширения Array
const numbers = [1, 2, 3, 4, 5]
console.log(numbers.last()) // 5

// Перемешать массив
numbers.shuffle()
```

## Основные концепции

### Модульная архитектура

Sky Modules построен на модульной архитектуре, где каждый модуль предоставляет определенную функциональность:

- **Основные модули**: Фундаментальные утилиты и хелперы
- **Дизайн система**: UI компоненты и дизайн токены
- **Интеграции фреймворков**: Кроссфреймворк компоненты (React, Vue, Solid, Svelte, Qwik, Angular)
- **Платформенные модули**: Специфичные для платформы утилиты

### Кроссплатформенная поддержка

Пишите один раз, запускайте везде:

- **Web**: Браузерные приложения с Vike
- **Node**: Серверные приложения с Bun
- **Desktop**: Нативные приложения с Tauri
- **Mobile**: iOS и Android с Expo

## Следующие шаги

- Просмотрите [Модули](/ru/modules/) чтобы изучить доступный функционал
- Посмотрите [Песочницу](/ru/playground/) для интерактивных примеров
- Просмотрите пакеты на [NPM](https://npmjs.com/~sky-modules)

## CLI команды

Sky Modules поставляется с мощным CLI:

```bash
# Разработка
sky web dev <app-name>          # Запустить web dev сервер
sky node dev <app-name>         # Запустить node dev сервер
sky desktop dev <app-name>      # Запустить desktop приложение

# Сборка
sky web build <app-name>        # Собрать для production
sky desktop build <app-name>    # Собрать desktop приложение

# Тестирование
sky test                        # Запустить все тесты
sky test <folder>              # Запустить конкретные тесты

# Проверка типов
sky check                       # Проверить все модули
sky check <module-name>        # Проверить конкретный модуль
```

## Структура проекта

```
project/
├── .sky/
│   └── sky.config.ts          # Конфигурация проекта
├── apps/
│   ├── web/                   # Web приложения
│   ├── node/                  # Node приложения
│   └── desktop/               # Desktop приложения
└── modules/
    ├── core/                  # Основные утилиты
    ├── design/                # Дизайн система
    └── universal/             # Универсальные компоненты
```

## Сообщество

- [GitHub](https://github.com/empty-set-dev/sky-modules)
- [NPM](https://npmjs.com/~sky-modules)
- [Issues](https://github.com/empty-set-dev/sky-modules/issues)
