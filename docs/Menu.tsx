import path from 'path'

import React, { PropsWithChildren } from 'react'

import menu from './menu.json'

export interface MenuProps {
    selected: string[]
    root: string
}
export default function Menu(props: MenuProps): ReactNode {
    const root = props.root ?? './'
    return menu.map(item => (
        <>
            <a href={root + item.path}>{item.name}</a>
            <br />
        </>
    ))

    // const renderSubMenu = (subMenu: typeof menu[0], i) => (
    //     <>
    //         <MenuItem tag="h2" selected={selectedElement === contentElements[i]}>
    //             {subMenu.title}
    //         </MenuItem>

    //         <ul>
    //             {subMenu.items.map(item => (
    //                 <MenuItem selected={selectedElement === item[1]}>{item[0]}</MenuItem>
    //             ))}
    //         </ul>
    //     </>
    // )

    // return (
    //     <div>
    //         <MenuItem tag="h1" selected={selectedElement === overviewElement}>
    //             Sky Docs
    //         </MenuItem>
    //         <ul>
    //             {menu.map((subMenu, i) => (
    //                 <li key={i}>{renderSubMenu(subMenu, i)}</li>
    //             ))}
    //         </ul>
    //     </div>
    // )
}

function MenuItem(props: { selected: boolean } & PropsWithChildren): ReactNode {
    return props.selected ? (
        <li>{props.children}</li>
    ) : (
        <li>
            <b>{props.children}</b>
        </li>
    )
}
