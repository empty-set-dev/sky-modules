import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { containerRecipe } from './Container.recipe.lite'

export type ContainerProps<T extends BoxAs = 'div'> = Design.SlotProps<
    T,
    typeof containerRecipe
> & { inputRef?: unknown }

export default function Container<T extends BoxAs = 'div'>(props: ContainerProps<T>): Mitosis.Node {
    const { size, padding, center, fluid, unstyled, recipe, as, ...restProps } = props
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
            ref={props.inputRef}
            {...restProps}
            as={as ?? 'div'}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
