import globalify from '@sky-modules/core/globalify'
import { ClassValue } from 'clsx'

import Box, * as lib from './Box'

type SxProps = ClassValue

// Base Box props
type BoxOwnProps = {
    sx?: undefined | SxProps
    children: Mitosis.Children
    asChild?: undefined | boolean
    ref?: undefined | Mitosis.Ref
}

// HTML element props
type BoxElementProps<T extends keyof HTMLElementTagNameMap = 'div'> = Partial<
    Omit<HTMLElementTagNameMap[T], 'children' | 'as'>
> & { as?: T } & BoxOwnProps

// Function component props
type BoxComponentProps<P = Record<string, unknown>> = Omit<P, 'as'> & {
    as?: (props: P) => Mitosis.Node
} & BoxOwnProps

declare global {
    namespace Mitosis {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Node = any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Children = any
        export type Ref = unknown
    }

    type TagName = keyof HTMLElementTagNameMap

    type BoxAs = TagName | ((props: Record<string, unknown>) => Mitosis.Node)

    type BoxProps<T extends BoxAs> = T extends (props: infer P) => Mitosis.Node
        ? BoxComponentProps<P>
        : T extends TagName
          ? BoxElementProps<T>
          : never

    function Box<T extends BoxAs = 'div'>(props: BoxProps<T>): Mitosis.Node
}

globalify({ Box, ...lib })
