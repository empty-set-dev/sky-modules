import { cx } from 'sky/helpers/cn'

import type { AnchorHTMLAttributes } from 'react'
import type { JSX } from 'react/jsx-runtime'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}
export default function Link(props: LinkProps): JSX.Element {
    const className = `
        p-10
        bg-[var(--bg)]
    `
    props.href
    return (
        <a {...props} className="m-10 p-10">
            {props.children}
        </a>
    )
}
