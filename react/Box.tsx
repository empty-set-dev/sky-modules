import clsx, { type ClassValue } from 'clsx'
import React, { forwardRef, type ReactNode } from 'react'

import type { JSX } from 'react'

type SxProps = ClassValue

// Base Box props
type BoxOwnProps = {
    sx?: SxProps
    className?: string
    children?: ReactNode
    asChild?: boolean
}

// HTML element props
type BoxElementProps<T extends keyof JSX.IntrinsicElements = 'div'> = BoxOwnProps &
    Omit<JSX.IntrinsicElements[T], 'className' | 'children'> & { as?: T }

// Function component props
type BoxComponentProps<P = Record<string, unknown>> = BoxOwnProps &
    P & { as: (props: P) => ReactNode }

export type BoxProps<T = 'div'> = T extends keyof JSX.IntrinsicElements
    ? BoxElementProps<T>
    : T extends (props: infer P) => ReactNode
      ? BoxComponentProps<P>
      : never

export function getBoxProps<T>(props: BoxProps<T>): BoxProps<T> {
    const { className, as, asChild, sx } = props
    const boxProps = {} as BoxProps<T>
    className != null && (boxProps.className = className)
    as != null && (boxProps.as = as)
    asChild != null && (boxProps.asChild = asChild)
    sx != null && (boxProps.sx = sx)
    return boxProps
}

export default forwardRef(function Box<
    T extends keyof JSX.IntrinsicElements | ((props: Record<string, unknown>) => ReactNode),
>(props: BoxProps<T>, ref: React.Ref<HTMLElement>): ReactNode {
    const { as: Element = 'div', sx, className, children, asChild, ...restProps } = props

    const combinedClass = clsx(className, sx)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...restProps,
            className: clsx((children.props as { className?: string }).className, combinedClass),
            ref,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
    }

    return React.createElement(
        Element || 'div',
        {
            ...restProps,
            className: combinedClass,
            ref,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        children
    )
})
