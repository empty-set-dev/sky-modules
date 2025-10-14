import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { flexRecipe } from './Flex.recipe.lite'

export type FlexProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof flexRecipe> & {
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
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis })
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? 'div'}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
