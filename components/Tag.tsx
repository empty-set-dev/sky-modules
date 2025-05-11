import { HTMLProps } from 'react'

export interface TagProps<T> extends HTMLProps<T>, PropsWithChildren {
    tag: string
}
export default function Tag<T>(props: TagProps<T>): ReactNode {
    let { tag: Tag, ...tagProps } = props

    return <Tag {...tagProps} />
}
