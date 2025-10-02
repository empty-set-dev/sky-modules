import { recipe } from '@sky-modules/design/recipe'

export const vstackRecipe = recipe({
    base: 'vstack',
    variants: {
        spacing: {
            none: 'vstack--spacing-none',
            xs: 'vstack--spacing-xs',
            sm: 'vstack--spacing-sm',
            md: 'vstack--spacing-md',
            lg: 'vstack--spacing-lg',
            xl: 'vstack--spacing-xl',
        },
        align: {
            start: 'vstack--align-start',
            center: 'vstack--align-center',
            end: 'vstack--align-end',
            stretch: 'vstack--align-stretch',
        },
        justify: {
            start: 'vstack--justify-start',
            center: 'vstack--justify-center',
            end: 'vstack--justify-end',
            between: 'vstack--justify-between',
            around: 'vstack--justify-around',
            evenly: 'vstack--justify-evenly',
        },
        wrap: {
            true: 'vstack--wrap',
        },
        reverse: {
            true: 'vstack--reverse',
        },
    },
    defaultVariants: {
        spacing: 'md',
        align: 'stretch',
        justify: 'start',
    },
})