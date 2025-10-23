import { ClassValue } from 'clsx'

import type { HTMLStyledProps } from './types'

type TagName = keyof HTMLElementTagNameMap

declare global {
    type BoxSxProp = ClassValue

    // Base Box props
    type PandaProps = Omit<HTMLStyledProps<'div'>, 'ref' | 'children' | 'className' | 'class'>
    type BoxOwnProps = PandaProps & {
        sx?: BoxSxProp | undefined
        children?: Mitosis.Children | undefined
        asChild?: boolean | undefined
        ref?: Mitosis.Ref | undefined
        class?: ClassValue | undefined
        className?: ClassValue | undefined
    }

    // HTML element props - only for HTML elements
    type BoxElementProps<T extends TagName = 'div'> = {
        as?: T
    } & BoxOwnProps &
        Partial<Omit<HTMLElementTagNameMap[T], 'class' | 'className' | 'children'>>

    // Function component props - only for components with exact known props
    type BoxComponentProps<P> = {
        as?: ((props: P) => Mitosis.Node) | TagName
    } & BoxOwnProps &
        P

    type BoxAs = TagName | ((props: object) => Mitosis.Node)

    type BoxProps<T = 'div'> = T extends TagName
        ? BoxElementProps<T>
        : T extends (props: infer P) => Mitosis.Node
          ? BoxComponentProps<P>
          : never

    function Box<T extends BoxAs = 'div'>(props: BoxProps<T>): Mitosis.Node
}
