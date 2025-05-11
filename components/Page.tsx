import classNames from 'pkgs/classnames'
import { HTMLProps } from 'react'

import Tag from './Tag'

import './Page.scss'

export interface PageProps<T> extends HTMLProps<T>, PropsWithChildren {
    tag?: string
}
export default function Page<T>(props: PageProps<T>): ReactNode {
    let { tag, className, ...tagProps } = props
    tag ??= 'div'
    className = classNames('Page', className)

    return <Tag tag={tag} className={className} {...tagProps} />
}
