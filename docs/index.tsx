import React, { Fragment } from 'react'

interface MenuItem {
    name: string
    path: string
    folder: string
    items: MenuItem[]
}

type Menu = MenuItem[]

export interface ContentProps {
    name: string
    menu: Menu
    selected: string
}

export function BeforeContent(props: ContentProps): ReactNode {
    const { name, menu } = props
    const selected = props.selected === '.' ? '' : props.selected
    const match = selected !== '' ? (props.selected.match(/\//g) ?? []) : null
    const root = selected !== '' ? '../' + match!.map(() => '../').join('') : ''
    const breadcrumbs: {
        name: string
        path: string
        folder: string
        items: MenuItem[]
    }[] = []

    const menuElement = menu.map((item, i) =>
        renderMenuItem({
            root,
            breadcrumbs,
            selected,
            item,
            i,
        })
    )
    const currentMenuElement = menu.map((item, i) =>
        renderCurrentMenuItem({
            root,
            breadcrumbs,
            selected,
            item,
            i,
        })
    )

    return (
        <>
            <h1>
                <a href={`${root}README.md`}>{name} Docs</a>
            </h1>

            {selected && menuElement}

            {breadcrumbs.length ? (
                <h2>
                    {breadcrumbs.map((item, i) => (
                        <Fragment key={i}>
                            {i + 1 < breadcrumbs.length ? (
                                <>
                                    <a href={encodeURIComponent(root + item.path)}>{item.name}</a>
                                    :{' '}
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

export function AfterContent(props: ContentProps): ReactNode {
    const { menu } = props
    const selected = props.selected === '.' ? '' : props.selected
    const match = selected !== '' ? (props.selected.match(/\//g) ?? []) : null
    const root = selected !== '' ? '../' + match!.map(() => '../').join('') : ''
    const breadcrumbs: {
        name: string
        path: string
        folder: string
        items: MenuItem[]
    }[] = []

    const menuElement = menu.map((item, i) =>
        renderMenuItem({
            root,
            breadcrumbs,
            selected,
            item,
            i,
        })
    )

    return <>{!selected && menuElement}</>
}

interface RenderItemProps {
    root: string
    breadcrumbs: {
        name: string
        path: string
        folder: string
        items: MenuItem[]
    }[]
    selected: string
    item: MenuItem
    i: number
}

function renderMenuItem(props: RenderItemProps): ReactNode {
    const { root, breadcrumbs, selected, item, i } = props

    let isSelected = false

    if (selected === item.folder || selected.startsWith(`${item.folder}/`)) {
        breadcrumbs.push(item)
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
                    <ul>
                        {item.items.map((item, i) =>
                            renderSubMenuItem({
                                root,
                                breadcrumbs,
                                selected,
                                item,
                                i,
                            })
                        )}
                    </ul>
                    <br />
                </>
            )}
        </Fragment>
    )

    return menuItem
}

function renderSubMenuItem(props: RenderItemProps): ReactNode {
    const { root, breadcrumbs, selected, item, i } = props
    let isSelected = false

    if (selected === item.folder || selected.startsWith(`${item.folder}/`)) {
        breadcrumbs.push(item)
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
                    <ul>
                        {item.items.map((item, i) =>
                            renderSubMenuItem({
                                root,
                                breadcrumbs,
                                selected,
                                item,
                                i,
                            })
                        )}
                    </ul>
                    <br />
                </>
            )}
        </li>
    )

    return menuItem
}

function renderCurrentMenuItem(props: RenderItemProps): ReactNode {
    const { root, breadcrumbs, selected, item, i } = props
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
                item.items.map((item, i) =>
                    renderCurrentMenuItem({
                        root,
                        breadcrumbs,
                        selected,
                        item,
                        i,
                    })
                )
            )}
        </Fragment>
    )

    return menuItem
}
