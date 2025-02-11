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
    const match = selected !== '' ? (props.selected.match(/\//g) ?? []) : null
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

        if (selected === item.folder || selected.startsWith(`${item.folder}/`)) {
            breadcrubms.push(item)
            isSelected = true
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

    function renderSubMenuItem(item: MenuItem, i: number): ReactNode {
        let isSelected = false

        if (selected === item.folder || selected.startsWith(`${item.folder}/`)) {
            breadcrubms.push(item)
            isSelected = true
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
                {(!selected || isSelected) && (
                    <>
                        <ul>{item.items.map(renderSubMenuItem as never)}</ul>
                        <br />
                    </>
                )}
            </li>
        )

        return menuItem
    }

    function renderCurrentMenuItem(item: MenuItem, i: number): ReactNode {
        let isSelected = false

        if (selected === item.folder || selected.startsWith(`${item.folder}/`)) {
            isSelected = true
        }

        if (selected.indexOf('#') === -1 && item.path.indexOf('#') !== -1) {
            return null
        }

        if (!selected) {
            return null
        }

        if (!isSelected) {
            return null
        }

        const menuItem = (
            <Fragment key={i}>
                {selected === item.folder ? (
                    <>
                        <ul>
                            {item.items.map(item => (
                                <>
                                    <a href={encodeURIComponent(root + item.path)}>{item.name}</a>{' '}
                                    <br />
                                </>
                            ))}
                        </ul>
                        <br />
                    </>
                ) : (
                    item.items.map(renderCurrentMenuItem)
                )}
            </Fragment>
        )

        return menuItem
    }

    const menuElement = menu.map(renderMenuItem)
    const currentMenuElement = menu.map(renderCurrentMenuItem)

    return (
        <>
            <h1>
                <a href={`${root}README.md`}>{title} Docs</a>
            </h1>

            {menuElement}

            {breadcrubms.length ? (
                <h2>
                    {breadcrubms.map((item, i) => (
                        <Fragment key={i}>
                            {i + 1 < breadcrubms.length ? (
                                <>
                                    <a href={encodeURIComponent(root + item.path)}>{item.name}</a> /{' '}
                                </>
                            ) : (
                                <>
                                    {item.name}{' '}
                                    <a href={encodeURIComponent(root + item.path.slice(0, -9))}>
                                        (Source)
                                    </a>
                                </>
                            )}
                        </Fragment>
                    ))}
                </h2>
            ) : null}

            {currentMenuElement}
        </>
    )
}
