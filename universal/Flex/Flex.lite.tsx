import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { flexRecipe } from './Flex.recipe.lite'

export default function Flex<T extends TagName = 'div'>(
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
        ...restProps
    } = props
    const styles =
        recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis })
    const flexRef = useRef(null)
    return (
        <Box
            ref={flexRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
