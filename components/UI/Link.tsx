import React from "react"
import { usePageContext } from "vike-react/usePageContext"
import cn from "classnames"

export function Link({
    href,
    children,
    onClick,
}: {
    href: string
    children: string
    onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
    const pageContext = usePageContext()
    const { urlPathname } = pageContext
    const isActive = href === "" ? false : href === "/" ? urlPathname === href : urlPathname.startsWith(href)

    return (
        <a href={href} className={cn({ "is-active": isActive })} onClick={onClick}>
            {children}
        </a>
    )
}
