import { cx } from 'sky/helpers/cn'

import JSX from './jsx-types'

export interface BoxProps extends JSX.PropsWithChildren {
    className?: string
    sx?: string
    as?: keyof HTMLElementTagNameMap
    asChild?: boolean
}
export default function Box(props: BoxProps): JSX.Element {
    const { className, sx, as = 'div', asChild, children, ...restProps } = props
    const finalClassName = cx(className, sx)

    if (asChild && children) {
        const child = Array.isArray(children) ? children[0] : children

        if (child && typeof child === 'object' && child.props) {
            return {
                ...child,
                props: {
                    ...restProps,
                    ...child.props,
                    className: cx(child.props.className, finalClassName),
                },
            }
        }
    }

    const Tag = as
    return (
        <Tag className={finalClassName} {...restProps}>
            {children}
        </Tag>
    )
}
