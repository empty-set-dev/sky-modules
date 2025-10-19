export {}

declare global {
    namespace HexagonGridEditor {
        interface BrushDescription {
            color?: string
            value?: string
            uiIcon?: string
            icon?: string
            position?: number
            positionColor?: string
            default?: boolean
        }
        interface Brush {
            color?: string
            value?: string
            uiIcon?: string
            icon?: string
            position?: number
            positionColor?: string
            default?: boolean
            type: 'color' | 'border' | 'position' | 'icon'
        }
    }
}
