import { useStore } from '@builder.io/mitosis'

export interface ButtonProps {
    text: string
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
    loading?: boolean
    onClick?: () => void
    children?: any
}

export default function Button(props: ButtonProps) {
    const state = useStore({
        isPressed: false,
        handleMouseDown() {
            state.isPressed = true
        },
        handleMouseUp() {
            state.isPressed = false
        },
    })

    return (
        <button
            onClick={props.disabled ? undefined : props.onClick ?? undefined}
            onMouseDown={state.handleMouseDown}
            onMouseUp={state.handleMouseUp}
            disabled={props.disabled}
        >
            {props.loading ? <span>Loading...</span> : props.children || props.text}
            123
        </button>
    )
}
