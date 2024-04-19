import React, { ReactElement, useState, useMemo } from 'react'

export default interface Template {
    menu: {
        title: string
        items: [string, ReactElement][]
    }[]
}
export default function Template(props: Template) {
    const { menu } = props

    const contentElements = useMemo(() => (
        menu.map(subMenu => (
            <>
                {subMenu.items.map((item, i) => (
                    <MenuItem
                        selected={false}
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
