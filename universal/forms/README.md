# Forms

Form field components with labels, helper text, and error messages.

## Components

### Field

Compound component for structured form fields.

```tsx
import Field from '@sky-modules/universal/forms/Field'

<Field>
  <Field.Label>Username</Field.Label>
  <input type="text" />
  <Field.HelperText>Enter your username</Field.HelperText>
  <Field.ErrorText>Invalid username</Field.ErrorText>
</Field>
```

**Subcomponents:**
- `Field.Root` - Container wrapper
- `Field.Label` - Input label
- `Field.HelperText` - Helper text below input
- `Field.ErrorText` - Error message display

**Global:**
```tsx
import '@sky-modules/universal/forms/Field/global'
```

**Mitosis:** Compiles to React, Vue, Solid, Svelte, Qwik, Angular
