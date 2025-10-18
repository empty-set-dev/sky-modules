import clsx, { type ClassValue } from 'clsx'
import { forwardRef, Ref, type ReactNode, isValidElement, cloneElement } from 'react'
import globalify from 'sky/core/globalify'

// @ts-expect-error panda box
import { Box as PandaBox, BoxProps as PandaBoxProps } from '#/x/design-system/panda/jsx/box'

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
type BoxComponentProps<P extends {}> = BoxOwnProps & P & { as: (props: P) => ReactNode }

export type BoxProps<T = 'div'> = T extends keyof JSX.IntrinsicElements
    ? BoxElementProps<T>
    : T extends (props: infer P extends {}) => ReactNode
      ? BoxComponentProps<P>
      : never

export function mergeBoxProps<
    T extends keyof JSX.IntrinsicElements | ((props: {}) => ReactNode),
    U extends {},
>(boxProps: BoxProps<T>, overrides: U): BoxProps<T> & U {
    return { ...boxProps, ...overrides }
}

const Box = forwardRef(function Box(
    props:
        | BoxProps<keyof JSX.IntrinsicElements>
        | (BoxProps<(props: {}) => ReactNode> & PandaBoxProps),
    ref: Ref<HTMLElement>
): ReactNode {
    const { as: Element = 'div', sx, className, children, asChild, ...restProps } = props

    const combinedClass = clsx(className, sx)

    if (asChild && isValidElement(children)) {
        return cloneElement(children, {
            ...restProps,
            className: clsx((children.props as { className?: string }).className, combinedClass),
            ref,
        })
    }

    return (
        <PandaBox {...restProps} as={Element} className={combinedClass}>
            {children}
        </PandaBox>
    )
})

globalify({ Box })
