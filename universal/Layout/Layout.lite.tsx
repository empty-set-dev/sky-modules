import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import LayoutHeader from './Layout.Header.lite'
import { layoutRecipe } from './Layout.recipe.lite'
import LayoutRoot from './Layout.Root.lite'

export default function Layout<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof layoutRecipe> & {
        // headerProps?: any
        // rootProps?: any
        // showHeader?: boolean
    }
): Mitosis.Node {
    return 'Header'
    // const {
    //     variant,
    //     header,
    //     footer,
    //     sidebar,
    //     aside,
    //     fullHeight,
    //     headerProps,
    //     rootProps,
    //     showHeader = true,
    //     unstyled,
    //     recipe,
    //     as,
    //     ...restProps
    // } = props
    // const styles =
    //     recipe ??
    //     layoutRecipe({
    //         variant,
    //         header,
    //         footer,
    //         sidebar,
    //         aside,
    //         fullHeight,
    //     })
    // const layoutRef = useRef(null)

    // return (
    //     <LayoutRoot
    //         variant={variant === 'dashboard' ? 'dashboard' : 'app'}
    //         fullHeight={fullHeight}
    //         {...rootProps}
    //     >
    //         {showHeader && (
    //             <LayoutHeader
    //                 variant={variant === 'dashboard' ? 'toolbar' : 'navbar'}
    //                 {...headerProps}
    //             />
    //         )}
    //         <Box
    //             ref={layoutRef}
    //             {...restProps}
    //             as={as ?? ('main' as T)}
    //             sx={clsx(props.sx, unstyled || styles)}
    //         >
    //             {props.children}
    //         </Box>
    //     </LayoutRoot>
    // )
}
