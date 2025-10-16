import { recipe } from '@sky-modules/design/recipe'

export const rowRecipe = recipe({
    base: 'row',
    variants: {
        gutter: {
            none: 'row--gutter-none',
            xs: 'row--gutter-xs',
            sm: 'row--gutter-sm',
            md: 'row--gutter-md',
            lg: 'row--gutter-lg',
            xl: 'row--gutter-xl',
        },
    },
    defaultVariants: {
        gutter: 'md',
    },
})
