import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { rowRecipe } from './Row.recipe.lite'

export type RowProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof rowRecipe> & {
    inputRef?: unknown
}

export default function Row<T extends TagName = 'div'>(props: RowProps<T>): Mitosis.Node {
    const { gutter, align, justify, wrap, reverse, unstyled, recipe, as, ...restProps } = props
    const styles =
        recipe ??
        rowRecipe({
            gutter,
            align,
            justify,
            wrap,
            reverse,
        })
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
