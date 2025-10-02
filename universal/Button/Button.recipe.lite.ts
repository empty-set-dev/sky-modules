import { recipe } from '@sky-modules/design/recipe'

export const buttonRecipe = recipe({
    base: 'button',
    variants: {
        variant: {
            primary: 'button--primary',
            secondary: 'button--secondary',
            outline: 'button--outline',
            ghost: 'button--ghost',
            danger: 'button--danger',
        },
        size: {
            sm: 'button--sm',
            md: 'button--md',
            lg: 'button--lg',
        },
        disabled: {
            true: 'button--disabled',
        },
        loading: {
            true: 'button--loading',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
})