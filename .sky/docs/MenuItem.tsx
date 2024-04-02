import React, { PropsWithChildren, ReactNode, useState } from "react"

export default interface MenuItem extends
    PropsWithChildren,
    React.HTMLAttributes<unknown>
{
    tag?: keyof JSX.IntrinsicElements
    selected: boolean
}
export default function MenuItem(props: MenuItem) {
    const { tag, selected, ...otherProps } = props;
    const Tag = props.tag ?? 'div' as keyof JSX.IntrinsicElements;
    const [hovered, setHovered] = useState(false)
    return (
        <Tag
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                color: selected ? 'pink' : hovered ? 'pink' : 'inherit',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
            }}
            {...otherProps}
        />
    )
}
