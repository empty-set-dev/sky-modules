import React, { Fragment } from 'react'

import skyConfig from '../sky.config.json'

import menu from './menu.json'

export interface NavProps {
    title: string
    selected?: string
    root?: string
}
export default function Nav(props: NavProps): ReactNode {
    const root = props.root ?? './'
    const selected = props.selected ?? ''
    const breadcrubms = []
    const title = (skyConfig as never as { title: string }).title

    function renderMenuItem(
        item: { name: string; path: string; folder: string; items: unknown[] },
        i: number
    ): ReactNode {
        let isSelected = false
        if (selected.startsWith(item.folder)) {
            isSelected = true
            breadcrubms.push(item)
        }

        const menuItem = (
            <Fragment key={i}>
                {!isSelected ? (
                    <>
                        <a href={encodeURIComponent(root + item.path)}>{item.name}</a> <br />
                    </>
                ) : (
                    <>
                        <b>
                            <a href={encodeURIComponent(root + item.path)}>{item.name}</a>
                        </b>{' '}
                        <br />
                    </>
                )}
                {(!selected || isSelected) && (
                    <>
                        <ul>{item.items.map(renderSubMenuItem)}</ul>
                        <br />
                    </>
                )}
            </Fragment>
        )

        return menuItem
    }

    function renderSubMenuItem(
        item: { name: string; path: string; folder: string; items: unknown[] },
        i: number
    ): ReactNode {
        let isSelected = false
        if (selected.startsWith(item.folder)) {
            isSelected = true
            breadcrubms.push(item)
        }

        const menuItem = (
            <li key={i}>
                {!isSelected ? (
                    <>
                        <a href={encodeURIComponent(root + item.path)}>{item.name}</a> <br />
                    </>
                ) : (
                    <>
                        <b>
                            <a href={encodeURIComponent(root + item.path)}>{item.name}</a>
                        </b>{' '}
                        <br />
                    </>
                )}
                {(!selected || isSelected) && (
                    <>
                        <ul>{item.items.map(renderSubMenuItem)}</ul>
                        <br />
                    </>
                )}
            </li>
        )

        return menuItem
    }

    const menuElement = menu.map(renderMenuItem)

    const isFinal = breadcrubms.length > 0 && breadcrubms[breadcrubms.length - 1].items.length === 0

    return (
        <>
            <h1>
                <a href="/README.md">{title} Docs</a>
            </h1>
            {menuElement}
            {isFinal && (
                <h1>
                    {breadcrubms.map((item, i) => (
                        <Fragment key={i}>
                            {i + 1 < breadcrubms.length ? (
                                <>
                                    <a href={decodeURIComponent(root + item.path)}>{item.name}</a> /{' '}
                                </>
                            ) : (
                                <>{item.name}</>
                            )}
                        </Fragment>
                    ))}
                </h1>
            )}
        </>
    )
}
