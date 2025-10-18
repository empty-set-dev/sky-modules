import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import LayoutHeader from './Layout.Header/Layout.Header.lite'
import { layoutRecipe } from './Layout.recipe.lite'
import LayoutRoot from './Layout.Root/Layout.Root.lite'

Layout.Header = LayoutHeader
Layout.Root = LayoutRoot
export type LayoutProps<T extends TagName = 'div'> = Design.SlotProps<typeof layoutRecipe, T> & {
    inputRef?: unknown
}
export default function Layout<T extends TagName = 'div'>(props: LayoutProps<T>): Mitosis.Node {
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
