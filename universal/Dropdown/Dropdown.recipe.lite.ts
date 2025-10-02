import { recipe } from '@sky-modules/design/recipe'

export const dropdownRecipe = recipe({
    base: 'dropdown',
    variants: {
        variant: {
            default: 'dropdown--default',
            menu: 'dropdown--menu',
            select: 'dropdown--select',
            combobox: 'dropdown--combobox',
            context: 'dropdown--context',
        },
        size: {
            sm: 'dropdown--size-sm',
            md: 'dropdown--size-md',
            lg: 'dropdown--size-lg',
        },
        shadow: {
            none: 'dropdown--shadow-none',
            sm: 'dropdown--shadow-sm',
            md: 'dropdown--shadow-md',
            lg: 'dropdown--shadow-lg',
        },
        border: {
            none: 'dropdown--border-none',
            subtle: 'dropdown--border-subtle',
            solid: 'dropdown--border-solid',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        shadow: 'md',
        border: 'subtle',
    },
})