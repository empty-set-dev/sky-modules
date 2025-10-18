import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Grid.lite.css'

import clsx from 'clsx'

import GridItem from './Grid.Item/Grid.Item.lite'
import { gridRecipe } from './Grid.recipe.lite'

Grid.Item = GridItem
export type GridProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof gridRecipe, T> & {
    inputRef?: unknown
}
export default function Grid<T extends BoxAs = 'div'>(props: GridProps<T>): Mitosis.Node {
    const {
        inline,
        columns,
        rows,
        gap,
        columnGap,
        rowGap,
        areas,
        autoFlow,
        autoColumns,
        autoRows,

        inputRef,
        unstyled,
        recipe,
        sx,
        ...boxProps
    } = props
    const styles =
        unstyled ||
        (recipe ??
            gridRecipe({
                inline,
                columns,
                rows,
                gap,
                columnGap,
                rowGap,
                areas,
                autoFlow,
                autoColumns,
                autoRows,
            }))
    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
