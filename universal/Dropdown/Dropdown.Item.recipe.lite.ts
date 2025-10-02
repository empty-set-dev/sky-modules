import { recipe } from '@sky-modules/design/recipe'

export const dropdownItemRecipe = recipe({
    base: 'dropdown-item',
    variants: {
        variant: {
            default: 'dropdown-item--default',
            ghost: 'dropdown-item--ghost',
            subtle: 'dropdown-item--subtle',
        },
        size: {
            sm: 'dropdown-item--size-sm',
            md: 'dropdown-item--size-md',
            lg: 'dropdown-item--size-lg',
        },
        destructive: {
            true: 'dropdown-item--destructive',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
})