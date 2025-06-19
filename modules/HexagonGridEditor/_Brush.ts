export {}

declare global {
    namespace HexagonGridEditor {
        interface BrushDescription {
            color?: string
            value?: string
            uiIcon?: string
            icon?: string
            position?: number
            default?: boolean
        }
        interface Brush {
            color?: string
            value?: string
            uiIcon?: string
            icon?: string
            position?: number
            default?: boolean
            type: 'color' | 'border' | 'border2' | 'circlePosition' | 'rectPosition' | 'icon'
        }
    }
}
