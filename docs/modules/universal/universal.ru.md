# @sky-modules/universal

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Universal utility module
</div>

<PlaygroundLink id="universal" label="Открыть Universal Playground" />


Фреймворк-агностичные UI-компоненты, компилируемые в несколько фреймворков через Mitosis.

## Установка

```bash
npm install @sky-modules/universal
```

## Возможности

- **Пиши раз, запускай везде** - Единый исходный код компилируется в React, Vue, Solid, Svelte, Qwik и Angular
- **На основе Mitosis** - Используй знакомый JSX-синтаксис
- **Типобезопасность** - Полная поддержка TypeScript
- **Вывод для фреймворков** - Автоматическая компиляция в 6+ фреймворков
- **Дизайн-система** - Интеграция с токенами Panda CSS

## Как это работает

Универсальные компоненты пишутся на Mitosis (файлы .lite.tsx) и автоматически компилируются в специфичные для фреймворков реализации во время сборки.

```
Component.lite.tsx → Mitosis → React/Vue/Solid/Svelte/Qwik/Angular
```

## Быстрый старт

### Написание универсального компонента

```tsx
// Button.lite.tsx
import { useStore } from '@builder.io/mitosis'

export default function Button(props) {
    const state = useStore({
        count: 0
    })

    return (
        <button onClick={() => state.count++}>
            {props.label}: {state.count}
        </button>
    )
}
```

### Использование в вашем фреймворке

После компиляции используй компонент в выбранном фреймворке:

**React:**
```tsx
import { Button } from '@sky-modules/universal/react'

<Button label="Нажми меня" />
```

**Vue:**
```vue
<script setup>
import { Button } from '@sky-modules/universal/vue'
</script>

<template>
    <Button label="Нажми меня" />
</template>
```

**Solid:**
```tsx
import { Button } from '@sky-modules/universal/solid'

<Button label="Нажми меня" />
```

## Доступные компоненты

Универсальный модуль включает:

- **Popover** - Доступный компонент всплывающего окна
- **SlotRoot** - Реализация паттерна слотов
- **Buttons** - Варианты и стили кнопок
- **Forms** - Компоненты форм ввода
- **Layout** - Утилиты макета
- **Typography** - Текстовые компоненты

## Структура компонента

```
universal/
├── Component/
│   ├── Component.lite.tsx       # Исходник Mitosis
│   ├── Component.lite.css       # Стили
│   └── index.lite.ts            # Экспорты
```

## Компиляция

Компоненты автоматически компилируются во время процесса сборки с помощью Sky Modules CLI:

```bash
sky mitosis build <app-name>
```

Вывод генерируется в директорию `x/` вашего приложения с реализациями для конкретных фреймворков.

## Варианты использования

Идеально подходит для:

- **Библиотек компонентов** - Делись компонентами между фреймворковыми проектами
- **Дизайн-систем** - Поддерживай единый источник истины
- **Мультифреймворковых приложений** - Поддержка нескольких фронтенд-стеков
- **Миграционных проектов** - Постепенные переходы между фреймворками

## Документация

Для синтаксиса Mitosis, паттернов компонентов и руководств по компиляции посетите [полную документацию](https://empty-set-dev.github.io/sky-modules/modules/universal).

## Лицензия

ISC License - смотрите файл [LICENSE](../LICENSE) для деталей.
