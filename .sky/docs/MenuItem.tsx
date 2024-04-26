import React, { PropsWithChildren } from "react";

export default function MenuItem(props: { selected: boolean } & PropsWithChildren) {
    return props.selected ? (
        <li>{props.children}</li>
    ) : (
        <li><b>{props.children}</b></li>
    )
}
