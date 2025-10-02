import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { containerRecipe } from './Container.recipe.lite'

export default function Container<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof containerRecipe>
): Mitosis.Node {
    const {
        size,
        padding,
        center,
        fluid,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        containerRecipe({
            size,
            padding,
            center,
            fluid,
        })
    const containerRef = useRef(null)
    return (
        <Box
            ref={containerRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}