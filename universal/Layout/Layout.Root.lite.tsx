import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { layoutRootRecipe } from './Layout.Root.recipe.lite'

export default function LayoutRoot<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof layoutRootRecipe>
): Mitosis.Node {
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
    const rootRef = useRef(null)
    return (
        <Box
            ref={rootRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}