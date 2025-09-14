import { cx } from 'sky/helpers/cn'

import type { AnchorHTMLAttributes } from 'react'
import type { JSX } from 'react/jsx-runtime'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}
export default function Link(props: LinkProps): JSX.Element {
    props.href
    return (
        <a {...props} className={cx(sx, props.className)}>
            {props.children}
        </a>
    )
}
