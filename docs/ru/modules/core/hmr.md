# HMR

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  hmr utility module
</div>

Утилиты для определения Hot Module Replacement.


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { hmr } from '@sky-modules/core'
```

## Установка

```typescript
import isHot from '@sky-modules/core/hmr'
```

## API

### isHot()

Проверить запущен ли код в контексте Hot Module Replacement (HMR).

```typescript
isHot(): boolean
```

**Возвращает:** boolean - True если работает в контексте HMR, иначе false

**Текущий статус:** Всегда возвращает `false` (реализация ожидается)

## Примеры использования

### Определение HMR окружения

```typescript
import isHot from '@sky-modules/core/hmr'

if (isHot()) {
  console.log('Работает в режиме HMR')
} else {
  console.log('Нормальный режим')
}
```

### Условная инициализация

```typescript
import isHot from '@sky-modules/core/hmr'

function initializeApp() {
  if (isHot()) {
    // Настройка HMR-специфичных обработчиков
    setupHMRListeners()
  } else {
    // Нормальная инициализация
    setupNormalListeners()
  }
}
```

### Логика специфичная для модуля

```typescript
if (isHot()) {
  // Сохранить состояние для горячей перезагрузки
  window.__appState = saveState()
} else {
  // Нормальная очистка
  cleanupResources()
}
```

## Примечания

- Реализация планируется для будущих версий
- Сейчас всегда возвращает false
- Используется для включения HMR-осведомленных путей кода в разработке
- Помогает предотвратить ненужную переинициализацию во время горячих перезагрузок
