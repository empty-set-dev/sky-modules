import React, { PropsWithChildren } from "react"
import cn from "classnames"
import Button, { ButtonProps } from "./Button"

export type AddButtonProps = ButtonProps
export default function AddButton(props: AddButtonProps) {
    const b = `AddButton`
    const { className } = props

    return <Button {...props} className={cn(className, b)} />
}
