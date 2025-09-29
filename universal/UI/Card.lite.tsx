import { useStore } from '@builder.io/mitosis'

export interface CardProps {
    title?: string
    subtitle?: string
    image?: string
    children?: any
    hoverable?: boolean
    className?: string
    onClick?: () => void
}

export default function Card(props: CardProps) {
    const state = useStore({
        isHovered: false,
        handleMouseEnter() {
            if (props.hoverable) {
                state.isHovered = true
            }
        },
        handleMouseLeave() {
            if (props.hoverable) {
                state.isHovered = false
            }
        },
    })

    const cardStyle = {
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: state.isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: props.onClick ? 'pointer' : 'default',
        transform: state.isHovered ? 'translateY(-4px)' : 'translateY(0)',
    }

    const titleStyle = {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '8px',
        color: '#333',
    }

    const subtitleStyle = {
        fontSize: '16px',
        color: '#666',
        marginBottom: '16px',
    }

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover' as const,
        borderRadius: '8px',
        marginBottom: '16px',
    }

    return (
        <div
            style={cardStyle}
            className={props.className}
            onMouseEnter={state.handleMouseEnter}
            onMouseLeave={state.handleMouseLeave}
            onClick={props.onClick}
        >
            {props.image && (
                <img src={props.image} alt={props.title || 'Card image'} style={imageStyle} />
            )}

            {props.title && <h3 style={titleStyle}>{props.title}</h3>}

            {props.subtitle && <p style={subtitleStyle}>{props.subtitle}</p>}

            {props.children && <div>{props.children}</div>}
        </div>
    )
}
