import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { rowRecipe } from './Row.recipe.lite'

export default function Row<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof rowRecipe>
): Mitosis.Node {
    const {
        gutter,
        align,
        justify,
        wrap,
        reverse,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        rowRecipe({
            gutter,
            align,
            justify,
            wrap,
            reverse,
        })
    const rowRef = useRef(null)
    return (
        <Box
            ref={rowRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}