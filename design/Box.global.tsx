import { ClassValue } from 'clsx'

import { BoxProps as PandaBoxProps } from '../.dev/styled-system/jsx/box'

declare global {
    namespace Mitosis {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Node = any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Children = any
        export type Ref = unknown
    }

    type TagName = keyof HTMLElementTagNameMap

    type BoxSxProp = ClassValue

    // Base Box props
    type BoxOwnProps = {
        sx?: BoxSxProp | undefined
        children?: Mitosis.Children | undefined
        asChild?: boolean | undefined
        ref?: Mitosis.Ref | undefined
        class?: ClassValue | undefined
        className?: ClassValue | undefined
    } & PandaBoxProps

    // HTML element props - only for HTML elements
    type BoxElementProps<T extends TagName = 'div'> = BoxOwnProps &
        Partial<Omit<HTMLElementTagNameMap[T], 'class' | 'className' | 'children' | 'as'>> & {
            as?: T | undefined
        }

    // Function component props - only for components with exact known props
    type BoxComponentProps<P extends Record<string, never>> = BoxOwnProps &
        P & { as?: ((props: P) => Mitosis.Node) | undefined }

    type BoxAs = TagName | ((props: Record<string, never>) => Mitosis.Node)

    type BoxProps<T = 'div'> = T extends TagName
        ? BoxElementProps<T>
        : T extends (props: infer P extends Record<string, never>) => Mitosis.Node
          ? BoxComponentProps<P>
          : never

    // Generic function for better type inference
    function Box<T extends TagName = 'div'>(props: BoxElementProps<T>): Mitosis.Node
    function Box<P extends Record<string, never>>(props: BoxComponentProps<P>): Mitosis.Node
}
