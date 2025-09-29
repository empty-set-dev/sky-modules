import globalify from '@sky-modules/core/globalify'
import { ClassValue } from 'clsx'

import Box, * as lib from './Box'

type SxProps = ClassValue

// Base Box props
type BoxOwnProps = {
    sx?: SxProps
    className?: string
    children?: Mitosis.Children
    asChild?: boolean
    ref?: undefined | Mitosis.Ref
}

// HTML element props
type BoxElementProps<T extends keyof HTMLElementTagNameMap = 'div'> = BoxOwnProps &
    Partial<Omit<HTMLElementTagNameMap[T], 'children'>> & { as?: T | undefined }

// Function component props
type BoxComponentProps<P = Record<string, unknown>> = BoxOwnProps &
    P & { as: (props: P) => JSX.Node }

declare global {
    namespace Mitosis {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Node = any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        export type Children = any
        export type Ref = unknown
    }

    type BoxProps<T = 'div'> = T extends keyof HTMLElementTagNameMap
        ? BoxElementProps<T>
        : T extends (props: infer P) => JSX.Node
          ? BoxComponentProps<P>
          : never

    function getBoxProps<T>(props: BoxProps<T>): BoxProps<T>

    function Box<T extends keyof HTMLElementTagNameMap | ((props: P) => JSX.Node), P>(
        props: BoxProps<T>
    ): Mitosis.Node
}

globalify({ Box, ...lib })
