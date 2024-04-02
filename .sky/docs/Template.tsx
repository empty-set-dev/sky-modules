import React, { ReactElement, useState, useMemo } from 'react'
import MenuItem from './MenuItem';

export default interface Template {
    menu: {
        title: string
        items: [string, ReactElement][]
    }[]
}
export default function Template(props: Template) {
    const { menu } = props

    const overviewElement: ReactElement = useMemo(() => (
        <></>
    ), [])

    function selectSubMenuElement(
        subMenu: typeof menu[0],
        item: typeof subMenu.items[0],
        i: number)
    {
        setBreadcrumbsElement(
            <h1>
                <span
                    style={{
                        color: 'pink',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setBreadcrumbsElement(
                            <h1>{subMenu.title}</h1>
                        )
                        setSelectedElement(contentElements[i])
                    }}
                >
                    {subMenu.title}
                </span>
                {' '}/{' '}
                {item[0]}
            </h1>
        )
        setSelectedElement(item[1])
    }

    const contentElements = useMemo(() => (
        menu.map(subMenu => (
            <>
                {subMenu.items.map((item, i) => (
                    <MenuItem
                        selected={false}
                        onClick={() => {
                            selectSubMenuElement(subMenu, item, i)
                        }}
                    >
                        {item[0]}
                    </MenuItem>
                ))}
            </>
        ))
    ), [])

    const [breadcrumbsElement, setBreadcrumbsElement] = useState(
        <h1>Sky Docs</h1>
    )
    const [selectedElement, setSelectedElement] = useState(overviewElement)

    const renderSubMenu = (subMenu: typeof menu[0], i) => (
        <>
            <MenuItem
                tag="h2"
                selected={selectedElement === contentElements[i]}
                onClick={() => {
                    setBreadcrumbsElement(
                        <h1>{subMenu.title}</h1>
                    )
                    setSelectedElement(contentElements[i])
                }}
            >
                {subMenu.title}
            </MenuItem>

            <ul style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0,
            }}>
                {subMenu.items.map(item => (
                    <MenuItem
                        selected={selectedElement === item[1]}
                        onClick={() => {
                            selectSubMenuElement(subMenu, item, i)
                        }}
                    >
                        {item[0]}
                    </MenuItem>
                ))}
            </ul>
        </>
    )

    const menuElement = (
        <div style={{
            paddingRight: 20,
            borderRight: '1px solid #666',
            whiteSpace: 'nowrap',
        }}>
            <MenuItem
                tag="h1"
                selected={selectedElement === overviewElement}
                onClick={() => {
                    setBreadcrumbsElement(<h1>Sky Docs</h1>)
                    setSelectedElement(overviewElement)
                }}
            >
                Sky Docs
            </MenuItem>
            <ul style={{
                listStyleType: 'none',
                padding: 0,
                margin: 0,
            }}>
                {menu.map((subMenu, i) => (
                    <li>
                        {renderSubMenu(subMenu, i)}
                    </li>
                ))}
            </ul>
        </div>
    )

    const contentElement = (
        <div style={{
            paddingLeft: 20,
            paddingRight: 20,
        }}>
            {breadcrumbsElement}
            {selectedElement}
        </div>
    )

    return (
        <div style={{
            display: 'flex',
        }}>
            {menuElement}
            {contentElement}
        </div>
    )
}
