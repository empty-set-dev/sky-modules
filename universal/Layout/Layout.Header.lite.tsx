import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { layoutHeaderRecipe } from './Layout.Header.recipe.lite'

export type LayoutHeaderProps<T extends TagName = 'header'> = Design.SlotProps<T, typeof layoutHeaderRecipe> & {
    inputRef?: unknown
}

export default function LayoutHeader<T extends TagName = 'header'>(props: LayoutHeaderProps<T>): Mitosis.Node {
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
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? ('header' as T)}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}