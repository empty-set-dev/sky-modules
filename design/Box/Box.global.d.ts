import Mitosis from '@sky-modules/universal/Mitosis'
import { ClassValue } from 'clsx'

import type { HTMLStyledProps } from './types'
type TagName = keyof HTMLElementTagNameMap

declare global {
    /**
     * Type for Tailwind/utility classes used in Box sx prop
     *
     * Accepts single class, array of classes, or conditional classes via clsx
     *
     * @example
     * ```tsx
     * <Box sx="flex items-center gap-4" />
     * <Box sx={["flex", isActive && "bg-blue-500"]} />
     * ```
     */
    type BoxSxProp = ClassValue

    /**
     * Panda CSS design system properties
     *
     * Includes all CSS properties with design token support
     * Excludes ref, children, className, class which are handled separately
     */
    type PandaProps = Omit<HTMLStyledProps<'div'>, 'ref' | 'children' | 'className' | 'class'>

    /**
     * Core Box component properties
     *
     * Combines Panda CSS props with styling and behavior props
     *
     * @property sx - Tailwind/utility classes
     * @property children - Child elements
     * @property asChild - Merge props with child element instead of wrapping
     * @property ref - Element reference
     * @property class - CSS class (framework-specific)
     * @property className - CSS class (React-style)
     */
    type BoxOwnProps = PandaProps & {
        sx?: BoxSxProp | undefined
        children?: Mitosis.Children | undefined
        asChild?: boolean | undefined
        ref?: Mitosis.Ref | undefined
        class?: ClassValue | undefined
        className?: ClassValue | undefined
    }

    /**
     * Box props when rendered as an HTML element
     *
     * Combines Box props with native HTML element attributes
     *
     * @template T - HTML element tag name (default: 'div')
     *
     * @example
     * ```tsx
     * const props: BoxElementProps<'button'> = {
     *   as: 'button',
     *   onClick: () => {},
     *   padding: '4'
     * }
     * ```
     */
    type BoxElementProps<T extends TagName = 'div'> = {
        as?: T
    } & BoxOwnProps &
        Partial<Omit<HTMLElementTagNameMap[T], 'class' | 'className' | 'children'>>

    /**
     * Box props when rendered as a component
     *
     * Combines Box props with component's own props
     *
     * @template P - Component props type
     *
     * @example
     * ```tsx
     * const MyButton = (props: { label: string }) => <button>{props.label}</button>
     * const props: BoxComponentProps<{ label: string }> = {
     *   as: MyButton,
     *   label: 'Click me',
     *   padding: '4'
     * }
     * ```
     */
    type BoxComponentProps<P> = {
        as?: ((props: P) => Mitosis.Node) | TagName
    } & BoxOwnProps &
        P

    /**
     * Valid values for Box 'as' prop
     *
     * Can be HTML tag name or component function
     */
    type BoxAs = TagName | ((props: object) => Mitosis.Node)

    /**
     * Polymorphic Box props type
     *
     * Automatically infers correct props based on 'as' prop value
     *
     * @template T - Element tag or component type (default: 'div')
     *
     * @example
     * ```tsx
     * // HTML element
     * const divProps: BoxProps<'div'> = { padding: '4' }
     * const buttonProps: BoxProps<'button'> = { onClick: () => {}, padding: '4' }
     *
     * // Component
     * type MyProps = { label: string }
     * const MyComponent = (props: MyProps) => <div>{props.label}</div>
     * const compProps: BoxProps<typeof MyComponent> = { label: 'Text', padding: '4' }
     * ```
     */
    type BoxProps<T = 'div'> = T extends TagName
        ? BoxElementProps<T>
        : T extends (props: infer P) => Mitosis.Node
          ? BoxComponentProps<P>
          : never

    /**
     * Universal polymorphic Box component
     *
     * Provides a flexible container with design system integration, supporting:
     * - Panda CSS design system props
     * - Tailwind/utility classes via sx prop
     * - Polymorphic rendering (any HTML element or component)
     * - asChild pattern for prop merging
     * - Cross-framework compatibility
     *
     * @template T - Element tag or component type (default: 'div')
     *
     * @example
     * Basic usage:
     * ```tsx
     * <Box padding="4" backgroundColor="primary.500">
     *   Content
     * </Box>
     * ```
     *
     * @example
     * With Tailwind:
     * ```tsx
     * <Box sx="flex items-center gap-4" padding="2">
     *   Combined styling
     * </Box>
     * ```
     *
     * @example
     * Polymorphic (render as different element):
     * ```tsx
     * <Box as="button" onClick={() => {}} padding="4">
     *   Button
     * </Box>
     * ```
     *
     * @example
     * asChild pattern (merge props with child):
     * ```tsx
     * <Box asChild padding="4" backgroundColor="blue.100">
     *   <button>Styled button</button>
     * </Box>
     * ```
     *
     * @example
     * Render as component:
     * ```tsx
     * <Box as={MyComponent} customProp="value" padding="4">
     *   Component content
     * </Box>
     * ```
     */
    function Box<T extends BoxAs = 'div'>(props: BoxProps<T>): Mitosis.Node
}
