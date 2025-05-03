import Button, { ButtonProps } from './Button'

export type AddButtonProps = ButtonProps
export default function AddButton(props: AddButtonProps): ReactNode {
    const b = `AddButton`
    const { className } = props

    return <Button {...props} className={`${b} ${className}`} />
}
