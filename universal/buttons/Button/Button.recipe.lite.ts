import { recipe } from '@sky-modules/design/recipe'

export const buttonRecipe = recipe({
    base: 'button',

    variants: {
        size: {
            xs: 'button--xs',
            sm: 'button--sm',
            md: 'button--md',
            lg: 'button--lg',
            xl: 'button--xl',
            '2xl': 'button--2xl',
            '3xl': 'button--3xl',
        },

        variant: {
            solid: 'button--solid',
            subtle: 'button--subtle',
            surface: 'button--surface',
            outline: 'button--outline',
            ghost: 'button--ghost',
            plain: 'button--plain',
        },

        rounded: {
            xs: 'button--rounded-xs',
            sm: 'button--rounded-sm',
            md: 'button--rounded-md',
            lg: 'button--rounded-lg',
            xl: 'button--rounded-xl',
            '2xl': 'button--rounded-2xl',
            '3xl': 'button--rounded-3xl',
            full: 'button--rounded-full',
        },

        disabled: {
            true: 'button--disabled',
        },

        loading: {
            true: 'button--loading',
        },

        highContrast: {
            true: 'button--high-contrast',
        },

        brand: {
            true: 'button--brand',
        },

        primary: {
            true: 'button--primary',
        },

        secondary: {
            true: 'button--secondary',
        },

        tertiary: {
            true: 'button--tertiary',
        },
    },

    defaultVariants: {
        size: 'md',
    },
})
