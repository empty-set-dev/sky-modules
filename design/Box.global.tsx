import globalify from '@sky-modules/core/globalify'
import Box, * as lib from '@sky-modules/react/Box'
import { ClassValue } from 'clsx'

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
    }

    // HTML element props - only for HTML elements
    type BoxElementProps<T extends TagName = 'div'> = BoxOwnProps &
        Partial<Omit<HTMLElementTagNameMap[T], 'class' | 'className' | 'children' | 'as'>> & {
            as?: T | undefined
        }

    // Function component props - only for components
    type BoxComponentProps<P extends {}> = BoxOwnProps & P & { as: (props: P) => Mitosis.Node }

    type BoxAs = TagName | ((props: {}) => Mitosis.Node)

    type BoxProps<T = 'div'> = T extends TagName
        ? BoxElementProps<T>
        : T extends (props: infer P extends {}) => Mitosis.Node
          ? BoxComponentProps<P>
          : never

    // Generic function for better type inference
    function Box<T extends TagName = 'div'>(props: BoxElementProps<T>): Mitosis.Node
    function Box<P extends {}>(props: BoxComponentProps<P>): Mitosis.Node
}

globalify({ Box, ...lib })
