import { JSX } from 'react'
import { cx } from 'sky/helpers/cn'

iAm('Box', import('./Box'))

declare global {
    interface Modules {
        Box: typeof import('./Box')
    }
}

export interface BoxProps extends PropsWithChildren {
    className?: string
    sx?: string
    as?: keyof JSX.IntrinsicElements
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
