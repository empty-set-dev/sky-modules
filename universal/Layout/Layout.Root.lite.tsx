import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { layoutRootRecipe } from './Layout.Root.recipe.lite'

export type LayoutRootProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof layoutRootRecipe> & {
    inputRef?: unknown
}

export default function LayoutRoot<T extends TagName = 'div'>(props: LayoutRootProps<T>): Mitosis.Node {
    const {
        // variant,
        fullHeight,
        fullWidth,
        overflow,
        direction,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        layoutRootRecipe({
            // variant,
            fullHeight,
            fullWidth,
            overflow,
            direction,
        })
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}