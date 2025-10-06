import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { flexRecipe } from './Flex.recipe.lite'

export default function Flex<T extends BoxAs = 'div'>(
    props: Design.SlotProps<T, typeof flexRecipe>
): Mitosis.Node {
    const {
        direction,
        wrap,
        align,
        justify,
        gap,
        grow,
        shrink,
        basis,
        unstyled,
        recipe,
        as,
        inputRef,
        ...restProps
    } = props
    const styles =
        recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis })
    return (
        <Box ref={inputRef} {...restProps} as={as ?? 'div'} sx={clsx(props.sx, unstyled || styles)}>
            {props.children}
        </Box>
    )
}
