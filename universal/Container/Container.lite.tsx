import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { containerRecipe } from './Container.recipe.lite'

export default function Container<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof containerRecipe>
): Mitosis.Node {
    const { inputRef, size, padding, center, fluid, unstyled, recipe, as, ...restProps } = props
    const styles =
        recipe ??
        containerRecipe({
            size,
            padding,
            center,
            fluid,
        })
    return (
        <Box
            ref={inputRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
