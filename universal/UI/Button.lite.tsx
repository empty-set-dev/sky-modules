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

    const getButtonStyle = () => {
        const baseStyle = {
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            opacity: props.disabled ? 0.6 : 1,
            transform: state.isPressed ? 'scale(0.98)' : 'scale(1)',
        }

        const variants = {
            primary: {
                backgroundColor: '#007bff',
                color: 'white',
            },
            secondary: {
                backgroundColor: '#6c757d',
                color: 'white',
            },
            danger: {
                backgroundColor: '#dc3545',
                color: 'white',
            },
        }

        return {
            ...baseStyle,
            ...variants[props.variant || 'primary'],
        }
    }

    return (
        <button
            style={getButtonStyle()}
            onClick={props.disabled ? undefined : props.onClick}
            onMouseDown={state.handleMouseDown}
            onMouseUp={state.handleMouseUp}
            disabled={props.disabled}
        >
            {props.loading ? <span>Loading...</span> : props.children || props.text}
        </button>
    )
}
