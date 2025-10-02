import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { layoutHeaderRecipe } from './Layout.Header.recipe.lite'

export default function LayoutHeader<T extends TagName = 'header'>(
    props: Design.SlotProps<T, typeof layoutHeaderRecipe>
): Mitosis.Node {
    const {
        variant,
        sticky,
        shadow,
        border,
        background,
        height,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        layoutHeaderRecipe({
            variant,
            sticky,
            shadow,
            border,
            background,
            height,
        })
    const headerRef = useRef(null)
    return (
        <Box
            ref={headerRef}
            {...restProps}
            as={as ?? ('header' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}