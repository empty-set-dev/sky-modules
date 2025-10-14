import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import LayoutHeader from './Layout.Header.lite'
import { layoutRecipe } from './Layout.recipe.lite'
import LayoutRoot from './Layout.Root.lite'

export type LayoutProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof layoutRecipe> & {
    inputRef?: unknown
    rootProps?: unknown
    showHeader?: boolean
    headerProps?: unknown
}

export default function Layout<T extends TagName = 'div'>(props: LayoutProps<T>): Mitosis.Node {
    const {
        variant,
        header,
        footer,
        sidebar,
        aside,
        fullHeight,
        headerProps,
        rootProps,
        showHeader = true,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        layoutRecipe({
            variant,
            header,
            footer,
            sidebar,
            aside,
            fullHeight,
        })
    return (
        <LayoutRoot ref={props.inputRef} fullHeight={fullHeight}>
            {showHeader && <LayoutHeader />}
            <Box {...restProps} as={as ?? ('main' as T)} sx={clsx(props.sx, unstyled || styles)}>
                {props.children}
            </Box>
        </LayoutRoot>
    )
}
