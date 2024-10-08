import React, { Fragment } from 'react'

import skyConfig from '../sky.config'

interface MenuItem {
    name: string
    path: string
    folder: string
    items: MenuItem[]
}

type Menu = MenuItem[]

export interface NavProps {
    menu: Menu
    selected: string
}
export function Nav(props: NavProps): ReactNode {
    const { menu } = props
    const selected = props.selected === '.' ? '' : props.selected
    const match = selected !== '' ? props.selected.match(/\//g) ?? [] : null
    const root = selected !== '' ? '../' + match!.map(() => '../').join('') : ''
    const breadcrubms: {
        name: string
        path: string
        folder: string
        items: MenuItem[]
    }[] = []
    const { title } = skyConfig

    function renderMenuItem(item: MenuItem, i: number): ReactNode {
        let isSelected = false
        let isOpen = false

        if (selected.startsWith(item.folder)) {
            breadcrubms.push(item)
            isSelected = true
            isOpen = true
        }

        if (selected.indexOf('#') === -1 && item.path.indexOf('#') !== -1) {
            return null
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
                {(!selected || isOpen) && (
                    <>
                        <ul>{item.items.map(renderSubMenuItem as never)}</ul>
                        <br />
                    </>
                )}
            </Fragment>
        )

        return menuItem
    }

    function renderSubMenuItem(item: MenuItem, i: number): ReactNode {
        let isSelected = false
        let isOpen = false

        if (selected.startsWith(item.folder)) {
            breadcrubms.push(item)
            isSelected = true
            isOpen = true
        }

        if (selected.indexOf('#') === -1 && item.path.indexOf('#') !== -1) {
            return null
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
                {(!selected || isOpen) && (
                    <>
                        <ul>{item.items.map(renderSubMenuItem as never)}</ul>
                        <br />
                    </>
                )}
            </li>
        )

        return menuItem
    }

    const menuElement = menu.map(renderMenuItem)

    return (
        <>
            <h1>
                <a href={`${root}README.md`}>{title} Docs</a>
            </h1>
            {menuElement}
            <h1>
                {breadcrubms.map((item, i) => (
                    <Fragment key={i}>
                        {i + 1 < breadcrubms.length ? (
                            <>
                                <a href={encodeURIComponent(root + item.path)}>{item.name}</a> /{' '}
                            </>
                        ) : (
                            <>{item.name}</>
                        )}
                    </Fragment>
                ))}
            </h1>
        </>
    )
}
