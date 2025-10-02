import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { hstackRecipe } from './HStack.recipe.lite'

export default function HStack<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof hstackRecipe>
): Mitosis.Node {
    const { spacing, align, justify, wrap, reverse, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? hstackRecipe({ spacing, align, justify, wrap, reverse })
    const stackRef = useRef(null)
    return (
        <Box
            ref={stackRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}