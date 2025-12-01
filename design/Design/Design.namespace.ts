import 'sky-jsx/global'

import '../Box/global'

declare global {
    /**
     * Design system utilities and types
     *
     * Provides helper types for building design system components with slots and recipes
     */
    namespace Design {
        /**
         * Props for slot root component with recipe support
         *
         * Combines Box props with recipe props and adds unstyled/recipe options
         *
         * @template R - Recipe function type
         * @template T - Element/component type (default: 'div')
         *
         * @example
         * ```typescript
         * type ButtonRootProps = Design.SlotRootProps<typeof buttonRecipe, 'button'>
         *
         * function ButtonRoot(props: ButtonRootProps) {
         *   const { recipe, unstyled, ...rest } = props
         *   return <Box as="button" {...rest} />
         * }
         * ```
         */
        type SlotRootProps<
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            R extends (props: any) => any,
            T extends BoxAs = 'div',
        > = BoxProps<T> &
            Partial<Exclude<Parameters<R>[0], undefined>> & {
                /**
                 * Skip default styling and use only provided props
                 */
                unstyled?: true | undefined
                /**
                 * Recipe function to apply styling
                 */
                recipe?: R | undefined
            }

        /**
         * Props for slot component
         *
         * Simple Box props with polymorphic element support
         *
         * @template T - Element/component type (default: 'div')
         *
         * @example
         * ```typescript
         * type ButtonIconProps = Design.SlotProps<'span'>
         *
         * function ButtonIcon(props: ButtonIconProps) {
         *   return <Box as="span" {...props} />
         * }
         * ```
         */
        type SlotProps<T extends BoxAs = 'div'> = BoxProps<T>
    }
}
