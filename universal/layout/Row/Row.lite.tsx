import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { rowRecipe } from './Row.recipe.lite'

export type RowProps<T extends TagName = 'div'> = Design.SlotRootProps<typeof rowRecipe, T> & {
    inputRef?: unknown
}
export default function Row<T extends TagName = 'div'>(props: RowProps<T>): Mitosis.Node {
    const { gutter, unstyled, recipe, ...boxProps } = props
    const styles = unstyled || (recipe ?? rowRecipe)({ gutter })
    return (
        <Box {...boxProps} ref={props.inputRef} sx={clsx(props.sx, styles)}>
            {props.children}
        </Box>
    )
}
