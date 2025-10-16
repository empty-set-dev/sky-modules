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
    type PandaProps = Omit<HTMLStyledProps<'div'>, 'ref' | 'children' | 'className' | 'class'>
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
        as?: T
    } & BoxOwnProps

    // Function component props - only for components with exact known props
    type BoxComponentProps<P> = P & {
        as?: ((props: P) => Mitosis.Node) | TagName
    } & BoxOwnProps

    type BoxAs = TagName | ((props: object) => Mitosis.Node)

    type BoxProps<T = 'div'> = T extends TagName
        ? BoxElementProps<T> & BoxOwnProps & PandaProps
        : T extends (props: infer P) => Mitosis.Node
          ? BoxComponentProps<P> & BoxOwnProps & PandaProps
          : never

    function Box<T extends BoxAs = 'div'>(props: BoxProps<T>): Mitosis.Node
}
