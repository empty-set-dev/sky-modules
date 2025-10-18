import { recipe } from '@sky-modules/design/recipe'

export const flexRecipe = recipe({
    base: 'flex',
    variants: {
        direction: {
            row: 'flex--direction-row',
            column: 'flex--direction-column',
            'row-reverse': 'flex--direction-row-reverse',
            'column-reverse': 'flex--direction-column-reverse',
        },
        wrap: {
            true: 'flex--wrap',
            reverse: 'flex--wrap-reverse',
        },
        align: {
            start: 'flex--align-start',
            center: 'flex--align-center',
            end: 'flex--align-end',
            stretch: 'flex--align-stretch',
            baseline: 'flex--align-baseline',
        },
        justify: {
            start: 'flex--justify-start',
            center: 'flex--justify-center',
            end: 'flex--justify-end',
            between: 'flex--justify-between',
            around: 'flex--justify-around',
            evenly: 'flex--justify-evenly',
        },
        gap: {
            none: 'flex--gap-none',
            xs: 'flex--gap-xs',
            sm: 'flex--gap-sm',
            md: 'flex--gap-md',
            lg: 'flex--gap-lg',
            xl: 'flex--gap-xl',
        },
        grow: {
            true: 'flex--grow',
            0: 'flex--grow-0',
        },
        shrink: {
            true: 'flex--shrink',
            0: 'flex--shrink-0',
        },
        basis: {
            auto: 'flex--basis-auto',
            full: 'flex--basis-full',
            '1/2': 'flex--basis-1-2',
            '1/3': 'flex--basis-1-3',
            '2/3': 'flex--basis-2-3',
            '1/4': 'flex--basis-1-4',
            '3/4': 'flex--basis-3-4',
        },
    },
    defaultVariants: {
        direction: 'row',
        align: 'stretch',
        justify: 'start',
        gap: 'none',
    },
})
