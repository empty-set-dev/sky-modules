import { recipe } from '@sky-modules/design/recipe'

export const buttonRecipe = recipe({
    base: 'button',

    variants: {
        colorPalette: {
            // Neutral colors
            slate: 'button--slate',
            gray: 'button--gray',
            zinc: 'button--zinc',
            stone: 'button--stone',

            // Red spectrum
            red: 'button--red',
            rose: 'button--rose',
            pink: 'button--pink',
            fuchsia: 'button--fuchsia',

            // Orange spectrum
            orange: 'button--orange',
            amber: 'button--amber',
            yellow: 'button--yellow',
            lime: 'button--lime',

            // Green spectrum
            green: 'button--green',
            emerald: 'button--emerald',
            teal: 'button--teal',
            cyan: 'button--cyan',

            // Blue spectrum
            sky: 'button--sky',
            blue: 'button--blue',
            indigo: 'button--indigo',
            violet: 'button--violet',
            purple: 'button--purple',
        },

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
        variant: 'solid',
        size: 'md',
        primary: true,
    },
})
