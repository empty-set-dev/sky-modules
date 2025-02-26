import React, { ButtonHTMLAttributes, CSSProperties, PropsWithChildren } from "react"
import cn from "classnames"

import "./Button.scss"

export interface ButtonProps extends PropsWithChildren {
    className?: string
    style?: CSSProperties
    tag?: "a" | "button"
    href?: string
    type?: ButtonHTMLAttributes<HTMLAnchorElement | HTMLButtonElement>["type"]
    disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}
export default function Button(props: ButtonProps) {
    const b = `Button`
    const { className, href, type, onClick, children } = props
    let { tag: Tag } = props
    Tag ??= "button"
    const disabled = props.disabled ?? undefined

    return (
        <Tag
            className={cn("FormControl", b, className)}
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
