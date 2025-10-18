import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { flexRecipe } from './Flex.recipe.lite'

export type FlexProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof flexRecipe, T> & {
    inputRef?: unknown
}

export default function Flex<T extends BoxAs = 'div'>(props: FlexProps<T>): Mitosis.Node {
    const {
        direction,
        wrap,
        align,
        justify,
        gap,
        grow,
        shrink,
        basis,

        inputRef,
        unstyled,
        recipe,
        sx,
        ...boxProps
    } = props
    const styles =
        unstyled ||
        (recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis }))
    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
