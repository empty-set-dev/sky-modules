# Sky Modules - Контекст работы и TODO

**Дата**: 2025-12-06
**Ветка**: `@anyasky91`
**Последний коммит**: `ec2bc0fa` - Fix and normalize all module dependency declarations

---

## ✅ Завершённые задачи

### 1. Globalify Define Registration
**Проблема**: Функция `globalify` не была зарегистрирована в системе define.

**Решение**:
- Создан `core/globalify/register.ts` - регистрирует globalify без циркулярных зависимостей
- Модифицирован `core/globalify/index.ts` - импортирует register.ts
- Создан тест `core/globalify/__spec__/globalify.define.spec.ts` - валидация регистрации

**Результат**: ✅ 14/14 тестов globalify проходят

### 2. Fix core/define Tests
**Проблема**: Тесты падали из-за ошибок в декораторах и runtime проверках.

**Решения**:
- **define.spec.ts**: Убрана установка `isRuntime = true` (конфликтовала с define())
- **types.ts**: Исправлены декораторы `@object`, `@array`, `@map`, `@set`, `@promise`
  - Было: `reactivePropertyDescriptor(string, key, index)` ❌
  - Стало: `reactivePropertyDescriptor(schema, key, index)` ✅
- **reactive.ts**: Исправлена логика обработки class vs schema objects (line 149)

**Результат**: ✅ 55/55 тестов core/define проходят

### 3. Fix features/effect Tests
**Проблема**: Неправильные пути импортов в `EffectBase.spec.ts`.

**Решение**:
- Изменены импорты с `'../Effect'` на `'../../Effect'`
- Аналогично для `ContextConstructor` и `EffectTree`

**Результат**: ✅ 40/40 тестов features/effect проходят

---

## 🔴 Найденные критические баги

### Bug #1: Неправильная проверка isRuntime в define.ts:72
**Файл**: `core/define/define.ts`
**Статус**: ✅ ИСПРАВЛЕН

```typescript
// ❌ БЫЛО (БАГ):
if (Internal.defines[name] != null && (!isRuntime || !isHot())) {

// ✅ СТАЛО:
if (Internal.defines[name] != null && (!isRuntime() || !isHot())) {
```

**Проблема**: `!isRuntime` проверял существование функции (всегда false), а не её результат.

**Последствия**: Дубликаты могли не детектироваться в некоторых случаях.

### Bug #2: Отсутствующий import makePlain в reactive.ts:90
**Файл**: `core/define/reactive.ts`
**Статус**: ✅ ЗАКОММЕНТИРОВАН (циркулярная зависимость)

```typescript
// TODO: Handle plain object schemas - requires resolving circular dependency with makePlain
// if (typeof schema === 'object') {
//     assume<{ [Internal.constructorSymbol]: object }>(schema)
//     schema[Internal.constructorSymbol] ??= makePlain(schema)
// }
```

**Проблема**:
- `makePlain` использовался без import
- Циркулярная зависимость: `reactive.ts` ↔ `makePlain.ts`

**Текущее состояние**: Код закомментирован, все тесты проходят (код не используется).

**Требуется**: Решить циркулярную зависимость для поддержки plain object schemas.

### Bug #3: Лишний #defines в package.json
**Файл**: Множественные `package.json` в модулях
**Статус**: ❌ НЕ ИСПРАВЛЕН

```json
{
    "imports": {
        "#defines": ["../.dev/defines/*"],  // ❌ Выходит за пределы пакета!
        "#setup": ["./setup"],              // ✅ OK
        "#/*": ["./*"],                     // ✅ OK
        "#server/*": ["./server/*"]         // ✅ OK
    }
}
```

**Проблема**: `#defines` указывает на `../.dev/` - сломается при установке через npm.

**Факт**: `#defines` нигде не используется (проверено grep).

**Затронутые файлы**:
- `behavior/package.json`
- `database/package.json`
- `design/package.json`
- `crypto/package.json`
- `svelte/package.json`
- `core/package.json`
- И другие (~10 файлов)

---

## 📋 TODO список

### Приоритет 1: Критические баги

- [ ] **Удалить `#defines` из всех package.json**
  - Найти все файлы: `find . -name "package.json" -not -path "*/node_modules/*"`
  - Удалить строку `"#defines": ["../.dev/defines/*"],` из каждого
  - Запустить тесты для проверки

- [ ] **Решить циркулярную зависимость reactive ↔ makePlain**
  - Вариант 1: Переместить `makePlain` логику в `reactive.ts`
  - Вариант 2: Создать третий модуль-посредник
  - Вариант 3: Lazy import через dynamic import()

### Приоритет 2: Валидация тестов

- [ ] **Запустить полный набор тестов**
  ```bash
  rm -rf .dev/vitest && sky test
  ```
  - Убедиться что core modules проходят
  - Проверить canvas tests (13 известных failures)

- [ ] **Проверить логику реактивности**
  - Убедиться что Solid.js signals работают корректно
  - Проверить batch updates в `queueCommit`
  - Проверить observe/unobserve для вложенных объектов

### Приоритет 3: Документация

- [ ] **Добавить тесты для plain object schemas**
  - Создать тест с `schema()` function
  - Проверить работу `makePlain` после fix циркулярной зависимости

- [ ] **Обновить комментарии в коде**
  - Добавить объяснение почему `isRuntime()` вызов нужен
  - Документировать TODO для makePlain

---

## 🧪 Текущее состояние тестов

### Core Modules: ✅ ПРОХОДЯТ
```
✓ core/define/__spec__/define.spec.ts (31 tests)
✓ core/define/__spec__/reactive.spec.ts (4 tests)
✓ core/define/__spec__/define.registration.spec.ts (1 test)
✓ core/defineMeasures/__spec__/defineMeasures.spec.ts (19 tests)
✓ core/globalify/__spec__/globalify.spec.ts (13 tests)
✓ core/globalify/__spec__/globalify.define.spec.ts (1 test)
✓ features/effect/internal/__spec__/EffectBase.spec.ts (15 tests)

Total: 84/84 passing ✅
```

### Canvas Module: ⚠️ 13 FAILURES (известные, не критичные)
Проблемы:
- `objectCache.size` undefined
- `animate()` function missing
- `createGeometryOrMaterial()` function missing
- Key generation not unique
- frameId type mismatch
- Reactivity timeout issues

---

## 🔧 Важные команды

### Тестирование
```bash
# Все тесты
sky test

# Конкретные модули
npx vitest run --config cli/dev-configs/vitest.config.js core/define

# С очисткой кэша
rm -rf .dev/vitest && sky test
```

### Git
```bash
# Текущая ветка
git checkout @anyasky91

# Статус
git status

# Коммит (только по запросу пользователя!)
git add .
git commit -m "..."
```

### Поиск
```bash
# Найти использование #defines
grep -r "from '#defines" --include="*.ts" --include="*.tsx"

# Найти package.json с imports
find . -name "package.json" -not -path "*/node_modules/*" -exec grep -l '"imports"' {} \;
```

---

## 📝 Важные замечания

1. **НЕ коммитить без разрешения пользователя**
   Проект использует хуки и специфичный workflow

2. **package.json "imports" vs tsconfig "paths"**
   - `package.json` - runtime Node.js (ОБЯЗАТЕЛЕН для npm пакетов)
   - `tsconfig.json` - compile-time TypeScript
   - Нужны ОБА для корректной работы

3. **`#/` imports активно используются**
   ```typescript
   import assume from '#/assume/assume'
   import Internal from '#/define/internal/internal'
   ```
   НЕ удалять `"#/*": ["./*"]` из package.json!

4. **Реактивность на Solid.js**
   - Lazy signal creation (performance)
   - Batch updates через Promise.resolve()
   - Nested observe/unobserve для объектов

5. **Canvas tests - известная проблема**
   13 тестов падают, но это не блокирует core функциональность

---

## 🎯 Следующие шаги

1. **Очистить `#defines`** из package.json файлов
2. **Запустить полный test suite** для финальной валидации
3. **Создать коммит** с описанием изменений (если пользователь одобрит)
4. **Решить makePlain циркулярную зависимость** (низкий приоритет)

---

## 📚 Полезные ссылки

- **CLAUDE.md**: `/Users/a/Space/Projects/EmptySet/sky-modules/CLAUDE.md`
- **Workspace Config**: `sky-workspace.config.ts`
- **Test Utils**: `cli/test-utils/`
- **Define System**: `core/define/`
- **Globalify**: `core/globalify/`

---

**Конец контекста** | Дата: 2025-12-06
