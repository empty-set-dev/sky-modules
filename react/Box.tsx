import clsx, { type ClassValue } from 'clsx'
import React, { forwardRef, type ReactNode } from 'react'

import type { JSX } from 'react/jsx-runtime'

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

// Polymorphic Box interface with overloads
interface BoxType {
    <T extends keyof JSX.IntrinsicElements = 'div'>(
        props: BoxElementProps<T> & { ref?: React.Ref<HTMLElement> }
    ): ReactNode
    <P extends Record<string, unknown>>(
        props: BoxComponentProps<P> & { ref?: React.Ref<HTMLElement> }
    ): ReactNode
}

function BoxInner<
    T extends keyof JSX.IntrinsicElements | ((props: Record<string, unknown>) => ReactNode),
>(
    props: T extends keyof JSX.IntrinsicElements
        ? BoxElementProps<T>
        : T extends (props: infer P) => ReactNode
          ? BoxComponentProps<P>
          : never,
    ref: React.Ref<HTMLElement>
): ReactNode {
    const { as: Element = 'div', sx, className, children, asChild, ...restProps } = props

    const combinedClass = clsx(className, sx)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...restProps,
            className: clsx((children.props as { className?: string }).className, combinedClass),
            ref,
        })
    }

    return React.createElement(
        Element || 'div',
        {
            ...restProps,
            className: combinedClass,
            ref,
        },
        children
    )
}

const Box = forwardRef(BoxInner) as BoxType
export default Box
