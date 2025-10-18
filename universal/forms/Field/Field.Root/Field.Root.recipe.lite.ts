import { recipe } from '@sky-modules/design/recipe'

export const fieldRootRecipe = recipe({
    base: 'field-root',
    variants: {
        required: {
            true: 'field-root--required',
        },
        invalid: {
            true: 'field-root--invalid',
        },
        disabled: {
            true: 'field-root--disabled',
        },
        readOnly: {
            true: 'field-root--read-only',
        },
    },
})
