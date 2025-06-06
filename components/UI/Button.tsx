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
    leftIcon?: ReactNode
    rightIcon?: ReactNode
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
            className={cn('FormControl UIGroupChild', b, className, { disabled })}
            style={props.style}
            type={type}
            onClick={ev => {
                if (disabled) {
                    return
                }

                onClick && onClick(ev)
            }}
            href={href}
            disabled={disabled}
        >
            {props.leftIcon && <div className={`${b}-left-icon`}>{props.leftIcon}</div>}
            {children}
            {props.rightIcon && <div className={`${b}-right-icon`}>{props.rightIcon}</div>}
        </Tag>
    )
}
