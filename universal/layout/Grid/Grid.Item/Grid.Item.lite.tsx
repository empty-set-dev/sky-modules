import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Grid.Item.lite.css'

import clsx from 'clsx'

import { gridItemRecipe } from './Grid.Item.recipe.lite'

export type GridItemProps<T extends BoxAs = 'div'> = Design.SlotRootProps<
    typeof gridItemRecipe,
    T
> & {
    inputRef?: unknown
}

export default function GridItem<T extends BoxAs = 'div'>(props: GridItemProps<T>): Mitosis.Node {
    const {
        colSpan,
        rowSpan,
        colStart,
        colEnd,
        rowStart,
        rowEnd,

        inputRef,
        unstyled,
        recipe,
        sx,
        ...boxProps
    } = props
    const styles =
        unstyled ||
        (recipe ??
            gridItemRecipe({
                colSpan,
                rowSpan,
                colStart,
                colEnd,
                rowStart,
                rowEnd,
            }))
    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
