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
type BoxElementProps<T extends keyof HTMLElementTagNameMap = 'div'> = BoxOwnProps &
    Partial<Omit<HTMLElementTagNameMap[T], 'children'>> & { as?: T }

// Function component props
type BoxComponentProps<P = {}> = BoxOwnProps & P & { as?: (props: P) => Mitosis.Node }

declare global {
    namespace Mitosis {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Node = any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Children = any
        export type Ref = unknown
    }

    type TagName = keyof HTMLElementTagNameMap

    type BoxProps<T> = T extends (props: infer P) => Mitosis.Node
        ? BoxComponentProps<P>
        : T extends keyof HTMLElementTagNameMap
          ? BoxElementProps<T>
          : BoxElementProps<'div'>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type BoxAs = keyof HTMLElementTagNameMap | ((props: any) => Mitosis.Node)

    function Box<T extends BoxAs>(props: BoxProps<T>): Mitosis.Node
}

globalify({ Box, ...lib })
