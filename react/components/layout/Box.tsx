import { JSX } from 'react'
import { cx } from 'sky/helpers/cn'
iAm('sky.react.components.layout.Box', import('./Box'))

declare global {
    interface Modules {
        'sky.react.components.layout.Box': typeof import('./Box')
    }
}

export interface BoxProps extends PropsWithChildren {
    className?: string
    sx?: string
    as?: keyof HTMLElementTagNameMap
    asChild?: boolean
    extends?: string
}
export default function Box<T extends keyof HTMLElementTagNameMap = 'div'>(
    props: BoxProps & { as?: T }
): ReactNode {
    const { className, sx, as, asChild, children, ...restProps } = props
    const Tag: keyof JSX.IntrinsicElements = as ?? 'div'
    if (asChild) {
        const clonedElement = cloneElement(children, props)
    }

    return (
        <Tag {...restProps} className={cx(className, sx)}>
            {children}
        </Tag>
    )
}
