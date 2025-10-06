import { ClassValue } from 'clsx'
import { HTMLStyledProps } from 'sky/.dev/styled-system/types'

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
    type PandaProps = Omit<
        {
            [P in keyof HTMLStyledProps<'div'>]: HTMLStyledProps<'div'>[P] | undefined
        },
        'ref' | 'children' | 'className' | 'class'
    >
    type BoxOwnProps = {
        sx?: BoxSxProp | undefined
        children?: Mitosis.Children | undefined
        asChild?: boolean | undefined
        ref?: Mitosis.Ref | undefined
        class?: ClassValue | undefined
        className?: ClassValue | undefined
    }

    // HTML element props - only for HTML elements
    type BoxElementProps<T extends TagName = 'div'> = Partial<
        Omit<HTMLElementTagNameMap[T], 'class' | 'className' | 'children'>
    > & {
        as?: T | undefined
    }

    // Function component props - only for components with exact known props
    type BoxComponentProps<P extends Record<string, unknown>> = P & {
        as?: ((props: P) => Mitosis.Node) | TagName | undefined
    }

    type BoxAs = TagName | ((props: {}) => Mitosis.Node)

    type BoxProps<T = 'div'> = T extends TagName
        ? BoxElementProps<T> & BoxOwnProps
        : T extends (props: infer P extends Record<string, unknown>) => Mitosis.Node
          ? BoxComponentProps<P> & BoxOwnProps
          : never

    // Universal Box function with union types for strict typing
    function Box<T extends BoxAs = 'div'>(
        props:
            | (BoxElementProps<T extends TagName ? T : 'div'> & PandaProps)
            | (BoxComponentProps<
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  T extends (...args: any[]) => any ? Parameters<T>[0] : Record<string, unknown>
              > &
                  PandaProps)
    ): Mitosis.Node
}
