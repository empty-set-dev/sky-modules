# Svelte Адаптер

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Svelte utility module
</div>

<PlaygroundLink id="svelte" label="Открыть Svelte Playground" />


Платформенные компоненты и утилиты Svelte для Sky Modules.

## Обзор

Svelte-адаптер предоставляет Svelte-специфичные реализации универсальных компонентов, скомпилированных через Mitosis. Используйте этот пакет для интеграции компонентов Sky Modules в Svelte-приложения.

## Установка

```bash
npm install @sky-modules/svelte svelte
```

## Возможности

- **Универсальные компоненты** - Svelte-реализации компонентов Sky Modules
- **Mitosis-компиляция** - Автоматическая генерация из определений универсальных компонентов
- **Типобезопасность** - Полная поддержка TypeScript
- **Реактивность** - Построен на реактивной системе Svelte

## Использование

### Базовый пример

```svelte
<script lang="ts">
  import { Component } from '@sky-modules/svelte'
</script>

<Component>
  Содержимое здесь
</Component>
```

## Компиляция компонентов

Компоненты в этом пакете скомпилированы из исходных файлов Mitosis (`.lite.tsx`), расположенных в директории `universal/`. Компиляция происходит автоматически во время сборки.

**Процесс сборки:**
```bash
# Компиляция Mitosis-компонентов в Svelte
sky mitosis build <app-name>
```

## Пиринговые зависимости

- `svelte` ^4.0.0 || ^5.0.0

## Архитектура

Svelte-адаптер является частью кросс-фреймворковой компонентной системы Sky Modules:
1. Универсальные компоненты определены в Mitosis
2. Скомпилированы в Svelte во время сборки
3. Опубликованы как Svelte-совместимый пакет

## Связанные модули

- [@sky-modules/universal](../universal/) - Определения универсальных компонентов
- [@sky-modules/react](../react/) - React-адаптер
- [@sky-modules/vue](../vue/) - Vue-адаптер
- [@sky-modules/solid](../solid/) - Solid-адаптер

## Примеры

Смотрите директорию [playground](/playground/) для полных примеров.
