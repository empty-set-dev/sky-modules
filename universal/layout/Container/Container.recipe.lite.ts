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
        },
        fluid: {
            true: 'container--fluid',
        },
        centerContent: {
            true: 'container--center-content',
        },
    },
})
