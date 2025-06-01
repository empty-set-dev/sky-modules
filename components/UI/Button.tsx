import cn from 'pkgs/classnames'
import React, { ButtonHTMLAttributes, CSSProperties, PropsWithChildren, RefObject } from 'react'

import './Button.scss'

export interface ButtonProps extends PropsWithChildren {
    className?: string
    style?: CSSProperties
    tag?: 'a' | 'button'
    href?: string
    type?: ButtonHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>['type']
    ref?: RefObject<HTMLButtonElement | HTMLAnchorElement | null>
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}
export default function Button(props: ButtonProps): ReactNode {
    const b = `Button`
    const { className, href, type, ref, onClick, children } = props
    let { tag: Tag } = props
    Tag ??= 'button'
    const disabled = props.disabled ?? undefined

    return (
        <Tag
            ref={ref as never}
            className={cn('FormControl', b, className)}
            style={props.style}
            type={type}
            onClick={onClick}
            href={href}
            disabled={disabled}
        >
            {children}
        </Tag>
    )
}
