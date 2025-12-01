# Forms

Компоненты полей форм с метками, вспомогательным текстом и сообщениями об ошибках.

## Компоненты

### Field

Составной компонент для структурированных полей формы.

```tsx
import Field from '@sky-modules/universal/forms/Field'

<Field>
  <Field.Label>Имя пользователя</Field.Label>
  <input type="text" />
  <Field.HelperText>Введите имя пользователя</Field.HelperText>
  <Field.ErrorText>Неверное имя пользователя</Field.ErrorText>
</Field>
```

**Подкомпоненты:**
- `Field.Root` - Контейнер-обертка
- `Field.Label` - Метка поля
- `Field.HelperText` - Вспомогательный текст под полем
- `Field.ErrorText` - Отображение сообщения об ошибке

**Глобально:**
```tsx
import '@sky-modules/universal/forms/Field/global'
```

**Mitosis:** Компилируется в React, Vue, Solid, Svelte, Qwik, Angular
