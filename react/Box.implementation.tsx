import { globalify } from '@sky-modules/core'
import { forwardRef, Ref, type ReactNode, isValidElement, cloneElement } from 'react'

import type { JSX } from 'react'

import { Argument, css, cx } from '~project/x/design-system/panda/css'
import { splitCssProps } from '~project/x/design-system/panda/jsx'
import { Box as PandaBox, BoxProps as PandaBoxProps } from '~project/x/design-system/panda/jsx/box'

/**
 * CSS styles passed to `sx` prop, supporting Tailwind-like utility classes
 */
type SxProps = Argument

/**
 * Base properties for Box component
 */
type BoxOwnProps = {
    /** Tailwind-style utility classes */
    sx?: SxProps
    /** Standard CSS class name */
    className?: string
    /** Child elements */
    children?: ReactNode
    /** When true, merges props into child element instead of wrapping */
    asChild?: boolean
}

/**
 * Props for Box rendering as HTML element
 */
type BoxElementProps<T extends keyof JSX.IntrinsicElements = 'div'> = BoxOwnProps &
    Omit<JSX.IntrinsicElements[T], 'className' | 'children'> & { as?: T }

/**
 * Props for Box rendering as custom component
 */
type BoxComponentProps<P extends {}> = BoxOwnProps & P & { as: (props: P) => ReactNode }

/**
 * Polymorphic Box component props
 *
 * Supports rendering as any HTML element or custom component
 */
export type BoxProps<T = 'div'> = T extends keyof JSX.IntrinsicElements
    ? BoxElementProps<T>
    : T extends (props: infer P extends {}) => ReactNode
      ? BoxComponentProps<P>
      : never

/**
 * Merges Box props with additional overrides
 *
 * @param boxProps - Base Box component props
 * @param overrides - Additional props to merge
 * @returns Combined props object
 *
 * @example
 * ```tsx
 * const baseProps = { padding: '4', className: 'base' }
 * const combined = mergeBoxProps(baseProps, { margin: '2' })
 * ```
 */
export function mergeBoxProps<
    T extends keyof JSX.IntrinsicElements | ((props: {}) => ReactNode),
    U extends {},
>(boxProps: BoxProps<T>, overrides: U): BoxProps<T> & U {
    return { ...boxProps, ...overrides }
}

/**
 * Universal Box component with Panda CSS and Tailwind support
 *
 * Polymorphic component that accepts:
 * - Panda CSS props (padding, margin, colors, etc.)
 * - Tailwind classes via `sx` prop
 * - Standard `className`
 * - `asChild` pattern for prop merging
 *
 * Globally available after import via `globalify()`
 *
 * @example
 * ```tsx
 * // Panda CSS props
 * <Box padding="4" backgroundColor="primary.500">
 *   Content
 * </Box>
 *
 * // Tailwind classes
 * <Box sx="hover:shadow-lg transition-all">
 *   Hover me
 * </Box>
 *
 * // Mixed styling
 * <Box padding="4" sx="hover:bg-blue-100" className="custom">
 *   Combined styles
 * </Box>
 *
 * // AsChild pattern
 * <Box asChild padding="4">
 *   <button>Styled button</button>
 * </Box>
 *
 * // Polymorphic as
 * <Box as="section" padding="8">
 *   Semantic HTML
 * </Box>
 * ```
 */
const Box = forwardRef(function Box(
    props:
        | BoxProps<keyof JSX.IntrinsicElements>
        | (BoxProps<(props: {}) => ReactNode> & PandaBoxProps),
    ref: Ref<HTMLElement>
): ReactNode {
    const { as: Element = 'div', sx, className, children, asChild, ...allProps } = props

    // Split Panda CSS props from regular props
    const [cssProps, restProps] = splitCssProps(allProps)

    // Generate className from Panda style props
    const pandaClassName = css(cssProps)

    // Combine all classNames: sx, className, and Panda props
    const combinedClass = cx(className, pandaClassName, sx)

    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            ...restProps,
            // @ts-expect-error className
            className: cx((children.props as { className?: string }).className, combinedClass),
            ref,
        })
    }

    return (
        // @ts-expect-error PandaBox
        <PandaBox {...restProps} as={Element} className={combinedClass}>
            {children}
        </PandaBox>
    )
})

globalify({ Box })
