import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import clsx from 'clsx'

import { flexRecipe } from './Flex.recipe.lite'

/**
 * Props for Flex component
 *
 * @template T - Element type (default: 'div')
 */
export type FlexProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof flexRecipe, T> & {
    /** Ref to the flex container element */
    inputRef?: unknown
}

/**
 * Flex layout component with Panda CSS styling
 *
 * Flexible box layout container with props for direction, wrap, alignment,
 * justification, gap, and flex properties (grow, shrink, basis).
 *
 * Compiled to all frameworks via Mitosis.
 *
 * @template T - Element type (default: 'div')
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example Basic usage
 * ```tsx
 * import Flex from '@sky-modules/universal/layout/Flex'
 *
 * <Flex direction="row" gap="4">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 * ```
 *
 * @example Column layout
 * ```tsx
 * <Flex direction="column" align="center" justify="center">
 *   <h1>Title</h1>
 *   <p>Content</p>
 * </Flex>
 * ```
 *
 * @example Responsive
 * ```tsx
 * <Flex wrap="wrap" gap="2">
 *   {items.map(item => <div key={item.id}>{item.name}</div>)}
 * </Flex>
 * ```
 *
 * @example Global usage
 * ```tsx
 * import '@sky-modules/universal/layout/Flex/global'
 *
 * <Flex>Available globally</Flex>
 * ```
 */
export default function Flex<T extends BoxAs = 'div'>(props: FlexProps<T>): Mitosis.Node {
    const {
        direction,
        wrap,
        align,
        justify,
        gap,
        grow,
        shrink,
        basis,

        inputRef,
        unstyled,
        recipe,
        sx,
        ...boxProps
    } = props
    const styles =
        unstyled ||
        (recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis }))
    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
