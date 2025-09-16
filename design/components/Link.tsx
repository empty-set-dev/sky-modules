import cn from 'classnames'

import type { AnchorHTMLAttributes } from 'react'
import type { JSX } from 'react/jsx-runtime'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}
export default function Link(props: LinkProps): JSX.Element {
    return (
        <a {...props} className={cn(sx, props.className)}>
            {props.children}
        </a>
    )
}
