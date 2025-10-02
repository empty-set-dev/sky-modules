import { recipe } from '@sky-modules/design/recipe'

export const dropdownContentRecipe = recipe({
    base: 'dropdown-content',
    variants: {
        variant: {
            default: 'dropdown-content--default',
            menu: 'dropdown-content--menu',
            popover: 'dropdown-content--popover',
            tooltip: 'dropdown-content--tooltip',
        },
        size: {
            sm: 'dropdown-content--size-sm',
            md: 'dropdown-content--size-md',
            lg: 'dropdown-content--size-lg',
            auto: 'dropdown-content--size-auto',
        },
        maxHeight: {
            none: 'dropdown-content--max-height-none',
            sm: 'dropdown-content--max-height-sm',
            md: 'dropdown-content--max-height-md',
            lg: 'dropdown-content--max-height-lg',
            xl: 'dropdown-content--max-height-xl',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
        maxHeight: 'md',
    },
})