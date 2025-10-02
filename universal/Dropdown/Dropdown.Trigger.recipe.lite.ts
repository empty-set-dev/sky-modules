import { recipe } from '@sky-modules/design/recipe'

export const dropdownTriggerRecipe = recipe({
    base: 'dropdown-trigger',
    variants: {
        variant: {
            default: 'dropdown-trigger--default',
            outline: 'dropdown-trigger--outline',
            ghost: 'dropdown-trigger--ghost',
            link: 'dropdown-trigger--link',
            icon: 'dropdown-trigger--icon',
        },
        size: {
            sm: 'dropdown-trigger--size-sm',
            md: 'dropdown-trigger--size-md',
            lg: 'dropdown-trigger--size-lg',
        },
        fullWidth: {
            true: 'dropdown-trigger--full-width',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'md',
    },
})