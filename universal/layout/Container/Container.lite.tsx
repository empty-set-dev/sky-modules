import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Container.lite.css'

import clsx from 'clsx'

import { containerRecipe } from './Container.recipe.lite'

export type ContainerProps<T extends BoxAs = 'div'> = Design.SlotRootProps<
    typeof containerRecipe,
    T
> & {
    inputRef?: unknown
}
export default function Container<T extends BoxAs = 'div'>(props: ContainerProps<T>): Mitosis.Node {
    const { size, fluid, centerContent, unstyled, recipe, ...boxProps } = props
    const styles = unstyled || (recipe ?? containerRecipe)({ size, fluid, centerContent })
    return (
        <Box {...boxProps} ref={props.inputRef} sx={clsx(props.sx, styles)}>
            {props.children}
        </Box>
    )
}
