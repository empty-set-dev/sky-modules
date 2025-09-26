# План деплоя слайсов модулей Sky на npmjs.org (Обновленный)

## 🎯 Глобальная цель
Создать автоматический деплой слайсов модулей Sky на npmjs.org с конфигурацией через `slice.json` файлы.

## 🏗️ Новая архитектура

### Структура слайсов:
```
core/
├── slice.json          # Конфигурация слайса
├── mergeNamespace/     # Модуль 1
├── globalify/          # Модуль 2
└── canClone.ts         # Модуль 3 (файл)

react/
├── slice.json          # Конфигурация слайса
├── useHook/            # Модуль 1
└── components/         # Модуль 2
```

### Формат slice.json:
```json
{
  "name": "@sky-modules/core",
  "description": "Core utilities for Sky Modules",
  "keywords": ["typescript", "utilities", "core"],
  "access": "public",
  "modules": {
    "mergeNamespace": {
      "description": "Advanced namespace merging utility",
      "main": true
    },
    "globalify": {
      "description": "Global namespace integration"
    },
    "canClone": {
      "description": "Check if object can be cloned"
    }
  }
}
```

## ✅ Выполнено

### 1. Типизация и утилиты
- **Создана типизация Sky.ModuleConfig** для slice.json файлов
- **Функция генерации package.json** - `generateSlicePackageJson.ts`
- **Функция поиска слайсов** - `findDeployableModules.ts` (нужно обновить)
- **Система сборки TypeScript** - `buildSlice.ts`

### 2. Автогенерация параметров
- `name`: из slice.json или автоматически `@sky-modules/{slice}`
- `version`: одна глобальная из основного package.json
- `author`, `license`, `repository`: из основного package.json
- Настройки сборки: ESM + CJS + TypeScript декларации

## 🚧 В работе

### 3. Обновление системы под slice.json
Нужно обновить поиск и обработку слайсов под новую архитектуру.

## 📋 Остается сделать

### 4. Создать slice.json для core
Создать конфигурационный файл для слайса core с описанием всех модулей.

### 5. Расширить cli/deploy.ts с логикой деплоя слайсов
- Команда `sky deploy slices` - деплой всех слайсов с slice.json
- Команда `sky deploy slices core` - деплой конкретного слайса
- Параметры: `--dry-run`, `--version-bump`

### 6. Интеграция с npm API для публикации
- Проверка аутентификации npm
- Проверка существования пакетов и версий
- Публикация через npm API
- Логирование результатов

### 7. Тестирование на примере core слайса
- Создать `core/slice.json`
- Протестировать полный цикл: сборка → генерация package.json → публикация

## 🎨 Новая архитектура системы

### Логика работы:
1. **Поиск слайсов** - сканирование папок с `slice.json`
2. **Чтение конфигурации** - парсинг slice.json для каждого слайса
3. **Сборка модулей** - компиляция TypeScript → JavaScript + декларации
4. **Генерация package.json** - автоматическое создание на основе slice.json
5. **Публикация** - деплой на npmjs.org

### Преимущества новой архитектуры:
- **Централизованная конфигурация** - один файл на слайс
- **Гибкость** - можно описать несколько модулей в одном слайсе
- **Простота** - меньше файлов конфигурации
- **Масштабируемость** - легко добавлять новые слайсы

### Структура билда:
```
.dev/slices/
├── core/
│   ├── package.json    # Автогенерированный
│   ├── src/            # Скопированные исходники
│   ├── dist/           # Скомпилированные файлы
│   │   ├── index.js    # CommonJS
│   │   ├── index.mjs   # ESM
│   │   └── index.d.ts  # TypeScript декларации
│   └── README.md       # Скопированный README
└── react/
    └── ... аналогично
```

## 🚀 Ожидаемый результат

После реализации:

```bash
# Создание slice.json
echo '{"description": "..."}' > core/slice.json

# Деплой слайса
sky deploy slices core

# Установка пользователем
npm install @sky-modules/core

# Использование
import { mergeNamespace, globalify } from '@sky-modules/core'
```

## 📝 TODO для следующих шагов

1. **Обновить типизацию** - добавить интерфейс для slice.json
2. **Создать slice.json для core** - описать все модули core слайса
3. **Обновить findDeployableModules** - искать slice.json вместо module.json
4. **Реализовать команду деплоя** - полная логика в cli/deploy.ts
5. **Протестировать** - полный цикл на примере core слайса

Эта архитектура намного элегантнее и масштабируемее! 🌟