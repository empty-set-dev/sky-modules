# Angular Adapter

Angular платформенные компоненты и утилиты для Sky Modules.

## Обзор

Angular адаптер предоставляет Angular-специфичные реализации универсальных компонентов, скомпилированных через Mitosis. Используйте этот пакет для интеграции компонентов Sky Modules в Angular приложения.

## Установка

```bash
npm install @sky-modules/angular @angular/core
```

## Возможности

- **Универсальные компоненты** - Angular реализации компонентов Sky Modules
- **Mitosis-компиляция** - Автоматически генерируются из универсальных определений компонентов
- **Типобезопасность** - Полная поддержка TypeScript
- **Совместимость с Zone.js** - Работает с Angular обнаружением изменений

## Использование

### Базовый пример

```typescript
import { Component } from '@angular/core'
import { SkyComponent } from '@sky-modules/angular'

@Component({
  selector: 'app-root',
  template: `
    <sky-component>
      Content goes here
    </sky-component>
  `
})
export class AppComponent {}
```

## Компиляция компонентов

Компоненты в этом пакете компилируются из Mitosis (`.lite.tsx`) исходных файлов, расположенных в директории `universal/`. Компиляция происходит автоматически во время сборки.

**Процесс сборки:**
```bash
# Компиляция Mitosis компонентов в Angular
sky mitosis build <app-name>
```

## Одноранговые зависимости

- `@angular/core` ^16.0.0 || ^17.0.0 || ^18.0.0

## Архитектура

Angular адаптер является частью кросс-фреймворк системы компонентов Sky Modules:
1. Универсальные компоненты определены в Mitosis
2. Компилируются в Angular во время сборки
3. Публикуются как Angular-совместимый пакет

## Импорт модуля

```typescript
import { NgModule } from '@angular/core'
import { SkyModulesModule } from '@sky-modules/angular'

@NgModule({
  imports: [
    SkyModulesModule
  ]
})
export class AppModule {}
```

## Связанные модули

- [@sky-modules/universal](../universal/) - Определения универсальных компонентов
- [@sky-modules/react](../react/) - React адаптер
- [@sky-modules/vue](../vue/) - Vue адаптер
- [@sky-modules/solid](../solid/) - Solid адаптер

## Примеры

Смотрите директорию [playground](../../playground/) для полных примеров.
