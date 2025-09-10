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
    as?: keyof JSX.IntrinsicElements
    asChild?: boolean
    extends?: string
}
export default function Box(props: BoxProps): ReactNode {
    const { className, sx, as, children, ...restProps } = props
    const Tag: keyof JSX.IntrinsicElements = as ?? 'div'

    return (
        // @ts-expect-error
        <Tag {...restProps} className={cx(className, sx)}>
            {children}
        </Tag>
    )
}
