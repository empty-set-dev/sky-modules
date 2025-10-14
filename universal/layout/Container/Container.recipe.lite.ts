import { recipe } from '@sky-modules/design/recipe'

export const containerRecipe = recipe({
    base: 'container',
    variants: {
        size: {
            xs: 'container--size-xs',
            sm: 'container--size-sm',
            md: 'container--size-md',
            lg: 'container--size-lg',
            xl: 'container--size-xl',
            '2xl': 'container--size-2xl',
            '3xl': 'container--size-3xl',
            '4xl': 'container--size-4xl',
            '5xl': 'container--size-5xl',
            '6xl': 'container--size-6xl',
            '7xl': 'container--size-7xl',
            full: 'container--size-full',
        },
        padding: {
            none: 'container--padding-none',
            xs: 'container--padding-xs',
            sm: 'container--padding-sm',
            md: 'container--padding-md',
            lg: 'container--padding-lg',
            xl: 'container--padding-xl',
        },
        center: {
            true: 'container--center',
        },
        fluid: {
            true: 'container--fluid',
        },
    },
    defaultVariants: {
        size: 'lg',
        padding: 'md',
        center: true,
    },
})