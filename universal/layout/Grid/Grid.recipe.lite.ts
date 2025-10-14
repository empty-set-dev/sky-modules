import { recipe } from '@sky-modules/design/recipe'

export const gridRecipe = recipe({
    base: 'grid',
    variants: {
        columns: {
            1: 'grid--columns-1',
            2: 'grid--columns-2',
            3: 'grid--columns-3',
            4: 'grid--columns-4',
            5: 'grid--columns-5',
            6: 'grid--columns-6',
            12: 'grid--columns-12',
            auto: 'grid--columns-auto',
            none: 'grid--columns-none',
        },
        rows: {
            1: 'grid--rows-1',
            2: 'grid--rows-2',
            3: 'grid--rows-3',
            4: 'grid--rows-4',
            5: 'grid--rows-5',
            6: 'grid--rows-6',
            auto: 'grid--rows-auto',
            none: 'grid--rows-none',
        },
        gap: {
            none: 'grid--gap-none',
            xs: 'grid--gap-xs',
            sm: 'grid--gap-sm',
            md: 'grid--gap-md',
            lg: 'grid--gap-lg',
            xl: 'grid--gap-xl',
        },
        columnGap: {
            none: 'grid--column-gap-none',
            xs: 'grid--column-gap-xs',
            sm: 'grid--column-gap-sm',
            md: 'grid--column-gap-md',
            lg: 'grid--column-gap-lg',
            xl: 'grid--column-gap-xl',
        },
        rowGap: {
            none: 'grid--row-gap-none',
            xs: 'grid--row-gap-xs',
            sm: 'grid--row-gap-sm',
            md: 'grid--row-gap-md',
            lg: 'grid--row-gap-lg',
            xl: 'grid--row-gap-xl',
        },
        areas: {
            layout: 'grid--areas-layout',
            sidebar: 'grid--areas-sidebar',
        },
        autoFlow: {
            row: 'grid--auto-flow-row',
            column: 'grid--auto-flow-column',
            dense: 'grid--auto-flow-dense',
        },
        autoColumns: {
            auto: 'grid--auto-columns-auto',
            min: 'grid--auto-columns-min',
            max: 'grid--auto-columns-max',
            fr: 'grid--auto-columns-fr',
        },
        autoRows: {
            auto: 'grid--auto-rows-auto',
            min: 'grid--auto-rows-min',
            max: 'grid--auto-rows-max',
            fr: 'grid--auto-rows-fr',
        },
    },
    defaultVariants: {
        gap: 'none',
    },
})