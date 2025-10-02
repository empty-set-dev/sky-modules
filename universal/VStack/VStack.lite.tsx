import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { vstackRecipe } from './VStack.recipe.lite'

export default function VStack<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof vstackRecipe>
): Mitosis.Node {
    const { spacing, align, justify, wrap, reverse, unstyled, recipe, as, ...restProps } = props
    const styles = recipe ?? vstackRecipe({ spacing, align, justify, wrap, reverse })
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