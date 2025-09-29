import { cx } from '@sky-modules/helpers/cn'
import Box, { type BoxProps, getBoxProps } from '@sky-modules/react/Box'
import { tv } from 'tailwind-variants'

import type { JSX, ReactNode } from 'react'

namespace UC {
    export type Props<T, Styles extends (...args: never[]) => unknown> = BoxProps<T> & {
        styles?: ReturnType<Styles>
    } & PropsWithChildren

    export type SlotProps<T> = BoxProps<T> & PropsWithChildren

    export type Element = JSX.Element

    export function useLocalState() {}
    export function useRoot() {}
    export function Root() {}
}

// @universal-component
export default Link
function Link<T extends keyof HTMLElementTagNameMap = 'div'>(
    props: UC.Props<T, typeof LinkStyles>
): JSX.Element {
    const { children } = props
    const styles = props.styles ?? LinkStyles(props)
    const boxProps = getBoxProps(props)

    const rootStyles = styles.root(props)
    const subStyles = styles.sub(props)

    return (
        <Link.Root {...boxProps}>
            <Link.Sub>sub</Link.Sub>
            {children}
        </Link.Root>
    )
}
namespace Link {
    export function Root<T = 'div'>(props: UC.SlotProps<T>): UC.Element {
        const { children } = props
        const boxProps = getBoxProps(props)

        return <UC.Root {...boxProps}>{children}</UC.Root>
    }
    export function Sub<T = 'div'>(props: UC.SlotProps<T>): UC.Element {
        const { children } = props
        const boxProps = getBoxProps(props)

        return (
            <Box ref {...boxProps}>
                {children}
            </Box>
        )
    }
}

export const LinkStyles = tv({
    slots: {
        root: 'bg-red-400',
        sub: 'bg-amber-600',
    },
    variants: {
        underline: {
            sub: 'underline',
        },
    },
})
