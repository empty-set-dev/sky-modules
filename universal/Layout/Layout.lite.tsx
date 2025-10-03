import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import LayoutHeader from './Layout.Header.lite'
import { layoutRecipe } from './Layout.recipe.lite'
import LayoutRoot from './Layout.Root.lite'

type LayoutProps = Design.SlotProps<T, typeof layoutRecipe> & {
    rootProps?: unknown
    showHeader?: boolean
    headerProps?: unknown
}

export default function Layout<T extends TagName = 'div'>(props: LayoutProps): Mitosis.Node {
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
    const inputRef = useRef(null)
    return (
        <LayoutRoot ref={inputRef} fullHeight={fullHeight}>
            {showHeader && <LayoutHeader />}
            <Box {...restProps} as={as ?? ('main' as T)} sx={clsx(props.sx, unstyled || styles)}>
                {props.children}
            </Box>
        </LayoutRoot>
    )
}
