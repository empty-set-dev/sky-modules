import cn from 'classnames'
import React, { CSSProperties, ReactNode } from 'react'

import './Table.scss'

export interface TableProps {
    className?: string
    style?: CSSProperties

    columns: {
        key: string
        title: string
    }[]

    data: Record<string, ReactNode>[]
}
export default function Table(props: TableProps): ReactNode {
    const { columns, data } = props

    return (
        <table className={cn('FormControl', 'Table', props.className)} style={props.style}>
            <thead>
                {columns.map(column => (
                    <th key={column.key}>{column.title}</th>
                ))}
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id as string}>
                        {columns.map(column => (
                            <td key={column.key}>{item[column.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
